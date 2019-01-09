import * as child               from "child_process";
import fsExtra                  from "fs-extra";
import * as minimist            from "minimist";
import {TheklaTestData}         from "./client";

const cwd = process.cwd();

const specFinderRelativeDir = `_testData/command/specFinder`;
const specFinderAbsoluteDir = `${cwd}/${specFinderRelativeDir}`;

const jasmineConfContent =  `
exports.config = {
    browserName: "firefox",

    testFramework: {
        frameworkName: "jasmine",
        jasmineOptions: {
            defaultTimeoutInterval: 1000
        }
    }
};
`;
const jasmineConfFileName = `jasmine_config.js`;
const jasmineConfDirName = `${specFinderAbsoluteDir}`;
const jasmineConfFilePath = `${jasmineConfDirName}/${jasmineConfFileName}`;
const jasmineConfRelativeFilePath = `${specFinderRelativeDir}/${jasmineConfFileName}`;

const masterSpecContent = `
describe('finding a spec', () => {
    it('in the master directory', () => {
        console.log("master spec found")
    });
});
`;
const masterSpecFileName = `spec_master_finder.js`;
const masterSpecDirName = `${specFinderAbsoluteDir}`;
const masterSpecFilePath = `${masterSpecDirName}/${masterSpecFileName}`;

const subSpecContent = `
describe('finding a spec', () => {
    it('in a subdirectory', () => {
        console.log("sub spec found")
    });
});
`;
const subSpecFileName = `spec_sub_finder.js`;
const subSpecDirName = `${specFinderAbsoluteDir}/subSpec`;
const subSpecFilePath = `${subSpecDirName}/${subSpecFileName}`;

