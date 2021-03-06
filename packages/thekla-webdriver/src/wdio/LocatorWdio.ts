import {Client}                     from "webdriver";
import {TkWebElement}               from "../interface/TkWebElement";
import {findByCssContainingText}    from "../lib/__client_side_scripts__/locators";
import {By, ByType}                 from "../lib/element/Locator";
import {funcToString}               from "../utils/Utils";
import {ElementRefIO, WebElementIO} from "./wrapper/WebElementIO";

export class LocatorWdio {

    private static getElementID = (element: ElementRefIO): string => {
        return element[Object.keys(element)[0]]
    };

    public static retrieveElements = (locator: By, element?: ElementRefIO): (client: Client) => Promise<TkWebElement<Client>[]>  => {
        return (client: Client): Promise<TkWebElement<Client>[]> => {
            switch (locator.selectorType) {
                case ByType.css:
                    return LocatorWdio.findElemsFromElem(client, `css selector`, locator.selector, element);
                case ByType.xpath:
                    return LocatorWdio.findElemsFromElem(client, `xpath`, locator.selector, element);
                case ByType.accessibilityId:
                    return LocatorWdio.findElemsFromElem(client, `accessibility id`, locator.selector, element);
                case ByType.js:
                case ByType.cssContainingText:
                    return LocatorWdio.findElemsFromElemByJs(client, locator, element);
                default:
                    return Promise.reject(`Selector ${locator.selectorType} not implemented for framework WebDriverJS`);
            }
        };
    };

    private static findElemsFromElem = (client: Client, strategy: string, selector: string, element?: ElementRefIO): Promise<TkWebElement<Client>[]> => {
        return (element ?
            (client.findElementsFromElement(
                LocatorWdio.getElementID(element),
                strategy,
                selector) as unknown as Promise<ElementRefIO[]>) :
            (client.findElements(
                strategy,
                selector) as unknown as Promise<ElementRefIO[]>))
            .then((elements: ElementRefIO[]): TkWebElement<Client>[] => WebElementIO.createAll(elements, client));
    };

    private static findElemsFromElemByJs = (client: Client, locator: By, element?: ElementRefIO): Promise<TkWebElement<Client>[]> => {
        return client.executeScript(
            funcToString(findByCssContainingText),
            [...locator.args, element])
            .then((elements: ElementRefIO[]): TkWebElement<Client>[] => WebElementIO.createAll(elements, client));
    };
}