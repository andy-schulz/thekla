/**
 * Action to click on a web element
 */

import {UsesAbilities, Interaction, stepDetails} from "@thekla/core";
import {FindElements}                            from "../abilities/FindElements";
import {UseBrowserFeatures}                      from "../abilities/UseBrowserFeatures";
import {SppElement}                              from "../SppWebElements";

class PagePosition implements PagePositionInterface {

    public static of(x: number, y: number): PagePosition {
        return new PagePosition(x, y)
    }

    private constructor(public x: number, public y: number) {
    }

    public inspect(): PagePositionInterface {
        return {x: this.x, y: this.y}
    }

}

export class Page {
    public static top(): PagePosition {
        return PagePosition.of(0, 0);
    }

    public static bottom(): PagePosition {
        return PagePosition.of(0, -1);
    }
}

interface PagePositionInterface {
    x: number;
    y: number;
}

class ElementScroller implements Interaction<void, void> {
    private center = false;

    /**
     * @ignore
     */
    @stepDetails<UsesAbilities, void, void>(`scroll to element: '<<element>>'`)
    public performAs(actor: UsesAbilities): Promise<void> {
        return FindElements.as(actor).findElement(this.element).scrollIntoView(this.center);
    }

    public atTheViewportCenter(): ElementScroller {
        this.center = true;
        return this;
    }

    /**
     * @ignore
     */
    public constructor(public element: SppElement) {
    }
}

class PageScroller implements Interaction<void, void> {

    /**
     * @ignore
     */
    @stepDetails<UsesAbilities, void, void>(`scroll to PagePosition: '<<position>>'`)
    public performAs(actor: UsesAbilities): Promise<void> {
        return UseBrowserFeatures.as(actor).scrollTo(this.pagePosition.inspect());
    }

    /**
     * @ignore
     */
    public constructor(private pagePosition: PagePosition) {
    }
}

export class Scroll {
    /**
     * specify which element or position should be scrolled to
     * @param element
     */
    public static to(element: SppElement): ElementScroller {
        return new ElementScroller(element);
    }

    public static toPosition(position: PagePosition): PageScroller {
        return new PageScroller(position);
    }
}

