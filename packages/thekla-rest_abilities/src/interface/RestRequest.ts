import {RestRequestResult} from "./RestRequestResult";

export interface RestRequest {
    get(): Promise<RestRequestResult>;

    post(): Promise<RestRequestResult>;

    patch(): Promise<RestRequestResult>;

    put(): Promise<RestRequestResult>;

    delete(): Promise<RestRequestResult>;
}