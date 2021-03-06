import {Ability, UsesAbilities} from "@thekla/core";
import {Browser}                from "@thekla/webdriver";

export class UseBrowserFeatures implements Ability {

    public isAbilityList(): boolean {
        return false;
    }

    public getAbilities(): Ability[] {
        return [this];
    }

    public static using(browser: Browser): UseBrowserFeatures {
        return new UseBrowserFeatures(browser);
    }

    public static as(actor: UsesAbilities): UseBrowserFeatures {
        return actor.withAbilityTo(UseBrowserFeatures) as UseBrowserFeatures;
    }

    public constructor(private client: Browser) {
    }

    public navigate(url: string): Promise<void> {
        return this.client.get(url);
    }

    public getCurrentUrl(): Promise<string> {
        return this.client.getCurrentUrl();
    }

    public getTitle(): Promise<string> {
        return this.client.getTitle()
    }

    public scrollTo({x, y}: { x: number; y: number }): Promise<void> {
        return this.client.scrollTo({x, y});
    }

    public switchToWindowMatchingTheTitle(titlePart: string): Promise<void> {
        return this.client.switchToWindowMatchingTheTitle(titlePart);
    }

    public uploadFile(file: string): Promise<string> {
        return this.client.uploadFile(file);
    }

    public executeScript(func: () => unknown): Promise<unknown> {
        return this.client.executeScript(func);
    }
}