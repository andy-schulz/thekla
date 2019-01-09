import fsExtra        from "fs-extra";
import {TheklaConfig} from "../../lib/config/TheklaConfig";

export  const simpleFeatureTestFileContent =
`Feature: Simple Feature File

Test the feature Files

    @Simple @Cucumber
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


export const spec_timeout_wait_for_10000ms = `
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

const cwd = process.cwd();
export const baseRelativeCucumberTestDir = `_testData/cucumber/`;
export const baseRelativeJasmineTestDir = `_testData/jasmine/`;
export const baseAbsoluteCucumberTestDir = `${cwd}/${baseRelativeCucumberTestDir}`;
export const baseAbsoluteJasmineTestDir = `${cwd}/${baseRelativeJasmineTestDir}`;

export const getDynamicTestDir = (type: "cucumber" | "jasmine" = "cucumber") => {
  const date = new Date().getTime();


  if(type === "cucumber") {
      return {absolute: `${baseAbsoluteCucumberTestDir}/${date}/`, relative: `${baseRelativeCucumberTestDir}/${date}/`};
  } else {
      return {absolute: `${baseAbsoluteJasmineTestDir}/${date}/`, relative: `${baseRelativeJasmineTestDir}/${date}/`};
  }
};

type TestFileType = "simple" | "example";

const featureFileStdName = `FeatureTestFile.feature`;
const stepDefinitionFileStdName = `StepDefinitionFile.js`;
const confFileStdName = `_conf.js`;

const getFeatureFileContent = (fileType: TestFileType) => {
    if(fileType === "simple") {
        return simpleFeatureTestFileContent;
    } else if (fileType === "example") {
        return exampleFeatureTestFileContent;
    } else {
        throw new Error(`File with TestFileType: ${fileType} does not exist.`);
    }
};

const getStepDefinitionFileContent = (fileType: TestFileType) => {
  if(fileType === "simple") {
    return simpleStepDefinitionFileContent;
  } else if (fileType === "example") {
    return exampleStepDefinitionFileContent;
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
    let result: JasmineTestFileResult;

    const testPath = getDynamicTestDir("jasmine");

    const specFileName = `${name}_specFile.js`;
    const absolutSpecFilePath = path ? `${testPath.absolute}/${path}/${specFileName}` : `${testPath.absolute}/${specFileName}`;
    const relativeSpecFilePath = path ? `${testPath.relative}/${path}/${specFileName}` : `${testPath.relative}/${specFileName}`;
    await fsExtra.outputFile(absolutSpecFilePath, content);

    result = {
        baseDir: testPath.absolute,
        specFilePath: absolutSpecFilePath,
        relativeSpecFilePath: relativeSpecFilePath
    };

    return Promise.resolve(result);
};

export interface CucumberTestFileResult {
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
    fileBaseName: string): Promise<CucumberTestFileResult> => {

    const result: CucumberTestFileResult = {
        baseDir: ``,
        featureFilePath: ``,
        relativeFeatureFilePath: ``,
        stepDefinitionFilePath: ``,
        relativeStepDefinitionFilePath: ``
    };

    const testPath = getDynamicTestDir();

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

    await fsExtra.outputFile(featureFileFullPath, getFeatureFileContent(fileType));
    await fsExtra.outputFile(stepDefinitionFileFullPath, getStepDefinitionFileContent(fileType));

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

    const confContent: string = `exports.config = ${JSON.stringify(config, null, '\t')};`;

    const testPath = getDynamicTestDir();
    result.baseDir = testPath.absolute;

    const confFileFullPath = `${testPath.absolute}/${fileBaseName}${confFileStdName}`;
    const confFileRelativePath = `${testPath.relative}/${fileBaseName}${confFileStdName}`;
    result.confFilePath = confFileFullPath;
    result.relativeConfFilePath = confFileRelativePath;

    await fsExtra.outputFile(confFileFullPath, confContent);

    return Promise.resolve(result);
};