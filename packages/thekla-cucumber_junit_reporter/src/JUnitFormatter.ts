// This file will be rewritten so i disable eslint for a while
/* eslint-disable */
import {Formatter, Status} from 'cucumber'
import * as util           from "util";
import {curry}             from "lodash";
import {
    map,
    flow,
    flatten,
    fromPairs,
    compact,
    first,
    intersection,
    last,
    size,
    each
}                          from "lodash/fp";

function getStepLineToKeywordMapFp(gherkinDocument: any) {
    return flow(
        map(`steps`),
        flatten,
        map((step: { [key: string]: any }) => [step.location.line, step.keyword]),
        fromPairs
    )
    (gherkinDocument.feature.children);
}

function getScenarioLineToDescriptionMapFp(gherkinDocument: any) {
    return flow(
        map((element: { [key: string]: any }) => [element.location.line, element.description]),
        fromPairs
    )(gherkinDocument.feature.children);
}

function getStepLineToPickledStepMapFp(pickle: any) {
    return flow(
        map((step: { [key: string]: any }) => [(last(step.locations) as { [key: string]: any }).line, step]),
        fromPairs
    )(pickle.steps)
}

function buildStepArgumentIterator(mapping: any) {
    return function (arg: any) {
        if (arg.hasOwnProperty(`rows`)) {
            return mapping.dataTable(arg);
        } else if (arg.hasOwnProperty(`content`)) {
            return mapping.docString(arg);
        }

        throw new Error(`Unknown argument type:`.concat(util.inspect(arg)));
    };
}

function getScenarioDescriptionFp(_ref: any) {
    const pickle = _ref.pickle,
        scenarioLineToDescriptionMap = _ref.scenarioLineToDescriptionMap;
    return flow(
        map((_ref2: { [key: string]: any }) => scenarioLineToDescriptionMap[_ref2.line]),
        compact,
        first
    )(pickle.location);
}

function getStepKeywordFp(_ref3: any) {
    const pickleStep = _ref3.pickleStep,
        stepLineToKeywordMap = _ref3.stepLineToKeywordMap;

    return flow(
        map((_ref4: { [key: string]: any }) => stepLineToKeywordMap[_ref4.line]),
        compact,
        first
    )
    (pickleStep.locations);
}

/**
 * format the item location information of the feature file
 * @param obj
 * @returns {string}
 */
function formatLocation(obj: any) {
    return ``.concat(obj.uri, `:`).concat(obj.line);
}

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

    const suiteNameMatch = folder.match(/(?<=[\\|\/]+)(.*)(?=[\\|\/]+)/g);
    const suiteName = !suiteNameMatch ? `master` : suiteNameMatch[0].replace(/[\\|\/]+/g, `-`);

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
const createJUnitReportFile = curry(createJUnitFile);


export class JUnitFormatter extends Formatter {
    private builder: any;
    public constructor(options: any) {
        super(options);

        this.builder = require(`junit-report-builder`).newBuilder();

        options.eventBroadcaster.on(`test-run-finished`, this.onTestRunFinished.bind(this))
    }

    public convertNameToId(obj: { name: string }) {
        return obj.name.replace(/ /g, `-`).toLowerCase()
    }

    public formatDataTable(dataTable: { rows: any[] }) {
        return {
            rows: dataTable.rows.map(row => ({cells: map(`value`)(row.cells)}))
        }
    }

    public formatDocString(docString: { [key: string]: any }) {
        return {
            content: docString.content,
            line: docString.location.line
        }
    }

    public formatStepArguments(stepArguments: any) {
        const iterator = buildStepArgumentIterator({
                                                       dataTable: this.formatDataTable.bind(this),
                                                       docString: this.formatDocString.bind(this)
                                                   });
        return map(iterator)(stepArguments)
    }

