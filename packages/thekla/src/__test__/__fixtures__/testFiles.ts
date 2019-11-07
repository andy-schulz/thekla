import fsExtra        from "fs-extra";
import {TheklaConfig} from "@thekla/config";

export  const simpleFeatureTestFileContent =
`Feature: Simple Feature File

Test the feature Files

    @Simple @Cucumber @Focus
    Scenario: Simple Search
        Given I search
        When I type it in
        Then it should appear
`;

export const simpleStepDefinitionFileContent =
`const { Given, When, Then } = require('cucumber')
           
Given(/^I search$/, function() {});
When(/^I type it in$/, function() {return Promise.resolve()});
Then(/^it should appear$/, function() {return Promise.resolve()});
`;

export const worldParameterStepDefinitionFileContent = (parameter: string) => `
const assert = require('assert');
const { Given, When, Then } = require('cucumber')
           
Given(/^I search$/, function() {
    const exp = ${parameter};
    assert.deepStrictEqual(this.parameters, exp);
});
When(/^I type it in$/, function() {return Promise.resolve()});
Then(/^it should appear$/, function() {return Promise.resolve()});
`;

export const exampleFeatureTestFileContent =
`Feature: Example Feature File

  Test that Thekla can execute tests with cucumber

  @Example @Cucumber
  Scenario: Simple Example
    Given I want to use thekla with cucumber
    When I start thekla
    Then I should see 3 console logs
`;

export const exampleStepDefinitionFileContent =
`const { Given, When, Then } = require('cucumber');

Given(/^I want to use thekla with cucumber$/, function() {
    console.log("GIVEN Step executed!");
    return Promise.resolve();
});
When(/^I start thekla$/, function() {
    console.log("WHEN Step executed!");
    return Promise.resolve()
});

Then(/^I should see 3 console logs$/, function() {
    console.log("THEN Step executed!");
    return Promise.resolve()
});
`;

export const specTimeoutWaitFor10000ms = `
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

export const createTheklaGlobalSpec = (expected: string) => {
    return `
