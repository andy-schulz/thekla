---
title: Abilities
parent: Web and Mobile Features
has_children: true
nav_order: 10
---

# Web and Mobile Abilities
{: .no_toc }

1. TOC
{:toc}

# BrowseTheWeb

Acors ability to use a browser and interact with it.

## Methods
{: .no_toc }

| name        | parameter                 | description                      |
| :---        | :---                      | :---                             |
| `.using()`* | browser: Browser / Client | returns an ability instance with |

## Creating a browser
{: .no_toc }

To create a browser object which can be assigned to the ability, call the helper object `RunningBrowser` as follows:

````typescript
import {RunningBrowser, TheklaGlobal} from "thekla";
declare const thekla: TheklaGlobal;

const aBrowser = RunningBrowser
        .startedOn(thekla.serverConfig())
        .withCapabilities(thekla.capabilities());
````

The configuration can be passed directly or can be used from the configuration file as it is done here.

> See the [Configuration](../../basics/CONFIGURATION.md) section for more details

## Example
{: .no_toc }

Pass the ability to actor `Jonathan`.

```typescript
const jonathan = Actor.named("Jonathan");

jonathan.can(BrowseTheWeb.using(aBrowser));
```

Now the actor is able to execute activities.

````typescript
jonathan.attemptsTo(
    Click.on(element)
)
````

> Find the details to locate an element in section [Element](../elements/ELEMENT.md).

# OperateOnMobileDevice

Acors ability to operate an app on a mobile device.

## Methods
{: .no_toc }

| name        | parameter                 | description                                     |
| :---        | :---                      | :---                                            |
| `.using()`* | client: Client | returns an ability instance with                |

## Example
{: .no_toc }

Pass the ability to an actor.

```typescript
const jonathan = Actor.named("Jonathan");
jonathan.can(OperateOnMobileDevice.using(aClient));