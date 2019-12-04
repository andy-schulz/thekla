---
title: Abilities
parent: Rest Abilities
has_children: true
nav_order: 10
---

# Abilities to work with REST APIs
{: .no_toc }

1. TOC
{:toc}

# UseTheRestApi

Acors ability to use a rest API.

## Methods
{: .no_toc }

| name        | parameter                 | description                                     |
| :---        | :---                      | :---                                            |
| `.with()`* | client: Client | returns an ability instance with                |

## Example
{: .no_toc }

Pass the ability to an actor.

```typescript
const theRestClient = ExecutingRestClient.from(thekla.restConfig());
const jonathan = Actor.named("Jonathan");
jonathan.can(UseTheRestApi.using(theRestClient));
```

> See section [Rest Client Configuration](../configuration/REST_CLIENT_CONFIG.md) to configure the rest client.