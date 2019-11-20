import {Interaction, UsesAbilities} from "@thekla/core";
import {UseBrowserFeatures}         from "../abilities/UseBrowserFeatures";

export class SwitchToWindow implements Interaction<void, void> {

    public performAs(actor: UsesAbilities): Promise<void> {
        return UseBrowserFeatures.as(actor).switchToWindowMatchingTheTitle(this.text);
    }

    public static matchingTheTitle(match: string): SwitchToWindow {
        return new SwitchToWindow(match);
    }

    private constructor(private text: string) {

    }
}