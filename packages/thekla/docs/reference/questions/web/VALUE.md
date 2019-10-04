---
title: Value
parent: Ref:Questions
---

# Value

Get the content of the value attribute.

## Ability

- [BrowseTheWeb](../../abilities/BROWSE_THE_WEB.md)

## Methods

| name         | parameter             | description                                 |
| :---         | :---                  | :---                                        |
| `.of()*`     | element: SppElement   | the element to get the content of the value attribute from |

## Example

Use the `See` interaction to check the content of attribute 'value'.

````typescript
john.attemptsTo(
    See.if(Value.of(element))
        .is(Expected.toBe(`My elements value`))
)
````

Save the attributes value to a variable.

```typescript
const classValue = await Value.of(element).answerdBy(john)
```

The `Value` question was added for convenience. You can use the Attribute question as well to query the value attribute.

```typescript
const value = await Attribute.of(element).called(`class`)
```

> See section [Attribute](ATTRIBUTE.md) for details.