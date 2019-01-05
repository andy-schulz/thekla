import fsExtra       from "fs-extra";
import * as minimist from "minimist";
import {Command}     from "../../lib/command";
import {Thekla}      from "../../lib/thekla";

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
    let thekla: Thekla;
    let command: Command;

    beforeAll(async () => {
        await fsExtra.outputFile(masterSpecFilePath, masterSpecContent);
        await fsExtra.outputFile(subSpecFilePath, subSpecContent);
        await fsExtra.outputFile(jasmineConfFilePath, jasmineConfContent);

        const testArgs = [
            `${jasmineConfRelativeFilePath}`,
        ];
        const args: minimist.ParsedArgs = require('minimist')(testArgs);
        thekla = new Thekla();
        command = new Command(thekla, args);

    });

    afterAll(async () => {
        await fsExtra.remove(specFinderAbsoluteDir);
    });

    describe('by command line',() => {
        it('as a glob, two files should be found - ' +
            '(test case id: c206faab-c926-43b8-8e1a-a9cd6f151f94)', async () => {
            const testArgsSpec = [
                '--specs=_testData/command/specFinder/**/spec*.js',
            ];
            const args: minimist.ParsedArgs = require('minimist')(testArgsSpec);

            const actual: string[] = await thekla.processSpecsFromCommandLine(args.specs);
            const expected: string[] = [
                '_testData/command/specFinder/spec_master_finder.js',
                '_testData/command/specFinder/subSpec/spec_sub_finder.js' ];

            expect(actual).toEqual(expected);
        });

        it('as glob with no existing file, it should return an empty array - ' +
            '(test case id: db991b42-7cc6-43d7-a65d-2b3d12f12377)', () => {
            const testArgsSpec = [
                '--specs=dist/spec/_testData/doesNotExist/**/*.js',
            ];
            const args: minimist.ParsedArgs = require('minimist')(testArgsSpec);

            return thekla.processSpecsFromCommandLine(args.specs)
                .then((specArray: string[]) => {
                    expect(specArray).toEqual([]);
                })
        });

        it('as a single file, it should return this file - ' +
            '(test case id: 477b309b-a655-4a76-860f-871158b2ee95)', async () => {
            const testArgsSpec = [
                '--specs=_testData/command/specFinder/spec_master_finder.js',
            ];
            const args: minimist.ParsedArgs = require('minimist')(testArgsSpec);

            const actual: string[] = await thekla.processSpecsFromCommandLine(args.specs);
            const expected: string[] = ["_testData/command/specFinder/spec_master_finder.js"];
            expect(expected).toEqual(actual);
        });

        it('as a single file which does not exist, it should return an empty spec array - ' +
            '(test case id: 680c6c8c-0efe-42ee-9eb9-626cabbc086d)', () => {
            const testArgsSpec = [
                '--specs=_testData/command/specFinder/doesNotExist.js',
            ];
            const args: minimist.ParsedArgs = require('minimist')(testArgsSpec);

            thekla.processSpecsFromCommandLine(args.specs)
                .then((specArray: string[]) => {
                    expect(specArray).toEqual([])
                })
        });

        it('as multiple spec file which dont exist, it should return an empty spec array - ' +
            '(test case id: f8486901-028a-4637-a3ed-cd1d4643deaa)', () => {
            const testArgsSpec = [
                '--specs=_testData/command/specFinder/doesNotExist1.js',
                '--specs=_testData/command/specFinder/doesNotExist2.js'
            ];
            const args: minimist.ParsedArgs = require('minimist')(testArgsSpec);

            thekla.processSpecsFromCommandLine(args.specs)
                .then((specArray: string[]) => {
                    expect(specArray).toEqual([])
                })
        });

        it('as multiple spec files where one does not exist, it should return a spec array with the existing spec file - ' +
            '(test case id: 00939ab0-c4b5-4bf9-a3a9-69e470770510)', async () => {
            const testArgsSpec = [
                '--specs=_testData/command/specFinder/doesNotExist1.js',
                '--specs=_testData/command/specFinder/spec_master_finder.js'
            ];
            const args: minimist.ParsedArgs = require('minimist')(testArgsSpec);

            const actual: string[] = await thekla.processSpecsFromCommandLine(args.specs);
            const expected: string[] = ['_testData/command/specFinder/spec_master_finder.js'];

            expect(actual).toEqual(expected);
        });

        it('as multiple spec files pointing to the same file, it should return a spec array with the existing file - ' +
            '(test case id: 21827abe-7b52-4abe-b77c-3562f6f53e5e)', async () => {
            const testArgsSpec = [
                '--specs=_testData/command/specFinder/spec_master_finder.js',
                '--specs=_testData/command/specFinder/spec_master_finder.js'
            ];
            const args: minimist.ParsedArgs = require('minimist')(testArgsSpec);

            const actual: string[] = await thekla.processSpecsFromCommandLine(args.specs);
            const expected: string[] = ['_testData/command/specFinder/spec_master_finder.js'];

            expect(actual).toEqual(expected);
        });

        it('as multiple globs pointing to the same files, it should return a spec array containing the existing files - ' +
            '(test case id: 161bb698-e7a8-4896-8bd0-289d9bd5dd79)', async () => {
            const testArgsSpec = [
                '--specs=_testData/command/specFinder/**/spec*.js',
                '--specs=_testData/command/specFinder/**/spec*.js',
            ];
            const args: minimist.ParsedArgs = require('minimist')(testArgsSpec);

            const actual: string[] = await thekla.processSpecsFromCommandLine(args.specs);
            const expected: string[] = [
                '_testData/command/specFinder/spec_master_finder.js',
                '_testData/command/specFinder/subSpec/spec_sub_finder.js'];

            expect(actual).toEqual(expected);
        });
    });
});