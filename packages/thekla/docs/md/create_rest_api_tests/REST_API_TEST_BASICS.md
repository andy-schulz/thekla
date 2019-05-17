# The Rest API Test Basics

## Table of Content

* [Create an Actor with the ability to use a Rest API](#create-an-actor-with-the-ability-to-use-a-rest-api)
    * [Create the actor](#create-the-actor)
    * [Create a configuration](#create-a-configuration)
    * [Create the rest client](#create-the-rest-client)
    * [Assign the UseTheRestApi ability to the actor](#assign-the-usetherestapi-ability-to-the-actor)
* [Create a request](#create-a-request)
    * [A Simple Request](#a-simple-request)
    * [A parameterized Request](#a-parameterized-request)
    * [attach request options to your request declaration](#attach-request-options-to-your-request-declaration)
* [Send a request](#send-a-request)
    * [GET](#get)
    * [POST](#post)
    * [DELETE](#delete)
    * [The general SEND function](#the-general-send-function)
* [Check the Requests result](#check-the-requests-result)


## Create an Actor with the ability to use a Rest API

### Create the actor
To test a rest API you have to create an actor.

```typescript
import {Actor} from "thekla";

const Martha = Actor.named(`Martha`);
```

### Create a configuration

Now create a configuration 

```typescript
import {RestClientConfig} from "thekla";

const config: RestClientConfig = {
    restClientName: "request",   // specifies the client implementation. here: nodejs request module
                                // it is optional right now as there is only one client implementation
                                
    requestOptions: {
        proxy: "http://myproxy.mycompany.com:8080"
    }
};
```

For a very simple rest API without any authentication or any special headers the config can be empty.

```typescript
import {RestClientConfig} from "thekla";

const config: RestClientConfig = {};
```

### Create the rest client

To actually send a request to an endpoint you need a client.

```typescript
import {ExecutingRestClient, RestClient} from "thekla";

const myRestClient: RestClient = ExecutingRestClient.from(config);
```

you dont have to pass any configuration here, You could always do it when you create or send the request.
Please check [the request section](#attach-request-options-to-your-request-declaration) for details.

### Assign the UseTheRestApi ability to the actor

```typescript
import {UseTheRestApi} from "thekla";

Martha.can(UseTheRestApi.with(myRestClient));
```

Now you actor is ready to send requests to you endpoint. Whats missing is the request itself and the 
interaction to actually send the given request.

## Create a request

### A Simple Request

Create a request with theklas ``request(...)`` function. 

```typescript
import {request, On} from "thekla"

const myRequest = 
    request(On.resource("http://your/api/resource"));

const myRequestWithParams = 
    request(On.resource("http://your/api/ressource?with=params"));
```

Using the ``On.resource(...)`` object has just the benefit of better readability. In the future 
the ``On`` object might get additional possibilities to configure a request. As of now only ``On.resource``
is supported.

The request type (GET, POST, DELETE) is not specified yet, it will be given 
when sending the request.

If your API does not require any special headers or authentication, the above configuration 
would be enough to execute the request. Check [Send a Request](#send-a-request) for further details.


### A parameterized Request

To parameterize your request write a function 

```typescript
import {request, On} from "thekla"

const myParameterizedRequest = (parameterized: string) => {
    return request(On.resource(`http://your/${parameterized}/api/resource/`));
};

```

### attach request options to your request declaration

In most cases just specifying the resource is not enough. You can attach special request options with 
the request. 

```typescript
import {request, On, RestClientConfig} from "thekla"

const config: RestClientConfig = {
    requestOptions: {
        proxy: "http://myproxy.mycompany.com:8080"
    }
}

const myRequest = 
    request(On.resource("http://your/api/resource"))
        .withConfig(config);
```

See the [Rest Configuration](REST_CLIENT_CONFIGURATION.md) Chapter on how configure the request in detail. 

Configuring a request is possible on three different places:

1. When you assign the ``UseTheRestApi`` ability to you actor
    1. ``actor.can(UseTheRestApi.using(MY_CLIENT_CONFIG_1))``
    1. here you can specify the base url or the proxy
    1. see chapter on using the [UseTheRestApi](#create-an-actor-with-the-ability-to-use-a-rest-api) ability
1. On the ``request(...)`` itself 
    1. ``const req = request(On.resource("myResource")).using(MY_CLIENT_CONFIG_2)``
    1. here you can add options which are common to to all request methods, like header info or authentication info
    1. see [above](#attach-request-options-to-your-request-declaration) for details
1. When you actually send the request
    1. ``john.attemptsTo(Get.from(req)).withConfig(MY_CLIENT_CONFIG_3)``
    1. when sending a resource you can e.g. pass the body of a POST request
    1. See [Send a request](#send-a-request) for more details
    
All three configurations are merged before sending the request. This way you can give only the relevant information
when you build up your tests.

## Send a request

As of now three Methods are implemented to send a request to your API:

* GET
* POST
* DELETE

### GET

To retrieve information from you endpoint you instruct your actor to send a GET request ``req``.

```typescript
import {Get} from "thekla";

await Martha.attemptsTo(
    Get.from(req)
);
```

See the sections above for request creation ``const req = request(...)``

Just sending a request an not checking the response is quite pointless, so we should save the response
to a variable.

```typescript
import {Get} from "thekla";

const responsStorage: any[] = []
const to = (saveToVar: any[]) => (actual: any) => saveToVar.push(actual);

await Martha.attemptsTo(
    Get.from(req)
    .andSaveResponse(to(responsStorage))
);

console.log(responsStorage[0]);
```
The method ``andSaveResponse(...)`` takes a callback of type ``(actual: any) => void``. In the 
example above i just create an array and push the response into the array.

You can also do it in a more easy way:

```typescript
import {Get} from "thekla";

const toTheConsole = (actual: any) => {
    console.log(actual);
}

await Martha.attemptsTo(
    Get.from(req)
    .andSaveResponse(toTheConsole)
);
```

The following methods are supported:

* `Get` class
    * `.from(req: RestRequest)`

* `Get` instance
    * `.andSaveResponse(saveFunction: (value: any) => void)`
    * `.dontFailInCaseOfAnError()`
        * if the request returns an error, dont fail. If ``andSaveResponse`` was specified it will be called.
    * `.withConfig(config: RestClientConfig)`

### POST

Using the ``Post`` request is similar to using the ``Get`` request. For syntactical reasons 
you are not using a ``from`` but a ``to`` method.

```typescript
import {Post} from "thekla";

await Martha.attemptsTo(
    Post.to(req)
);
```

The following methods are supported:

* `Post` class
    * `.to(req: RestRequest)`

* `Post` instance
    * `.andSaveResponse(saveFunction: (value: any) => void)`
    * `.dontFailInCaseOfAnError()`
            * if the request returns an error, dont fail. If ``andSaveResponse`` was specified it will be called.
    * ``.withConfig(config: RestClientConfig)``

Posting a request requires you to specify at least a request body.

This can be achieved by passing the config with the ``withConfig(config: RestClientConfig)`` method.
See [the configuration chapter](REST_CLIENT_CONFIGURATION.md) for more details.

### DELETE

Using the ``Delete`` request is ... again ... similar to using the ``Get`` request. 

```typescript
import {Delete} from "thekla";

await Martha.attemptsTo(
    Delete.from(req)
);
```

* ``Delete`` class
    * ``.from(req: RestRequest)``

* ``Delete`` instance
    * ``.andSaveResponse(saveFunction: (value: any) => void)``
    * ``.dontFailInCaseOfAnError()``
            * if the request returns an error, dont fail. If ``andSaveResponse`` was specified it will be called.
    * ``.withConfig(config: RestClientConfig)``

### The general SEND function

If dont want to use the ``Get``, ``Post`` and ``Delete`` methods directly, 
you can switch to the more general ``Send`` object.

```typescript
import {Send, Method} from "thekla";

await Martha.attemptsTo(
    Send.the(req).as(Method.get())
);
```

* ``Send`` class
    * .the(req: RestRequest)

* ``Send`` instance
    * ``.as(method: RequestMethod)``
    * ``.andSaveResponse(saveFunction: (value: any) => void)``
    * ``.dontFailInCaseOfAnError()``
            * if the request returns an error, dont fail. If ``andSaveResponse`` was specified it will be called.
    * ``.withConfig(config: RestClientConfig)``
    
RequestMethod supports the following rest Methods:

* ``Method``
    * ``.get()``
    * ``.post()``
    * ``.delete()``

## Check the Requests result

In case you just want to check the response without extracting any values, 
use the See interaction directly.

```typescript
import {See, Response, Method, Expected} from "thekla";

const myExpectedResponse = {
    valueA: "A",
    valueB: "B",
    valueC: ["C"],
}

await Martha.attemptsTo(
    See.if(Response.of(req).as(Method.get()))
                    .is(Expected.toContain(myExpectedResponse))
);
```

In this example ``myExpectedResponse`` is a subset of the actual response. `Expected.toContain()`
just checks whether the values are within the result or not.
