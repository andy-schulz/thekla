---
title: Questions
parent: Web and Mobile Features
has_children: true
nav_order: 60
---
# Questions of Web and Mobile Abilities

## Attribute

Get the value of a web elements attribute.

### Ability
{: .no_toc }

- [BrowseTheWeb](./ABILITIES.md#browsetheweb)

### Methods
{: .no_toc }

| name         | parameter             | description                                 |
| :---         | :---                  | :---                                        |
| `.of()*`     | element: SppElement   | the element to get the attribute value from |
| `.called()*` | attributeName: string | the name of the attribute                   |

### Example
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

## Count

Count the number of elements found by the given element selector.

### Ability
{: .no_toc }

- [BrowseTheWeb](./ABILITIES.md#browsetheweb)

### Methods
{: .no_toc }

| name     | parameter                | description                  |
| :---     | :---                     | :---                         |
| `.of()*` | elements: SppElementList | the element list to be found |

### Example
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

## RemoteFileLocation

the question uploads a file to the selenium server and returns the remote file location. This location
can then be entered into an input field to test the upload functionality of a site.

### Ability
{: .no_toc }

- [BrowseTheWeb](./ABILITIES.md#browsetheweb)

### Methods
{: .no_toc }

| name     | parameter    | description                                    |
| :---     | :---         | :---                                           |
| `.of()*` | file: string | the file to be uploaded to the selenium server |

### Example
{: .no_toc }

````typescript
const fileLocation = await RemoteFileLocation.of(`<MY_FOLDER>/myFile.log`).answeredBy(john)
// fileLocation: <SOME_REMOTE_FOLDER>/myFile.log
````

Use the RemoteFileLocation question to test a sites upload functionality.

````typescript
john.attemptsTo(

    Enter.resultOf(RemoteFileLocation.of(`<MY_FOLDER>/myFile.log`))
        .into(UPLOAD_INPUT_FIELD),

    Click.on(UPLOAD_FILE_BUTTON)
)
````

## Status

Get the visibility or enabled status of an element.

### Ability
{: .no_toc }

- [BrowseTheWeb](./ABILITIES.md#browsetheweb)
- [OperateOnMobileDevice](./ABILITIES.md#operateonmobiledevice)

### Methods
{: .no_toc }

| name             | parameter                                                        | description                                                                                                                           |
| :---             | :---                                                             | :---                                                                                                                                  |
| `.visible.of()*` | element: SppElement                                              | the element to get the visibility status from                                                                                         |
| `.enable.of()*`  | element: SppElement                                              | the element to get the enabled status from                                                                                            |
| `.of()*`         | element: SppElement                                              | the element to get the visibility or enabled status from                                                                              |
| `.ofAll()*`      | elements: SppElementList, options: {all: true / false (default)} | the element list to get the visibility or enabled status from. If all is set to true, the status is all elements is returned as array |

``Status.visible.of(element)`` can be written as ``Visibility.of(element)``. The ``Visibility`` object is just
an alias for ``Status.visible``

### Example
{: .no_toc }

Use the `See` interaction to check if the elements is visible.

````typescript
john.attemptsTo(
    See.if(Status.visible.of(element))
        .is(Expected.to.be.truthy())
)

// or

john.attemptsTo(
    See.if(Visibility.of(element))
        .is(Expected.to.be.truthy())
)
````

Save the elements enable status to a variable.

```typescript
const status = await Status.enable.of(element).answerdBy(john)
// status: true | false
```

get the Status of multiple elements as a single value

````typescript
const status = await Status.enable.ofAll(elementList).answerdBy(john)
// status: {visible: true | false, enabled: true | false}
````

get the Status of multiple elements as separate values

````typescript
const status = await Status.enable.ofAll(elementList, {all: true}).answerdBy(john)
// status: {visible: [boolean], enabled: [boolean]}
````

## Text

Get the content / text of element.

### Ability
{: .no_toc }

- [BrowseTheWeb](./ABILITIES.md#browsetheweb)
- [OperateOnMobileDevice](./ABILITIES.md#operateonmobiledevice)

### Methods
{: .no_toc }

| name     | parameter           | description                      |
| :---     | :---                | :---                             |
| `.of()*` | element: SppElement | the element to get the text from |

### Example
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

## TheSites
{: .no_toc }

Get the title or the url of a site.

### Ability
{: .no_toc }

- [BrowseTheWeb](./ABILITIES.md#browsetheweb)

### Methods
{: .no_toc }

| name        | parameter | description     |
| :---        | :---      | :---            |
| `.url()*`   | -         | the sites url   |
| `.title()*` | -         | the sites title |

### Example
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

## Value

Get the content of the value attribute.

### Ability
{: .no_toc }

- [BrowseTheWeb](./ABILITIES.md#browsetheweb)

### Methods
{: .no_toc }

| name     | parameter           | description                                                |
| :---     | :---                | :---                                                       |
| `.of()*` | element: SppElement | the element to get the content of the value attribute from |

### Example
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

> See section [Attribute](#attribute) for details.