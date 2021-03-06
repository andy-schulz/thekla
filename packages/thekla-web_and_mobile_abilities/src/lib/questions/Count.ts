import {Question, UsesAbilities} from "@thekla/core";
import {FindElements}            from "../abilities/FindElements";
import {SppElementList}          from "../SppWebElements";

export class Count implements Question<void, number> {

    public answeredBy(actor: UsesAbilities): Promise<number> {
        return FindElements.as(actor).findElements(this.elements).count();
    }

    public static of(elements: SppElementList): Count {
        return new Count(elements)
    }

    private constructor(
        private elements: SppElementList
    ) {
    }

    public toString(): string {
        return `count of elements '${this.elements.toString()}'`
    }
}