import {Question, UsesAbilities} from "@thekla/core";
import {SppElement}              from "../SppWebElements";
import {FindElements}            from "../abilities/FindElements";

export class Attribute implements Question<void, string> {
    private attributeName = ``;

    public answeredBy(actor: UsesAbilities): Promise<string> {
        return FindElements.as(actor).findElement(this.element).getAttribute(this.attributeName).then((value: any) => {
            return `${value}`
        });
    }

    public static of(element: SppElement): Attribute {
        return new Attribute(element)
    }

    public called(attributeName: string): Attribute {
        this.attributeName = attributeName;
        return this;
    }

    private constructor(
        private element: SppElement
    ) {
    }

    public toString(): string {
        return `Attribute '${this.attributeName}' of element '${this.element.toString()}'`
    }
}