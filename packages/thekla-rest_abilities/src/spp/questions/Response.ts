import {RequestMethod}                        from "../../lib/Method";
import {Question, UsesAbilities}              from "@thekla/core";
import {UseTheRestApi}                        from "../abilities/UseTheRestApi";
import {SppRestRequest, SppRestRequestResult} from "../SppRestRequests";

export class Response implements Question<void,SppRestRequestResult> {
    private method: RequestMethod;
    public static of(request: SppRestRequest): Response  {
        return new Response(request)
    }

    public as(method: RequestMethod): Response {
        this.method = method;
        return this;
    }

    private constructor(
        private request: SppRestRequest
    ) {}

    public answeredBy(actor: UsesAbilities): Promise<SppRestRequestResult> {
        return this.method.send(UseTheRestApi.as(actor).send(this.request));
    }
}