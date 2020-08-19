import * as child                         from "child_process";
import fsExtra                            from "fs-extra";
import {TheklaConfig}                     from "@thekla/config";
import {
    createJasmineTestFiles,
    createTheklaConfigFile, createTheklaGlobalSpec, JasmineTestFileResult,
    TheklaConfigFileResult
}                                         from "../__fixtures__/testFiles";
import {TheklaTestData, TheklaTestResult} from "../__fixtures__/client";
import * as minimist                      from "minimist";

describe(`The Thekla global object`, () => {
    let forked: child.ChildProcess;
    let theklaConfigResult: TheklaConfigFileResult;
    let file1Result: JasmineTestFileResult;
    const childOutput: any = ``;

    beforeAll(() => {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000;
    });

    beforeEach(async () => {
        forked = child.fork(`${__dirname}/../__fixtures__/client.js`, [], {});
        // forked = child.fork(`${__dirname}/../__fixtures__/client.js`, [], {stdio: `ignore`});
    });

    afterEach(() => {
        forked.kill();
        // remove spec file
        if(file1Result) {
            fsExtra.remove(file1Result.baseDir);
            file1Result = {baseDir: ``, relativeSpecFilePath: ``, specFilePath: ``};
        }
    });

    afterEach(() => {
        // remove config files
        if(theklaConfigResult.baseDir) {
            fsExtra.remove(theklaConfigResult.baseDir);
        }

        // reset result after deleting the test dir
        theklaConfigResult = {baseDir: ``, confFilePath: ``, relativeConfFilePath: ``};
    });

    describe(`thekla.config`, () => {
        it(`should be accessible inside a jasmine test case - (test case id: 0cd3574c-2430-4bd9-a4d4-d115bb46264d)`, async () => {
            const testConfig: TheklaConfig =  {
                specs: [``],
                testFramework: {
                    frameworkName: `jasmine`,
                    jasmineOptions: {
                        defaultTimeoutInterval: 1234
                    }
                },
                params: {
                    testName: `new Test created`
                }
            };

            theklaConfigResult = await createTheklaConfigFile(testConfig, `SingleSpecCliOption`);

            const expected = testConfig;
            const expectedConf = createTheklaGlobalSpec(JSON.stringify(expected)) ;
            file1Result = await createJasmineTestFiles(`SimpleGlobalsSpec`,``, expectedConf);

            const args: minimist.ParsedArgs = {
                "_": [theklaConfigResult.relativeConfFilePath],
                "specs": `${file1Result.relativeSpecFilePath}`
            };

            const testData: TheklaTestData = {
                args: args,
            };

            forked.send(testData);

            return new Promise((resolve, reject) => {
                try {

                    forked.stdout?.on(`data`, (data) => {
                        console.log(data)
                    })

                    forked.stderr?.on(`data`, (data) => {
                        console.log(data)
                    })

                    forked.on(`message`, (result: TheklaTestResult) => {
                        console.log(result);
                        expect(result.specResult.failedCount).toEqual(0);
                        expect(result.specResult.specResults[0].description)
                            .toEqual(`Thekla globals Should be accessible inside a spec`);
                        resolve();
                    });
                } catch (e) {
                    const message = `Error on forked process ${e} ${Error().stack}`;
                    reject(message);
                }

            })
        });
    });
});