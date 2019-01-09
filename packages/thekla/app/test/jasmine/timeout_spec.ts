import * as child     from 'child_process';
import fsExtra        from "fs-extra";
import * as minimist  from "minimist";
import {TheklaConfig} from "../../lib/config/TheklaConfig";

const testArgs: string[] = [];
const args: minimist.ParsedArgs = require('minimist')(testArgs);

import {TheklaTestData} from './client';

const spec_timeout_wait_for_10000ms = `
"use strict";
describe('timeout a spec', () => {
    it('in the master directory', (done) => {
        const prom = new Promise((fulfill, reject) => {
            setTimeout(fulfill, 10000);
        });
        prom.then(() => {
            done();
        });
    });
});
`;


describe('Setting the Timeout', () => {
    let forked: child.ChildProcess;
    let testPath: string = "";

    const prepareFiles = async function(name: string, path: string, content: string): Promise<string> {
        const baseName = name;
        const featureFileName = `${baseName}_specFile.js`;
        const featureFilePath = `${path}/${featureFileName}`;
        await fsExtra.outputFile(featureFilePath, content);

        return Promise.resolve(featureFilePath);
    };

    beforeEach(() => {
        forked = child.fork(`${__dirname}/client.js`, [], {stdio: "ignore"});
        const date = (new Date()).getTime();
        const cwd = process.cwd();
        testPath = `${cwd}/_testData/jasmine/${date}`;
    });

    afterEach(() => {
        forked.kill();
        fsExtra.remove(testPath);
    });

    it('to 1000ms the test case should time out after this time - (test case id: e1ae8747-345e-459d-89c3-8530d41423a6)', async () => {
        const specFile = "Wait1000msTestFile";
        const filePath: string = await prepareFiles(specFile, testPath, spec_timeout_wait_for_10000ms);

        const testConfig: TheklaConfig =  {
            testFramework: {
                frameworkName: "jasmine",
                jasmineOptions: {
                    defaultTimeoutInterval: 1000
                }
            }
        };

        const testData: TheklaTestData = {
            config: testConfig,
            specs: filePath
        };

        forked.send(testData);

        return new Promise((resolve, reject) => {
            forked.on('message', (specResult: any) => {
                expect(specResult.failedCount).toEqual(1);
                expect(specResult.specResults[0].duration).toBeGreaterThanOrEqual(1000);
                expect(specResult.specResults[0].duration).toBeLessThanOrEqual(1100);

                resolve();
            });
        })
    });

    it('to 5000ms the test case should time out after this time - (test case id: )', async () => {
        const specFile = "Wait5000msTestFile";
        const filePath: string = await prepareFiles(specFile, testPath, spec_timeout_wait_for_10000ms);

        const testConfig: TheklaConfig =  {
            testFramework: {
                frameworkName: "jasmine",
            }
        };

        const testData: TheklaTestData = {
            config: testConfig,
            specs: filePath
        };

        forked.send(testData);

        return new Promise((resolve, reject) => {
            forked.on('message', (specResult: any) => {
                expect(specResult.failedCount).toEqual(1);
                expect(specResult.specResults[0].duration).toBeGreaterThanOrEqual(5000);
                expect(specResult.specResults[0].duration).toBeLessThanOrEqual(5100);

                resolve();
            });
        })
    },10000);
});