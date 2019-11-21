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
        return `Status of element '${this.element.toString()}'`
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

export class StatusOfElement implements Question<void, ElementStatus> {

    public answeredBy(actor: UsesAbilities): Promise<ElementStatus> {
        return new Promise(async (resolve, reject) => {
            const status: ElementStatus = {};
            if(this.element instanceof SppElement) {
                    status.visible = await FindElements.as(actor).findElement(this.element).isVisible();
                    status.enabled = await FindElements.as(actor).findElement(this.element).isEnabled();
            } else {
                status.visible = await FindElements.as(actor).findElements(this.element).isVisible();
                status.enabled = await FindElements.as(actor).findElements(this.element).isEnabled();
            }

            resolve(status);
        })
    }

    public constructor(private element: SppElement | SppElementList) {
    }

    public toString(): string {
        return `Status of element 
    called ${this.element.toString()}`
    }
}

export class Status {

    public static of(elements: SppElement | SppElementList) {
        return new StatusOfElement(elements);
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