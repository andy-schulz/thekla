import {Question, UsesAbilities} from "@thekla/core";
import {FindElements}            from "../abilities/FindElements";
import {SppElement}              from "../SppWebElements";

export class Text implements Question<void, string> {

    public static of(element: SppElement): Text {
        return new Text(element)
    }

    private constructor(
        private element: SppElement
    ) {
    }

    public answeredBy(actor: UsesAbilities): Promise<string> {
        return FindElements.as(actor).findElement(this.element).getText();
    }

    public toString(): string {
        return `Text (innerHTML) of element '${this.element.toString()}'`
    }
}