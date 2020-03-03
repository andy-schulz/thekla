/**
 * Action to click on a web element
 */

import {UsesAbilities, Interaction, stepDetails} from "@thekla/core";
import {FindElements}                            from "../abilities/FindElements";
import {SppElementList, SppElement}              from "../SppWebElements";

export class Click implements Interaction<void, void> {
    private centerElement = false;
    /**
     * @ignore
     */
    @stepDetails<UsesAbilities, void, void>(`click on element: '<<element>>'`)
    public performAs(actor: UsesAbilities): Promise<void> {

        // only SppElement has the shallWait method, SppElementList does not
        if (!(this.element as unknown as any).shallWait) {
            return FindElements.as(actor).findElements(this.element as SppElementList).click();
        }

        return this.centerElement ?
            FindElements.as(actor)
                .findElement(this.element as SppElement)
                .scrollIntoView(true)
                .then(() => {
                    return FindElements.as(actor).findElement(this.element as SppElement).click();
                }) :
            FindElements.as(actor)
                .findElement(this.element as SppElement)
                .click();
    }

    // /**
    //  * specify which element should be clicked on
    //  * @param element - the SPP Element
    //  */
    // public static on(element: SppElement | SppElementList): Click {
    //     return new Click(element as SppElement);
    // }

    public static get on(): ClickHelper {
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        return on;
    }

    /**
     * @ignore
     */
    constructor(public element: SppElement | SppElementList, centerElement?: boolean) {
        if(centerElement)
            this.centerElement = true;
    }
}

const on = (element: SppElement | SppElementList): Click => {
    return new Click(element);
};

const centered = (element: SppElement | SppElementList): Click => {
    return new Click(element, true);
};

on.centered = centered;

interface ClickHelper extends Function {
    (element: SppElement | SppElementList): Click;

    centered: (element: SppElement | SppElementList) => Click;
}