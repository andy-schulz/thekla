import {Status}                                                            from "cucumber";
import {compact, first, flatten, flow, fromPairs, intersection, last, map} from "lodash/fp";
import * as util                                                           from "util";
import {curry}                                                             from "lodash";

export const getStepLineToKeywordMapFp = (gherkinDocument: any) => {
    return flow(
        map(`steps`),
        flatten,
        map((step: { [key: string]: any }) => [step.location.line, step.keyword]),
        fromPairs
    )
    (gherkinDocument.feature.children);
};

export const getScenarioLineToDescriptionMapFp = (gherkinDocument: any) => {
    return flow(
        map((element: { [key: string]: any }) => [element.location.line, element.description]),
        fromPairs
    )(gherkinDocument.feature.children);
};

export const getStepLineToPickledStepMapFp = (pickle: any) => {
    return flow(
        map((step: { [key: string]: any }) => [(last(step.locations) as { [key: string]: any }).line, step]),
        fromPairs
    )(pickle.steps)
};

export const buildStepArgumentIterator = (mapping: any) => {
    return function (arg: any) {
        if (arg.hasOwnProperty(`rows`)) {
            return mapping.dataTable(arg);
        } else if (arg.hasOwnProperty(`content`)) {
            return mapping.docString(arg);
        }

        throw new Error(`Unknown argument type:`.concat(util.inspect(arg)));
    };
};

export const getScenarioDescriptionFp = (_ref: any) => {
    const pickle = _ref.pickle,
        scenarioLineToDescriptionMap = _ref.scenarioLineToDescriptionMap;
    return flow(
        map((_ref2: { [key: string]: any }) => scenarioLineToDescriptionMap[_ref2.line]),
        compact,
        first
    )(pickle.location);
};

export const getStepKeywordFp = (_ref3: any) => {
    const pickleStep = _ref3.pickleStep,
        stepLineToKeywordMap = _ref3.stepLineToKeywordMap;

    return flow(
        map((_ref4: { [key: string]: any }) => stepLineToKeywordMap[_ref4.line]),
        compact,
        first
    )
    (pickleStep.locations);
};

/**
 * format the item location information of the feature file
 * @param obj
 * @returns {string}
 */
export const formatLocation = (obj: any): string=> {
    return ``.concat(obj.uri, `:`).concat(obj.line);
};

const getSuiteNameFromFolder = (uri: string): string => {

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
const createJUnitFile = (builder: any, folder: string, featureName: string, scenarioName: string, steps: any[], error: string) => {

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

    const suiteName = getSuiteNameFromFolder(folder);

    const suite = builder.testSuite().name(suiteName);
    const testCase = suite.testCase()
                          .className(suiteName + `.` + featureName
                              .replace(/[\s]+/g, `_`)
                              .replace(/[.]+/g, `_`))
                          .name(scenarioName
                                    .replace(/[\s]+/g, `_`)
                                    .replace(/[.]+/g, `_`));

    // create the result lists
    const results = flow(map(`result`), flatten)(steps);
    const resultsWithoutHooks = flow(
        map((step: { [key: string]: any }) => step.hidden ? [] : [step]),
        flatten,
        map(`result`),
        flatten)(steps);

    // calculate test case duration
    const duration = flow(map(`duration`), flatten)(resultsWithoutHooks);
    const sumDuration = duration.reduce((acc, elem) => elem ? acc + elem : acc, 0) / 1000000000;
    testCase.time(sumDuration);

    // calculate test case status
    const status = flow(
        map(`status`),
        flatten)(results);

    // get the error message from the test steps
    const errorMessages = flow(
        map(`error_message`),
        flatten)(results);

    const statusToTest = notStrict;
    if (intersection(status)(statusToTest.failed).length > 0) {
        testCase.failure(errorMessages.toString())
        // TODO: add stacktrace information
    } else if (intersection(status)(statusToTest.skipped).length > 0) {
        testCase.skipped()
    }
};

export const createJUnitReportFile = curry(createJUnitFile);

// eslint-disable-next-line @typescript-eslint/camelcase
export const __test_gsnff = getSuiteNameFromFolder;