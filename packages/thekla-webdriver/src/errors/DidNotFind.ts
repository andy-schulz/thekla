import {WebElementFinder, WebElementListFinder} from "../interface/WebElements";

export class DidNotFind extends Error {

    public static theElement(element: WebElementFinder | WebElementListFinder): DidNotFind {
        return new DidNotFind(element)
    }

    private  constructor(private _element: WebElementFinder | WebElementListFinder) {
        super(`
        Did not find the Element: ${_element.toString()}.
        Try waiting before you interact with it like:
            element(By.<<your selector>>)
                .shallWait(UntilElement.is.visible)
        `);
        this.name = `${DidNotFind.name}Element`;
        Error.captureStackTrace(this, DidNotFind)
    }

    public get element(): WebElementFinder | WebElementListFinder {
        return this._element;
    }
}