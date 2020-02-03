---
title: Questions
parent: Web and Mobile Features
has_children: true
nav_order: 10
---
# Questions of Web and Mobile Abilities
{: .no_toc }

1. TOC
{:toc}

# Attribute

Get the value of a web elements attribute.

## Ability
{: .no_toc }

- [BrowseTheWeb](../../abilities/BROWSE_THE_WEB.md)

## Methods
{: .no_toc }

| name         | parameter             | description                                 |
| :---         | :---                  | :---                                        |
| `.of()*`     | element: SppElement   | the element to get the attribute value from |
| `.called()*` | attributeName: string | the name of the attribute                   |

## Example
{: .no_toc }

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

# Count

Count the number of elements found by the given element selector.

## Ability
{: .no_toc }

- [BrowseTheWeb](../../abilities/BROWSE_THE_WEB.md)

## Methods
{: .no_toc }

| name     | parameter                | description                  |
| :---     | :---                     | :---                         |
| `.of()*` | elements: SppElementList | the element list to be found |

## Example
{: .no_toc }

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

# Status

Get the visibiliy or enabled status of an element.

## Ability
{: .no_toc }

- [BrowseTheWeb](../../abilities/BROWSE_THE_WEB.md)
- [OperateOnMobileDevice](../../abilities/OPERATE_ON_MOBILE_DEVICE.md)

## Methods
{: .no_toc }

| name             | parameter           | description                                   |
| :---             | :---                | :---                                          |
| `.visible.of()*` | element: SppElement | the element to get the visibility status from |
| `.enable.of()*`  | element: SppElement | the element to get the enabled status from    |

## Example
{: .no_toc }

Use the `See` interaction to check the elements visible status.

````typescript
john.attemptsTo(
    See.if(Status.visible.of(element))
        .is(Expected.toBe(true))
)
````

Save the elements enable status to a variable.

```typescript
const text = await Status.enable.of(element).answerdBy(john)
```

# Text

Get the content / text of element.

## Ability
{: .no_toc }

- [BrowseTheWeb](../../abilities/BROWSE_THE_WEB.md)
- [OperateOnMobileDevice](../../abilities/OPERATE_ON_MOBILE_DEVICE.md)

## Methods
{: .no_toc }

| name     | parameter           | description                      |
| :---     | :---                | :---                             |
| `.of()*` | element: SppElement | the element to get the text from |

## Example
{: .no_toc }

Use the `See` interaction to check for a text

````typescript
john.attemptsTo(
    See.if(Text.of(element))
        .is(Expected.toBe(`MyText`))
)
````

Save the text to a variable.

```typescript
const text = await Text.of(element).answerdBy(john)
```

# TheSites
{: .no_toc }

Get the title or the url of a site.

## Ability
{: .no_toc }

- [BrowseTheWeb](../../abilities/BROWSE_THE_WEB.md)

## Methods
{: .no_toc }

| name        | parameter | description     |
| :---        | :---      | :---            |
| `.url()*`   | -         | the sites url   |
| `.title()*` | -         | the sites title |

## Example
{: .no_toc }

Use the `See` interaction to check the sites title.

````typescript
john.attemptsTo(
    See.if(TheSites.title())
        .is(Expected.toBe(`my sites title`))
)
````

Save the elements enable status to a variable.

```typescript
const myUrl = await TheSites.url().answerdBy(john)
```

# Value

Get the content of the value attribute.

## Ability
{: .no_toc }

- [BrowseTheWeb](../../abilities/BROWSE_THE_WEB.md)

## Methods
{: .no_toc }

| name         | parameter             | description                                 |
| :---         | :---                  | :---                                        |
| `.of()*`     | element: SppElement   | the element to get the content of the value attribute from |

## Example
{: .no_toc }

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