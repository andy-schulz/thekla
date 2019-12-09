import {RestClientConfig}           from "@thekla/config";
import {stepDetails, UsesAbilities} from "@thekla/core";
import {RestRequestResult}          from "../../interface/RestRequestResult";
import {RequestMethod}              from "../../lib/Method";
import {UseTheRestApi}              from "../abilities/UseTheRestApi";
import {SppRestRequest}             from "../SppRestRequests";
import {continueOnError}            from "./0_helper";
import {MethodBasics}               from "./MethodBasics";

class SendHelper extends MethodBasics {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private config: RestClientConfig | undefined;

    @stepDetails<UsesAbilities, void, RestRequestResult>(`send a get request for: '<<request>>'`)
    public performAs(actor: UsesAbilities): Promise<RestRequestResult> {
        return this.method.send(UseTheRestApi.as(actor).send(this.request))
                   .catch(continueOnError(this.catchError))
    }

    public constructor(request: SppRestRequest, private method: RequestMethod) {
        super(request)
    }
}

export class Send {
    public static the(request: SppRestRequest): Send {
        return new Send(request);
    }

    public as(method: RequestMethod): SendHelper {
        return new SendHelper(this.request, method);
    }

    private constructor(private request: SppRestRequest) {

    }
}

