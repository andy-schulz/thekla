import {Ability, UsesAbilities}                                from "@thekla/core";
import {Browser, ImplicitWaiter, until, UntilElementCondition} from "@thekla/webdriver";
import {SppElement}                                            from "../SppWebElements";

export class WaitOnElements implements Ability {

    public isAbilityList(): boolean {
        return false;
    }

    public getAbilities(): Ability[] {
        return [this];
    }

    public static using(client: Browser): WaitOnElements {
        return new WaitOnElements(client);
    }

    public static as(actor: UsesAbilities): WaitOnElements {
        return actor.withAbilityTo(WaitOnElements) as WaitOnElements;
    }

    public constructor(private client: Browser) {

    }

    public wait(condition: UntilElementCondition, element: SppElement): Promise<string> {

        return this.client.wait(
            until(condition.waiter.isFulfilledFor(element.getElements(this.client) as unknown as ImplicitWaiter)),
            condition.timeout,
            condition.conditionHelpText);
    }
}