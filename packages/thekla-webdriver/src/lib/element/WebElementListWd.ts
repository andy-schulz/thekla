import {getLogger, Logger}        from "@log4js-node/log4js-api";
import {DidNotFind, UntilElement} from "../..";
import {ClientCtrls}              from "../../interface/ClientCtrls";
import {TkWebElement}             from "../../interface/TkWebElement";
import {
    ImplicitWaiter,
    MultipleElementsOptions,
    WebElementFinder,
    WebElementListFinder
}                                 from "../../interface/WebElements";
import {UntilElementCondition}    from "./ElementConditions";
import {By}                       from "./Locator";
import {WebElementWd}             from "./WebElementWd";

/**
 * List object to wrap the location strategy for finding multiple elements with WebDriverJS
 */
export class WebElementListWd<WD> implements WebElementListFinder, ImplicitWaiter {
    private _description = ``;
    private logger: Logger = getLogger(`WebElementListWd`);

    // the standard waiter waits for an element to be visible for 0 ms
    // it can be overwritten by setting a standard visible timeout with setStandardWait().
    private static shallWaitFor = 0;
    private readonly standardWaiter: UntilElementCondition;

    public constructor(
        private _getElements: () => Promise<TkWebElement<WD>[]>,
        private _locator: By,
        public readonly browser: ClientCtrls<WD>,
        private createWebElementFromList: (elementList: WebElementListWd<WD>,
                                           browser: ClientCtrls<WD>) => WebElementWd<WD>,
        private shallImplicitlyWait: boolean = true) {
        this.standardWaiter = UntilElement.is.visible.forAsLongAs(shallImplicitlyWait ? WebElementListWd.shallWaitFor : -1);
    }

    /**
     * Send
     */
    // sendKeys(keySequence: string): Promise<void> {
    //     return new Promise((fulfill) => {
    //         this.getElements().then(() => {
    //             fulfill()
    //         });
    //
    //     })
    // }

    /**
     * set the standard wait time for elements to be visible
     * @param {number} timeout - the time to wait until the element is visible
     */
    public static set implicitlyWaitFor(timeout: number) {
        WebElementListWd.shallWaitFor = timeout;
    }

    public static get implicitlyWaitFor(): number {
        return WebElementListWd.shallWaitFor;
    }

    private getElements(): Promise<TkWebElement<WD>[]> {
        return this.standardWaiter.waitFor(this)
                   .then(() => this._getElements());
    }

    /**
     * get the first element of elements list
     * @returns {Promise<TkWebElement<WD>>} the first element
     */
    public getHeadOfElementList(): Promise<TkWebElement<WD>> {

        const head = (elements: TkWebElement<WD>[]): Promise<TkWebElement<WD>> => {
            if (elements.length === 0) return Promise.reject(DidNotFind.theElement(this));
            if (elements.length > 1) {
                this.logger.trace(`Found ${elements ? elements.length : 0} element(s) for ${this.locatorDescription}`)
            }
            return Promise.resolve(elements[0])
        };

        return this.getElements().then(head);
    }

    /**
     * find sub elements relative to this current waiter
     * @param locator - selector to find a sub waiter
     */
    public element(
        locator: By): WebElementFinder {
        const desc = `'${this.description.replace(`'Elements'`, `'Element'`)}'`;
        return (this.all(locator) as WebElementListWd<WD>).toWebElement().called(this.description);
    }

    /**
     * find all sub elements relative to this element
     * @param locator - selector to find all sub elements
     */
    public all(
        locator: By
    ): WebElementListFinder {
        this.logger.debug(`Chains all Elements: ${locator.toString()}`);

        const allGetElements = async (): Promise<TkWebElement<WD>[]> => {
            this.logger.debug(`Getting ALL elements for locator ${locator.toString()}`);
            const elements = await this._getElements();
            this.logger.debug(`Got ${elements.length} elements for locator ${locator.toString()}`);

            // TODO: Check if this can be done in parallel
            // get all subelements of each element in elements list and put it into an array
            return elements.reduce(async (accPromise, elem): Promise<TkWebElement<WD>[]> => {
                const acc: TkWebElement<WD>[] = await accPromise;
                const elemsList: TkWebElement<WD>[] = await elem.findElements(locator);
                return [...acc, ...elemsList];
            }, Promise.resolve([] as TkWebElement<WD>[]))
                           .then((elements: TkWebElement<WD>[]) => {
                               this.logger.trace(`Found ${elements ? elements.length : 0} element(s) for locator '${locator}'`);
                               return elements
                           });
        };
        return new WebElementListWd(allGetElements, locator, this.browser, this.createWebElementFromList).called(this.description);
    }