describe('Passing spec files', () => {
    let forked: child.ChildProcess;

    beforeAll(async () => {
        await fsExtra.outputFile(masterSpecFilePath, masterSpecContent);
        await fsExtra.outputFile(subSpecFilePath, subSpecContent);
        await fsExtra.outputFile(jasmineConfFilePath, jasmineConfContent);

        const testArgs = [
            `${jasmineConfRelativeFilePath}`,
        ];
    });

    afterAll(async () => {
        // await fsExtra.remove(specFinderAbsoluteDir);
    });

    beforeEach(() => {
        forked = child.fork(`${__dirname}/client.js`, [], {stdio: "ignore"});
    });

    describe('by command line',() => {
        it('aaaaaas a glob, two files should be found - ' +
            '(test case id: c206faab-c926-43b8-8e1a-a9cd6f151f94)', async () => {

            const testArgsSpec = [
                jasmineConfRelativeFilePath,
                `--specs=_testData/command/specFinder/**/spec*.js`,
            ];
            const args: minimist.ParsedArgs = require('minimist')(testArgsSpec);


            const testData: TheklaTestData = {
                args: args,
            };

            forked.send(testData);

            return new Promise((resolve, reject) => {
                try {
                    forked.on('message', (specResult: any) => {
                        expect(specResult.failedCount).toEqual(0);
                        expect(specResult.specResults.length).toEqual(2);
                        expect(JSON.stringify(specResult.specResults)).toContain('finding a spec in a subdirectory');
                        expect(JSON.stringify(specResult.specResults)).toContain('finding a spec in the master directory');
                        resolve();
                    });
                } catch (e) {
                    const message = `Error on forked process ${e} ${Error().stack}`;
                    reject(message);
                }
            })
        });

        it('as glob with no existing file, it should not execute any files - ' +
            '(test case id: db991b42-7cc6-43d7-a65d-2b3d12f12377)', () => {
            const testArgsSpec = [
                jasmineConfRelativeFilePath,
                '--specs=dist/spec/_testData/doesNotExist/**/*.js',
            ];
            const args: minimist.ParsedArgs = require('minimist')(testArgsSpec);


            const testData: TheklaTestData = {
                args: args,
            };

            forked.send(testData);

            return new Promise((resolve, reject) => {
                try {
                    forked.on('message', (specResult: any) => {
                        expect(specResult.failedCount).toEqual(0);
                        expect(specResult.specResults.length).toEqual(0);
                        resolve();
                    });
                } catch (e) {
                    const message = `Error on forked process ${e} ${Error().stack}`;
                    reject(message);
                }
            })
        });

        it('as a single file, it should execute this file - ' +
            '(test case id: 477b309b-a655-4a76-860f-871158b2ee95)', async () => {
            const testArgsSpec = [
                jasmineConfRelativeFilePath,
                '--specs=_testData/command/specFinder/spec_master_finder.js',
            ];
            const args: minimist.ParsedArgs = require('minimist')(testArgsSpec);

            const testData: TheklaTestData = {
                args: args,
            };

            forked.send(testData);

            return new Promise((resolve, reject) => {
                try {
                    forked.on('message', (specResult: any) => {
                        expect(specResult.failedCount).toEqual(0);
                        expect(specResult.specResults.length).toEqual(1);
                        expect(JSON.stringify(specResult.specResults)).toContain('finding a spec in the master directory');
                        resolve();
                    });
                } catch (e) {
                    const message = `Error on forked process ${e} ${Error().stack}`;
                    reject(message);
                }
            })
        });

        it('as a single file which does not exist, it should not execute any files - ' +
            '(test case id: 680c6c8c-0efe-42ee-9eb9-626cabbc086d)', () => {
            const testArgsSpec = [
                jasmineConfRelativeFilePath,
                '--specs=_testData/command/specFinder/doesNotExist.js',
            ];
            const args: minimist.ParsedArgs = require('minimist')(testArgsSpec);


            const testData: TheklaTestData = {
                args: args,
            };

            forked.send(testData);

            return new Promise((resolve, reject) => {
                try {
                    forked.on('message', (specResult: any) => {
                        expect(specResult.failedCount).toEqual(0);
                        expect(specResult.specResults.length).toEqual(0);
                        resolve();
                    });
                } catch (e) {
                    const message = `Error on forked process ${e} ${Error().stack}`;
                    reject(message);
                }
            })
        });

        it('as multiple spec file which dont exist, it should not execute any tests - ' +
            '(test case id: f8486901-028a-4637-a3ed-cd1d4643deaa)', () => {
            const testArgsSpec = [
                jasmineConfRelativeFilePath,
                '--specs=_testData/command/specFinder/doesNotExist1.js',
                '--specs=_testData/command/specFinder/doesNotExist2.js'
            ];
            const args: minimist.ParsedArgs = require('minimist')(testArgsSpec);

            const testData: TheklaTestData = {
                args: args,
            };

            forked.send(testData);

            return new Promise((resolve, reject) => {
                try {
                    forked.on('message', (specResult: any) => {
                        expect(specResult.failedCount).toEqual(0);
                        expect(specResult.specResults.length).toEqual(0);
                        resolve();
                    });
                } catch (e) {
                    const message = `Error on forked process ${e} ${Error().stack}`;
                    reject(message);
                }
            })
        });

        it('as multiple spec files where one does not exist, it should execute the existing test - ' +
            '(test case id: 00939ab0-c4b5-4bf9-a3a9-69e470770510)', async () => {
            const testArgsSpec = [
                jasmineConfRelativeFilePath,
                '--specs=_testData/command/specFinder/doesNotExist1.js',
                '--specs=_testData/command/specFinder/spec_master_finder.js'
            ];
            const args: minimist.ParsedArgs = require('minimist')(testArgsSpec);

            const testData: TheklaTestData = {
                args: args,
            };

            forked.send(testData);

            return new Promise((resolve, reject) => {
                try {
                    forked.on('message', (specResult: any) => {
                        expect(specResult.failedCount).toEqual(0);
                        expect(specResult.specResults.length).toEqual(1);
                        expect(JSON.stringify(specResult.specResults)).toContain('finding a spec in the master directory');
                        resolve();
                    });
                } catch (e) {
                    const message = `Error on forked process ${e} ${Error().stack}`;
                    reject(message);
                }
            })
        });

        it('as multiple spec files pointing to the same file, it should execute the test only once - ' +
            '(test case id: 21827abe-7b52-4abe-b77c-3562f6f53e5e)', async () => {
            const testArgsSpec = [
                jasmineConfRelativeFilePath,
                '--specs=_testData/command/specFinder/spec_master_finder.js',
                '--specs=_testData/command/specFinder/spec_master_finder.js'
            ];
            const args: minimist.ParsedArgs = require('minimist')(testArgsSpec);

            const testData: TheklaTestData = {
                args: args,
            };

            forked.send(testData);

            return new Promise((resolve, reject) => {
                try {
                    forked.on('message', (specResult: any) => {
                        expect(specResult.failedCount).toEqual(0);
                        expect(specResult.specResults.length).toEqual(1);
                        expect(JSON.stringify(specResult.specResults)).toContain('finding a spec in the master directory');
                        resolve();
                    });
                } catch (e) {
                    const message = `Error on forked process ${e} ${Error().stack}`;
                    reject(message);
                }
            })
        });

        it('as multiple globs pointing to the same files, it should execute the two existing files - ' +
            '(test case id: 161bb698-e7a8-4896-8bd0-289d9bd5dd79)', async () => {
            const testArgsSpec = [
                jasmineConfRelativeFilePath,
                '--specs=_testData/command/specFinder/**/spec*.js',
                '--specs=_testData/command/specFinder/**/spec*.js',
            ];
            const args: minimist.ParsedArgs = require('minimist')(testArgsSpec);

            const testData: TheklaTestData = {
                args: args,
            };

            forked.send(testData);

            return new Promise((resolve, reject) => {
                try {
                    forked.on('message', (specResult: any) => {
                        expect(specResult.failedCount).toEqual(0);
                        expect(specResult.specResults.length).toEqual(2);
                        expect(JSON.stringify(specResult.specResults)).toContain('finding a spec in a subdirectory');
                        expect(JSON.stringify(specResult.specResults)).toContain('finding a spec in the master directory');
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