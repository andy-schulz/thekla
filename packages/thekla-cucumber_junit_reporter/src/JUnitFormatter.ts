// This file will be rewritten so i disable eslint for a while
/* eslint-disable */
import {Formatter, Status} from 'cucumber'
import {map, size, each}   from "lodash/fp";
import {
    buildStepArgumentIterator,
    createJUnitReportFile, formatLocation, getScenarioDescriptionFp,
    getScenarioLineToDescriptionMapFp, getStepKeywordFp,
    getStepLineToKeywordMapFp,
    getStepLineToPickledStepMapFp
}                          from "./JUnitFormatterUtils";


export default class JUnitFormatter extends Formatter {
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

                if (exception.message)
                    data.result.error_message = exception.message;
                else
                    data.result.error_message = exception;

                if (exception.stack)
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

    public static formatterLocation(): string {
        return __filename;
    }
};