---
nav_exclude: true
---

# Reference

## Using basic Actions

### Click

### Enter

### Select a 

## Using Questions

### How to extract values

### Evaluate a State


### Choose specific actions depending on a state

If you want to execute specific actions depending on a UI or REST state you can use the See Action in the following way.

````typescript
import {Actor, See, Text, Click, strictEqualTo, element, By} from "thekla-core"

const statusElement = element(By.css(".MyElementLocatpr"));
const element1 = element(By.css(".ElementToClickInCaseTheStateIsMet"));
const element2 = element(By.css(".ElementToClickInCaseTheStateIsNotMet"));

const Jonathan = Actor.called("Jonathan");
// Assign an ability to Jonathan here

Jonathan.attemptsTo(
    See.if(Text.of(statusElement))
        .is(strictEqualTo("MyState"))
        .then(
            Click.on(element1)
        )
        .otherwise(
            Click.on(element2)
        )
)
````