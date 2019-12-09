import {RestClientConfig}                        from "@thekla/config";
import {Interaction, stepDetails, UsesAbilities} from "@thekla/core";
import {RestRequestResult}                       from "../../interface/RestRequestResult";
import {UseTheRestApi}                           from "../abilities/UseTheRestApi";
import {SppRestRequest}                          from "../SppRestRequests";
import {continueOnError, MethodActions}          from "./0_helper";

export class Get implements Interaction<void, RestRequestResult>, MethodActions {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private catchError = false;

    @stepDetails<UsesAbilities, void, RestRequestResult>(`send a get request for: '<<request>>'`)
    public performAs(actor: UsesAbilities): Promise<RestRequestResult> {
        return UseTheRestApi.as(actor).send(this.request).get()
                            .catch(continueOnError(this.catchError))
    }

    public static from(request: SppRestRequest): Get {
        return new Get(request);
    }

    public continueOnError(): Get {
        this.catchError = true;
        return this;
    }

    private constructor(private request: SppRestRequest) {
    }
}