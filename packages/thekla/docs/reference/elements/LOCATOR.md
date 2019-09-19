---
title: By
parent: Elements
grand_parent: Reference
---

# By element selector

The `By` element selector specifies which selector shall be used to find an element.

## Ability

none

## Methods

| name                    | parameter                               | description                                                         |
| :---                    | :---                                    | :---                                                                |
| `.css()`*               | locator: string                         | returns the element found by css selector                           |
| `.xpath()`*             | locator: string                         | returns the element found by xpath selector                         |
| `.cssContainingText()`* | locator: string, containingText: string | returns the element found by css selector containing the given text |
| `.accessibilityId()`*   | locator: string                         | appium only: returns an element found by accessibility selector     |

## Example

````typescript
import {element, By, Click} from "thekla"

const myFirstDropDownItem = element(By.cssContainingText("#myDropDownId option", "My Drop Down first Item Text"));

````
