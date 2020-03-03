---
title: Elements
parent: Web and Mobile Features
has_children: true
nav_order: 40
---
# Creating web elements and web element lists
{: .no_toc }

1. TOC
{:toc}

# SppElement

An `SppElement` can be created by calling the `element()` function.
The `SppElement` is used when interacting with the browser or mobile device.

To identify the element  the [`By`] selector is passed to the `element()` function.

> See section [`By`](#by-element-selector) for using the By selector

## Abiliy
{: .no_toc }

- [BrowseTheWeb](../abilities/BROWSE_THE_WEB.md)
- [OperateOnMobileDevice](../abilities/OPERATE_ON_MOBILE_DEVICE.md)

## Method
{: .no_toc }

| name                        | parameter                        | description                                                                                                           |
| :---                        | :---                             | :---                                                                                                                  |
| `.called()`                 | element: SppElement              | Give the element a name. When the element cant be found the name is printed, it makes it easier to identify the error |
| `.shallWait()`              | condition: UntilElementCondition | wait for the condition to be met, before trying to interact with the element                                          |
| `.shallNotImplicitlyWait()` | none                             | do not wait for an element if implicit wait is activated                                                              |
| `.element()`                | locator: By                      | search for an element from this element in the DOM                                                                    |
| `.all()`                    | locator: by                      | search for all elements from this element in the dom                                                                  |


## Example
{: .no_toc }

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

# SppElementList

# SppFrameElement

# By element selector

The `By` element selector specifies which selector shall be used to find an element.

## Ability
{: .no_toc }

none

## Methods
{: .no_toc }

| name                    | parameter                               | description                                                         |
| :---                    | :---                                    | :---                                                                |
| `.css()`*               | locator: string                         | returns the element found by css selector                           |
| `.xpath()`*             | locator: string                         | returns the element found by xpath selector                         |
| `.cssContainingText()`* | locator: string, containingText: string | returns the element found by css selector containing the given text |
| `.accessibilityId()`*   | locator: string                         | appium only: returns an element found by accessibility selector     |

## Example
{: .no_toc }

````typescript
import {element, By} from "thekla"

const myFirstDropDownItem = element(By.cssContainingText("#myDropDownId option", "My Drop Down first Item Text"));

````