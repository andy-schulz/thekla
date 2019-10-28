import {RestClientConfig}  from "@thekla/config";
import {RestRequestResult} from "./RestRequestResult";

export interface RestRequest {
    get(clientConfig?: RestClientConfig): Promise<RestRequestResult>;

    post(clientConfig?: RestClientConfig): Promise<RestRequestResult>;

    patch(clientConfig?: RestClientConfig): Promise<RestRequestResult>;

    delete(clientConfig?: RestClientConfig): Promise<RestRequestResult>;
}