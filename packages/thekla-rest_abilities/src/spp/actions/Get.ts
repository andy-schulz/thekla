import {Interaction, stepDetails, UsesAbilities} from "@thekla/core";
import {RestRequestResult, UseTheRestApi}        from "../..";
import {SppRestRequest}                          from "../SppRestRequests";
import {continueOnError, MethodActions}          from "./0_helper";

export class Get implements Interaction<void, RestRequestResult>, MethodActions {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private catchError = false;

    private constructor(private request: SppRestRequest) {
    }

    public static from(request: SppRestRequest): Get {
        return new Get(request);
    }

    @stepDetails<UsesAbilities, void, RestRequestResult>(`send a get request for: '<<request>>'`)
    public performAs(actor: UsesAbilities): Promise<RestRequestResult> {
        return UseTheRestApi.as(actor).send(this.request).get()
                            .catch(continueOnError(this.catchError))
    }

    public continueOnError(): Get {
        this.catchError = true;
        return this;
    }
}