---
title: Count
parent: Ref:Questions
---

# Count

Count the number of elements found by the given element selector.

## Ability

- [BrowseTheWeb](../../abilities/BROWSE_THE_WEB.md)

## Methods

| name     | parameter                | description                  |
| :---     | :---                     | :---                         |
| `.of()*` | elements: SppElementList | the element list to be found |

## Example

Use the `See` interaction to check the number of elements

````typescript
john.attemptsTo(
    See.if(Count.of(elements))
        .is(Expected.toBe(6))
)
````

Save the number of elements to a variable

```typescript
const text = await Count.of(elements).answerdBy(john)
```