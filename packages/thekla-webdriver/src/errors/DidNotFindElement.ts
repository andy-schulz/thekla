import {WebElementFinder, WebElementListFinder} from "..";
import {ImplicitWaiter}                         from "../interface/WebElements";

export class DidNotFindElement extends Error {

    public  constructor(private _element: WebElementFinder | WebElementListFinder) {
        super(`
    Did not find the Element: ${_element.toString()}.
    Try waiting before you interact with it like:
        element(By.<<your selector>>)
            .shallWait(UntilElement.is.visible)
        `);
        this.name = `${DidNotFindElement.name}`;
        Error.captureStackTrace(this, DidNotFindElement)
    }

    public get element(): WebElementFinder | WebElementListFinder {
        return this._element;
    }
}

export class DidNotFindWaiter extends Error {

    public  constructor(private _waiter: ImplicitWaiter) {
        super(`
    Did not find the Element: ${_waiter.toString()}.
    Try waiting before you interact with it like:
        element(By.<<your selector>>)
            .shallWait(UntilElement.is.visible)
        `);
        this.name = `${DidNotFindElement.name}`;
        Error.captureStackTrace(this, DidNotFindElement)
    }

    public get waiter(): ImplicitWaiter {
        return this._waiter;
    }
}