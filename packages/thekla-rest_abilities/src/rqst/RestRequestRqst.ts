import {RequestOptions}    from "@thekla/config";
import merge               from "deepmerge";
import * as rp             from "request-promise-native";
import {RestRequest}       from "../interface/RestRequest";
import {RestRequestResult} from "../interface/RestRequestResult";

export class RestRequestRqst implements RestRequest {

    public constructor(
        private resource: string,
        private requestOptions: RequestOptions) {
    }

    public get(): Promise<RestRequestResult> {
        return this.send(rp.get);
    }

    public patch(): Promise<RestRequestResult> {
        return this.send(rp.patch);
    }

    public put(): Promise<RestRequestResult> {
        return this.send(rp.put);
    }

    public post(): Promise<RestRequestResult> {
        return this.send(rp.post);
    }

    public delete(): Promise<RestRequestResult> {
        return this.send(rp.delete);
    }

    /**
     * merge two configs
     * @param orig
     * @param merger
     */
    protected mergeClientConfig(orig: RequestOptions, merger: RequestOptions): RequestOptions {
        return merge(orig, merger);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private send(fn: any): Promise<RestRequestResult> {
        return new Promise((resolve, reject): void => {
            fn(this.resource, this.requestOptions)
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                .then((response: any): void => {
                    resolve(response);
                })
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                .catch((e: any): void => {
                    reject(e.response ? e.response : e);
                });
        });
    }

    public toString(): string {
        return `resource: ${this.resource} with options: ${JSON.stringify(this.requestOptions)}`
    }
}