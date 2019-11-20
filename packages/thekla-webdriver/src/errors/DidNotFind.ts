import {WebElementFinder, WebElementListFinder} from "..";
import {DidNotFindElement}                      from "./DidNotFindElement";
import {DidNotFindWindow}                       from "./DidNotFindWindow";

export class DidNotFind {
    public static theElement(element: WebElementFinder | WebElementListFinder): DidNotFindElement {
        return new DidNotFindElement(element)
    }

    public static theWindowWithTitle(title: string, foundWindowTitles: string[]): DidNotFindWindow  {
        return new DidNotFindWindow(title, foundWindowTitles)
    }
}