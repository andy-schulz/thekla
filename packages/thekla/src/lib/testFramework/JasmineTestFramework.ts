import * as path        from "path";
import {JasmineOptions} from "@thekla/config";
import {TheklaReporter} from "../reporters/TheklaReporter";
import {getLogger}      from "@log4js-node/log4js-api";

export class JasmineTestFramework {
    private logger = getLogger(`JasmineTestFramework`);
    constructor(private frameworkOptions: JasmineOptions) {

    }

    public run(specs: string[]): Promise<any> {
        this.logger.debug(`Starting Jasmine Tests.`);
        // eslint-disable-next-line @typescript-eslint/no-var-requires

        return import(`jasmine`).then((J) => {
            const J1 = new J.default({})

            const jasmineGlobal = jasmine;

            const reporter = new TheklaReporter();
            J1.addReporter(reporter);

            if(this.frameworkOptions.defaultTimeoutInterval)
                jasmineGlobal.DEFAULT_TIMEOUT_INTERVAL = this.frameworkOptions.defaultTimeoutInterval;

            J1.configureDefaultReporter({});
            J1.projectBaseDir = path.resolve();
            J1.addSpecFiles(specs);
            J1.execute();

            return new Promise((fulfill, reject) => {
                J1.onComplete(function(passed: any) {
                    try {
                        fulfill({
                            failedCount: reporter.failedCount,
                            specResults: reporter.testResult
                        });
                    } catch (err) {
                        reject(err);
                    }
                });
            });
        })
    }
}