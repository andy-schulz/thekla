import * as child       from "child_process";


import fsExtra          from 'fs-extra'
import * as minimist    from "minimist";
import {Command}        from "../../lib/command";
import {menus}          from "../../lib/commands/help";
import {TheklaConfig}   from "../../lib/config/TheklaConfig";
import {Thekla}         from "../../lib/thekla";
import {TheklaTestData} from "../data/client";
import {
    createCucumberTestFiles, createTheklaConfigFile, CucumberTestFileResult, TheklaConfigFileResult
}                       from "../data/testFiles";


describe('execute a basic cucumber feature file', () => {
    let file1Result: CucumberTestFileResult;
    let theklaConfigResult: TheklaConfigFileResult;

    beforeEach(async () => {
        file1Result = await createCucumberTestFiles("simple", "", "", "SpecOptionCli");
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

    describe('and not specifying a feature file', () => {
        let forked: child.ChildProcess;

        beforeEach(() => {
            forked = child.fork(`${__dirname}/../data/client.js`, [], {stdio: ['ignore', 'pipe', process.stderr, 'ipc']});
        });

        afterEach(() => {
            forked.kill();
        });

        it('should display the help text when an empty spec Array is passed ' +
            '- (test case id: ebfd78a6-c683-4227-ac3c-5304d6cdae57)', async () => {

            const testConfig: TheklaConfig = {
                specs: [],
                testFramework: {
                    frameworkName: "cucumber",
                }
            };

            theklaConfigResult = await createTheklaConfigFile(testConfig, "MultipleSpecConfOption");

            const args: minimist.ParsedArgs = {
                "_": [theklaConfigResult.relativeConfFilePath]
            };

            const testData: TheklaTestData = {
                args: args
            };

            let output: string = "";

            forked.stdout.on("data", function (chunk) {
                output = chunk.toString();
            });

            forked.send(testData);

            return new Promise( (resolve, reject) => {
                try {
                    forked.on('message', (specResult: any) => {
                        expect(specResult).toEqual({});
                        expect(output.trim()).toEqual(menus.specs.trim());
                        resolve();
                    });
                } catch (e) {
                    const message = `Error on forked process ${e} ${Error().stack}`;
                    reject(message);
                }
            });
        });

        it('should display an error message when the specs are passed as an Array with a length greater than 1 ' +
            '- (test case id: bbbfc97d-b4ba-4731-a774-2a0635f5d3f9)', async () => {

            let output: string = "";
            forked.stdout.on("data", function (chunk) { output = chunk.toString()});

            const testConfig: TheklaConfig = {
                specs: [file1Result.relativeFeatureFilePath, file1Result.relativeFeatureFilePath],
                testFramework: {
                    frameworkName: "cucumber",
                }
            };
            theklaConfigResult = await createTheklaConfigFile(testConfig, "MultipleSpecConfOption");

            const args: minimist.ParsedArgs = {
                "_": [theklaConfigResult.relativeConfFilePath]
            };
            const testData: TheklaTestData = { args: args };

            forked.send(testData);

            return new Promise( (resolve, reject) => {
                try {
                    forked.on('message', (specResult: any) => {
                        expect(specResult.error).toEqual(undefined);
                        expect(output.trim()).toEqual(menus.ccMultipleFeatureFiles.trim());
                        resolve();
                    });
                } catch (e) {
                    const message = `Error on forked process ${e} ${Error().stack}`;
                    reject(message);
                }
            });
        });
    });

    describe('and specifying the feature files', () => {
        let forked: child.ChildProcess;
        let output: string = "";

        beforeEach(() => {
            forked = child.fork(`${__dirname}/../data/client.js`, [], {stdio: ['ignore', 'pipe', process.stderr, 'ipc']});
            forked.stdout.on("data", function (chunk) { output = chunk.toString()});
        });

        afterEach(() => {
            forked.kill();
            output = "";
        });

        const cucumberSuccess = `1 scenario (1 passed)
3 steps (3 passed)
0m00.`;

        const startTest = (args:minimist.ParsedArgs): Promise<any> => {
            forked.send({ args: args });

            return new Promise( (resolve, reject) => {
                try {
                    forked.on('message', (specResult: any) => {
                        resolve(specResult);
                    });
                } catch (e) {
                    const message = `Error on forked process ${e} ${Error().stack}`;
                    reject(message);
                }
            });
        };

        it('by passing via command line, it should execute the file ' +
            '- (test case id: 8499d974-f712-49dc-a333-2b1e8a6d499d)', async () => {
            const testConfig: TheklaConfig = {
                testFramework: {
                    frameworkName: "cucumber",
                }
            };

            theklaConfigResult = await createTheklaConfigFile(testConfig, "SingleSpecCliOption");

            const args: minimist.ParsedArgs = {
                "_": [theklaConfigResult.relativeConfFilePath],
                "specs": `${file1Result.relativeFeatureFilePath}`,
            };

            return startTest(args)
                .then((specResult: any) => {
                    expect(specResult.error).toEqual(undefined);
                    expect(specResult.success).toBe(true);
                    expect(output.trim().slice(0,-4)).toEqual(cucumberSuccess.trim());
                })
        });

        it('by passing them within the config file, it should execute the file ' +
            '- (test case id: fcfac440-f13c-4dbd-be6b-f93eef045e57)', async () => {
            const testConfig: TheklaConfig = {
                specs: [file1Result.relativeFeatureFilePath],
                testFramework: {
                    frameworkName: "cucumber",
                }
            };

            theklaConfigResult = await createTheklaConfigFile(testConfig, "SingleSpecConfOption");

            const args: minimist.ParsedArgs = {
                "_": [theklaConfigResult.relativeConfFilePath]
            };

            return startTest(args)
                .then((specResult: any) => {
                    expect(specResult.error).toEqual(undefined);
                    expect(specResult.success).toBe(true);
                    expect(output.trim().slice(0,-4)).toEqual(cucumberSuccess.trim());
                });
        });


        it('should ignore empty specs array defined in config file when specs are passed via command line ' +
            '- (test case id: 8cd2e0a6-e14d-435c-985d-29e635eae1bf)', async () => {
            const testConfig: TheklaConfig = {
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

            return startTest(args)
                .then((specResult: any) => {
                    expect(specResult.error).toEqual(undefined);
                    expect(specResult.success).toBe(true);
                    expect(output.trim().slice(0,-4)).toEqual(cucumberSuccess.trim());
                });
        });

    });

    describe('and specify the cucumber report', () => {
        const reportPath = "_testData/report";
        const cwd = process.cwd();
        const fullReportPath = `${cwd}/${reportPath}`;

        let forked: child.ChildProcess;
        let output: string = "";

        beforeEach(() => {
            forked = child.fork(`${__dirname}/../data/client.js`, [], {stdio: ['ignore', 'pipe', process.stderr, 'ipc']});
            forked.stdout.on("data", function (chunk) { output = chunk.toString()});
        });

        afterEach(() => {
            forked.kill();
            output = "";
        });

        beforeAll(() => {
            // test for report dir and create it
            return fsExtra.mkdirp(fullReportPath);
        });

        afterAll(() => {
            return fsExtra.remove(fullReportPath);
        });

        const startTest = (args:minimist.ParsedArgs): Promise<any> => {
            forked.send({ args: args });

            return new Promise( (resolve, reject) => {
                try {
                    forked.on('message', (specResult: any) => {
                        resolve(specResult);
                    });
                } catch (e) {
                    const message = `Error on forked process ${e} ${Error().stack}`;
                    reject(message);
                }
            });
        };

        it('it should generate the report ' +
            '- (test case id: b8cdd200-2341-45a8-ae80-673d89e3e502)', async () => {
            const baseName = `GenerateReportFromSimpleFeatureFile`;

            const reportFileName = `${baseName}RepotFile.json`;
            const testConfig: TheklaConfig = {
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

            startTest(args)
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
                .then(() => {
                    expect(true).toBeFalsy(`The spec should not run successful as the report folder does not exist`);
                }).catch((e: any) => {
                    expect(e.toString()).toContain(`no such file or directory, open`);
                    expect(e.toString()).toContain(`${reportFileName}`);
                });
        });
    });

});