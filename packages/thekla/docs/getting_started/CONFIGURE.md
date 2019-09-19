---
title: Configure
parent: Getting Started
has_children: false
nav_order: 2
---

## Create the test configuration

Create the file ``thekla_conf.ts`` in the ``test`` folder with the following content:

````typescript
import {TheklaConfig} from "thekla"

export const config: TheklaConfig = {

    // this is your test spec we will create in the next section
    specs: ["dist/google_search_spec.js"],

    seleniumConfig: {
        seleniumServerAddress: "http://localhost:4444/wd/hub"
    },

    capabilities: [{
        browserName: "chrome"
    }],

    testFramework: {
        frameworkName: "jasmine",
        jasmineOptions: {
            defaultTimeoutInterval: 10 * 1000
        }
    }
};
````

## Configure the typescript transpiler

Create the file ``tsconfig.json`` in the root directory of your project.

````json
{
  "compilerOptions": {
        "target": "ES2016"
        ,"module": "commonjs"
        ,"sourceMap": true
        ,"outDir": "dist"
        ,"rootDir": "test"
        ,"strict": true
        ,"noImplicitAny": true
        ,"inlineSources": true
  }
}
````

## Add the test scripts to package.json

````json
{
  "scripts": {
    "pretest": "npm install & tsc",
    "test": "node_modules/.bin/thekla dist/thekla_conf.js"
  }
}
````