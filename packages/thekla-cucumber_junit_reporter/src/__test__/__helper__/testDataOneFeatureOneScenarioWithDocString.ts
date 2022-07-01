import {Status} from "cucumber";

export const feature = {
    file: `Feature: my doc string feature
                Scenario: my scenario
                Given my step
                """
                This is a DocString
                """
                `,
    uri: 'a.feature'
}

export const testCase = {
    sourceLocation: {
        uri: feature.uri,
        line: 2
    },
    attemptNumber: 1
}

export const test_case_prepared_data = {
    sourceLocation: testCase.sourceLocation,
    steps: [{
        sourceLocation: {
            uri: feature.uri,
            line: 3
        },
        actionLocation: {
            uri: 'steps.js',
            line: 6
        }
    }]
}

export const test_case_started_data = testCase;

export const test_step_finished_data = {
    index: 0,
    testCase: testCase,
    result: {
        duration: 1,
        status: Status.PASSED
    }
}

export const test_case_finished_data = {
    ...testCase,
    result: {
        duration: 1000,
        status: Status.PASSED
    }
}

