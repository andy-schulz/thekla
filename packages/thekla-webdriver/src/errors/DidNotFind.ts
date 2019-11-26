import {WebElementFinder, WebElementListFinder} from "..";
import {ImplicitWaiter}                         from "../interface/WebElements";
import {DidNotFindElement, DidNotFindWaiter}    from "./DidNotFindElement";
import {DidNotFindWindow}                       from "./DidNotFindWindow";

export class DidNotFind {
    public static theElement(element: WebElementFinder | WebElementListFinder): DidNotFindElement {
        return new DidNotFindElement(element)
    }

    public static theWaiter(waiter: ImplicitWaiter): DidNotFindWaiter {
        return new DidNotFindWaiter(waiter)
    }

    public static theWindowWithTitle(title: string, foundWindowTitles: string[]): DidNotFindWindow  {
        return new DidNotFindWindow(title, foundWindowTitles)
    }
}