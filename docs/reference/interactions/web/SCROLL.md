---
title: Scroll
parent: Ref:Interactions
has_children: false
---

# Scroll

## Ability

- [BrowseTheWeb](../../abilities/BROWSE_THE_WEB.md)
- [OperateOnMobileDevice](../../abilities/OPERATE_ON_MOBILE_DEVICE.md)

## Methods

| name         | parameter        | description |
| :---         | :---             | :---        |
| `.to()`* | element: SppElement or PagePosition | description |

## Example

```typescript
josh.attemptsTo(
    Scroll.to(MY_ELEMENT),
    Scroll.to(Page.top())
)
```