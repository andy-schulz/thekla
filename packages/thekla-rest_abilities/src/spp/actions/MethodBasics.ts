import {Interaction, stepDetails, UsesAbilities} from "@thekla/core";
import {RestRequestResult}                       from "../../interface/RestRequestResult";
import {UseTheRestApi}                           from "../abilities/UseTheRestApi";
import {SppRestRequest}                          from "../SppRestRequests";
import {continueOnError, MethodActions}          from "./0_helper";

export abstract class MethodBasics implements Interaction<void, RestRequestResult>, MethodActions {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any

    public catchError = false;
    public request: SppRestRequest;

    public abstract performAs(actor: UsesAbilities): Promise<RestRequestResult>

    public continueOnError(): MethodBasics {
        this.catchError = true;
        return this;
    }

    public constructor(request: SppRestRequest) {
        this.request = request;
    }
}