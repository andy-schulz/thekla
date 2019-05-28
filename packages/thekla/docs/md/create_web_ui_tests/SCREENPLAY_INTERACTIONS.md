# Thekla web test fundamentals

## Table of Content

1. [Interactions](#interactions)
    1. [NAVIGATE to the page](#navigate-to-the-page)
    1. [CLICK on an element](#click-on-an-element)
    1. [ENTER text into a field](#enter-text-into-a-field)
    1. [HOVER over an elememt](#hover-over-an-element)
    1. [WAIT for an element](#wait-for-an-element)
    1. [SLEEP for an amount of time](#sleep-for-an-amount-of-time)
    1. [Ask a QUESTION](#ask-a-question)
1. [Questions](#questions)
    1. [Get the inner TEXT](#get-the-inner-text)
    1. [get the elements VALUE](#get-the-elements-value)
    1. [get the named ATTRUBUTE](#get-the-named-attribute)
    1. [get THE-SITES properties](#get-the-sites-properties)
    1. [COUNT the number of elements](#count-the-number-of-elements)

## Interactions

To interact with the browser you need to locate the elements on your web page to test and 
give your actor the ability to BrowseTheWeb.

See [Locate Elements](LOCATE_ELEMENTS.md) and the [BrowseTheWeb ability](BROWSE-THE-WEB_ABILITY.md) description for details.

In all examples i will use the object ``Googles`` as an page object containing all element definitions of the page.

### NAVIGATE to the page

The ``Navigate`` interaction has only one static member ``to(...)`` to which you can pass your URL.

Example:

```typescript
Josh.attemptsTo(
    Navigate
        .to("https://google.com")
)
```

Note: there is no baseUrl as of now, so you have to pass the whole URL.

### CLICK on an element

Clicking on an element is performed by calling ``Click.on(...)`` and passing the element to click on
to the ``on(...)`` method.

Example:

```typescript
Josh.attemptsTo(
    Click
        .on(Googles.SEARCH_BUTTON)
)
```

Note: Check out the [Locate Elements](LOCATE_ELEMENTS.md) description on how to locate elements.

### ENTER text into a field

For entering a value into a field you use the ``Enter`` interaction, passing the value and the element to the interaction.

Example:

```typescript
Josh.attemptsTo(
    Enter
        .value("Software Test Automation")
        .into(Googles.SEARCH_FIELD)
)
```

If a field contains a values, it can be cleared before entering a new value by using the ``.butClearsTheFieldBefore(...)``
method.

Example:

```typescript
Josh.attemptsTo(
    Enter
        .value("Software Test Automation extreme")
        .into(Googles.SEARCH_FIELD)
        .butClearsTheFieldBefore()
)
```

### HOVER over an element

To hover 

```typescript
Josh.attemptsTo(
    Hover
        .over(Googles.IMAGINARY_HOVER_ELEMENT)
)
```

### WAIT for an element

To wait for an elements appearance or disappearance you can use the ``Wait`` interaction.

```typescript
Josh.attemptsTo(
    Wait
        .for(Googles.INPUT_FIELD)
        .andCheck(UntilElement.is.visible())
)
```

### SLEEP for an amount of time 

Sleep is a problematic 

``
``





### Ask a QUESTION

## Questions

### Get the inner TEXT

### Get the elements VALUE 

### get the named ATTRIBUTE

### get THE-SITES properties

### COUNT the number of elements