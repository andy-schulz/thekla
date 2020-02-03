---
title: Interactions
parent: Rest Features
has_children: true
nav_order: 10
---

# Interactions for working with REST APIs
{: .no_toc }

1. TOC
{:toc}

# Delete

Delete from the specified resource.

## Ability
{: .no_toc }

- [UseTheRestApi](../../abilities/USE_THE_REST_API.md)

## Methods
{: .no_toc }

| name                 | parameter           | description                                                                   |
| :---                 | :---                | :---                                                                          |
| `.from()`*           | request: SppRequest | the request to send for the DELETE method                                     |
| `.continueOnError()` | -                   | dont exit in case of an error, html codes 4xx and 5xx are considered an error |

## Example
{: .no_toc }

create a request. In general the resource is parameterized e.g. a userId,
for simplicity a plain simple resource is used.

````typescript
const user = request(On.resource("htpps://example.com/user/"));

````

````typescript
const response = await john.attemptsTo(
    Delete.from(user)
)
````

````typescript
const response = await Delete.from(user).performAs(john)
````

# Get

Get the resource.

## Ability
{: .no_toc }

- [UseTheRestApi](../../abilities/USE_THE_REST_API.md)

## Methods
{: .no_toc }

| name                 | parameter           | description                                                                   |
| :---                 | :---                | :---                                                                          |
| `.from()`*           | request: SppRequest | the request to send for the GET method                                     |
| `.continueOnError()` | -                   | dont exit in case of an error, html codes 4xx and 5xx are considered an error |

## Example
{: .no_toc }

````typescript
const response = await john.attemptsTo(
    Get.from(user)
)
````

````typescript
const response = await Get.from(user).performAs(john)
````

# Post

## Ability
{: .no_toc }

- [UseTheRestApi](../../abilities/USE_THE_REST_API.md)

## Methods
{: .no_toc }

## Example
{: .no_toc }
