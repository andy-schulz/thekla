import {TheklaConfig}          from "./config/TheklaConfig";
import {getLogger}             from "@log4js-node/log4js-api";
// import {thekla}                from "./globals/globals";
import {CucumberTestFramework} from "./testFramework/CucumberTestFramework";
import {JasmineTestFramework}  from "./testFramework/JasmineTestFramework";

export interface TheklaCliOpts {
    "require"?: string | string[];
    "format"?: string | string[];
    [arg: string]: any;
    '--'?: string[];
    _: string[];
}

// declare let thekla:any;
declare let global: any;

export class Thekla {
    private _cliOptions: TheklaCliOpts = {
        "--": [],
        "_": []
    };

    private theklaConfig: TheklaConfig;

    private logger = getLogger("Thekla");

    constructor() {
    }

    run(theklaConfig: TheklaConfig): Promise<any> {
        global.thekla = {};
        global.thekla.config = theklaConfig;
        this.theklaConfig = theklaConfig;

        // set jasmine as default TestFramework
        let framework: string = "jasmine";
        if (this.theklaConfig.testFramework && this.theklaConfig.testFramework.frameworkName) {
            framework = this.theklaConfig.testFramework.frameworkName;
        }

        if (framework === "jasmine") {
            const opts = this.theklaConfig.testFramework.jasmineOptions ? this.theklaConfig.testFramework.jasmineOptions : {};

            if(this.theklaConfig.specs === undefined || this.theklaConfig.specs.length === 0) {
                const message = `
No Specs found in config file, please specify one as command line parameter or as a config file attribute
Use:
    --specs=glob|dir|file
or
    config = {
        specs: [glob|dir|file]
    }
            `;
                this.logger.error(message);
                return Promise.reject(message);
            } else {
                return new JasmineTestFramework(opts).run(this.theklaConfig.specs);
            }
        } else if (framework === "cucumber") {
            const configOpts = this.theklaConfig.testFramework.cucumberOptions ? this.theklaConfig.testFramework.cucumberOptions : {};

            if(this.theklaConfig.specs === undefined || this.theklaConfig.specs.length === 0) {
                const message = `
No Specs found in config file, please specify one as command line parameter or as a config file attribute
Use:
    --specs=glob|dir|file
or
    config = {
        specs: [glob|dir|file]
    }
            `;
                this.logger.error(message);
                return Promise.reject(message);
            } if(this.theklaConfig.specs.length > 1) {
                const message = `
Passing multiple features files in an array is not supported yet, please pass in a single string as described in: https://github.com/cucumber/cucumber-js/blob/master/docs/cli.md#running-specific-features
            `;
                this.logger.error(message);
                return Promise.reject(message);
            } else {
                return new CucumberTestFramework(configOpts, this._cliOptions).run(this.theklaConfig.specs[0]);
            }

        } else {
            throw Error(`Framework ${framework} is not implemented yet`);
        }
    }
}



