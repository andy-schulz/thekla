---
title: Status
parent: Ref:Questions
---

# Status

Get the visibiliy or enabled status of an element.

## Ability

- [BrowseTheWeb](../../abilities/BROWSE_THE_WEB.md)
- [OperateOnMobileDevice](../../abilities/OPERATE_ON_MOBILE_DEVICE.md)

## Methods

| name             | parameter           | description                                   |
| :---             | :---                | :---                                          |
| `.visible.of()*` | element: SppElement | the element to get the visibility status from |
| `.enable.of()*`  | element: SppElement | the element to get the enabled status from    |

## Example

Use the `See` interaction to check the elements visible status.

````typescript
john.attemptsTo(
    See.if(Status.visible.of(element))
        .is(Expected.toBe(true))
)
````

Save the elements enable status to a variable.

```typescript
const text = await Status.enable.of(element).answerdBy(john)
```