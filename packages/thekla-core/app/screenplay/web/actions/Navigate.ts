import {BrowseTheWeb, Interaction} from "../../../index";
import {UsesAbilities}             from "../../Actor";
import {stepDetails}               from "../../lib/decorators/StepDecorators";

export class Navigate implements Interaction {

    public static to(url: string): Navigate {
        return new Navigate(url);
    }

    constructor(private url: string) {}

    @stepDetails<UsesAbilities>(`navigate to: <<url>>`)
    performAs(actor: UsesAbilities): Promise<void> {
        return BrowseTheWeb.as(actor).navigate(this.url);
    }
}