import {Browser, FrameElementFinder, WebElementFinder, WebElementListFinder, By, UntilElementCondition}
    from "@thekla/webdriver";

// export interface FinderLocator {
//     type: string;
//     locator: By;
// }

export interface SppFinderWaiter<T> {
    shallWait(condition: UntilElementCondition): T;
    shallNotImplicitlyWait(): T;
}

/**
 * Interface defining the frame creation method
 */
export interface SppFrameFinder {
    frame(locator: By): SppFrameElement;
}

/**
 * Interface defining the waiter creation methods
 */
export interface SppFinder {
    element(locator: By): SppElement;

    all(locator: By): SppElementList;
}

export interface ElementHelper extends Function {
    (browser: Browser): WebElementFinder;

    description?: () => string;
}

export interface ElementListHelper extends Function {
    (browser: Browser): WebElementListFinder;

    description?: () => string;
}

/**
 * abstract class implementing the finders for sub elements
 */
export abstract class SppFinderRoot implements SppFinder {
    protected _description = ``;

    protected constructor(
        public locator: By,
        public getElements: ElementHelper | ElementListHelper) {
    }

    public element(locator: By): SppElement {
        const getElements = (browser: Browser): WebElementFinder => {
            return this.getElements(browser).element(locator);
        };
        getElements.description = this.getElements.description;

        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        return new SppElement(locator, getElements);
    }

    public all(locator: By): SppElementList {
        const getElements = (browser: Browser): WebElementListFinder => {
            return this.getElements(browser).all(locator);
        };
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        return new SppElementList(locator, getElements)
    }

    public get description(): string {
        return this._description;
    }
}

/**
 * class representing a single spp web waiter
 */
export class SppElement extends SppFinderRoot implements SppFinderWaiter<SppElement> {
    public constructor(
        locator: By,
        getElements: (browser: Browser) => WebElementFinder) {
        super(locator, getElements)
    }

    public called(description: string): SppElement {
        const desc = (browser: Browser): WebElementFinder => {
            return this.getElements(browser).called(description) as WebElementFinder;
        };

        desc.description = (): string => {
            const desc = this.getElements.description ? this.getElements.description() + ` -> ` : ``;

            return desc + description;
        };

        return new SppElement(this.locator, desc);
    }

    public shallWait(condition: UntilElementCondition): SppElement {
        const waiter = (browser: Browser): WebElementFinder => {
            return (this.getElements(browser) as WebElementFinder).shallWait(condition);
        };
        waiter.description = this.getElements.description;

        return new SppElement(this.locator, waiter);
    }

    public shallNotImplicitlyWait(): SppElement {
        const waiter = (browser: Browser): WebElementFinder => {
            return (this.getElements(browser) as WebElementFinder).shallNotImplicitlyWait();
        };
        waiter.description = this.getElements.description;

        return new SppElement(this.locator, waiter);
    }

    public toString(): string {
        return `'${this.getElements.description ? this.getElements.description() : `SppElement`}' 
    located by >>${this.locator.toString()}<<`;
    }
}

/**
 * class representing an spp web waiter list
 */
export class SppElementList extends SppFinderRoot {
    public constructor(
        locator: By,
        getElements: (browser: Browser) => WebElementListFinder) {
        super(locator, getElements)
    }

    public filteredByText(text: string): SppElementList {
        const getElements = (browser: Browser): WebElementListFinder => {
            return (this.getElements(browser) as WebElementListFinder).filteredByText(text);
        };
        return new SppElementList(this.locator, getElements);
    };

    public called(description: string): SppElementList {
        const desc = (browser: Browser): WebElementListFinder => {
            return this.getElements(browser).called(description) as WebElementListFinder;
        };
        return new SppElementList(this.locator, desc);
    }

    public toString(): string {
        return `${this._description ? this._description : `'SppElementList'`} located by >>${this.locator.toString()}<<`;
    }
}

/**
 * class representing a frame waiter
 */
export class SppFrameElement implements SppFinder, SppFrameFinder {
    public constructor(
        private locator: By,
        private switchFrame: (browser: Browser) => FrameElementFinder) {
    }

    public element(locator: By): SppElement {
        const getElements = (browser: Browser): WebElementFinder => {
            return this.switchFrame(browser).element(locator);
        };
        return new SppElement(locator, getElements);
    }

    public all(locator: By): SppElementList {
        const getElements = (browser: Browser): WebElementListFinder => {
            return this.switchFrame(browser).all(locator);
        };
        return new SppElementList(locator, getElements)
    }

    public frame(locator: By): SppFrameElement {
        const switchFrame = (browser: Browser): FrameElementFinder => {
            return this.switchFrame(browser).frame(locator);
        };
        return new SppFrameElement(locator, switchFrame);
    }

    public called(description: string): SppFrameElement {
        const desc = (browser: Browser): FrameElementFinder => {
            return this.switchFrame(browser).called(description);
        };
        return new SppFrameElement(this.locator, desc);
    }

    // toString() {
    //     return `${this._description ? this._description : "'SppFrameElement'"} located by >>${this.locator.toString()}<<`;
    // }
}

/**
 * creating an SppWebElement
 * @param locator - selector to find the Element
 */
export function element(locator: By): SppElement {
    const getElements = (browser: Browser): WebElementFinder => {
        return browser.element(locator);
    };
    return new SppElement(locator, getElements);
}

/**
 * creating a list of SppWebElements
 * @param locator - selector to find the waiter list
 */
export function all(locator: By): SppElementList {
    const getElements = (browser: Browser): WebElementListFinder => {
        return browser.all(locator);
    };
    return new SppElementList(locator, getElements);
}

/**
 * creating a SppFramElement
 * @param locator - selector to find the frame
 */
export function frame(locator: By): SppFrameElement {
    const switchFrame = (browser: Browser): FrameElementFinder => {
        return browser.frame(locator);
    };
    return new SppFrameElement(locator, switchFrame);
}