---
nav_exclude: true
---






### Ask a QUESTION

Checking the sites or the elements state can be done with the interaction called ``See``. The Question, which is
retrieving the elements state is passed to the ``if(...)``. The questions result is passed to a matcher, which is 
a function of type ``(acutal: any) => boolean``. You can pass any function of that type or use the matcher provided
by the ``Expected`` object (See [Using the matchers](#using-the-matcher) for more details).

```typescript
Josh.attemptsTo(
    See
        .if(<<Question>>)
        .is(<<TheMatcher>>) 
)
```

Just in case you need to execute abilities depending on an elements state you can use the ``See`` interaction and passing
the activities to the ``then(...)`` and/or the ``otherwise(...)`` method.

I don't encourage the usage of this functionality as it makes a test case unpredictable.  

```typescript
Josh.attemptsTo(
    See
        .if(<<Question>>)
        .is(<<TheMatcher>>)
        .then(<<Activities>>)
        .otherwise(<<Activities>>)
)
```

### Using the matcher

To compare a returned value from a question you are able to use a matcher.

Example with a ``toBe(...)`` matcher:

```typescript
Josh.attemptsTo(
    See
        .if(<<Question>>)
        .is(Expected.toBe("myString")) 
)
```



## Further Information
* [Create Rest API tests](create_rest_api_tests/README.md)
* [Create Web tests](create_web_ui_tests)