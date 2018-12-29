import * as path        from "path";
import {JasmineOptions} from "../config/ConfigProcessor";
import {TheklaReporter} from "../reporters/TheklaReporter";
import {getLogger}      from "@log4js-node/log4js-api";

export class JasmineTestFramework {
    private logger = getLogger("JasmineTestFramework");
    constructor(private frameworkOptions: JasmineOptions) {

    }

    public run(specs: string[]): Promise<any> {
        this.logger.debug(`Starting Jasmine Tests.`);
        const Jasmine = require('jasmine');
        const jasminer = new Jasmine();
        const jasmineGlobal = jasmine;


        const reporter = new TheklaReporter();
        jasminer.addReporter(reporter);

        return new Promise((fulfill, reject) => {
            if(this.frameworkOptions.defaultTimeoutInterval)
                jasmineGlobal.DEFAULT_TIMEOUT_INTERVAL = this.frameworkOptions.defaultTimeoutInterval;

            jasminer.onComplete(function(passed: any) {
                try {
                    fulfill({
                        failedCount: reporter.failedCount,
                        specResults: reporter.testResult
                    });
                } catch (err) {
                    reject(err);
                }
            });


            jasminer.configureDefaultReporter({});
            jasminer.projectBaseDir = path.resolve();
            jasminer.specDir = '';
            jasminer.addSpecFiles(specs);
            jasminer.execute();
        });
    }
}