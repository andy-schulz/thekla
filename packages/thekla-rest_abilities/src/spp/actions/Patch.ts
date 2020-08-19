import {stepDetails, UsesAbilities}       from "@thekla/core";
import {RestRequestResult, UseTheRestApi} from "../..";
import {SppRestRequest}                   from "../SppRestRequests";
import {continueOnError}                  from "./0_helper";
import {MethodBasics}                     from "./MethodBasics";

export class Patch extends MethodBasics {
    private constructor(request: SppRestRequest) {
        super(request)
    }

    public static to(request: SppRestRequest): Patch {
        return new Patch(request);
    }

    @stepDetails<UsesAbilities, void, RestRequestResult>(`send a post request for: '<<request>>'`)
    public performAs(actor: UsesAbilities): Promise<RestRequestResult> {
        return UseTheRestApi.as(actor).send(this.request).patch()
                            .catch(continueOnError(this.catchError))
    }
}