    /**
     * wait for condi   tion until interaction with element / element list
     * @param condition - the waiter condition to wait for
     */
    public shallWait(condition: UntilElementCondition): WebElementListFinder {
        this.logger.debug(`Shall Wait for Element: ${this.toString()}`);

        const waitGetElements = async (): Promise<TkWebElement<WD>[]> => {
            this.logger.debug(`shallWait - Start getting elements from function chain: ${this._locator.toString()}`);

            return condition.waitFor(this)
                            .then(() => this._getElements())
        };

        return new WebElementListWd(waitGetElements, this._locator, this.browser, this.createWebElementFromList).called(this.description);
    }

    public shallNotImplicitlyWait(): WebElementListFinder {
        return new WebElementListWd(this._getElements, this._locator, this.browser, this.createWebElementFromList, false)
            .called(this.description);
    }

    public count(): Promise<number> {
        return new Promise((fulfill, reject): void => {
            this.getElements().then((elems: TkWebElement<WD>[]): void => {
                fulfill(elems.length);
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            }).catch((e: any): void => {
                return reject(e);
            });
        })
    }

    public click(): Promise<void> {
        return this.getElements()
                   .then((elements: TkWebElement<WD>[]) => {
                       if (elements.length === 0)
                           return Promise.reject(DidNotFind.theElement(this));

                       return elements.reduce((chain: Promise<void>, element: TkWebElement<WD>): Promise<void> => {
                           return chain.then(() => {
                               return element.click()
                           })
                       }, Promise.resolve())
                   })
    }

    public isEnabledWaiter(): Promise<boolean[] | boolean> {
        return this.isEnabledPure(this._getElements());
    }

    private isEnabledPure(elements: Promise<TkWebElement<WD>[]>, options?: MultipleElementsOptions): Promise<boolean[] | boolean> {
        return elements
            .then((elements: TkWebElement<WD>[]) => {
                return Promise.all(
                    elements.map((elem: TkWebElement<WD>) => {
                        return elem.isEnabled()
                    })
                )
            })
            .then((elementStatus: boolean[]) => {
                return options?.returnSeparateValues ?
                    elementStatus :
                    elementStatus.reduce((acc: boolean, elem: boolean) => acc && elem, true);
            })
    }

    public isEnabled(options?: MultipleElementsOptions): Promise<boolean[] | boolean> {
        return this.isEnabledPure(this.getElements(), options)
    }

    public isVisibleWaiter(): Promise<boolean[] | boolean> {
        return this.isDisplayedPure(this._getElements());
    }

    private isDisplayedPure(elements: Promise<TkWebElement<WD>[]>, options?: MultipleElementsOptions): Promise<boolean[] | boolean> {
        return elements.then((elements: TkWebElement<WD>[]) => {
            return Promise.all(
                elements.map((elem: TkWebElement<WD>) => {
                    return elem.isDisplayed()
                               .then((result: boolean) => {
                                   return result
                               })
                })
            )
        })
                       .then((elementStatus: boolean[]) => {
                           if (elementStatus.length === 0)
                               return false;

                           return options?.returnSeparateValues ?
                               elementStatus :
                               elementStatus.reduce((acc: boolean, elem: boolean) => acc && elem, true);
                       })
    }

    public isVisible(options?: MultipleElementsOptions): Promise<boolean[] | boolean> {
        return this.isDisplayedPure(this.getElements(), options);
    }

    public getText(): Promise<string[]> {
        return new Promise((fulfill, reject): void => {
            this.getElements()
                .then((elems: TkWebElement<WD>[]): void => {
                    fulfill(Promise.all(
                        elems.map((elem: any): Promise<string> => elem.getText())
                    ))
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                }).catch((e: any): void => {
                return reject(e);
            })
        })
    }

    public toWebElement(): WebElementWd<WD> {
        return this.createWebElementFromList(this, this.browser);
    }

    public filteredByText(searchText: string): WebElementListFinder {

        const reducer = (acc: Promise<TkWebElement<WD>[]>, element: any): Promise<TkWebElement<WD>[]> => {
            return acc.then((arr: TkWebElement<WD>[]): Promise<TkWebElement<WD>[]> => {
                return new Promise((resolve, reject) => {
                    element.getText()
                           .then((text: string) => {
                               if (text.includes(searchText)) {
                                   arr.push(element);
                               }
                               resolve(arr);
                           })
                           .catch(reject);
                })
            })
        };

        const filteredElements = async (): Promise<TkWebElement<WD>[]> => {
            const elements = await this.getElements();
            return elements.reduce(reducer, Promise.resolve([]));
        };

        return new WebElementListWd(filteredElements, this._locator, this.browser, this.createWebElementFromList);
    }

    public called(description: string): WebElementListFinder {
        this._description = description;
        return this;
    }

    public get description(): string {
        return this._description;
    }

    public get locatorDescription(): string {
        return this._locator.toString();
    }

    public toString(): string {
        return `'${this._description ? this._description : `Elements`}' selected by: >>${this._locator.toString()}<<`;
    }
}