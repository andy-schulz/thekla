---
title: Questions
has_children: true
nav_order: 50
---

# Questions

Questions retrieve information from a device like text, attribute values or status information.

Every question can be used by:
- the `See` interaction to directly compare the retrieved value with an expectation, or
- directly call the question and store the retrieved data

For example the `Text` question retrieves the the content of an element.

Use it with the `See` interaction

````typescript
anActor.attemptsTo(
    See.if(Text.of(element))
        .is(Expected.toBe(`an expectation`))
)
````

directly call the `Text` question and store the text for later use

````typescript
const text = await Text.of(element).answeredBy(anActor);
````