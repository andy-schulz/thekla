---
title: Interactions
parent: Core Features
has_children: true
nav_order: 10
---

# Basic Interactions

## AndThen

One limitation of chaining tasks is, that a result of one task can only be used in the following task and
not by any other following tasks. To get around this limitation you can use the ``AndThen`` task group.

### Ability
{: .no_toc }

none

### Methods
{: .no_toc }

| name      | parameter                                                           | description                                                |
| :---      | :---                                                                | :---                                                       |
| `.run()`* | func : (actor: Actor, result: ParameterType) => Promise<ResultType> | group tasks to reuse a task result in multiple other tasks |

### Examples
{: .no_toc }

Both Task2 and Task3 will need the result of Task1 as input parameter. To path the parameter to both Tasks
you can use the ``AndThen`` task group. 

```typescript
Josh.attemptsTo(
    Task1.of(taskParameter),
    AndThen.run((actor: Actor, task1Result: Task1ReturnType) => {
        actor.attemptsTo(
            Task2.of(task1Result),
            Task3.of(task1Result)
        )       
    }),
    Task4.of(taskParameter))
```

## REPEAT

Repeat will retry activities until a question result meets an expected result.  
Whenever you have to implement an active polling to observe a status
change use this action.

The final result of the activity list will be passed to the next activity
following the ``Repeat`` activity.

### Ability
{: .no_toc }

none

### Methods
{: .no_toc }

| name             | parameter                           | description                                                                   |
| :---             | :---                                | :---                                                                          |
| `.activities()`* | activity: Activity, ....            | sleep for the amount of time in ms                                            |
| `.until()`       | question: Question                  | the question to retrieve the result                                           |
| `.is()`          | expected: Assertion                 | the assertion to check the questions result                                   |
| `.retryFor()`    | retries: number, duration: Duration | query the question for # of 'retries' and wait for 'duration' between retries |

### Examples
{: .no_toc }

To wait for a status change by pressing a refresh button you could do:

```typescript
Josh.attemptsTo(
    Repeat.activities(
        Click.on(REFRESH_BUTTON)
    ).until(
        Text.of(STATUS_FIELD)
    ).is(
        Expected.to.equal(`SUCCESS`)
    )   
)
```

Check every two seconds for a status change and abort after 10 checks.

```typescript
Josh.attemptsTo(
    Repeat.activities(
        Click.on(REFRESH_BUTTON)
    ).until(
        Text.of(STATUS_FIELD)
    ).is(
        Expected.to.equal(`SUCCESS`)
    ).retryFor(
        10, Duration.in.seconds(2)
    )   
)
```

Pass the activity result to the following task:

```typescript
Josh.attemptsTo(
    Repeat.activities(
        Get.from(resource))
    .until(Result.ofLastActivity())
    .is(Expected.to.deep.equal({status: "success"}))   
)
```

## SEE

The See interaction executes a `Question` and checks if the answer matches a given state. 
e.g.

```typescript
See.if(Text.of(MYELEMENT))
    .is(Expected.toBe(`Total: $123.456`))
```

Possible `Questions` are:

- Core Questions - created for training and demonstration purposes
    - [Result](QUESTIONS.md#result)
- Web Questions
    - [Text](../web_and_mobile/QUESTIONS.md#text)
    - [Value](../web_and_mobile/QUESTIONS.md#value)
    - [Attribute](../web_and_mobile/QUESTIONS.md#attribute)
    
- etc. 

> See [Questions](./QUESTIONS.md).

The `Matcher` is a function of type `(answer: <TYPE>) => boolean)`.
You can provide you own function or choose one provided by the `Expected` module.

> See [Matcher](./ASSERTIONS.md).



### Ability
{: .no_toc }

none

### Methods
{: .no_toc }

| name           | parameter                                | description                                                                               |
| :---           | :---                                     | :---                                                                                      |
| `.if()`*       | question: Question                       | extract                                                                                   |
| `.is()`        | matcher: (value: <GENERIC>) => boolean)  | verify that the Question passed in `if()` fulfills the function                           |
| `.repeatFor()` | maxIterations: number,  interval: number | repeat until check is `true` for `maxIterations` and wait for `intervall` between retries |
| `.then()`      | activities: Activity[]                   | if check is `true` execute the following activites                                        |
| `.otherwise()` | activities: Activity[]                   | if check is `false` execute the following activities                                      |

### Examples
{: .no_toc }

See action using ``.then()`` and ``.otherwise()``.

````typescript
Josh.attemptsTo(
    See.if(Text.of(myElement))
        .is(Expected.toBe(`The Text`))
        .repeatFor(5, 5000)
        .then(
            Click.on(mySaveButton))
        .otherwise(
            Click.on(myCancelButton)))
````

The Activity Result preceding the See action will be passed through to  
the next Activity following the See action.

e.g.

````typescript
actor.attemptsTo(
    PrecedingTask.doingSomething(),
    
    See.if(MyQuestion)
       .is(Expected.to.equal(something)),
    
    FollowingTask.usingResultFromPrecedingTask()
)
````

... or checking the result of the preceding task before continuing with
further activities.

````typescript
actor.attemptsTo(
    PrecedingTask.doingSomething(),
    
    See.if(Result.ofLastActivity())
       .is(Expected.to.equal(something)),
    
    FollowingTask.usingResultFromPrecedingTask()
)
````

## SLEEP

Sleep will pause the interaction execution flow. Only the execution is paused, the generation of the interaction and 
task objects is not interrupted and will be finished first.

### Ability
{: .no_toc }

none

### Methods
{: .no_toc }

| name         | parameter           | description                                           |
| :---         | :---                | :---                                                  |
| `.for()`*    | sleepTime: number   | sleep for the amount of time in ms                    |
| `.because()` | sleepReason: string | reason to use the sleep, will be used in activity log |


In later versions Sleep will only be used in debug mode and will be automatically deactivated during test execution. 
So please be careful when using it.

### Example
{: .no_toc }

```typescript
Josh.attemptsTo(
    Sleep.for(5000)
)
```

## WAIT

Wait for a web element to change its state.  
Right now you can wait until the element:
- is / is not visible
- is / is not enabled

To specify the desired state the [`UntilElementCondition`](../web_and_mobile/UNTIL_ELEMENT_CONDITION.md) condition shall be used.

### Ability
{: .no_toc }

none

### Methods
{: .no_toc }

| name          | parameter                        | description                                               |
| :---          | :---                             | :---                                                      |
| `.for()`*     | element: SppElement              | the element it should be waited for (presence or absence) |
| `.andCheck()` | condition: UntilElementCondition | the state the element should have                         |

### Example
{: .no_toc }

```typescript
Josh.attemptsTo(
    Wait
        .for(Googles.INPUT_FIELD)
        .andCheck(UntilElement.is.visible)
)
```