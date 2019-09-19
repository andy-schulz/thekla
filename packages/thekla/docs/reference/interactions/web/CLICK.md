---
title: Click
parent: Interactions
grand_parent: Reference
has_children: false
---

# Click

Clicks on the given browser element (mobile / desktop) or an app element (mobile). 

> the `Tap` interaction is not implemented, it will follow soon

## Ability

- [BrowseTheWeb](../../abilities/BROWSE_THE_WEB.md)
- [OperateOnMobileDevice](../../abilities/OPERATE_ON_MOBILE_DEVICE.md)

## Methods

| name     | parameter           | description              |
| :---     | :---                | :---                     |
| `.on()`* | element: SppElement | the element to click on. |

## Example

```typescript
Josh.attemptsTo(
    Click
        .on(Googles.SEARCH_BUTTON)
)
```