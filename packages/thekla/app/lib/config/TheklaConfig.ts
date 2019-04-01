import {SeleniumConfig, RestConfig, DesiredCapabilities} from "thekla-core";


export interface TheklaConfig {
    // index signature is used for
    // [key: string]: any;

    specs?: string[];

    seleniumConfig?: SeleniumConfig;
    capabilities?: DesiredCapabilities[];
    restConfig?: RestConfig;
    params?: {
        [key: string]: any
    };

    testFramework: TestFramework;
}


export interface TestFramework {
    frameworkName: "jasmine" | "cucumber";
    jasmineOptions?: JasmineOptions;
    cucumberOptions?: CucumberOptions;

}

export interface JasmineOptions {
    defaultTimeoutInterval?: number;
}

export interface CucumberOptions {

    // cli options --name
    // execute tests where the scenario name matches one of the given strings
    name?: string[];

    // cli option --parallel <NUMBER_OF_SLAVES>
    // when set to true a default number of slaves of two will be used
    parallel?: boolean;
    // when parallel is set to true it will run with the given number of slaves
    numberOfSlaves?: number;

    //cli option --tags <expression>
    /** https://docs.cucumber.io/cucumber/api/#tag-expressions **/
    tags?: string[];

    /**
     * see https://github.com/cucumber/cucumber-js/blob/master/docs/cli.md#formats
     */
    // cli option --format or -f
    format?: string[];

    //cli --format-options
    formatOptions?: {
        snippetInterface?:  "async-await" | "callback" | "generator" | "promise" | "synchronous";
        snippetSyntax?: string;
        rerun?: {
            separator: string
        };
        colorsEnabled?: boolean;
    }

    // cli option --require-module <module_name>
    requireModule?: string[];
    // "features/**/*.<ext>" e.g. --require 'features/**/*.coffee'
    require?: string[];

    //cli option --world-parameters
    worldParameters?: object;

    //cli --exit
    exit?: boolean;
}

