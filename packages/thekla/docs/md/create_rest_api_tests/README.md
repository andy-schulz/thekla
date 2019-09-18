---
title: TEMPLATE
parent: NONE
has_children: true
nav_order: 1
---

# Use your Rest API with Thekla

To use a REST API in your tests you have to do the following steps:

1. create a request
1. create an actor with the ability ``UseTheRestApi``
1. execute your request

# Quick Start Guide
The fastest way to get started is by downloading the 
[Thekla Examples](https://github.com/andy-schulz/thekla-examples) repository


```typescript
import {
    TheklaConfig,
    ExecutingRestClient,
    On,
    request,
    Actor,
    UseTheRestApi,
    Get,
    Response,
    Expected,
    RestClientConfig,
    Method,
    See,
    Send
} from "thekla";

declare const thekla: {config: TheklaConfig};

describe(`Using the MathJs API to add numbers`, () => {

    it(' with url parameter, should return the correct sum ' +
        '- (test case id: fa78ae96-1aba-4803-84ef-bda90583855d)', async () => {

        // create the actor
        const Martha = Actor.named(`Martha`);

        // create a rest client, the current implementation uses the nodejs 'request' module
        // the rest client config is take from the thekla_conf.ts configuration
        // right now its empty, as for a very simple request nothing has to be configured
        const theRestClient = ExecutingRestClient.from(thekla.config.restConfig as RestClientConfig);

        // give Martha the ability to use the just created API
        Martha.can(UseTheRestApi.with(theRestClient));

        // create a simple request
        const req = request(On.resource(`http://api.mathjs.org/v4/?expr=2*(7-3)`));

        let result: any[] = [];

        // push the result from the request into the array
        const to = (resultContainer: any[]) => (actual: any) => resultContainer.push(actual);

        // now Martha can execute the request and store the value into the result array
        await Martha.attemptsTo(
            Get.from(req).andSaveResponse(to(result))
        );
        expect(result).toEqual([`8`]);


        // Or do it in a general SendMyRequest Way
        result = [];
        await Martha.attemptsTo(
            Send.the(req).as(Method.get())
                .andSaveResponse(to(result))
        );
        expect(result[0]).toBe(`8`);


        // if you just want to check the result you can do it in one step
        await Martha.attemptsTo(
            See.if(Response.of(req).as(Method.get()))
                .is(Expected.toBe("8")),
        );
    });
});
```

# Where to continue

* [The Basics](REST_API_TEST_BASICS.md)
* [Configure the request client](REST_CLIENT_CONFIGURATION.md)

## Create a Request

create a request:

```typescript
import {request, On} from "thekla"

const mathGetRequest = request(On.resource())



```

## Create an actor with the ability to use a REST API

## Execute your Requests

## 