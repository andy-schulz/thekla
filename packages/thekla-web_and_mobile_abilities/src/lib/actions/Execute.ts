/**
 * Action to hover over a web element
 */

import {Interaction, stepDetails, UsesAbilities} from "@thekla/core";
import {UseBrowserFeatures}                      from "../abilities/UseBrowserFeatures";

export class Execute implements Interaction<void, unknown> {

    private constructor(private func: () => unknown) {
    }

    public static script(func: () => unknown): Execute {
        return new Execute(func);
    }

    @stepDetails<UsesAbilities, void, unknown>(`navigate to: <<url>>`)
    public performAs(actor: UsesAbilities): Promise<unknown> {
        return UseBrowserFeatures.as(actor)
                                 .executeScript(this.func)
    }
}