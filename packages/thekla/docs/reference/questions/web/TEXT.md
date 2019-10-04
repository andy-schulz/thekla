---
title: Text
parent: Ref:Questions
---

# Text
Get the content / text of element.

## Ability

- [BrowseTheWeb](../../abilities/BROWSE_THE_WEB.md)
- [OperateOnMobileDevice](../../abilities/OPERATE_ON_MOBILE_DEVICE.md)

## Methods

| name     | parameter           | description                      |
| :---     | :---                | :---                             |
| `.of()*` | element: SppElement | the element to get the text from |

## Example

create the an actor 

````typescript
const john = Actor.named(`John`);
john.whoCan(BrowseTheWeb.using(aBrowser));
````

use the `See` interaction to check for a text

````typescript
john.attemptsTo(
    See.if(Text.of(element))
        .is(Expected.toBe(`MyText`))
)
````

save the text for later use.
```typescript
const text = await Text.of(element).answerdBy(john)
```