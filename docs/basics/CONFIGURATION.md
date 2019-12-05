---
title: Configuration
has_children: true
nav_order: 11
---

# Configuration

Thekla can be configured by a single configuration file with the following parts:

- testing framework to use, you can choose between
    - jasmine or
    - cucumber
- [web and mobile configuration](../reference/web_and_mobile/CONFIGURATION.md)
- [rest configuration](../reference/rest/CONFIGURATION.md)

## The config file

All configurations are placed in a config file e.g. ``thekla_conf.ts``

Run the transpiled config with:

````bash
thekla dist/thekla_conf.js
````

> typescript transpiled the the source into the dist folder

# configure which specs or features to run

Specs (Jasmine) or features (Cucumber) are specified by using the specs array.

````typescript

import {TheklaConfig} from "@thekla/config";

export default {
    // specify specs (jasmine) or features (cucumber)
    // specify the file: DIR/MyFile.js or DIR/MyFeature.feature
    // or use glob e.g.
    specs: ["features/**/*.features"]

} as TheklaConfig;

````

# Configure thekla to use cucumber

The cucumber cli parameters are just mapped to configuration objects and are optional.

Please check the [cucumber-js cli documentation]((https://github.com/cucumber/cucumber-js/blob/master/docs/cli.md))
for detailed information.

````typescript

import {TheklaConfig} from "@thekla/config";

export default {

    // all options for the framework in use
    testFramework: {
        // use cucumber
        frameworkName: `cucumber`,
        // configure cucumber                       
        cucumberOptions: {     
            // require support files (see --require cli option)                            
            require: [`dist/step_definitions/**/*.js`],
            requireModule: [
                `MODULE`, 
                `ts-node/register`],
            // specify formatter (see --format cli option)
            format: [
                `REPORT[:PATH]`,
                `json:report/cucumber_report.json`,
                // the junit formatter is a separate @thekla module and not part
                // of the cucumber standard implementation
                `junit:report/cucumber_report.xml`],
            // tags to execute (see --tags cli option)
            tags: [`@Focus`],
            // set world parameter (see the --world-parameter cli option)
            // can be accessed inside step definitions with "this.parameter"
            worldParameters: {
                myParameter: `MyParameterValue (string | number | object | array etc.)`
            }
        }
    }
} as TheklaConfig;

````

# Configure thekla to use jasmine

Jasmine is used by setting the frameworkName ``jasmine``.

As of now the only implemented option for Jasmine is ``defaultTimeoutInterval``.

````typescript

import {TheklaConfig} from "@thekla/config";

export default {

    // all options for the framework in use
    testFramework: {
        // use jasmine
        frameworkName: `jasmine`,
        jasmineOptions: {
            // set the default Timeout for a spec
            defaultTimeoutInterval: 20 * 1000
        }
    }
} as TheklaConfig;

````