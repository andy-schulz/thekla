import {Question, UsesAbilities} from "@thekla/core";
import {UseBrowserFeatures}      from "../abilities/UseBrowserFeatures";

class SiteUrl implements Question<void, string> {
    public answeredBy(actor: UsesAbilities): Promise<string> {
        return UseBrowserFeatures.as(actor).getCurrentUrl();
    }

    public toString(): string {
        return `Url of site`;
    }
}

class SiteTitle implements Question<void, string> {
    public answeredBy(actor: UsesAbilities): Promise<string> {
        return UseBrowserFeatures.as(actor).getTitle();
    }

    public toString(): string {
        return `Title of site`;
    }
}

export class TheSites {
    public static url(): SiteUrl {
        return new SiteUrl()
    }

    public static title(): SiteTitle {
        return new SiteTitle()
    }
}