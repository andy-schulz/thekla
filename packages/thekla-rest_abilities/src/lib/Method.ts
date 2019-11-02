import {RestClientConfig}  from "@thekla/config";
import {RestRequest}       from "../interface/RestRequest";
import {RestRequestResult} from "../interface/RestRequestResult";

export interface RequestMethod {
    send(request: RestRequest, clientConfig?: RestClientConfig): Promise<RestRequestResult>;
}

export class MethodGet implements RequestMethod{
    public send(request: RestRequest, clientConfig?: RestClientConfig): Promise<RestRequestResult> {
        return request.get(clientConfig)
    }
}

export class MethodPost implements RequestMethod{
    public send(request: RestRequest, clientConfig?: RestClientConfig): Promise<RestRequestResult> {
        return request.post(clientConfig)
    }
}

export class MethodDelete implements RequestMethod{
    public send(request: RestRequest, clientConfig?: RestClientConfig): Promise<RestRequestResult> {
        return request.delete(clientConfig)
    }
}

export class MethodPatch implements RequestMethod{
    public send(request: RestRequest, clientConfig?: RestClientConfig): Promise<RestRequestResult> {
        return request.patch(clientConfig)
    }
}

export class Method {

    public static get(): RequestMethod {
        return new MethodGet()
    }

    public static post(): RequestMethod {
        return new MethodPost()
    }

    public static delete(): RequestMethod {
        return new MethodDelete()
    }

    public static patch(): RequestMethod {
        return new MethodPatch()
    }
}