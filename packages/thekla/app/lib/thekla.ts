import * as glob               from "glob";
import {TheklaConfig}          from "./config/ConfigProcessor";
import {getLogger}             from "@log4js-node/log4js-api";
import {CucumberTestFramework} from "./testFramework/CucumberTestFramework";
import {JasmineTestFramework}  from "./testFramework/JasmineTestFramework";

export interface TheklaCliOpts {
    "require"?: string | string[];
    "format"?: string | string[];
    [arg: string]: any;
    '--'?: string[];
    _: string[];
}

export class Thekla {
    private specList: string[] = [];
    private specFinder: string[];
    private _cliOptions: TheklaCliOpts = {
        "--": [],
        "_": []
    };

    private formatList: string[] = [];


    private theklaConfig: TheklaConfig;

    private logger = getLogger("Thekla");

    constructor() {
    }

    set cliOptions(cliOpts: TheklaCliOpts) {
        this._cliOptions = cliOpts;
    }

    /**
     * process given spec options, will be called with command line options or config file options
     * @param specFinder - List of spec or feature files
     */
    processSpecsFromCommandLine(specFinder: string[] | undefined): Promise<string[]> {

        if(specFinder === undefined || specFinder.length === 0) {
            const message = `no Specs were given by command line`;
            this.logger.info(message);
            return Promise.resolve([])
        }

        return this.processSpecs(specFinder);
    }

    private processSpecsFromConfig(specFinder: string[] | undefined) {
        if(this.specList.length > 0) {
            this.logger.warn(`Specs were passed by command line, ignoring the specs from config.`);
            return Promise.resolve(this.specList);
        }

        if(/*this.specList.length === 0 && */(specFinder === undefined || specFinder.length === 0)) {
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
        }

        return this.processSpecs(specFinder)
            .then((specs: string[]) => {
                if(this.specList.length === 0) {
                    const message = `No Specs found with the given finder: ${JSON.stringify(specFinder)}`;
                    this.logger.error(message);
                    return Promise.reject(message);
                }
                return Promise.resolve(specs);
            })


    }


    private processSpecs(specFinder: string[]): Promise<string[]> {
        let files: string[] = [];

        const globfiles = (globFinder: string[]) => {
            for (const spec of globFinder) {
                const f = glob.sync(spec);
                if (f.length != 0) {
                    files = [...files, ...f]
                }
            }
        };

        // globfiles requires an array so create one if its necessary
        globfiles(Array.isArray(specFinder) ? specFinder : [specFinder]);

        // remove duplicates before passing the files
        this.specList = [...(new Set(files))];

        this.specFinder = specFinder;

        return Promise.resolve(this.specList);
    }

    processConfig(configFile: any): Promise<any> {
        const options: Promise<any>[] = [];

        this.theklaConfig = configFile.config;

        // if no specs are passed by command line use specs specified in config file
        if (this.specList.length == 0) {
            options.push(this.processSpecsFromConfig(this.theklaConfig.specs));
        }

        // TODO: put proxy handling etc. here

        return Promise.all(options);
    }


    loadConfig(configPath: string): Promise<void> {
        return import(configPath)
            .then((config: TheklaConfig) => {
                this.processConfig(config)
            })
    }

    run(): Promise<any> {
        if(!this.theklaConfig) {
            throw Error(`No configuration file found.`);
        }

        // set jasmine as default TestFramework
        let framework: string = "jasmine";
        if (this.theklaConfig.testFramework && this.theklaConfig.testFramework.frameworkName) {
            framework = this.theklaConfig.testFramework.frameworkName;
        }

        if (framework === "jasmine") {
            const opts = this.theklaConfig.testFramework.jasmineOptions ? this.theklaConfig.testFramework.jasmineOptions : {};
            return new JasmineTestFramework(opts).run(this.specList);
        } else if (framework === "cucumber") {
            let specs: string = "";
            const configOpts = this.theklaConfig.testFramework.cucumberOptions ? this.theklaConfig.testFramework.cucumberOptions : {};

            if(this.specFinder.length != 1) {
                const message = `Passing multiple features files in an array is not supported yet, please pass in a single string as described in: https://github.com/cucumber/cucumber-js/blob/master/docs/cli.md#running-specific-features`;
                this.logger.error(message);
                return Promise.reject(message);
            } else {
                specs = this.specFinder[0];
            }

            return new CucumberTestFramework(configOpts, this._cliOptions).run(specs);
        } else {
            throw Error(`Framework ${framework} is not implemented yet`);
        }
    }
}