"use strict";
describe('Thekla globals', () => {
    it('Should be accessible inside a spec', () => {
        const exp = ${expected};
        let th = thekla;
        th.config.specs = [""]; // remove specs from config as its given by command line not by config
        expect(th.config).toEqual(exp);
    });
});
`
};

const cwd = process.cwd();
export const baseRelativeCucumberTestDir = `_testData/cucumber/`;
export const baseRelativeJasmineTestDir = `_testData/jasmine/`;
export const baseAbsoluteCucumberTestDir = `${cwd}/${baseRelativeCucumberTestDir}`;
export const baseAbsoluteJasmineTestDir = `${cwd}/${baseRelativeJasmineTestDir}`;

// eslint-disable-next-line
export const getDynamicTestDir = (type: "cucumber" | "jasmine" = "cucumber") => {
  const date = new Date().getTime();

  if(type === `cucumber`) {
      return {timeStampDir: `${date}`, absolute: `${baseAbsoluteCucumberTestDir}/${date}/`, relative: `${baseRelativeCucumberTestDir}/${date}/`};
  } else {
      return {timeStampDir: `${date}`, absolute: `${baseAbsoluteJasmineTestDir}/${date}/`, relative: `${baseRelativeJasmineTestDir}/${date}/`};
  }
};

// eslint-disable-next-line
type TestFileType = "simple" | "example" | "worldParameter";

const featureFileStdName = `FeatureTestFile.feature`;
const stepDefinitionFileStdName = `StepDefinitionFile.js`;
const confFileStdName = `_conf.js`;

const getFeatureFileContent = (fileType: string) => {
    if(fileType === `simple`) {
        return simpleFeatureTestFileContent;
    } else if (fileType === `example`) {
        return exampleFeatureTestFileContent;
    } else {
        throw new Error(`File with TestFileType: ${fileType} does not exist.`);
    }
};

const getStepDefinitionFileContent = (fileType: string, param = ``) => {
  if(fileType === `simple`) {
    return simpleStepDefinitionFileContent;
  } else if (fileType === `example`) {
    return exampleStepDefinitionFileContent;
  } else if (fileType === `worldParameter`) {
      return worldParameterStepDefinitionFileContent(param);
  } else {
    throw new Error(`File with TestFileType: ${fileType} does not exist.`);
  }
};

export interface JasmineTestFileResult {
    baseDir: string;
    specFilePath: string;
    relativeSpecFilePath: string;
}

export const createJasmineTestFiles = async function(name: string, path: string, content: string): Promise<JasmineTestFileResult> {

    const testPath = getDynamicTestDir(`jasmine`);

    const specFileName = `${name}_specFile.js`;
    const absolutSpecFilePath = path ? `${testPath.absolute}/${path}/${specFileName}` : `${testPath.absolute}/${specFileName}`;
    const relativeSpecFilePath = path ? `${testPath.relative}/${path}/${specFileName}` : `${testPath.relative}/${specFileName}`;
    await fsExtra.outputFile(absolutSpecFilePath, content);

    const result: JasmineTestFileResult = {
        baseDir: testPath.absolute,
        specFilePath: absolutSpecFilePath,
        relativeSpecFilePath: relativeSpecFilePath
    };

    return Promise.resolve(result);
};

export interface CucumberTestFileResult {
    timeStampDir: string;
    baseDir: string;
    featureFilePath: string;
    relativeFeatureFilePath: string;
    stepDefinitionFilePath: string;
    relativeStepDefinitionFilePath: string;
}

export const createCucumberTestFiles = async (
    fileType: TestFileType,
    featurePath: string,
    stepPath: string,
    fileBaseName: string,
    param = ``): Promise<CucumberTestFileResult> => {

    const fileTypes: Map<TestFileType, TestFileType[]> = new Map();
    fileTypes.set(`simple`, [`simple`, `simple`]);
    fileTypes.set(`example`, [`example`, `example`]);
    fileTypes.set(`worldParameter`, [`simple`, `worldParameter`]);

    const result: CucumberTestFileResult = {
        timeStampDir: ``,
        baseDir: ``,
        featureFilePath: ``,
        relativeFeatureFilePath: ``,
        stepDefinitionFilePath: ``,
        relativeStepDefinitionFilePath: ``
    };

    const testPath = getDynamicTestDir();

    result.timeStampDir = testPath.timeStampDir;
    result.baseDir = testPath.absolute;
    const featureFileFullPath = `${testPath.absolute}/${featurePath}/${fileBaseName}${featureFileStdName}`;
    const featureFileRelativePath = `${testPath.relative}/${featurePath}/${fileBaseName}${featureFileStdName}`;
    result.featureFilePath = featureFileFullPath;
    result.relativeFeatureFilePath = featureFileRelativePath;

    const newStepPath = stepPath ? stepPath : featurePath;

    const stepDefinitionFileFullPath = `${testPath.absolute}/${newStepPath}/step_definition/${fileBaseName}${stepDefinitionFileStdName}`;
    const stepDefinitionFileRelativePath = `${testPath.relative}/${newStepPath}/step_definition/${fileBaseName}${stepDefinitionFileStdName}`;
    result.stepDefinitionFilePath = stepDefinitionFileFullPath;
    result.relativeStepDefinitionFilePath = stepDefinitionFileRelativePath;

    const ft = fileTypes.get(fileType);
    if(ft !== undefined) {
        await fsExtra.outputFile(featureFileFullPath, getFeatureFileContent(ft[0]));
        await fsExtra.outputFile(stepDefinitionFileFullPath, getStepDefinitionFileContent(ft[1],param));
    } else {
        Promise.reject(`Error creating files.`)
    }

    return Promise.resolve(result);
};

export interface TheklaConfigFileResult {
    baseDir: string;
    confFilePath: string;
    relativeConfFilePath: string;
}

export const createTheklaConfigFile = async (config: TheklaConfig, fileBaseName: string): Promise<TheklaConfigFileResult> => {
    const result: TheklaConfigFileResult =  {
        baseDir: ``,
        confFilePath: ``,
        relativeConfFilePath: ``
    };

    const confContent = `exports.config = ${JSON.stringify(config, null, `\t`)};`;

    const testPath = getDynamicTestDir();
    result.baseDir = testPath.absolute;

    const confFileFullPath = `${testPath.absolute}/${fileBaseName}${confFileStdName}`;
    const confFileRelativePath = `${testPath.relative}/${fileBaseName}${confFileStdName}`;
    result.confFilePath = confFileFullPath;
    result.relativeConfFilePath = confFileRelativePath;

    await fsExtra.outputFile(confFileFullPath, confContent);

    return Promise.resolve(result);
};