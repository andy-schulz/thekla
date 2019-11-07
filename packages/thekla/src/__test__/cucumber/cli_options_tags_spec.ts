import * as child                                                                                        from "child_process";
import * as minimist                                                                                     from "minimist";
import {TheklaConfig}                                                                                    from "@thekla/config";
import {TheklaTestData, TheklaTestResult}                                                                from "../__fixtures__/client";
import {createCucumberTestFiles, createTheklaConfigFile, CucumberTestFileResult, TheklaConfigFileResult} from "../__fixtures__/testFiles";
import fsExtra                                                                                           from 'fs-extra'

jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;

describe(`Specifying tags`, () => {
    let file1Result: CucumberTestFileResult;
    let file2Result: CucumberTestFileResult;
    let theklaConfigResult: TheklaConfigFileResult;

    beforeAll(async () => {
        file1Result = await createCucumberTestFiles(`simple`, `test1`, `step1`, `RequireOptionCli`);
        file2Result = await createCucumberTestFiles(`example`, `test2`, `step2`, `RequireOptionFramework`);

    });

    afterAll(async () => {
        await fsExtra.remove(file1Result.baseDir);
        await fsExtra.remove(file2Result.baseDir);
    });

    afterEach(() => {
        // thekla config result changes in every test case, so remove it after each iteration
        if(theklaConfigResult.baseDir) {
            fsExtra.remove(theklaConfigResult.baseDir);
        }

        // reset result after deleting the test dir
        theklaConfigResult = {baseDir: ``, confFilePath: ``, relativeConfFilePath: ``};
    });

    describe(`on command line`, () => {

        let forked: child.ChildProcess;

        beforeEach(() => {
            forked = child.fork(`${__dirname}/../__fixtures__/client.js`, [], {stdio: [`ignore`, `pipe`, process.stderr, `ipc`]});
        });

        it(`should execute 2 scenarios when no tags are set and an empty tag is set on command line` +
            `- (test case id: b8945d08-36cf-42fa-9d1d-c4360c4db1af)`, async () => {

            const expectedResult = `2 scenarios (2 passed)
6 steps (6 passed)
0m00.0`;

            const testConfig: TheklaConfig = {
                specs: [`${file1Result.relativeFeatureFilePath}`, `${file2Result.relativeFeatureFilePath}`],
                testFramework: {
                    frameworkName: `cucumber`,
                    cucumberOptions: {
                        require: [`_testData/cucumber/+(${file1Result.timeStampDir}|${file2Result.timeStampDir})/**/*.js`]
                    }
                }
            };
            theklaConfigResult = await createTheklaConfigFile(testConfig, `MultipleSpecConfOption`);

            const args: minimist.ParsedArgs = {
                "_": [theklaConfigResult.relativeConfFilePath],
                "specs": `_testData/cucumber/+(${file1Result.timeStampDir}|${file2Result.timeStampDir})/**/*.feature`,
                testFramework: {
                    cucumberOptions: {
                        tags: ``
                    }
                }
            };

            const testData: TheklaTestData = {
                args: args
            };

            let output = ``;

            forked.stdout.on(`data`, function (chunk) {
                output = chunk.toString();
            });

            forked.send(testData);

            return new Promise( (resolve, reject) => {
                try {
                    forked.on(`message`, (result: TheklaTestResult) => {
                        expect(result.specResult.success).toBeTruthy(`Test should pass, but it doesn't`);
                        expect(output.trim()).toContain(expectedResult);
                        resolve();
                    });
                } catch (e) {
                    const message = `Error on forked process ${e} ${Error().stack}`;
                    reject(message);
                }
            });
        });

        it(`should execute 2 scenarios when a tag is set in the config and its overwritten by an empty tag on command line` +
            `- (test case id: cef48bfc-c124-40cc-b567-aaea53ab6ca2)`, async () => {

            const expectedResult = `2 scenarios (2 passed)
6 steps (6 passed)
0m00.0`;

            const testConfig: TheklaConfig = {
                specs: [`${file1Result.relativeFeatureFilePath}`, `${file2Result.relativeFeatureFilePath}`],
                testFramework: {
                    frameworkName: `cucumber`,
                    cucumberOptions: {
                        require: [`_testData/cucumber/+(${file1Result.timeStampDir}|${file2Result.timeStampDir})/**/*.js`],
                        tags: [`@Focus`]
                    }
                }
            };

            theklaConfigResult = await createTheklaConfigFile(testConfig, `MultipleSpecConfOption`);

            const args: minimist.ParsedArgs = {
                "_": [theklaConfigResult.relativeConfFilePath],
                "specs": `_testData/cucumber/+(${file1Result.timeStampDir}|${file2Result.timeStampDir})/**/*.feature`,
                testFramework: {
                    cucumberOptions: {
                        tags: ``
                    }
                }
            };

            const testData: TheklaTestData = {
                args: args
            };

            let output = ``;

            forked.stdout.on(`data`, function (chunk) {
                output = chunk.toString();
            });

            forked.send(testData);

            return new Promise( (resolve, reject) => {
                try {
                    forked.on(`message`, (result: TheklaTestResult) => {
                        expect(result.specResult.success).toBeTruthy(`Test should pass, but it doesn't`);
                        expect(output.trim()).toContain(expectedResult);
                        resolve();
                    });
                } catch (e) {
                    const message = `Error on forked process ${e} ${Error().stack}`;
                    reject(message);
                }
            });
        });

        it(`should execute 1 scenarios when a tag is set in the config file` +
            `- (test case id: d6065772-739b-49f0-8712-da3c23f48c37)`, async () => {

            const expectedResult = `1 scenario (1 passed)
3 steps (3 passed)
0m00.0`;

            const testConfig: TheklaConfig = {
                specs: [`${file1Result.relativeFeatureFilePath}`, `${file2Result.relativeFeatureFilePath}`],
                testFramework: {
                    frameworkName: `cucumber`,
                    cucumberOptions: {
                        require: [`_testData/cucumber/+(${file1Result.timeStampDir}|${file2Result.timeStampDir})/**/*.js`],
                        tags: [`@Focus`]
                    }
                }
            };

            theklaConfigResult = await createTheklaConfigFile(testConfig, `MultipleSpecConfOption`);

            const args: minimist.ParsedArgs = {
                "_": [theklaConfigResult.relativeConfFilePath],
                "specs": `_testData/cucumber/+(${file1Result.timeStampDir}|${file2Result.timeStampDir})/**/*.feature`,
                testFramework: {
                }
            };

            const testData: TheklaTestData = {
                args: args
            };

            let output = ``;

            forked.stdout.on(`data`, function (chunk) {
                output = chunk.toString();
            });

            forked.send(testData);

            return new Promise( (resolve, reject) => {
                try {
                    forked.on(`message`, (result: TheklaTestResult) => {
                        expect(result.specResult.success).toBeTruthy(`Test should pass, but it doesn't`);
                        expect(output.trim()).toContain(expectedResult);
                        resolve();
                    });
                } catch (e) {
                    const message = `Error on forked process ${e} ${Error().stack}`;
                    reject(message);
                }
            });
        });

        it(`should execute 1 scenarios when multiple tags are set in the config file and it is overwritten by command line` +
            `- (test case id: 5d730927-b996-42df-bd74-5483cb06880e)`, async () => {

            const expectedResult = `1 scenario (1 passed)
3 steps (3 passed)
0m00.0`;

            const testConfig: TheklaConfig = {
                specs: [`${file1Result.relativeFeatureFilePath}`, `${file2Result.relativeFeatureFilePath}`],
                testFramework: {
                    frameworkName: `cucumber`,
                    cucumberOptions: {
                        require: [`_testData/cucumber/+(${file1Result.timeStampDir}|${file2Result.timeStampDir})/**/*.js`],
                        tags: [`@Example`,`@Focus`]
                    }
                }
            };

            theklaConfigResult = await createTheklaConfigFile(testConfig, `MultipleSpecConfOption`);

            const args: minimist.ParsedArgs = {
                "_": [theklaConfigResult.relativeConfFilePath],
                "specs": `_testData/cucumber/+(${file1Result.timeStampDir}|${file2Result.timeStampDir})/**/*.feature`,
                testFramework: {
                    cucumberOptions: {
                        tags: [`@Focus`]
                    }
                }
            };

            const testData: TheklaTestData = {
                args: args
            };

            let output = ``;

            forked.stdout.on(`data`, function (chunk) {
                output = chunk.toString();
            });

            forked.send(testData);

            return new Promise( (resolve, reject) => {
                try {
                    forked.on(`message`, (result: TheklaTestResult) => {
                        expect(result.specResult.success).toBeTruthy(`Test should pass, but it doesn't`);
                        expect(output.trim()).toContain(expectedResult);
                        resolve();
                    });
                } catch (e) {
                    const message = `Error on forked process ${e} ${Error().stack}`;
                    reject(message);
                }
            });
        });
    });
});