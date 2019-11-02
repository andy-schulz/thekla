import {RestClient}             from "../../interface/RestClient";
import {RestRequest}            from "../../interface/RestRequest";
import {Ability, UsesAbilities} from "@thekla/core";
import {SppRestRequest}         from "../SppRestRequests";

/**
 * Ability to use a REST Module
 *
 */
export class UseTheRestApi implements Ability {

    public getAbilities(): Ability[] {
        return [this];
    }

    public isAbilityList(): boolean {
        return false;
    }

    public static with(restClient: RestClient): UseTheRestApi {
        return new UseTheRestApi(restClient);
    }

    public static as(actor: UsesAbilities): UseTheRestApi {
        return actor.withAbilityTo(UseTheRestApi) as UseTheRestApi;
    }

    public send(spe: SppRestRequest): RestRequest {
        return spe.send(this.restClient)
    }

    public constructor(private restClient: RestClient) {

    }
}