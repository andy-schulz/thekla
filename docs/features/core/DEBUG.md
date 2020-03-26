---
title: Debugging
parent: Core Features
has_children: false
nav_order: 100
---

# Debug your tests
{: .no_toc }

1. TOC
{:toc}

## using breakpoints from your IDE

Debugging ``thekla`` tests is a little bit more difficult then just setting 
a breakpoint within your IDE.

I will demonstrate it by using following code snippet:

````typescript
await jonathan.attemptsTo(
    Navigate.to(`https://www.google.com/`),

    Enter.value(`software test automation`)
        .into(googleSearchField),

    Sleep.for(5 * 1000),

    See.if(Value.of(googleSearchField))
        .is(Expected.to.equal(`software test automation`))
)
````

By Setting the breakpoint to the ``Enter.value...`` line, you might expect that the execution stops
just after the browser is started and the google search page is loaded. In Fact the program stops
before that. You have to remember that each line is just an activity object passed to the ``attemptsTo`` 
function as a parameter.

Lets recall the flow of actions for this example again:

1. evaluate the method parameters and
    1. create the ``Navigate`` activity object
    1. create the ``Enter`` activity object
    1. create the ``Sleep`` activity object
    1. create the ``See`` activity object
1. pass all generated objects as parameters to the function
1. execute the ``attemptsTo`` method by 
    1. execute the ``Navigate`` activity
        1. as its the first activity the browser opens
        1. the browser loads the google page
    1. execute the ``Enter`` activity
        1. the value is inserted into the input field
    1. execute the ``Sleep`` activity
        1. the test stops execution for the given amount of time (here 5 seconds)
    1. execute the ``See`` activity
        1. get the value of the search input field
        1. compare the retrieved value to the expectation
    
So placing the breakpoint in front of the ``Enter`` line will stop the execution before
stage 1.ii and not as intended before stage 3.ii.
  
## Use debugging helpers to debug the code

To actually stop at the desired stage you can use two workarounds of the 
``@thekla/core`` library

1. using the Debug object
2. using the Dbg() wrapper function

Let me demonstrate it on the same example as above.

First import the two posibilities:

```typescript
import {Debug, Dbg} from "@thekla/core"
```

Now use it in our test example:

````typescript
await jonathan.attemptsTo(
    Navigate.to(`https://www.google.com/`),

    Debug.by(dbgResult => 
        console.log(dbgResult)
    ),

    Enter.value(`software test automation`)
        .into(googleSearchField),

    Dbg(Sleep.for(5 * 1000)).debug(sndResult => 
        console.log(sndResult)
    ),

    See.if(Value.of(googleSearchField))
        .is(Expected.to.equal(`software test automation`))
)
````

### Use the Debug Activity

The ``Debug`` object is of type Activity as ``Navigate`` or ``Click`` 
and is providing a static ``by`` method accepting a function of type

````text
(result?: T) => void
```` 

The result parameter is the value returned by the activity executed before
(here the ``Navigate`` activity, but ``Navigate`` is not returning anything so 
its undefined).

The parameter function is called when the activity is executed (stage 3).
That way you can set the breakpoint to line:

````typescript
console.log(dbgResult)
```` 

and the processing stops right after the google page was loaded.

### Use the Dbg() wrapper function

The second way to debug your code is by using the ``Dbg()`` wrapper function,
which returns a Debug activity providing a ``.debug()`` method accepting a
function of type:

````text
(result?: T) => void
```` 

As the name suggests the function wraps the Sleep activity into a Debug activity.
When the Debug activity is executed, it first calls the function passed to the ``.debug()`` method
followed by the execution of the wrapped activity 
(here: the ``Sleep`` activity).

The breakpoint can be set to the following line:

````typescript
console.log(sndResult)
````

Now the execution stops right after the value was entered into the search field
and before the execution is put to sleep for five seconds.