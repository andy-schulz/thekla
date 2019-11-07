import * as child       from "child_process";

import fsExtra                         from 'fs-extra'
import * as minimist                   from "minimist";
import {Command}                       from "../../lib/command";
import {CucumberOptions, TheklaConfig} from "@thekla/config";
import {processFrameworkOptions}       from "../../lib/testFramework/CucumberUtils";
import {Thekla}                        from "../../lib/thekla";
import {
    createCucumberTestFiles, createTheklaConfigFile, CucumberTestFileResult, TheklaConfigFileResult
}                                      from "../__fixtures__/testFiles";

describe(`Specifying the formatter`, () => {
    let file1Result: CucumberTestFileResult;
    let theklaConfigResult: TheklaConfigFileResult;

    beforeEach(async () => {
        file1Result = await createCucumberTestFiles(`simple`, ``, ``, `SpecOptionCli`);
    });

    afterEach(async () => {
        // remove features
        await fsExtra.remove(file1Result.baseDir);
    });

    afterEach(() => {
        // remove config files
        if(!theklaConfigResult)
            return;

        if(theklaConfigResult.baseDir) {
            fsExtra.remove(theklaConfigResult.baseDir);
        }

        // reset result after deleting the test dir
        theklaConfigResult = {baseDir: ``, confFilePath: ``, relativeConfFilePath: ``};
    });

    describe(`JUnitFormatter`, () => {

        it(`should return the cli option
        test id: 26e976e8-597e-4d66-ac5d-316a235a8845`, () => {
            const cucumberOptions: CucumberOptions = {
                format: [`junit:/reportFolder/MyReport.xml`]
            };

            const junitFormatter = processFrameworkOptions(cucumberOptions);

            const expected = [
                `--format`,
                `JUnitFormatter.js:/reportFolder/MyReport.xml`
            ];

            expect(junitFormatter.length).toEqual(2);
            expect(junitFormatter[0]).toEqual(expected[0]);
            expect(junitFormatter[1]).toContain(expected[1]);
        });
    });

    describe(`JUnitFormatter and JsonFormatter`, () => {

        it(`should return both formatter as cli options
        test id: 734816fa-7828-4f53-b683-db24c757ba9d`, () => {
            const cucumberOptions: CucumberOptions = {
                format: [
                    `json:/reportFolder/JsonReporter.json`,
                    `junit:/reportFolder/JUnitReport.xml`]
            };

            const junitFormatter = processFrameworkOptions(cucumberOptions);

            const expected = [
                `--format`,
                `json:/reportFolder/JsonReporter.json`,
                `--format`,
                `JUnitFormatter.js:/reportFolder/JUnitReport.xml`
            ];

            expect(junitFormatter.length).toEqual(4);
            expect(junitFormatter[0]).toEqual(expected[0]);
            expect(junitFormatter[1]).toEqual(expected[1]);
            expect(junitFormatter[2]).toEqual(expected[2]);
            expect(junitFormatter[3]).toContain(expected[3]);
        });
    });

    describe(`and specify the cucumber report`, () => {
        const reportPath = `_testData/report`;
        const cwd = process.cwd();
        const fullReportPath = `${cwd}/${reportPath}`;

        let forked: child.ChildProcess;
        let output = ``;

        beforeEach(() => {
            forked = child.fork(`${__dirname}/../__fixtures__/client.js`, [], {stdio: [`ignore`, `pipe`, process.stderr, `ipc`]});
            forked.stdout.on(`data`, function (chunk) { output = chunk.toString()});
        });

        afterEach(() => {
            forked.kill();
            output = ``;
        });

        beforeAll(() => {
            // test for report dir and create it
            return fsExtra.mkdirp(fullReportPath);
        });

        afterAll(() => {
            return fsExtra.remove(fullReportPath);
        });

        const startTest = (args: minimist.ParsedArgs): Promise<any> => {
            forked.send({ args: args });

            return new Promise( (resolve, reject) => {
                try {
                    forked.on(`message`, (specResult: any) => {
                        resolve(specResult);
                    });
                } catch (e) {
                    const message = `Error on forked process ${e} ${Error().stack}`;
                    reject(message);
                }
            });
        };

        it(`it should generate the Json report
        - (test case id: b8cdd200-2341-45a8-ae80-673d89e3e502)`, async () => {
            const baseName = `GenerateReportFromSimpleFeatureFile`;

            const reportFileName = `${baseName}ReportFile.json`;
            const testConfig: TheklaConfig = {
                testFramework: {
                    frameworkName: `cucumber`,
                    cucumberOptions: {
                        format: [`json:${reportPath}/${reportFileName}`]
                    }
                }
            };

            theklaConfigResult = await createTheklaConfigFile(testConfig, `MultipleSpecConfOption`);

            const args: minimist.ParsedArgs = {
                "_": [theklaConfigResult.relativeConfFilePath],
                "specs": `${file1Result.relativeFeatureFilePath}`,
            };

            return startTest(args)
                .then((result: any) => {
                    expect(result.specResult.success).toBeTruthy(`Spec was not executed successfully`);
                    expect(fsExtra.existsSync(`${fullReportPath}/${reportFileName}`)).toBeTruthy(
                        `Reportfile '${reportFileName}' does not exist in folder '${fullReportPath}'`);
                });
        });

        it(`it should generate the Junit report
        - (test case id:44e005a5-0b2a-448d-8a85-0d469a5ff742)`, async () => {
            const baseName = `GenerateJunitReportFromSimpleFeatureFile`;

            const reportFileName = `${baseName}JUnitReportFile.xml`;
            const testConfig: TheklaConfig = {
                testFramework: {
                    frameworkName: `cucumber`,
                    cucumberOptions: {
                        format: [`junit:${reportPath}/${reportFileName}`]
                    }
                }
            };

            theklaConfigResult = await createTheklaConfigFile(testConfig, `JUnitReporterConfOption`);

            const args: minimist.ParsedArgs = {
                "_": [theklaConfigResult.relativeConfFilePath],
                "specs": `${file1Result.relativeFeatureFilePath}`,
            };

            return startTest(args)
                .then((result: any) => {
                    expect(result.specResult.success).toBeTruthy(`Spec was not executed successfully`);
                    expect(fsExtra.existsSync(`${fullReportPath}/${reportFileName}`)).toBeTruthy(
                        `Reportfile '${reportFileName}' does not exist in folder '${fullReportPath}'`);
                })
        });

        it(`it should throw an error when the given folder does not exist 
        - (test case id: 926989d3-3f5b-4ab6-8821-795cd2df68c1)`, async () => {
            const baseName = `ErorrMessageWhenDirDoesNotExist`;

            const reportFileName = `${baseName}RepotFile.json`;
            const testConfig: TheklaConfig = {
                testFramework: {
                    frameworkName: `cucumber`,
                    cucumberOptions: {
                        format: [`json:doesNotExistFolder/${reportFileName}`]
                    }
                }
            };

            theklaConfigResult = await createTheklaConfigFile(testConfig, `MultipleSpecConfOption`);

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