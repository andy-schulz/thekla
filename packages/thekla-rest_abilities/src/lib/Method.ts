import {RestClientConfig}  from "@thekla/config";
import {RestRequest}       from "../interface/RestRequest";
import {RestRequestResult} from "../interface/RestRequestResult";

export interface RequestMethod {
    send(request: RestRequest): Promise<RestRequestResult>;
}

export class MethodGet implements RequestMethod{
    public send(request: RestRequest): Promise<RestRequestResult> {
        return request.get()
    }
}

export class MethodPost implements RequestMethod{
    public send(request: RestRequest): Promise<RestRequestResult> {
        return request.post()
    }
}

export class MethodDelete implements RequestMethod{
    public send(request: RestRequest): Promise<RestRequestResult> {
        return request.delete()
    }
}

export class MethodPatch implements RequestMethod{
    public send(request: RestRequest): Promise<RestRequestResult> {
        return request.patch()
    }
}

export class MethodPut implements RequestMethod{
    public send(request: RestRequest): Promise<RestRequestResult> {
        return request.put()
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