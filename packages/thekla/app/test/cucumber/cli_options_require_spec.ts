import * as minimist                                                                                     from "minimist";
import {Command}                                                                                         from "../../lib/command";
import {TheklaConfig}                                                                                    from "../../lib/config/TheklaConfig";
import {Thekla}                                                                                          from "../../lib/thekla";
import {createCucumberTestFiles, createTheklaConfigFile, CucumberTestFileResult, TheklaConfigFileResult} from "./testFiles";
import fsExtra                                                                                           from 'fs-extra'


describe('Specifying support files', () => {
    let file1Result: CucumberTestFileResult;
    let file2Result: CucumberTestFileResult;
    let theklaConfigResult: TheklaConfigFileResult;

    beforeEach(async () => {
        file1Result = await createCucumberTestFiles("simple", "test1", "step1", "RequireOptionCli");
        file2Result = await createCucumberTestFiles("example", "test2", "step2", "RequireOptionFramework");
    });

    afterEach(async () => {
        await fsExtra.remove(file1Result.baseDir);
        await fsExtra.remove(file2Result.baseDir);
    });

    afterEach(() => {
        if(theklaConfigResult.baseDir) {
            fsExtra.remove(theklaConfigResult.baseDir);
        }

        // reset result after deleting the test dir
        theklaConfigResult = {baseDir: "", confFilePath: "", relativeConfFilePath: ""};
    });

    describe('on command line only', () => {

        it('as a single option, should find the support file ' +
            '- (test case id: 0c7dab32-8f0d-4f98-8931-251636256503)', async () => {

            const testConfig: TheklaConfig = {
                testFramework: {
                    frameworkName: "cucumber",
                }
            };

            theklaConfigResult = await createTheklaConfigFile(testConfig, "SingleCliOption");

            const args: minimist.ParsedArgs = {
                "_": [theklaConfigResult.relativeConfFilePath],
                "specs": `${file1Result.relativeFeatureFilePath}`,
                "testFramework": {
                    cucumberOptions: {
                        require: `${file1Result.relativeStepDefinitionFilePath}`
                    }
                }
            };

            const thekla = new Thekla();
            const command = new Command(thekla, args);
            await command.run().then((specResult: any) => {
                console.log(specResult);
                expect(specResult.success).toBeTruthy();
            });
        });
    });

    describe('only in the config file', () => {
        it('as a single option, should find the support file' +
            '- (test case id: dfcf68da-e41f-4669-9f48-c25cb475826d)', async () => {

            const testConfig: TheklaConfig = {
                testFramework: {
                    frameworkName: "cucumber",
                    cucumberOptions: {
                        require: [file1Result.relativeStepDefinitionFilePath]
                    }
                }
            };

            theklaConfigResult = await createTheklaConfigFile(testConfig, "SingleConfOption");

            const args: minimist.ParsedArgs = {
                "_": [theklaConfigResult.relativeConfFilePath],
                "specs": `${file1Result.relativeFeatureFilePath}`,
            };

            const thekla = new Thekla();
            const command = new Command(thekla, args);
            await command.run().then((specResult: any) => {
                expect(specResult.success).toBeTruthy();
            });
        });

        it('as a single option with multiple support files, it should execute multiple feature files' +
            '- (test case id: c06b4331-2374-4904-ba96-0694eeaf2442)', async () => {

            const testConfig: TheklaConfig = {
                testFramework: {
                    frameworkName: "cucumber",
                    cucumberOptions: {
                        require: [file1Result.relativeStepDefinitionFilePath,file2Result.relativeStepDefinitionFilePath]
                    }
                }
            };

            theklaConfigResult = await createTheklaConfigFile(testConfig, "MultipleFeatureFilesConfOption");

            const args: minimist.ParsedArgs = {
                "_": [theklaConfigResult.relativeConfFilePath],
                "specs": `${file1Result.baseDir}/../`,
            };

            console.log("SPECS: " + args.specs);

            const thekla = new Thekla();
            const command = new Command(thekla, args);
            await command.run().then((specResult: any) => {
                expect(specResult.success).toBeTruthy();
            });
        });
    });

    describe('on command line and config file', () => {
        it('when loading the wrong support files with config option, the test passes ' +
            '- (test case id: b77d6249-ea6e-4919-8b20-d453a1c895c1)', async () => {


            const testConfig: TheklaConfig = {
                testFramework: {
                    frameworkName: "cucumber",
                    cucumberOptions: {
                        require: [file2Result.relativeStepDefinitionFilePath]
                    }
                }
            };

            theklaConfigResult = await createTheklaConfigFile(testConfig, "SingleCliAndConfOption");

            const args: minimist.ParsedArgs = {
                "_": [theklaConfigResult.relativeConfFilePath],
                "specs": `${file1Result.relativeFeatureFilePath}`,
                testFramework: {
                    cucumberOptions: {
                        require: `${file1Result.relativeStepDefinitionFilePath}`
                    }
                }
            };

            const thekla = new Thekla();
            const command = new Command(thekla, args);
            await command.run().then((specResult: any) => {
                expect(specResult.success).toBeTruthy();
            });

        });

        it('when loading the wrong support files with cli option, the test fails ' +
            '- (test case id: 2853cfa8-b1cb-4953-9364-27d32d420e97)', async () => {


            const testConfig: TheklaConfig = {
                testFramework: {
                    frameworkName: "cucumber",
                    cucumberOptions: {
                        require: [file1Result.relativeStepDefinitionFilePath]
                    }
                }
            };

            theklaConfigResult = await createTheklaConfigFile(testConfig, "ErrorWithSingleCliOption");

            const args: minimist.ParsedArgs = {
                "_": [theklaConfigResult.relativeConfFilePath],
                "specs": `${file1Result.relativeFeatureFilePath}`,
                testFramework: {
                    cucumberOptions: {
                        require: `${file2Result.relativeStepDefinitionFilePath}`
                    }
                },
            };

            const thekla = new Thekla();
            const command = new Command(thekla, args);
            await command.run().then((specResult: any) => {
                expect(specResult.success).toBeFalsy();
            });

        });
    });

    describe('not on command line and not in config file', () => {

        it('should fail the test ' +
            '- (test case id: 6c3f3e1a-6d29-439b-9b57-29a55c48eacb)', async () => {

            const testConfig: TheklaConfig = {
                testFramework: {
                    frameworkName: "cucumber",
                }
            };

            theklaConfigResult = await createTheklaConfigFile(testConfig, "MissingRequireOption");

            const args: minimist.ParsedArgs = {
                "_": [theklaConfigResult.relativeConfFilePath],
                "specs": `${file1Result.relativeFeatureFilePath}`,
            };

            const thekla = new Thekla();
            const command = new Command(thekla, args);
            await command.run().then((specResult: any) => {
                expect(specResult.success).toBeFalsy();
            });
        });
    });
});