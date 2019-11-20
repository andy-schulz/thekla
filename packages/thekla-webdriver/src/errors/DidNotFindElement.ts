import {WebElementFinder, WebElementListFinder} from "..";

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