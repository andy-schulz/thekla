import {getLogger}                               from "@log4js-node/log4js-api";
import {getConfiguredTheklaGlobal, TheklaConfig} from "@thekla/config";
import {printHelpText}                           from "./commands/help";
import {CucumberTestFramework}                   from "./testFramework/CucumberTestFramework";
import {JasmineTestFramework}                    from "./testFramework/JasmineTestFramework";

export interface TheklaCliOpts {
    require?: string | string[];
    format?: string | string[];

    [arg: string]: any;

    '--'?: string[]; //eslint-disable-line
    _: string[];
}

// declare let thekla:any;
declare let global: any;

export class Thekla {
    private logger = getLogger(`Thekla`);

    private _cliOptions: TheklaCliOpts = {
        "--": [],
        "_": []
    };

    private theklaConfig: TheklaConfig;

    run(theklaConfig: TheklaConfig): Promise<any> {
        global.thekla = getConfiguredTheklaGlobal(theklaConfig);
        this.theklaConfig = theklaConfig;

        // set jasmine as default TestFramework
        let framework = `jasmine`;
        if (this.theklaConfig.testFramework && this.theklaConfig.testFramework.frameworkName) {
            framework = this.theklaConfig.testFramework.frameworkName;
        }

        if (framework === `jasmine`) {
            const opts = this.theklaConfig.testFramework.jasmineOptions ? this.theklaConfig.testFramework.jasmineOptions : {};

            if (this.theklaConfig.specs === undefined || this.theklaConfig.specs.length === 0) {
                printHelpText(`specs`);

                this.logger.error(`Help Text for missing spec declaration was printed`);
                return Promise.reject();
            } else {
                return new JasmineTestFramework(opts).run(this.theklaConfig.specs);
            }
        } else if (framework === `cucumber`) {
            const configOpts = this.theklaConfig.testFramework.cucumberOptions ? this.theklaConfig.testFramework.cucumberOptions : {};

            if (this.theklaConfig.specs === undefined || this.theklaConfig.specs.length === 0) {
                printHelpText(`specs`);
                return Promise.reject();
            }
            if (this.theklaConfig.specs.length > 1) {
                printHelpText(`ccMultipleFeatureFiles`);
                return Promise.reject();
            } else {
                return new CucumberTestFramework(configOpts).run(this.theklaConfig.specs[0]);
            }

        } else {
            return Promise.reject(`Framework ${framework} is not implemented yet`);
        }
    }
}