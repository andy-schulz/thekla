---
title: Attribute
parent: Ref:Questions
---

# Attribute

Get the value of a web elements attribute.

## Ability

- [BrowseTheWeb](../../abilities/BROWSE_THE_WEB.md)

## Methods

| name         | parameter             | description                                 |
| :---         | :---                  | :---                                        |
| `.of()*`     | element: SppElement   | the element to get the attribute value from |
| `.called()*` | attributeName: string | the name of the attribute                   |

## Example

Use the `See` interaction to check for the attributes value.

````typescript
john.attemptsTo(
    See.if(Attribute.of(element).called(`class`))
        .is(Expected.toBe(`MyClass`))
)
````

Save the attributes value to a variable.

```typescript
const classValue = await Attribute.of(element).called(`class`).answerdBy(john)
```