    public onTestRunFinished() {
        const groupedTestCases: { [key: string]: any } = {};
        // @ts-ignore
        each((testCase: { [key: string]: any }) => {
            const {
                sourceLocation: {uri}
            } = testCase;
            if (!groupedTestCases[uri]) {
                groupedTestCases[uri] = []
            }
            groupedTestCases[uri].push(testCase)
        })
        // @ts-ignore
        (this.eventDataCollector.testCaseMap); // @ts-ignore

        // lodash/fp/map is caped (does not pass the key to the function)
        // to preserve the key set cap to false that key will be passed to the function
        // @ts-ignore
        const cmapfp = map.convert({cap: false});

        // map over every feature file
        cmapfp((group: any, uri: string) => {
            // @ts-ignore
            const gherkinDocument = this.eventDataCollector.gherkinDocumentMap[uri];

            const featureData: { [key: string]: any } = this.getFeatureData(gherkinDocument.feature, uri);

            const stepLineToKeywordMap = getStepLineToKeywordMapFp(gherkinDocument);

            const scenarioLineToDescriptionMap = getScenarioLineToDescriptionMapFp(gherkinDocument);

            group.map((testCase: { sourceLocation: any; steps: any }) => {
                // @ts-ignore
                const {pickle} = this.eventDataCollector.getTestCaseData(
                    testCase.sourceLocation
                );
                const scenarioData: { [key: string]: any } = this.getScenarioData({
                                                                                      featureId: featureData.id,
                                                                                      pickle,
                                                                                      scenarioLineToDescriptionMap
                                                                                  });

                const stepLineToPickledStepMap = getStepLineToPickledStepMapFp(pickle);

                let isBeforeHook = true;

                const scenarioDataSteps = testCase.steps.map((testStep: { sourceLocation: any }) => {
                    isBeforeHook = isBeforeHook && !testStep.sourceLocation;

                    const stepData = this.getStepData({
                                                          isBeforeHook,
                                                          stepLineToKeywordMap,
                                                          stepLineToPickledStepMap,
                                                          testStep
                                                      });

                    return stepData;
                });

                // create test case data in builder
                createJUnitReportFile(this.builder)(featureData.uri)(featureData.name)(scenarioData.name)(scenarioDataSteps)(``);
            });
        })(groupedTestCases);

        // write to file
        this.log(this.builder.build());
    }

    public getFeatureData(feature: any, uri: string) {
        return {
            description: feature.description,
            keyword: feature.keyword,
            name: feature.name,
            line: feature.location.line,
            id: this.convertNameToId(feature),
            tags: this.getTags(feature),
            uri
        }
    }

    public getScenarioData({featureId, pickle, scenarioLineToDescriptionMap}: any) {
        const description = getScenarioDescriptionFp({
                                                         pickle,
                                                         scenarioLineToDescriptionMap
                                                     });
        return {
            description,
            id: `${featureId};${this.convertNameToId(pickle)}`,
            keyword: `Scenario`,
            line: pickle.locations[0].line,
            name: pickle.name,
            tags: this.getTags(pickle),
            type: `scenario`
        }
    }

    public getStepData({
                           isBeforeHook,
                           stepLineToKeywordMap,
                           stepLineToPickledStepMap,
                           testStep
                       }: any) {
        const data: any = {};
        if (testStep.sourceLocation) {
            const {line} = testStep.sourceLocation;
            const pickleStep = stepLineToPickledStepMap[line];
            data.arguments = this.formatStepArguments(pickleStep.arguments);
            data.keyword = getStepKeywordFp({pickleStep, stepLineToKeywordMap});
            // data.keywordFp = getStepKeywordFp({ pickleStep, stepLineToKeywordMap });
            data.line = line;
            data.name = pickleStep.text
        } else {
            data.keyword = isBeforeHook ? `Before` : `After`;
            data.hidden = true
        }
        if (testStep.actionLocation) {
            data.match = {location: formatLocation(testStep.actionLocation)}
        }
        if (testStep.result) {
            const {
                result: {exception, status}
            } = testStep;
            data.result = {status};
            if (testStep.result.duration) {
                data.result.duration = testStep.result.duration * 1000000
            }
            if (status === Status.FAILED && exception) {

                if(exception.message)
                    data.result.error_message = exception.message;
                else
                    data.result.error_message = exception;

                if(exception.stack)
                    data.result.error_stack = exception.stack
            }
        }
        if (size(testStep.attachments) > 0) {
            data.embeddings = testStep.attachments.map((attachment: any) => ({
                data: attachment.data,
                mime_type: attachment.media.type
            }))
        }
        return data
    }

    public getTags(obj: any) {
        return map((tagData: { [key: string]: any }) => ({
            name: tagData.name,
            line: tagData.location.line
        }))(obj.tags)
    }
};