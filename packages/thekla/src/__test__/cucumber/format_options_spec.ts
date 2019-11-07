import * as child       from "child_process";

import fsExtra        from 'fs-extra'
import * as minimist  from "minimist";
import {Command}      from "../../lib/command";
import {TheklaConfig} from "@thekla/config";
import {Thekla}       from "../../lib/thekla";
import {
    createCucumberTestFiles, createTheklaConfigFile, CucumberTestFileResult, TheklaConfigFileResult
}                     from "../__fixtures__/testFiles";

describe(`execute a basic cucumber feature file`, () => {
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
        if(theklaConfigResult.baseDir) {
            fsExtra.remove(theklaConfigResult.baseDir);
        }

        // reset result after deleting the test dir
        theklaConfigResult = {baseDir: ``, confFilePath: ``, relativeConfFilePath: ``};
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

        it(`it should generate the report
        - (test case id: b8cdd200-2341-45a8-ae80-673d89e3e502)`, async () => {
            const baseName = `GenerateReportFromSimpleFeatureFile`;

            const reportFileName = `${baseName}RepotFile.json`;
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

            startTest(args)
                .then((specResult: any) => {
                    expect(specResult.success).toBeTruthy(`Spec was not executed successfully`);
                    expect(fsExtra.existsSync(`${fullReportPath}/${reportFileName}`)).toBeTruthy(
                        `Reportfile '${reportFileName}' does not exist in folder '${fullReportPath}'`);
                });
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