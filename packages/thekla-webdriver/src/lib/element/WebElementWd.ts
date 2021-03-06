import {ClientCtrls}                                                     from "../../interface/ClientCtrls";
import {TkWebElement}                                                    from "../../interface/TkWebElement";
import {ImplicitWaiter, WebElementFinder, WebElementListFinder}          from "../../interface/WebElements";
import {staleCheck}                                                      from "../decorators/staleCheck";
import {UntilElementCondition}                                           from "./ElementConditions";
import {centerDistance, ElementDimensions, ElementLocationInView, Point} from "./ElementLocation";
import {WebElementListWd}                                                from "./WebElementListWd";
import {getLogger, Logger}                                               from "log4js";
import fp                                                                from "lodash/fp"
import {By}                                                              from "./Locator";

export class
WebElementWd<WD> implements WebElementFinder, ImplicitWaiter {
    private _description = ``;
    private logger: Logger = getLogger(`WebElementWd`);

    public constructor(
        private elementList: WebElementListWd<WD>,
        private browser: ClientCtrls<WD>) {
    }

    public all(locator: By): WebElementListFinder {
        return this.elementList.all(locator);
    };

    public element(locator: By): WebElementFinder {
        return this.elementList.element(locator);
    };

    protected getWebElement = (): Promise<TkWebElement<WD>> => {
        return this.elementList.getHeadOfElementList()
    };

    protected parentGetWebElement = this.getWebElement;

    @staleCheck<void>()
    public click(): Promise<void> {
        return this.getWebElement()
                   .then((element: any): Promise<void> => element.click())
    }

    public movePointerTo = (client: WD): Promise<WD> => {
        return this.getWebElement()
                   .then((element: TkWebElement<WD>): Promise<WD> => {
                       return element.move()(client);
                   })
                   .then(() => client)
    };

    public dragToElement(element: WebElementFinder): Promise<void> {

        return this.getCenterDistanceTo(element)
                   .then((distance: Point): Promise<void> => {
                       return (this.browser.getFrameWorkClient())
                           .then(this.movePointerTo)
                           .then(this.browser.pointerButtonDown(0))
                           // this is a workaround for chrome, firefox works great but chrome does not
                           // it seems chrome swallows the first move action
                           .then(this.browser.movePointerTo({x: 5, y: 5}))
                           .then(this.browser.movePointerTo({x: distance.x, y: distance.y}))
                           .then(this.browser.pointerButtonUp(0))
                           .then((): void => {
                           })
                   });
    }

    private getCenterDistanceTo(element: WebElementFinder): Promise<Point> {

        const calculateDistance = ([p1, p2]: Point[]): Point => {
            return centerDistance(p1, p2)
        };

        return Promise.all([this.getCenterPoint(), element.getCenterPoint()])
                      .then(calculateDistance)
    }

    public hover(): Promise<void> {
        return this.browser.getFrameWorkClient()
                   .then(this.movePointerTo)
                   .then(() => {});
    }

    @staleCheck<void>()
    public sendKeys(keySequence: string): Promise<void> {
        return this.getWebElement()
                   .then((element: any): Promise<void> => element.sendKeys(keySequence))
    }

    @staleCheck<string>()
    public getText(): Promise<string> {
        return this.getWebElement()
                   .then((element: any): Promise<string> => element.getText())
                   .then((text): string => text)
    }

    @staleCheck<string>()
    public getAttribute(attributeName: string): Promise<string> {
        return this.getWebElement()
                   .then(async (element: TkWebElement<WD>): Promise<string> => {
                       return element.getAttribute(attributeName);
                   })
                   .then((text): string => text);
    }

    @staleCheck<string>()
    public getProperty(propertyName: string): Promise<string> {
        return this.getWebElement()
                   .then((element: TkWebElement<WD>): Promise<string> => {
                       return element.getProperty(propertyName);
                   })
    }

    @staleCheck<ElementDimensions>()
    public getRect(): Promise<ElementDimensions> {
        return this.getWebElement()
                   .then((element: TkWebElement<WD>): Promise<ElementDimensions> => {
                       return element.getRect();
                   })
    }

    @staleCheck<Point>()
    public getCenterPoint(): Promise<Point> {
        return this.getWebElement()
                   .then((element: TkWebElement<WD>): Promise<Point> => {
                       return element.getCenterPoint();
                   })
    }

    private getElementLocationInViewFromElement = (pr: Promise<TkWebElement<WD>>): Promise<ElementLocationInView> => {
        return pr.then((element: TkWebElement<WD>): Promise<ElementLocationInView> => {
            return element.getLocationInView()
        })
    };
    @staleCheck<ElementLocationInView>()
    public getElementLocationInView(): Promise<ElementLocationInView> {
        return fp.flow(
            this.getWebElement,
            this.getElementLocationInViewFromElement
        )();
    }

    @staleCheck<boolean>()
    public isVisible(): Promise<boolean> {
        return this.isDisplayed()
    }

    @staleCheck<boolean>()
    public isDisplayed(): Promise<boolean> {
        return this.getWebElement()
                   .then((element: any): TkWebElement<WD> => {
                       this.logger.trace(`${element ? `Did find ` : `Did not find`} the elements to check for display state`);
                       return element;
                   })
                   .then((element: any): Promise<boolean> => element[`isDisplayed`]())
                   .then((state): boolean => state) // returns a Promise and not the webdriver promise.Promise
                   .catch((): boolean => false)
    }

    @staleCheck<boolean>()
    public isEnabled(): Promise<boolean> {
        return this.getWebElement()
                   .then((element: any): Promise<boolean> => element[`isEnabled`]())
                   .then((state): boolean => state)
                   .catch((): boolean => false)
    }

    @staleCheck<void>()
    public scrollIntoView(center?: boolean): Promise<void> {
        return this.getWebElement()
                   .then((element): Promise<void> => {
                       return element.scrollIntoView(center);
                   })
    }

    @staleCheck<void>()
    public clear(): Promise<void> {
        return new Promise((resolve, reject): void => {
            this.getWebElement()
                .then((element: any): Promise<void> => element.clear())
                .then(resolve, reject)
                .catch(reject)
        })
    }

    public get description(): string {
        return `${this.elementList.description}${this._description}`;
    }

    public called(description: string): WebElementFinder {
        this.logger.debug(`Set Description to '${description}'`);
        this.elementList.called(description);
        return this;
    }

    public toString(): string {
        return `'${this.elementList.description ? this.elementList.description : `Element`}' selected by: >>${this.elementList.locatorDescription}<<`;
    }

    public shallWait(condition: UntilElementCondition): WebElementFinder {
        return (this.elementList.shallWait(condition) as WebElementListWd<WD>).toWebElement() as WebElementFinder;
    }

    public shallNotImplicitlyWait(): WebElementFinder {
        return (this.elementList.shallNotImplicitlyWait() as WebElementListWd<WD>).toWebElement() as WebElementFinder;
    }

    public isVisibleWaiter(): Promise<boolean[] | boolean> {
        return this.elementList.isVisibleWaiter();
    }

    public isEnabledWaiter(): Promise<boolean[] | boolean> {
        return this.elementList.isEnabledWaiter();
    }
}