---
title: Questions
parent: Core Features
has_children: true
nav_order: 10
---

# Basic Questions
{: .no_toc }

The basic questions were created for 

1. TOC
{:toc}

## Result

The ``Result`` question has two purposes

1. Return the result of the last executed activity (``.ofLastActivity()``)
1. Specify the the value which shall be returned (``of(THE_VALUE)``)
    1. immediately
    1. after a specified amount of time 
    1. after a defined amount of queries to the question

the second purpose was implemented for training and demonstration purposes.

e.g. You can check how the See action works when specifying delays. 

### Ability
{: .no_toc }

none

### Methods
{: .no_toc }

| name                 | parameter          | description                                                                                       |
| :---                 | :---               | :---                                                                                              |
| `.ofLastActivity()`* | -                  | return the result of the last executed activity                                                   |
| `.of()`*             | value: any         | return the value immediately                                                                      |
| `.resolvesAtQuery()` | #ofQuery: number   | return the value given to ``.of()`` at the '#ofQueries'-th of time the Result object was executed |
| `.delayedBy()`       | duration: Duration | return the value given to ``.of()`` after the specified duration                                  |

### Example
{: .no_toc }

Check a value returned by a Task

```typescript
actor.attemptsTo(
    NyTask.calculatingTheNumber(42),

    See.if(Result.ofLastActivity())
        .is(Expected.to.equal(42))
)
```

Check that See is querying the question multiple times until the result is met, or
throw an Error if the value is still not met.

The following example will fail as the Result will be returned after the 4th iteration
but ``See`` is just querying the question for 3 times.

````typescript
actor.attemptsTo(
    See.if(Result.of(true).resolvesAtQuery(4))
        .is(Expected.to.be.truthy())
        .repeatFor(3)
)
````

This will work as the 'true' value is returned at the 4-th iteration of the See interaction.

````typescript
actor.attemptsTo(
    See.if(Result.of(true).resolvesAtQuery(4))
        .is(Expected.to.be.truthy())
        .repeatFor(4)
)
````

The following example will fail as ``See`` is querying the question 4 times with a
default delay of one Second between each iteration. As the true value is returned after
5 seconds and See is trying it for 4 Seconds (4 times with 1 Second in between = 4 seconds total),
the See action will fail.

````typescript
actor.attemptsTo(
    See.if(Result.of(true).delayedBy(Duration.in.seconds(5)))
        .is(Expected.to.be.truthy())
        .repeatFor(4)
)
````

When we increase the time between each iteration (or increase the number of queries), the Check should
succeed.

Here we are checking the question 8 seconds in total (4 queries and 2 seconds in between = 8 seconds total).
``See`` already succeeds after the 3rd iteration as 6 Seconds are passed and Return passes the correct value. 

````typescript
actor.attemptsTo(
    See.if(Result.of(true).delayedBy(Duration.in.seconds(5)))
        .is(Expected.to.be.truthy())
        .repeatFor(4, Duration.in.seconds(2))
)
````