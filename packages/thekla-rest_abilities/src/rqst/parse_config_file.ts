import {Headers, RequestOptions, ResponseType, SearchParamsType} from "@thekla/config"
import {ExtendOptions}                                           from "got";
import {HttpProxyAgent, HttpsProxyAgent}                         from "hpagent";
import {curry, merge, pipe}                                      from "ramda";

type CurriedOptionsFunc<T> = (arg: T) => (gotOpts: ExtendOptions) => ExtendOptions;
type JsonBody = { [key: string]: any; }

export const createGotOptions = (reqOpts: RequestOptions): ExtendOptions => {

    return pipe(
        reqOpts.baseUrl ? setBaseUrl(reqOpts.baseUrl) : identity(reqOpts),
        reqOpts.port ? setPort(reqOpts.port) : identity(reqOpts),
        reqOpts.headers ? setHeaders(reqOpts.headers) : identity(reqOpts),
        reqOpts.textBody ? setTextBody(reqOpts.textBody) : identity(reqOpts),
        reqOpts.jsonBody ? setJsonBody(reqOpts.jsonBody) : identity(reqOpts),
        reqOpts.responseType ? setResponseType(reqOpts.responseType) : identity(reqOpts),
        reqOpts.searchParams ? setSearchParams(reqOpts.searchParams) : identity(reqOpts),
        reqOpts.resolveBodyOnly ? setResolveBodyOnly(reqOpts.resolveBodyOnly) : identity(reqOpts),

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

const setPort: CurriedOptionsFunc<string | number> = curry((port: string | number, gotOpts: ExtendOptions): ExtendOptions => {
    return merge(gotOpts, {port: port});
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

const setResolveBodyOnly: CurriedOptionsFunc<boolean> = curry((bodyOnly: boolean, gotOpts: ExtendOptions): ExtendOptions => {
    return merge(gotOpts, {resolveBodyOnly: bodyOnly});
})

const setHeaders: CurriedOptionsFunc<Headers> = curry((headers: Headers, gotOpts: ExtendOptions): ExtendOptions => {
    return merge(gotOpts, {headers: headers});
})

const setProxy: CurriedOptionsFunc<string> = curry((proxyUrl: string, gotOpts: ExtendOptions): ExtendOptions => {

    const httpProxy = {
        agent: {
            http: new HttpProxyAgent({
                keepAlive:      true,
                keepAliveMsecs: 1000,
                maxSockets:     256,
                maxFreeSockets: 256,
                proxy:          proxyUrl
            })
        }
    }

    const httpsProxy = {
        agent: {
            http: new HttpsProxyAgent({
                keepAlive:      true,
                keepAliveMsecs: 1000,
                maxSockets:     256,
                maxFreeSockets: 256,
                proxy:          proxyUrl
            })
        }
    }

    return merge(gotOpts, proxyUrl.startsWith(`https`) ? httpsProxy : httpProxy);
})