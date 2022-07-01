import {Status} from "cucumber";
import {curry} from "lodash";
import {map} from "lodash/fp";
import path from "path";

export const getSuiteNameFromFolder = (uri: string): string => {

    const suiteNameMatch = uri.match(/[^\/|^\\](.*)[^\/](?=[\/|\\])/g);
    // const suiteNameMatch = uri.match(/(?<=[\\|\/]{0-2})(.*)(?=[\\|\/]+)/g);
    const suiteName = !suiteNameMatch ? `master` : suiteNameMatch[0].replace(/[\\|\/]+/g, `-`);

    return suiteName;
};

/**
 * create the junit xml file
 *
 * @param builder
 * @param {string} folder
 * @param {string} featureName
 * @param {string} scenarioName
 * @param {any[]} steps
 * @param {string} error
 */

export type DocumentResult = {
    "duration": number,
    "status": string,
    "exception": { [key: string]: any }
}

export type FeatureSuiteMapping = {
    suite: string,
    uri: string,
    featureName: string
}

export type SuiteFeatureGroups = Map<string, FeatureSuiteMapping[]>

export const splitInSuiteNameAndUri = (uriList: string[]): FeatureSuiteMapping[] => {
    return map((uri:string) => { return {
        suite: getSuiteNameFromFolder(uri),
        uri: uri,
        featureName: path.basename(uri)}})
    (uriList)
}

/**
 *
 * @param suiteNamesAndUris
 * @return MAP{suiteName}
 */
export const groupSuite = (suiteNamesAndUris: FeatureSuiteMapping[]): SuiteFeatureGroups => {
    return suiteNamesAndUris.reduce((suites:SuiteFeatureGroups, item:FeatureSuiteMapping) => {
        const suiteList: FeatureSuiteMapping[] = suites.get(item.suite) || [];
        suiteList.push(item)
        suites.set(item.suite, suiteList)
        return suites
    }, new Map())
}


const strict = {
    failed: [Status.FAILED, Status.PENDING, Status.UNDEFINED, Status.AMBIGUOUS],
    skipped: [Status.SKIPPED],
    passed: [Status.PASSED]
};

const notStrict = {
    failed: [Status.FAILED, Status.AMBIGUOUS],
    skipped: [Status.PENDING, Status.SKIPPED, Status.UNDEFINED],
    passed: [Status.PASSED]
};


const createJUnitFile = (suite: any, suiteName: string, featureName: string, scenarioName: string, result: DocumentResult, error: string) => {

    const replaceCh = (str: string) => str.replace(/[\s]+/g, `_`).replace(/[.]+/g, `_`);

    const testCase = suite.testCase()
        .className(replaceCh(suiteName) +"." + replaceCh(featureName))
        .name(replaceCh(scenarioName));

    testCase.time(result.duration / 1000000);

    const statusToTest = notStrict;

    if (statusToTest.failed.includes(result.status as Status)) {
        testCase.failure(JSON.stringify(result.exception, null, 2))
        // TODO: add stacktrace information
    } else if (statusToTest.skipped.includes(result.status as Status)) {
        testCase.skipped()
    }
};

export const createJUnitReportFile = curry(createJUnitFile);

// eslint-disable-next-line @typescript-eslint/camelcase
export const __test_gsnff = getSuiteNameFromFolder;