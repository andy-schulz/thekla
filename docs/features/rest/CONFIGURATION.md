---
title: Configuration
parent: Rest Features
has_children: true
nav_order: 10
---
# Configuration

## RequestOptions

The following options are available to configure the http requests.

````typescript
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

    proxy?: string
}
````

## Specify Options

Options can be specified on three different Levels:

1. on Request Client Level
2. on Request Level
3. on Method Level

I will use the ``baseUrl`` attribute to demonstrate the three different configuration types.

### Specify options on client Level

RequestOptions specified at client level will be used for all further requests and must not be specified at the
other levels again, but can be overwritten.

The RestClientConfig ist used to parameterize the http client and can contain request options as well.

To configure the baseUrl at client level set the ``baseUrl`` attribute within the ``requestOption`` object. 

````typescript
const Richard: Actor = Actor.named(`Richard`);

// specify RequestOptions within the ClientConfig
const restClientConfig: RestClientConfig = {
        requestOptions: {
            baseUrl: `https://my.domain.com`
        }
    };
// assign client config to client used by ability 
Richard.whoCan(UseTheRestApi.with(ExecutingRestClient.from(restClientConfig)));

// the base url can now be omitted
// the GET request is now performed on: http://my.domain.com/status
const systemStatus = request(On.resource(`status`));

Richard.attemptsTo(
    Get.from(systemStatus)
)
````

### Specify options on Request Level

If you want to set request options per request use the ``using()`` method when creating the request.

Options set at client level will be merged / overwritten with options set at request level.

````typescript
const Richard: Actor = Actor.named(`Richard`);

const restClientConfig: RestClientConfig = {};

Richard.whoCan(UseTheRestApi.with(ExecutingRestClient.from(restClientConfig)));

const opts: RequestOptions = {
    baseUrl: `https://my.domain.com`
 }

// set the options per request to reuse options for different request executions
const systemStatus = request(On.resource(`status`)).using(opts);

Richard.attemptsTo(
    Get.from(systemStatus)
)
````

### Specify options on Method Level

The request itself is immutable, so you can set the options directly before the method executes.

````typescript
const Richard: Actor = Actor.named(`Richard`);

const restClientConfig: RestClientConfig = {};

Richard.whoCan(UseTheRestApi.with(ExecutingRestClient.from(restClientConfig)));

const systemStatus = request(On.resource(`status`));

const opts: RequestOptions = {
    baseUrl: `https://my.domain.com`
 }

Richard.attemptsTo(
    Get.from(systemStatus.using(opts))
       

// or

Richard.attemptsTo(
    Get.from(systemStatus.using({baseUrl: `https://my.domain.com`}))
)
````


## Options

### ``baseUrl``

Set the baseUrl for the request.

````json
{
    "baseUrl": "https://my.domain.com"
}
````

### ``port``

Set the request port

````json
{
    "port": 1234
}
````

### ``headers``

Set the requests header information

````json
{
    "headers": {
        "Accept": "application/json",
        "Authorization": "Basic 1234567ABCDEF"
    }
}
````

### ``searchParams``

Add queryParameter to the request

````json
{
    "searchParams": {
        "firstParam": "one",
        "secondParam": "two"
    }
}
````

The following request will is send to:

``http://my.domain.com/queries/?firstParam=one&secondParam=two``

````typescript
const opts: RequestOptions = {
    searchParams: {
            "firstParam": "one",
            "secondParam": "two"
        }
 }

const systemStatus = request(On.resource(`http://my.domain.com/queries/`));
                         .using(opts)
````


### ``pathParams``

Add path parameter to the request

````json
{
    "pathParams": {
        "user": "one",
        "password": "two"
    }
}
````

Path parameter is specified as ``{user}`` within a url.

The following request is send to:

``http://my.domain.com/user/one/password/two``

````typescript
const opts: RequestOptions = {
    searchParams: {
            "firstParam": "one",
            "secondParam": "two"
        }
 }

const systemStatus = request(On.resource(`http://my.domain.com/{user}/one/{password}/two`));
                         .using(opts)
````
### ``jsonBody`` and ``textBody``



### ``responseType``

In case the ``responseType`` is set to ``json`` the system tries to parse the result body to a JSON

````json
{
    "responseType": "json"
}
````

### ``proxy``

Specify the proxy information if you are behind a corporate proxy.

````json
{
    "proxy": "http://user:password@proxy.my.company.com:8080"
}
````