import * as minimist from "minimist";
import {Command}     from "../../lib/command";
import {Thekla}      from "../../lib/thekla";
import test from 'tape';


const testArgs = [
    'dist/spec/_testData/jasmine_config.js',
    '--specs=dist/spec/**/*.js',
];
const args: minimist.ParsedArgs = require('minimist')(testArgs);

const thekla = new Thekla();
const command = new Command(thekla, args);


test('parse glob parameter', async (assert) => {
    const testArgsSpec = [
        'dist/spec/_testData/jasmine_config.js',
        '--specs=dist/spec/_testData/specFinder/**/*.js',
    ];
    const args: minimist.ParsedArgs = require('minimist')(testArgsSpec);

    const actual: string[] = await thekla.processSpecsFromCommandLine(args.specs);
    const expected: string[] = [
        'dist/spec/_testData/specFinder/spec_master_finder.js',
        'dist/spec/_testData/specFinder/subSpec/spec_sub_finder.js' ];

    assert.deepEqual(actual, expected);
    assert.end();
});

test('parse glob parameter which does not return existing files', async (assert) => {
    const testArgsSpec = [
        'dist/spec/_testData/jasmine_config.js',
        '--specs=dist/spec/_testData/doesNotExist/**/*.js',
    ];
    const args: minimist.ParsedArgs = require('minimist')(testArgsSpec);

    thekla.processSpecsFromCommandLine(args.specs)
        .then(() => {
            assert.isEqual(true, false, "no Error is thrown when no spec matches the glob");
            assert.end();
        }).catch((e: string) => {
            assert.isEqual(e.includes("no files found: dist/spec/_testData/doesNotExist/**/*.js"), true, "Error does not contain 'Not Found' Info");
            assert.end();
        });
});

test('parse a single test file', async (assert) => {
    const testArgsSpec = [
        'dist/spec/_testData/jasmine_config.js',
        '--specs=dist/spec/_testData/specFinder/spec_master_finder.js',
    ];
    const args: minimist.ParsedArgs = require('minimist')(testArgsSpec);

    const actual: string[] = await thekla.processSpecsFromCommandLine(args.specs);
    const expected: string[] = ["dist/spec/_testData/specFinder/spec_master_finder.js"];

    assert.deepEqual(actual, expected);
    assert.end();
});

test('parse a single test file which does not exist', async (assert) => {
    const testArgsSpec = [
        'dist/spec/_testData/jasmine_config.js',
        '--specs=dist/spec/_testData/specFinder/doesNotExist.js',
    ];
    const args: minimist.ParsedArgs = require('minimist')(testArgsSpec);

    thekla.processSpecsFromCommandLine(args.specs)
        .then(() => {
            assert.isEqual(true, false, "no Error is thrown when no spec matches the glob");
            assert.end();
        }).catch((e: string) => {
            assert.isEqual(e.includes("no files found: dist/spec/_testData/specFinder/doesNotExist.js"), true, "Error does not contain 'Not Found Info'");
            assert.end();
        });
});

test('parse multiple specs options which dont exist', async (assert) => {
    const testArgsSpec = [
        'dist/spec/_testData/jasmine_config.js',
        '--specs=dist/spec/_testData/specFinder/doesNotExist1.js',
        '--specs=dist/spec/_testData/specFinder/doesNotExist2.js'
    ];
    const args: minimist.ParsedArgs = require('minimist')(testArgsSpec);

    thekla.processSpecsFromCommandLine(args.specs)
        .then(() => {
            assert.isEqual(true, false, "no Error is thrown when no spec matches the glob");
            assert.end();
        }).catch((e: string) => {
            assert.isEqual(e.includes("no files found: dist/spec/_testData/specFinder/doesNotExist1.js,dist/spec/_testData/specFinder/doesNotExist2.js"),
                true,
                `Error does not contain correct 'Not Found Info' it is: ${e}`);
            assert.end();
        });
});

test('parse multiple specs options where only one spec exists', async (assert) => {
    const testArgsSpec = [
        'dist/spec/_testData/jasmine_config.js',
        '--specs=dist/spec/_testData/specFinder/doesNotExist1.js',
        '--specs=dist/spec/_testData/specFinder/spec_master_finder.js'
    ];
    const args: minimist.ParsedArgs = require('minimist')(testArgsSpec);

    const actual: string[] = await thekla.processSpecsFromCommandLine(args.specs);
    const expected: string[] = ['dist/spec/_testData/specFinder/spec_master_finder.js'];

    assert.deepEqual(actual, expected);
    assert.end();
});

test('parse multiple specs options where only a single file exists', async (assert) => {
    const testArgsSpec = [
        'dist/spec/_testData/jasmine_config.js',
        '--specs=dist/spec/_testData/specFinder/spec_master_finder.js',
        '--specs=dist/spec/_testData/specFinder/spec_master_finder.js'
    ];
    const args: minimist.ParsedArgs = require('minimist')(testArgsSpec);

    const actual: string[] = await thekla.processSpecsFromCommandLine(args.specs);
    const expected: string[] = ['dist/spec/_testData/specFinder/spec_master_finder.js'];

    assert.deepEqual(actual, expected);
    assert.end();
});

test('parse multiple specs options for multiple glob options for the same amount of files', async (assert) => {
    const testArgsSpec = [
        'dist/spec/_testData/jasmine_config.js',
        '--specs=dist/spec/_testData/specFinder/**/*.js',
        '--specs=dist/spec/_testData/specFinder/**/*.js',
    ];
    const args: minimist.ParsedArgs = require('minimist')(testArgsSpec);

    const actual: string[] = await thekla.processSpecsFromCommandLine(args.specs);
    const expected: string[] = [
        'dist/spec/_testData/specFinder/spec_master_finder.js',
        'dist/spec/_testData/specFinder/subSpec/spec_sub_finder.js'];

    assert.deepEqual(actual, expected);
    assert.end();
});