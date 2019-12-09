import {RestClientConfig} from "@thekla/config";
import {RestClient}       from "../interface/RestClient";
import {RestClientRqst}   from "../rqst/RestClientRqst";

export class ExecutingRestClient {
    public static from(conf: RestClientConfig): RestClient {
        return RestClientRqst.with(conf.requestOptions)
    }
}