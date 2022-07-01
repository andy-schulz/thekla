// This file will be rewritten so i disable eslint for a while
/* eslint-disable */
import {Formatter} from 'cucumber'
import {map} from "lodash/fp";
import {
    createJUnitReportFile,
    getSuiteNameFromFolder,
    groupSuite,
    splitInSuiteNameAndUri,
    FeatureSuiteMapping,
    SuiteFeatureGroups
} from "./JUnitFormatterUtils";
import {filter, flow, uniq} from "lodash";


export default class JUnitFormatter extends Formatter {
    private builder: any;

    public constructor(options: any) {
        super(options);

        this.builder = require(`junit-report-builder`).newBuilder();

        options.eventBroadcaster.on(`test-run-finished`, this.onTestRunFinished.bind(this))
    }

    public formatDataTable(dataTable: { rows: any[] }) {
        return {
            rows: dataTable.rows.map(row => ({cells: map(`value`)(row.cells)}))
        }
    }

    public onTestRunFinished() {

        // @ts-ignore
        const attempts: [{ [key: string]: any }] = this.eventDataCollector.getTestCaseAttempts();

        const suites: SuiteFeatureGroups = flow(
            map((result: any) => result.gherkinDocument.uri),
            uniq,
            splitInSuiteNameAndUri,
            groupSuite)(attempts);

        suites.forEach((features: FeatureSuiteMapping[], key: string) => {

            map((feature: FeatureSuiteMapping) => {
                const suiteName = key;
                const suite = this.builder.testSuite().name(suiteName + "." + feature.featureName.replace(".feature", ""));

                suite.property("URI", feature.uri)

                filter(attempts, (attempt: any) => attempt.gherkinDocument.uri === feature.uri)
                    .forEach((result: any) => {

                        map((tag: any) => tag.name)(result.pickle.tags)

                        createJUnitReportFile(suite)
                        (suiteName)
                        (result.gherkinDocument.feature.name)
                        (result.pickle.name)
                        (result.result)
                        (``);
                    })
            })(features)
        })
        ;
        // write to file
        this.log(this.builder.build());
    }

    public static formatterLocation(): string {
        return __filename;
    }
};