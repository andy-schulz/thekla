import {RequestOptions} from "@thekla/config";
import {On}             from "../lib/Ressource";
import {RestRequest}    from "./RestRequest";

export interface RestClient {
    request(resource: On, clientConfig?: RequestOptions): RestRequest;
}