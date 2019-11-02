import {WebElementListFinder, WebElementFinder, Browser} from "@thekla/webdriver";
import {Ability, UsesAbilities}                          from "@thekla/core";
import {SppFinderRoot, SppElement, SppElementList}       from "../SppWebElements";

export class FindElements implements Ability {

    public isAbilityList(): boolean {
        return false;
    }

    public getAbilities(): Ability[] {
        return [this];
    }

    public static using(client: Browser): FindElements {
        return new FindElements(client);
    }

    public static as(actor: UsesAbilities): FindElements {
        return actor.withAbilityTo(FindElements) as FindElements;
    }

    public constructor(private browser: Browser) {

    }

    public findElement(spe: SppElement): WebElementFinder {
        return this.find(spe) as WebElementFinder;
    }

    public findElements(elements: SppElementList): WebElementListFinder {
        return this.find(elements) as WebElementListFinder;
    }

    public find(spe: SppFinderRoot): WebElementFinder | WebElementListFinder {
        return spe.getElements(this.browser)
    }
}