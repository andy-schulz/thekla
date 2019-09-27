---
title: UseTheRestApi
parent: Ref:Abilities
---

# USeTheRestApi

Acors ability to use a rest API.

## Methods

| name        | parameter                 | description                                     |
| :---        | :---                      | :---                                            |
| `.with()`* | client: Client | returns an ability instance with                |

## Example

Pass the ability to an actor.

```typescript
const theRestClient = ExecutingRestClient.from(thekla.restConfig());
const jonathan = Actor.named("Jonathan");
jonathan.can(UseTheRestApi.using(theRestClient));
```

> See section [Rest Client Configuration](../configuration/REST_CLIENT_CONFIG.md) to configure the rest client.