import {RequestOptions, ResponseType, SearchParamsType} from "@thekla/config"
import {ExtendOptions}                                  from "got";
import {HttpProxyAgent, HttpsProxyAgent}                from "hpagent";
import {curry, merge, pipe}                             from "ramda";

type CurriedOptionsFunc<T> = (arg: T) => (gotOpts: ExtendOptions) => ExtendOptions;
type JsonBody = { [key: string]: any; }

export const createGotOptions = (reqOpts: RequestOptions): ExtendOptions => {

    return pipe(
        reqOpts.baseUrl ? setBaseUrl(reqOpts.baseUrl) : identity(reqOpts),
        reqOpts.textBody ? setTextBody(reqOpts.textBody) : identity(reqOpts),
        reqOpts.jsonBody ? setJsonBody(reqOpts.jsonBody) : identity(reqOpts),
        reqOpts.responseType ? setResponseType(reqOpts.responseType) : identity(reqOpts),
        reqOpts.searchParams ? setSearchParams(reqOpts.searchParams) : identity(reqOpts),

        // proxy shall be last to add
        reqOpts.proxy ? setProxy(reqOpts.proxy) : identity(reqOpts)
    )({})
}

const identity: CurriedOptionsFunc<RequestOptions> = curry((reqOpts: RequestOptions, gotOpts: ExtendOptions): ExtendOptions => {
    return gotOpts
})

const setBaseUrl: CurriedOptionsFunc<string> = curry((baseUrl: string, gotOpts: ExtendOptions): ExtendOptions => {
    return merge(gotOpts, {prefixUrl: baseUrl});
})

const setTextBody: CurriedOptionsFunc<string> = curry((textBody: string, gotOpts: ExtendOptions): ExtendOptions => {
    return merge(gotOpts, {body: textBody});
})

const setJsonBody: CurriedOptionsFunc<JsonBody> = curry((jsonBody: JsonBody, gotOpts: ExtendOptions): ExtendOptions => {
    return merge(gotOpts, {json: jsonBody});
})

const setResponseType: CurriedOptionsFunc<ResponseType> = curry((responseType: ResponseType, gotOpts: ExtendOptions): ExtendOptions => {
    return merge(gotOpts, {responseType: responseType});
})

const setSearchParams: CurriedOptionsFunc<SearchParamsType> = curry((searchParams: SearchParamsType, gotOpts: ExtendOptions): ExtendOptions => {
    return merge(gotOpts, {searchParams: searchParams});
})

const setProxy: CurriedOptionsFunc<string> = curry((proxyUrl: string, gotOpts: ExtendOptions): ExtendOptions => {

    const httpProxy = {
        agent: {
            http: new HttpProxyAgent({
                keepAlive: true,
                keepAliveMsecs: 1000,
                maxSockets: 256,
                maxFreeSockets: 256,
                proxy: proxyUrl
            })
        }
    }

    const httpsProxy = {
        agent: {
            http: new HttpsProxyAgent({
                keepAlive: true,
                keepAliveMsecs: 1000,
                maxSockets: 256,
                maxFreeSockets: 256,
                proxy: proxyUrl
            })
        }
    }

    return merge(gotOpts, proxyUrl.startsWith(`https`) ? httpsProxy : httpProxy);
})