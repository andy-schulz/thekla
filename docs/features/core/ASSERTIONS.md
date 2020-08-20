---
title: Assertions
parent: Core Features
has_children: true
nav_order: 10
---

# Basic Assertions

The ``thekla`` assertions are based on the [Chai Assertion Library](https://www.chaijs.com/).

As the ``See`` interaction

````typescript
actor.attemptsTo(
    See.if(question)
        .is(assertion)
)
````

expects an assertion function of type 

````typescript
(actual: T) => boolean
````

the ``thekla`` assertions are curried versions of the 
[Chai Assert Style](https://www.chaijs.com/guide/styles/#assert) functions of type

````text
(expected: U) => (actual: T) => boolean

assertion(expected value)(actual value)
````

This way its possible to write assertions like:

````typescript
actor.attemptsTo(
    See.if(Result.of(`my expected value`))
       .is(Expected.to.include(`value`))
)
````

For more information please consult the 
[Chai Assertion Style](https://www.chaijs.com/api/assert/) documentation.

## Usage

````bash
npm install @thekla/assertion --save
````

````typescript
import {Expected} from "@thekla/assertion"
````

## language candy

To improve readability the following language chains are available.

* to
* be
* have

So you could either write the assertion in the form of

```typescript
See.if(Result.of(`my expected value`))
   .is(Expected.to.equal(`my expected value`))
```

or:

````typescript
See.if(Result.of(`my expected value`))
   .is(Expected.to.be.equal(`my expected value`))
````
## Flags

### not

The ``not`` flag is used to negate all assertions:

Example:

````typescript
See.if(Result.of(`The Result`))
   .is(Expected.not.to.equal(`my expected value`))
````

## equal

Example:

````typescript
See.if(Result.of(`1234`))
   .is(Expected.to.equal(`1234`))
````

### strict (===)
{: .no_toc }

The equality assertion always checks for strict equality 
(See [Equality comparisons and sameness](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Equality_comparisons_and_sameness)).

* 123 === 123 // true
* 'abc' === 'abc' // true
* ``[1,2,3]`` === ``[1,2,3]`` // false
* `` const arr = [1,2,3]; arr === arr`` // true
* {a: 1} === {a: 1} // false
* `` const foo = {a: 1}}; foo === foo`` // true

### deep
{: .no_toc }

If you want to check for deep equality you can use the ``deep`` flag, the content of arrays
and objects is tested for strict equality.

````typescript
See.if(Result.of([{a:1}]))
   .is(Expected.to.be.deep.equal([{a:1}]))
````

* 123 ``deep equal`` 123 // true
* 'abc' ``deep qual`` 'abc' // true
* ``[1,2,3]`` ``deep equal`` ``[1,2,3]`` // true
* const arr = ``[1,2,3]``; arr ``deep equal`` arr // true
* {a: 1} === {a: 1} // true
* const foo = {a: 1}}; foo ``deep equal`` foo // true

## truthy / falsy

The ``truthy / falsy`` assertion checks for equality to the corresponding boolean value.

Example:

````typescript
See.if(Result.of(true))
   .is(Expected.to.be.truthy)
````

or

````typescript
See.if(Result.of(false))
   .is(Expected.to.be.falsy)
````

## match

To check a questions result with a regular expression, you can use the match assertion.

````typescript
See.if(Result.of(`Checked by RegExp`))
   .is(Expected.to.match(/RegExp/))
````

## include

Example:

````typescript
See.if(Result.of(`abcde`))
   .is(Expected.to.include(`a`))
````

### strict
{: .no_toc }

Per default include checks for strict equality:

````typescript
See.if(Result.of(`abc`)).is(Expected.to.include(`a`)); // true

See.if(Result.of([1,2])).is(Expected.to.include(1)); // true

See.if(Result.of([{a: 1}, {b: 1}])).is(Expected.to.include({a: 1})); // false

See.if(Result.of({a: 1, b: 2})).is(Expected.to.include({a: 1})); // true

See.if(Result.of({a: {b: 2}, c: 2})).is(Expected.to.include({a: {b: 2}})); // false
````

### deep
{: .no_toc }

for deep quality use the deep flag

````typescript
See.if(Result.of([{a: 1}, {b: 1}])).is(Expected.to.deep.include({a: 1})); // true
See.if(Result.of({a: {b: 2}, c: 2})).is(Expected.to.deep.include({a: {b: 2}})); // true
````

### nested
{: .no_toc }

to check for nested includes (objects inside objects) you can use the nested flag.

````typescript
See.if(Result.of({a: {b: {c: 1}}})) 
    .is(Expected.to.have.deep.nested.include({"a.b" : {c: 1}})); // true
````

Check [the chai examples](https://www.chaijs.com/api/bdd/) for details.

### own
{: .no_toc }

The own flag causes the assertion to inherited properties.

Check [the chai examples](https://www.chaijs.com/api/bdd/) for details.

## Chain multiple Assertions

To use multiple assertions on the same questions you can chain the assertions with ``and``

Example:

````typescript
See.if(Result.of([1,2]))
   .is(Expected.to.include(1)
        .and.to.include(2))
````