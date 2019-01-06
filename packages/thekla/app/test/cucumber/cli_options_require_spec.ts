import * as minimist                                                                             from "minimist";
import {Command}                                                                                 from "../../lib/command";
import {TheklaConfig}                                                                            from "../../lib/config/ConfigProcessor";
import {Thekla}                                                                                  from "../../lib/thekla";
import {createTestFiles, createTheklaConfigFile, CucumberTestFileResult, TheklaConfigFileResult} from "./testFiles";
import fsExtra                                                                                   from 'fs-extra'


describe('Specifying support files', () => {
    let file1Result: CucumberTestFileResult;
    let file2Result: CucumberTestFileResult;
    let theklaConfigResult: TheklaConfigFileResult;

    beforeEach(async () => {
        file1Result = await createTestFiles("simple", "test1", "step1", "RequireOptionCli");
        file2Result = await createTestFiles("example", "test2", "step2", "RequireOptionFramework");
    });

    afterEach(async () => {
        await fsExtra.remove(file1Result.baseDir);
        await fsExtra.remove(file2Result.baseDir);
    });

    afterEach(() => {
        if(theklaConfigResult.baseDir) {
            fsExtra.remove(theklaConfigResult.baseDir);
        }

        theklaConfigResult = {baseDir: "", confFilePath: "", relativeConfFilePath: ""};
    });

    describe('on command line only', () => {

        it('as a single option, should find the support file ' +
            '- (test case id: 0c7dab32-8f0d-4f98-8931-251636256503)', async () => {

            const testConfig: TheklaConfig = {
                browserName: "firefox",
                testFramework: {
                    frameworkName: "cucumber",
                }
            };

            theklaConfigResult = await createTheklaConfigFile(testConfig, "SingleCliOption");

            const args: minimist.ParsedArgs = {
                "_": [theklaConfigResult.relativeConfFilePath],
                "specs": `${file1Result.relativeFeatureFilePath}`,
                "require": `${file1Result.relativeStepDefinitionFilePath}`
            };

            const thekla = new Thekla();
            const command = new Command(thekla, args);
            await command.run().then((specResult: any) => {
                expect(specResult.success).toBeTruthy();
            });
        });
    });

    describe('only in the config file', () => {
        it('as a single option, should find the support file' +
            '- (test case id: dfcf68da-e41f-4669-9f48-c25cb475826d)', async () => {

            const testConfig: TheklaConfig = {
                browserName: "firefox",
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
    });

    describe('on command line and config file', () => {

    });

    describe('not on command line and not config file', () => {

        it('should fail the test ' +
            '- (test case id: 6c3f3e1a-6d29-439b-9b57-29a55c48eacb)', async () => {

            const testConfig: TheklaConfig = {
                browserName: "firefox",
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