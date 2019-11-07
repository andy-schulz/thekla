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

| name                     | parameter              | description                                                                           |
| :---                     | :---                   | :---                                                                                  |
| `.to()`*                 | element: SppElement    | scroll the element to the top of the viewport                                         |
| `.atTheViewportCenter()` |                        | if scrolled to an element position the element at the center of the visible view port |
| `.toPosition()`*         | position: PagePosition | scroll to a pages position, currently implemented are Page.bottom() and Page.top()    |

## Example

```typescript
josh.attemptsTo(
    Scroll.to(MY_ELEMENT),
    Scroll.to(MY_ELEMENT).atTheViewportCenter(),

    Scroll.to(Page.top())
)
```