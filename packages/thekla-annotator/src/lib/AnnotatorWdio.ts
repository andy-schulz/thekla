import {Client}    from "webdriver"
import * as uuid   from "uuid"
import {getLogger} from "@log4js-node/log4js-api";

import {
    displayMessage,
    hideMessage,
    highlightElement,
    unHighlightElement
} from "./__client_side_scripts__/annotator_scripts";

/* eslint-disable @typescript-eslint/no-non-null-assertion */

export class AnnotatorWdio {
    private logger = getLogger(this.constructor.name);
    private elementBefore: any = undefined;
    private styleBefore: string | undefined = undefined;

    private promise: Promise<void | any> = Promise.resolve();

    // id must start with a letter, so i put an "a" in front of it, just in case the uuid starts with a number
    private readonly uuid = `a` + uuid.v4().toString();

    private static driverMap: Map<Client, AnnotatorWdio> = new Map();

    private funcToString = (func: Function | string): string => {
        return `return (${func}).apply(null, arguments);`
    };

    /**
     * returns an Annotator instance for the given driver, if it does not already exist, it will be created.
     *
     * @param driver the driver instance which has to be annotated
     * @returns the Annotator instance for the driver
     */
    private static hl(driver: Client): AnnotatorWdio {
        if (AnnotatorWdio.driverMap.has(driver))
            return (AnnotatorWdio.driverMap.get(driver))!;
        else {
            const hl = new AnnotatorWdio();
            AnnotatorWdio.driverMap.set(driver, hl);
            return hl;
        }

    }

    /**
     * add a div in the browsers dom and display the given test message
     *
     * @param driver the driver instance which has to be annotated
     * @param testMessage the message to display
     */
    private displayTM(driver: Client, testMessage: string): Promise<Client> {
        return this.promise = this.promise
                                  .then(() => driver.executeScript(this.funcToString(displayMessage), [this.uuid, testMessage]))
                                  .then(() => driver)
                                  .catch((e) => {
                                      this.logger.warn(e.toString());
                                      return driver
                                  }) // in case of an error, dont stop
    }

    /**
     * send request to hide test message banner
     * @param driver
     */
    private hideTM(driver: Client): Promise<Client> {
        return this.promise = this.promise
                                  .then(() => driver.executeScript(this.funcToString(hideMessage), [this.uuid]))
                                  .then(() => driver)
                                  .catch((e) => {
                                      this.logger.warn(e.toString());
                                      return driver
                                  }) // in case of an error, dont stop
    }

    /**
     * send request to highlight the element
     * @param driver
     * @parm element
     */
    private hlight(driver: Client, element: object): Promise<string> {
        return this.promise = this.promise
                                  .then(() => {
                                      return new Promise((resolve, reject) => {
                                          driver.executeScript(this.funcToString(unHighlightElement), [this.elementBefore, this.styleBefore])
                                                .then(resolve, (e: Error) => {
                                                    if (e.name === `stale element reference`) {
                                                        this.logger.debug(`stale element reference error detected while unhighlighting an old element.
                            I am going to ignore the error.`);
                                                        resolve(e)
                                                    }
                                                    reject(e)
                                                })
                                      })
                                  })
                                  .catch((e): Promise<void> => {
                                      if (e.toString().includes(`StaleElementReferenceError`)) {
                                          return Promise.resolve(e);
                                      }
                                      return Promise.reject(e);
                                  })
                                  .then(() => {
                                      return new Promise((resolve, reject) => {
                                          driver.executeScript(this.funcToString(highlightElement), [element])
                                                .then(resolve, reject)
                                      })
                                  })
                                  .then((style: any) => {
                                      this.elementBefore = element;
                                      this.styleBefore = style === null ? undefined : style;
                                      return `element highlighted`
                                  })
                                  .catch((e) => {
                                      this.elementBefore = undefined;
                                      this.logger.debug(e);
                                      return e.toString();
                                  })
    }

    public reset(): void {
        this.elementBefore = undefined;
        this.styleBefore = undefined;
    }

    /**
     * add a div in the browsers dom and display the given test message
     *
     * @param driver the driver to be annotated
     * @param testMessage the message to display
     *
     * @returns a Promise with an empty object in case the browser function succeeds
     */
    public static displayTestMessage(testMessage: string): (driver: Client) => Promise<Client> {
        return (driver: Client): Promise<Client> => {
            const hl: AnnotatorWdio = AnnotatorWdio.hl(driver);
            return hl.displayTM(driver, testMessage);
        }
    }

    /**
     * hide the test message. Set display: none
     *
     * @param driver the driver to be annotated
     *
     * @returns a Promise with an empty object in case the browser function succeeds
     *
     */
    public static hideTestMessage(driver: Client): Promise<Client> {
        const hl: AnnotatorWdio = AnnotatorWdio.hl(driver);
        return hl.hideTM(driver);
    }

    /**
     * highlight the browsers element (red border and red text)
     *
     * @param driver
     * @param element
     */
    public static highlight(element: { [key: string]: string }): (driver: Client) => Promise<string> {
        return (driver: Client): Promise<string> => {
            if (!element)
                return Promise.reject(`cant annotate an empty element`);
            const hl: AnnotatorWdio = AnnotatorWdio.hl(driver);
            return hl.hlight(driver, element)
        }
    }

    public static resetHighlighter(driver: Client): Promise<Client> {
        const hl: AnnotatorWdio = AnnotatorWdio.hl(driver);
        hl.reset();
        return Promise.resolve(driver);
    }
}