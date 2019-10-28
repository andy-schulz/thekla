import {UsesAbilities, Interaction, stepDetails} from "@thekla/core";
import {UseBrowserFeatures} from "../abilities/UseBrowserFeatures";

export class Navigate implements Interaction<void, void> {

    public static to(url: string): Navigate {
        return new Navigate(url);
    }

    private constructor(private url: string) {
    }

    @stepDetails<UsesAbilities, void, void>(`navigate to: <<url>>`)
    public performAs(actor: UsesAbilities): Promise<void> {
        return UseBrowserFeatures.as(actor).navigate(this.url);
    }
}