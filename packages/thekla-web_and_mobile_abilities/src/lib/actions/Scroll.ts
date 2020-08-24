/**
 * Action to click on a web element
 */

import {Interaction, stepDetails, UsesAbilities} from "@thekla/core";
import {FindElements}                            from "../abilities/FindElements";
import {UseBrowserFeatures}                      from "../abilities/UseBrowserFeatures";
import {SppElement}                              from "../SppWebElements";

class PagePosition implements PagePositionInterface {

    private constructor(public x: number, public y: number) {
    }

    public static of(x: number, y: number): PagePosition {
        return new PagePosition(x, y)
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
    public constructor(public element: SppElement, centered?: boolean) {
        this.center = !!centered;
    }

    /**
     * @ignore
     */
    @stepDetails<UsesAbilities, void, void>(`scroll to element: '<<element>>'`)
    public performAs(actor: UsesAbilities): Promise<void> {
        return FindElements.as(actor).findElement(this.element).scrollIntoView(this.center);
    }
}

class PageScroller implements Interaction<void, void> {

    /**
     * @ignore
     */
    public constructor(private pagePosition: PagePosition) {
    }

    /**
     * @ignore
     */
    @stepDetails<UsesAbilities, void, void>(`scroll to PagePosition: '<<position>>'`)
    public performAs(actor: UsesAbilities): Promise<void> {
        return UseBrowserFeatures.as(actor).scrollTo(this.pagePosition.inspect());
    }
}

export class Scroll {
    /**
     * specify which element or position should be scrolled to
     */
    public static get to(): ScrollHelper {
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        return to;
    }

    public static toPosition(position: PagePosition): PageScroller {
        return new PageScroller(position);
    }
}

const to = (element: SppElement): ElementScroller => {
    return new ElementScroller(element);
};

const centered = (element: SppElement): ElementScroller => {
    return new ElementScroller(element, true);
};

to.centered = centered;

interface ScrollHelper extends Function {
    centered: (element: SppElement) => ElementScroller;

    (element: SppElement): ElementScroller;
}
