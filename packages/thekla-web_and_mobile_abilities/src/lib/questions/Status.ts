import {Question, UsesAbilities}    from "@thekla/core";
import {FindElements}               from "../abilities/FindElements";
import {SppElement, SppElementList} from "../SppWebElements";

class VisibleStatus implements Question<void, boolean> {

    public answeredBy(actor: UsesAbilities): Promise<boolean> {
        return FindElements.as(actor).findElement(this.element).isVisible();
    }

    public constructor(private element: SppElement) {

    }

    public toString(): string {
        return `Visibility of element '${this.element.toString()}'`
    }
}

class EnableStatus implements Question<void, boolean> {

    public answeredBy(actor: UsesAbilities): Promise<boolean> {
        return FindElements.as(actor).findElement(this.element).isEnabled();
    }

    public constructor(private element: SppElement) {

    }
}

export interface ElementStatus {
    visible?: boolean | boolean[];
    enabled?: boolean | boolean[];
}

class StatusOfElement implements Question<void, ElementStatus> {

    public answeredBy(actor: UsesAbilities): Promise<ElementStatus> {
        return new Promise(async (resolve) => {
            const status: ElementStatus = {};
            status.visible = await FindElements.as(actor).findElement(this.element).isVisible();
            status.enabled = await FindElements.as(actor).findElement(this.element).isEnabled();

            resolve(status);
        })
    }

    public constructor(private element: SppElement) {
    }

    public toString(): string {
        return `Status of element 
    called ${this.element.toString()}`
    }
}

class StatusOfMultipleElements implements Question<void, ElementStatus> {

    public answeredBy(actor: UsesAbilities): Promise<ElementStatus> {
        return new Promise(async (resolve) => {
            const status: ElementStatus = {};

            status.visible = await FindElements.as(actor)
                                               .findElements(this.elements)
                                               .isVisible({returnSeparateValues: this.options.all});
            status.enabled = await FindElements.as(actor)
                                               .findElements(this.elements)
                                               .isEnabled({returnSeparateValues: this.options.all});

            resolve(status);
        })
    }

    public constructor(private elements: SppElementList, private options = {all: false}) {
    }

    public toString(): string {
        return `Status of multiple elements
    called ${this.elements.toString()}`
    }
}

export class Status {

    public static of(element: SppElement): StatusOfElement {
        return new StatusOfElement(element);
    }

    public static ofAll(elements: SppElementList, options = {all: false}): StatusOfMultipleElements {
        return new StatusOfMultipleElements(elements, options);
    }

    public static visible = {
        of: (element: SppElement): VisibleStatus => {
            return new VisibleStatus(element)
        }
    };

    public static enable = {
        of: (element: SppElement): EnableStatus => {
            return new EnableStatus(element)
        }
    }
}

export const Visibility = Status.visible;