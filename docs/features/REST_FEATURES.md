---
title: Rest Features
has_children: true
nav_order: 120
---

# Short Introduction to the Rest Features

## Installation

````bash
npm install @thekla/rest-abilities
````

## Usage

````typescript
import {Actor, See}                                                         from "@thekla/core";
import {ExecutingRestClient, UseTheRestApi, On, request, Get, Send, Method, Response} from "@thekla/rest-abilities";

const Martha = Actor.named(`Martha`);

const config = {};

const theRestClient = ExecutingRestClient.from(config);

Martha.can(UseTheRestApi.with(theRestClient));

const mathApiRequest = request(On.resource(`http://api.mathjs.org/v4/?expr=2*(7-3)`));

Martha.attemptsTo()





````

