import {stepDetails, UsesAbilities} from "@thekla/core";
import {RestRequestResult}          from "../../interface/RestRequestResult";
import {UseTheRestApi}              from "../abilities/UseTheRestApi";
import {SppRestRequest}             from "../SppRestRequests";
import {continueOnError}            from "./0_helper";
import {MethodBasics}               from "./MethodBasics";

export class Patch extends MethodBasics{
    @stepDetails<UsesAbilities, void, RestRequestResult>(`send a post request for: '<<request>>'`)
    public performAs(actor: UsesAbilities): Promise<RestRequestResult> {
        return UseTheRestApi.as(actor).send(this.request).patch()
                            .catch(continueOnError(this.catchError))
    }

    public static to(request: SppRestRequest): Patch {
        return new Patch(request);
    }

    private constructor(request: SppRestRequest) {
        super(request)
    }
}