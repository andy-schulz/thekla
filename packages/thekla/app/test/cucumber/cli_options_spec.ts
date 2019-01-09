import fsExtra        from 'fs-extra'
import * as minimist  from "minimist";
import {Command}      from "../../lib/command";
import {TheklaConfig} from "../../lib/config/TheklaConfig";
import {Thekla}       from "../../lib/thekla";
import {
    baseAbsoluteTestDir, createTestFiles, createTheklaConfigFile, CucumberTestFileResult,
    getDynamicTestDir,
    simpleFeatureTestFileContent,
    simpleStepDefinitionFileContent, TheklaConfigFileResult
} from "./testFiles";


describe('execute a basic cucumber feature file', () => {
    let file1Result: CucumberTestFileResult;
    let file2Result: CucumberTestFileResult;
    let theklaConfigResult: TheklaConfigFileResult;

    beforeEach(async () => {
        file1Result = await createTestFiles("simple", "", "", "SpecOptionCli");
    });

    afterEach(async () => {
        // remove features
        await fsExtra.remove(file1Result.baseDir);
    });

    afterEach(() => {
        // remove config files
        if(theklaConfigResult.baseDir) {
            fsExtra.remove(theklaConfigResult.baseDir);
        }

        // reset result after deleting the test dir
        theklaConfigResult = {baseDir: "", confFilePath: "", relativeConfFilePath: ""};
    });
    describe('and specifying the feature files', () => {

        it('by passing via command line, it should execute the file ' +
            '- (test case id: 8499d974-f712-49dc-a333-2b1e8a6d499d)', async () => {


            const testConfig: TheklaConfig = {
                browserName: "firefox",
                testFramework: {
                    frameworkName: "cucumber",
                }
            };

            theklaConfigResult = await createTheklaConfigFile(testConfig, "SingleSpecCliOption");

            const args: minimist.ParsedArgs = {
                "_": [theklaConfigResult.relativeConfFilePath],
                "specs": `${file1Result.relativeFeatureFilePath}`,
            };

            const thekla = new Thekla();
            const command = new Command(thekla, args);
            return  command.run().then((specResult: any) => {
                console.log(specResult);
                expect(specResult.success).toBeTruthy();
            });
        });

        it('by passing them within the config file, it should execute the file ' +
            '- (test case id: fcfac440-f13c-4dbd-be6b-f93eef045e57)', async () => {

            const testConfig: TheklaConfig = {
                browserName: "firefox",
                specs: [file1Result.relativeFeatureFilePath],
                testFramework: {
                    frameworkName: "cucumber",
                }
            };

            theklaConfigResult = await createTheklaConfigFile(testConfig, "SingleSpecConfOption");

            const args: minimist.ParsedArgs = {
                "_": [theklaConfigResult.relativeConfFilePath]
            };


            const thekla = new Thekla();
            const command = new Command(thekla, args);
            return  command.run().then((specResult: any) => {
                console.log(specResult);
                expect(specResult.success).toBeTruthy();
            });
        });


        it('should throw an Error when the specs are passed as an Array with a length greater than 1 ' +
            '- (test case id: bbbfc97d-b4ba-4731-a774-2a0635f5d3f9)', async () => {

            const testConfig: TheklaConfig = {
                browserName: "firefox",
                specs: [file1Result.relativeFeatureFilePath, file1Result.relativeFeatureFilePath],
                testFramework: {
                    frameworkName: "cucumber",
                }
            };

            theklaConfigResult = await createTheklaConfigFile(testConfig, "MultipleSpecConfOption");

            const args: minimist.ParsedArgs = {
                "_": [theklaConfigResult.relativeConfFilePath]
            };


            const thekla = new Thekla();
            const command = new Command(thekla, args);
            return  command.run()
                .then((specResult: any) => {
                    expect(true).toBeFalsy(`command.run should throw an Error and should not pass as it is right now`);
                }).catch((e: any) => {
                    expect(e).toContain(`Passing multiple features files in an array is not supported yet, please pass in a single string as described in: https://github.com/cucumber/cucumber-js/blob/master/docs/cli.md#running-specific-features`);
                });
        });

        it('should throw an Error when an empty spec Array is passed ' +
            '- (test case id: ebfd78a6-c683-4227-ac3c-5304d6cdae57)', async () => {
            const testConfig: TheklaConfig = {
                browserName: "firefox",
                specs: [],
                testFramework: {
                    frameworkName: "cucumber",
                }
            };

            theklaConfigResult = await createTheklaConfigFile(testConfig, "MultipleSpecConfOption");

            const args: minimist.ParsedArgs = {
                "_": [theklaConfigResult.relativeConfFilePath]
            };

            const thekla = new Thekla();
            const command = new Command(thekla, args);
            return  command.run()
                .then(() => {
                    expect(true).toBeFalsy(`At this point the Method thekla.processConfig should throw an Error, but it doest.`);
                })
                .catch((e: any) => {
                    const expectedMessage = `
No Specs found in config file, please specify one as command line parameter or as a config file attribute
Use:
    --specs=glob|dir|file
or
    config = {
        specs: [glob|dir|file]
    }
            `;
                    expect(e).toContain(expectedMessage);
                })
        });

        it('should ignore empty specs array defined in config file when specs are passed via command line ' +
            '- (test case id: 8cd2e0a6-e14d-435c-985d-29e635eae1bf)', async () => {
            const testConfig: TheklaConfig = {
                browserName: "firefox",
                specs: [],
                testFramework: {
                    frameworkName: "cucumber",
                }
            };

            theklaConfigResult = await createTheklaConfigFile(testConfig, "MultipleSpecConfOption");

            const args: minimist.ParsedArgs = {
                "_": [theklaConfigResult.relativeConfFilePath],
                "specs": `${file1Result.relativeFeatureFilePath}`,
            };


            const thekla = new Thekla();
            const command = new Command(thekla, args);
            return  command.run()
                .then((specResult: any) => {
                    expect(specResult.success).toBeTruthy();
                });
        });

    });

    describe('and specify the cucumber report', () => {
        const reportPath = "_testData/report";
        const cwd = process.cwd();
        const fullReportPath = `${cwd}/${reportPath}`;

        beforeAll(() => {
            // test for report dir and create it
            return fsExtra.mkdirp(fullReportPath);
        });

        afterAll(() => {
            return fsExtra.remove(fullReportPath);
        });

        it('it should generate the report ' +
            '- (test case id: b8cdd200-2341-45a8-ae80-673d89e3e502)', async () => {
            const baseName = `GenerateReportFromSimpleFeatureFile`;

            const reportFileName = `${baseName}RepotFile.json`;
            const testConfig: TheklaConfig = {
                browserName: "firefox",
                testFramework: {
                    frameworkName: "cucumber",
                    cucumberOptions: {
                        format: [`json:${reportPath}/${reportFileName}`]
                    }
                }
            };

            theklaConfigResult = await createTheklaConfigFile(testConfig, "MultipleSpecConfOption");

            const args: minimist.ParsedArgs = {
                "_": [theklaConfigResult.relativeConfFilePath],
                "specs": `${file1Result.relativeFeatureFilePath}`,
            };


            const thekla = new Thekla();
            const command = new Command(thekla, args);
            return  command.run()
                .then((specResult: any) => {
                    expect(specResult.success).toBeTruthy(`Spec was not executed successfully`);
                    expect(fsExtra.existsSync(`${fullReportPath}/${reportFileName}`)).toBeTruthy(
                        `Reportfile '${reportFileName}' does not exist in folder '${fullReportPath}'`);
                });
        });

        it('it should throw an error when the given folder does not exist - (test case id: 926989d3-3f5b-4ab6-8821-795cd2df68c1)', async () => {
            const baseName = `ErorrMessageWhenDirDoesNotExist`;

            const reportFileName = `${baseName}RepotFile.json`;
            const testConfig: TheklaConfig = {
                browserName: "firefox",
                testFramework: {
                    frameworkName: "cucumber",
                    cucumberOptions: {
                        format: [`json:doesNotExistFolder/${reportFileName}`]
                    }
                }
            };

            theklaConfigResult = await createTheklaConfigFile(testConfig, "MultipleSpecConfOption");

            const args: minimist.ParsedArgs = {
                "_": [theklaConfigResult.relativeConfFilePath],
                "specs": `${file1Result.relativeFeatureFilePath}`,
            };

            const thekla = new Thekla();
            const command = new Command(thekla, args);
            return  command.run()
                .then((specResult: any) => {
                    expect(true).toBeFalsy(`The spec should not run successful as the report folder does not exist`);
                }).catch((e: any) => {
                    expect(e.toString()).toContain(`no such file or directory, open`);
                    expect(e.toString()).toContain(`${reportFileName}`);
                });
        });
    });

});