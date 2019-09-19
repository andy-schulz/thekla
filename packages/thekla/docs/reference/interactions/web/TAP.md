---
title: Tap
parent: Interactions
grand_parent: Reference
has_children: false
---

# Tap NOT IMPLEMENTED YET

Tap on an element or position of an touch enabled device ( mobile or desktop / laptop).

## Ability

- [BrowseTheWeb](../../abilities/BROWSE_THE_WEB.md)
- [OperateOnMobileDevice](../../abilities/OPERATE_ON_MOBILE_DEVICE.md)

## Methods

| name      | parameter                              | description                              |
| :---      | :---                                   | :---                                     |
| ` .on()`* | element: SppElement or position: Point | taps on an element or a screens position |

## Example

```typescript
Josh.attemptsTo(
    Tap.on(Googles.SEARCH_BUTTON),
    Tap.on(Position.onScreen(x,y))
)
```