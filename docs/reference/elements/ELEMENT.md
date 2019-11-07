---
title: SppElement
parent: Ref:Elements
nav_order: 1
---

# SppElement

An `SppElement` can be created by calling the `element()` function.
The `SppElement` is used when interacting with the browser or mobile device.

To identify the element  the [`By`] selector is passed to the `element()` function.

> See section [`By`](LOCATOR.md) for using the By selector

## Abiliy

- [BrowseTheWeb](../abilities/BROWSE_THE_WEB.md)
- [OperateOnMobileDevice](../abilities/OPERATE_ON_MOBILE_DEVICE.md)

## Method

| name           | parameter                        | description                                                                                                           |
| :---           | :---                             | :---                                                                                                                  |
| `.called()`    | element: SppElement              | Give the element a name. When the element cant be found the name is printed, it makes it easier to identify the error |
| `.shallWait()` | condition: UntilElementCondition | wait for the condition to be met, before trying to interact with the element                                          |
| `.element()`   | locator: By                      | search for an element from this element in the DOM                                                                    |
| `.all()`       | locator: by                      | search for all elements from this element in the dom                                                                   |


## Example

Create a SppElement

```typescript
const mySearchElement = element(By.css(`.googlesSerachField`))
```

Create an SppElement and give it a name.

```typescript
const mySearchElement = element(By.css(`.googlesSerachField`))
    .called(`The name of the element`)
```

Create an SppElement and wait until the status is met before interacting with the element.

```typescript
const mySearchElement = element(By.css(`.googlesSerachField`))
    .called(`The name of the element`)
    .shallWait(UntilElement.is.visible)
```

Chain the element locators.

```typescript
const mySearchElement = element(By.css(`.googlesSearchArea`))
    .element(By.css(`.googlesSerachField`))
    .called(`The name of the element`)
    .shallWait(UntilElement.is.visible)
```