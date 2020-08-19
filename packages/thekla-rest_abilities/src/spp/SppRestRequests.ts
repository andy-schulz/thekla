import {RequestOptions, RestClientConfig} from "@thekla/config";
import merge                              from "deepmerge";
import {RestClient}                       from "../interface/RestClient";
import {RestRequest}                      from "../interface/RestRequest";
import {On}                               from "../lib/Resource";

export interface RequestHelper extends Function {
    resource: string;
    options: Record<string, unknown>;

    (restClient: RestClient, requestOptions: RequestOptions): RestRequest;
}

/**
 * the rest request instance
 */
export class SppRestRequest {

    public constructor(
        public resource: On,
        public sender: RequestHelper) {
    }

    /**
     * returns a new request instance, the passed client config will be merged with the current config
     *
     * @param {RestClientConfig} clientConfig - the new partial client config
     * @returns {SppRestRequest} a new request instance
     */
    public using(requestOptions: RequestOptions): SppRestRequest {

        if (!requestOptions)
            throw new Error(`passing empty request options not allowed`);

        const sender: RequestHelper = (restClient: RestClient, rqstOptns: RequestOptions): RestRequest => {
            const opts = merge(rqstOptns, requestOptions);
            return this.sender(restClient, opts)
        };
        sender.resource = this.sender.resource;
        sender.options = merge(this.sender.options, requestOptions);

        return new SppRestRequest(this.resource, sender);
    }

    /**
     * execute the request
     * @param {RestClient} restClient
     * @returns {RestRequest}
     */
    public send(restClient: RestClient): RestRequest {
        return this.sender(restClient, {});
    }

    /**
     * return the request description string
     * @returns {string} the request description
     */
    public toString(): string {
        return `resource: ${this.sender.resource} with options: ${JSON.stringify(this.sender.options, null, `\t`)}`;
    }
}

export class SppRestRequestResult {

}

/**
 * creating an SppRestRequest
 * @param resource - resource the request is going to
 */
export function request(resource: On): SppRestRequest {

    const send: RequestHelper = (restClient: RestClient, clientConfig: RequestOptions): RestRequest => {
        return restClient.request(resource, clientConfig);
    };

    send.resource = `${resource}`;
    send.options = {};

    return new SppRestRequest(resource, send);
}