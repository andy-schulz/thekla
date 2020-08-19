import {RequestOptions}    from "@thekla/config";
import merge               from "deepmerge";
import got                 from "got"
import R                   from "ramda";
import {RestRequestResult} from "..";
import {RestRequest}       from "../interface/RestRequest";
import {createGotOptions}  from "./parse_config_file.ts'";
import {replacePathParams} from "./path_parameters";

export class RestRequestRqst implements RestRequest {

    public constructor(
        private resource: string,
        private requestOptions: RequestOptions) {
    }

    public get(): Promise<RestRequestResult> {
        return this.send(got.get);
    }

    public patch(): Promise<RestRequestResult> {
        return this.send(got.patch);
    }

    public put(): Promise<RestRequestResult> {
        return this.send(got.put);
    }

    public post(): Promise<RestRequestResult> {
        return this.send(got.post);
    }

    public delete(): Promise<RestRequestResult> {
        return this.send(got.delete);
    }

    public toString(): string {
        return `resource: ${this.resource} with options: ${JSON.stringify(this.requestOptions)}`
    }

    /**
     * merge two configs
     * @param orig
     * @param merger
     */
    protected mergeClientConfig(orig: RequestOptions, merger: RequestOptions): RequestOptions {
        return merge(orig, merger);
    }

    private replacePathParams = (resource: string, opts: RequestOptions) => {
        if (!opts.pathParams)
            return resource;

        const pathParams = opts.pathParams;
        const reducer = (res: string, arr: [string, string | string[] | undefined]): string => {

            return ``;
        }
        R.reduce(reducer, resource, Object.entries(pathParams))

    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private send(methodFunction: any): Promise<RestRequestResult> {
        return new Promise((resolve, reject): void => {
            methodFunction(replacePathParams(this.resource, this.requestOptions), createGotOptions(this.requestOptions))
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
}