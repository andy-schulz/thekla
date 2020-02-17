import {Question, UsesAbilities} from "@thekla/core";
import {UseBrowserFeatures}      from "../abilities/UseBrowserFeatures";

export class RemoteFileLocation implements Question<void, string> {

    public answeredBy(actor: UsesAbilities): Promise<string> {
        return UseBrowserFeatures.as(actor).uploadFile(this.file);
    }

    public static of(file: string): RemoteFileLocation {
        return new RemoteFileLocation(file);
    }

    private constructor(private file: string) {
    }
}