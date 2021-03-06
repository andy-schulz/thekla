import {stepDetails, UsesAbilities} from "@thekla/core";
import {RestRequestResult}          from "../../interface/RestRequestResult";
import {UseTheRestApi}              from "../abilities/UseTheRestApi";
import {SppRestRequest}             from "../SppRestRequests";
import {continueOnError}            from "./0_helper";
import {MethodBasics}               from "./MethodBasics";

export class Delete extends MethodBasics {

    @stepDetails<UsesAbilities, void, RestRequestResult>(`send a delete request for: '<<request>>'`)
    public performAs(actor: UsesAbilities): Promise<RestRequestResult> {
        return UseTheRestApi.as(actor).send(this.request).delete()
                            .catch(continueOnError(this.catchError))
    }

    public static from(request: SppRestRequest): Delete {
        return new Delete(request);
    }

    private constructor(request: SppRestRequest) {
        super(request)
    }
}