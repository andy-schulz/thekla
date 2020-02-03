---
title: Questions and Assertions
has_children: true
nav_order: 50
---

# Questions

Questions retrieve information from a device like text, attribute values or status information.

Every question can be used by:
- the `See` interaction to directly compare the retrieved value with an expectation, or
- directly call the question and store the retrieved data

For example the `Text` question retrieves the the textual content of an element.

Use it with the [``See``](../features/core/INTERACTIONS.md#see) interaction

````typescript
anActor.attemptsTo(
    See.if(Text.of(element))
        .is(Expected.to.equal(`an expectation`))
)
````

directly call the `Text` question and store the text for later use

````typescript
const text = await Text.of(element).answeredBy(anActor);
````

# Assertions

The counter part of a question is an assertion. Whereas the question retrieves a value the
assertion compares it to an expected value:

````typescript
actor.attemptsTo(
    See.if(Question)
        .is(Expected.to.equal(Value))
)
````

Find detailed information about available Assertions in the 
[Core Assertions](../features/core/ASSERTIONS.md) and the 
[Web and Mobile Assertions](../features/web_and_mobile/ASSERTIONS.md) section.

