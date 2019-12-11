import {RequestOptions}  from "@thekla/config";
import merge             from "deepmerge";
import {RestClient}      from "../interface/RestClient";
import {RestRequest}     from "../interface/RestRequest";
import {On}              from "../lib/Resource";
import {RestRequestRqst} from "./RestRequestRqst";

export class RestClientRqst implements RestClient {

    public static with(baseRequestOptions: RequestOptions = {}): RestClient {
        return new RestClientRqst(baseRequestOptions);
    }

    public request(resource: On, requestOptions: RequestOptions): RestRequest {
        const opts: RequestOptions = merge(this.baseRequestOptions, requestOptions);
        return new RestRequestRqst(resource.resource, opts)
    }

    private constructor(private baseRequestOptions: RequestOptions) {

    }
}