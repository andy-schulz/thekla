import * as minimist from "minimist";
import {Command}     from "../../lib/command";
import {Thekla}      from "../../lib/thekla";
import test from 'tape';


const testArgs = [
    'dist/spec/config.js',
    '--specs=dist/spec/**/*.js',
];
const args: minimist.ParsedArgs = require('minimist')(testArgs);

const thekla = new Thekla();
const command = new Command(thekla, args);


test('parse glob parameter', (assert) => {
    const testArgsSpec = [
        'dist/spec/config.js',
        '--specs=dist/spec/testData/specFinder/**/*.js',
    ];
    const args: minimist.ParsedArgs = require('minimist')(testArgsSpec);

    const actual: string[] = command.processSpecs(args);
    const expected: string[] = [
        'dist/spec/testData/specFinder/spec_master_finder.js',
        'dist/spec/testData/specFinder/subSpec/spec_sub_finder.js' ];

    assert.deepEqual(actual, expected);
    assert.end();
});

test('parse glob parameter which does not return existing files', (assert) => {
    const testArgsSpec = [
        'dist/spec/config.js',
        '--specs=dist/spec/testData/doesNotExist/**/*.js',
    ];
    const args: minimist.ParsedArgs = require('minimist')(testArgsSpec);

    const actual: string[] = command.processSpecs(args);
    const expected: string[] = [];

    assert.deepEqual(actual, expected);
    assert.end();
});

test('parse a single test file', (assert) => {
    const testArgsSpec = [
        'dist/spec/config.js',
        '--specs=dist/spec/testData/specFinder/spec_master_finder.js',
    ];
    const args: minimist.ParsedArgs = require('minimist')(testArgsSpec);

    const actual: string[] = command.processSpecs(args);
    const expected: string[] = ["dist/spec/testData/specFinder/spec_master_finder.js"];

    assert.deepEqual(actual, expected);
    assert.end();
});

test('parse a single test file which does not exist', (assert) => {
    const testArgsSpec = [
        'dist/spec/config.js',
        '--specs=dist/spec/testData/specFinder/doesNotExist.js',
    ];
    const args: minimist.ParsedArgs = require('minimist')(testArgsSpec);

    const actual: string[] = command.processSpecs(args);
    const expected: string[] = [];

    assert.deepEqual(actual, expected);
    assert.end();
});

test('parse multiple specs options which dont exist', (assert) => {
    const testArgsSpec = [
        'dist/spec/config.js',
        '--specs=dist/spec/testData/specFinder/doesNotExist1.js',
        '--specs=dist/spec/testData/specFinder/doesNotExist2.js'
    ];
    const args: minimist.ParsedArgs = require('minimist')(testArgsSpec);

    const actual: string[] = command.processSpecs(args);
    const expected: string[] = [];

    assert.deepEqual(actual, expected);
    assert.end();
});

test('parse multiple specs options where only one spec exists', (assert) => {
    const testArgsSpec = [
        'dist/spec/config.js',
        '--specs=dist/spec/testData/specFinder/doesNotExist1.js',
        '--specs=dist/spec/testData/specFinder/spec_master_finder.js'
    ];
    const args: minimist.ParsedArgs = require('minimist')(testArgsSpec);

    const actual: string[] = command.processSpecs(args);
    const expected: string[] = ['dist/spec/testData/specFinder/spec_master_finder.js'];

    assert.deepEqual(actual, expected);
    assert.end();
});

test('parse multiple specs options where only a single file exists', (assert) => {
    const testArgsSpec = [
        'dist/spec/config.js',
        '--specs=dist/spec/testData/specFinder/spec_master_finder.js',
        '--specs=dist/spec/testData/specFinder/spec_master_finder.js'
    ];
    const args: minimist.ParsedArgs = require('minimist')(testArgsSpec);

    const actual: string[] = command.processSpecs(args);
    const expected: string[] = ['dist/spec/testData/specFinder/spec_master_finder.js'];

    assert.deepEqual(actual, expected);
    assert.end();
});

test('parse multiple specs options for multiple glob options for the same amount of files', (assert) => {
    const testArgsSpec = [
        'dist/spec/config.js',
        '--specs=dist/spec/testData/**/*.js',
        '--specs=dist/spec/testData/**/*.js',
    ];
    const args: minimist.ParsedArgs = require('minimist')(testArgsSpec);

    const actual: string[] = command.processSpecs(args);
    const expected: string[] = [
        'dist/spec/testData/specFinder/spec_master_finder.js',
        'dist/spec/testData/specFinder/subSpec/spec_sub_finder.js'];

    assert.deepEqual(actual, expected);
    assert.end();
});