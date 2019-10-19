import * as child     from 'child_process';
import fsExtra        from "fs-extra";
import * as minimist  from "minimist";
import {TheklaConfig} from "../../lib/config/TheklaConfig";
import {
    createJasmineTestFiles,
    createTheklaConfigFile,
    JasmineTestFileResult, spec_timeout_wait_for_10000ms,
    TheklaConfigFileResult
}                     from "../data/testFiles";


import {TheklaTestData} from './client';

describe('Setting the Timeout', () => {
    let forked: child.ChildProcess;

    let theklaConfigResult: TheklaConfigFileResult;
    let file1Result: JasmineTestFileResult;


    beforeEach(() => {
        forked = child.fork(`${__dirname}/client.js`, [], {stdio: "ignore"});
    });

    beforeEach(async () => {
        file1Result = await createJasmineTestFiles("SimpleTimoutSpec","", spec_timeout_wait_for_10000ms);
    });

    afterEach(() => {
        forked.kill();
        // remove spec file
        fsExtra.remove(file1Result.baseDir);
    });

    afterEach(() => {
        // remove config files
        if(theklaConfigResult.baseDir) {
            fsExtra.remove(theklaConfigResult.baseDir);
        }

        // reset result after deleting the test dir
        theklaConfigResult = {baseDir: "", confFilePath: "", relativeConfFilePath: ""};
    });

    it('to 1000ms the test case should time out after this time - (test case id: e1ae8747-345e-459d-89c3-8530d41423a6)', async () => {
        const testConfig: TheklaConfig =  {
            testFramework: {
                frameworkName: "jasmine",
                jasmineOptions: {
                    defaultTimeoutInterval: 1000
                }
            }
        };

        theklaConfigResult = await createTheklaConfigFile(testConfig, "SingleSpecCliOption");

        const args: minimist.ParsedArgs = {
            "_": [theklaConfigResult.relativeConfFilePath],
            "specs": `${file1Result.relativeSpecFilePath}`,
        };

        const testData: TheklaTestData = {
            args: args,
        };

        forked.send(testData);

        return new Promise((resolve, reject) => {
            try {
                forked.on('message', (specResult: any) => {
                    expect(specResult.failedCount).toEqual(1);
                    expect(specResult.specResults[0].duration).toBeGreaterThanOrEqual(1000);
                    expect(specResult.specResults[0].duration).toBeLessThanOrEqual(1100);
                    resolve();
                });
            } catch (e) {
                const message = `Error on forked process ${e} ${Error().stack}`;
                reject(message);
            }

        })
    });

    it('to 5000ms the test case should time out after this time - (test case id: )', async () => {
        const testConfig: TheklaConfig =  {
            testFramework: {
                frameworkName: "jasmine",
            }
        };

        theklaConfigResult = await createTheklaConfigFile(testConfig, "Wait5000msTestFile");

        const args: minimist.ParsedArgs = {
            "_": [theklaConfigResult.relativeConfFilePath],
            "specs": `${file1Result.relativeSpecFilePath}`,
        };

        const testData: TheklaTestData = {
            args: args
        };

        forked.send(testData);

        return new Promise((resolve, reject) => {
            try {
                forked.on('message', (specResult: any) => {
                    expect(specResult.failedCount).toEqual(1);
                    expect(specResult.specResults[0].duration).toBeGreaterThanOrEqual(5000);
                    expect(specResult.specResults[0].duration).toBeLessThanOrEqual(5100);
                    resolve();
                });
            } catch (e) {
                const message = `Error on forked process ${e} ${Error().stack}`;
                reject(message);
            }

        })
    },10000);
});