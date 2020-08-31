/* eslint-disable quotes */

export interface RestClientConfig {

    // eslint-disable-next-line quotes
    restClientName?: "got";
    requestOptions?: RequestOptions;
}

export declare type Headers = Record<string, string | string[] | undefined>;
export declare type PathParameters = Record<string, string | string[] | undefined>;

export declare type ResponseType = 'json' | 'buffer' | 'text'
export declare type SearchParamsType =  string | { [key: string]: string | number | boolean | null | undefined; }
export interface RequestOptions {

    baseUrl?: string;
    port?: string | number;

    headers?: Headers;
    searchParams?: SearchParamsType;
    pathParams?: PathParameters;

    jsonBody?: {
        [key: string]: any;
    };
    textBody?: string;

    responseType?: ResponseType;

    resolveBodyOnly?: boolean;

    proxy?: string
}