# Configure the Rest Client

## Table of content

* [Config structure](#config-structure)
* [Useful request Options in detail](#useful-request-options-in-detail)
    * [resolveWithFullResponse](#resolvewithfullresponse)
    * [proxy](#proxy)
    * [body](#body)
    * [header](#header)
* [All request Options](#all-request-options)

## Config structure

the RestClientConfig consists of two Attributes:

```typescript
import {RequestPromiseOptions} from "request-promise-native";

export interface RestClientConfig {

    restClientName?: "request";
    requestOptions?: RequestPromiseOptions;
}
```

The `restClientName` is meant to specify which client implementation to take. As of yet I just implemented implemented
the nodejs 'request' module, so specify it like seen above. 

To configure the client and the requests the `requestOptions` will be used. 

## Useful request Options in detail

I will just 

Check out the [Full List of request options]() for more details, or consult the the 
[nodejs request module](https://github.com/request/request) on GitHub.

### resolveWithFullResponse

```typescript
import {RestClientConfig} from "thekla"

const config: RestClientConfig = {
    requestOptions: {
        resolveWithFullResponse: true
    }
}
```

Default: `false`

If set to `true` the complete Response object will be returned including HttpStatusCode, header information, 
response body etc.

If set to `false` only the response body is returned. If you are just interested in the returned data, 
leave the value at `false`.

the followng two examples demonstrate the amount of data returned when switching between 
`resolveWithFullResponse: true` and `false`

Example for `resolveWithFullResponse: true`

```typescript
const response = {
    _readableState: {},
    readable: false,
    domain: null,
    _events: {},
    _eventsCount: 4,
    _maxListeners: undefined,
    socket: {},
    connection: {},
    httpVersionMajor: 1,
    httpVersionMinor: 1,
    httpVersion: '1.1',
    complete: true,
    headers: {},
    rawHeaders: [],
    trailers: {},
    rawTrailers: [],
    upgrade: false,
    url: '',
    method: null,
    statusCode: 200,
    statusMessage: 'OK',
    client: {},
    _consuming: true,
    _dumped: false,
    req: {},
    request: {},
    toJSON: [responseToJSON],
    caseless: {},
    read: [Function],
    body: '8'
}
```

Example for `resolveWithFullResponse: false`

```typescript
const response = 8
```

Only the content of the body attribute will be returned when `resolveWithFullResponse: true`

### proxy

A Proxy can be set using the following config.

```typescript
import {RestClientConfig} from "thekla"

const config: RestClientConfig = {
    requestOptions: {
        proxy: "myproxy.mycompany.com:8080"
    }
}
```

### body

Post requests require a request body which can be set with the following attribute.

```typescript
import {RestClientConfig} from "thekla"

const config: RestClientConfig = {
    requestOptions: {
        body: {
            // My content goes here
        }
    }
}
```

### header

Headers can be set with the following attribute.

```typescript
import {RestClientConfig} from "thekla"

const config: RestClientConfig = {
    requestOptions: {
        headers: {
            "Authorization": "Basic ABCDEFGHIJKLMN",
            "Content-Encoding": "identity"
        }
    }
}
```


## All request Options

```typescript
interface RequestPromiseOptions {
    resolveWithFullResponse?: boolean;
    baseUrl?: string;
    callback?: RequestCallback;
    jar?: CookieJar | boolean;
    formData?: { [key: string]: any };
    form?: { [key: string]: any } | string;
    auth?: AuthOptions;
    oauth?: OAuthOptions;
    aws?: AWSOptions;
    hawk?: HawkOptions;
    qs?: any;
    qsStringifyOptions?: any;
    qsParseOptions?: any;
    json?: any;
    jsonReviver?: (key: string, value: any) => any;
    jsonReplacer?: (key: string, value: any) => any;
    multipart?: RequestPart[] | Multipart;
    agent?: http.Agent | https.Agent;
    agentOptions?: http.AgentOptions | https.AgentOptions;
    agentClass?: any;
    forever?: any;
    host?: string;
    port?: number;
    method?: string;
    headers?: Headers;
    body?: any;
    family?: 4 | 6;
    followRedirect?: boolean | ((response: http.IncomingMessage) => boolean);
    followAllRedirects?: boolean;
    followOriginalHttpMethod?: boolean;
    maxRedirects?: number;
    removeRefererHeader?: boolean;
    encoding?: string | null;
    pool?: any;
    timeout?: number;
    localAddress?: string;
    proxy?: any;
    tunnel?: boolean;
    strictSSL?: boolean;
    rejectUnauthorized?: boolean;
    time?: boolean;
    gzip?: boolean;
    preambleCRLF?: boolean;
    postambleCRLF?: boolean;
    withCredentials?: boolean;
    key?: Buffer;
    cert?: Buffer;
    passphrase?: string;
    ca?: string | Buffer | string[] | Buffer[];
    har?: HttpArchiveRequest;
    useQuerystring?: boolean;
}
```