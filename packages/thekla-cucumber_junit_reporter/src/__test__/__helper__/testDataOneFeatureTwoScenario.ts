import {Status} from "cucumber";

export const feature = {
    file: `@tag1 @tag2
    Feature: my feature
    my feature description
    Scenario: my scenario number one
    my scenario description
    Given my step
    Scenario: my scenario number two
    my scenario description
    Given my step`,
    uri: "a.feature"
};


export const testCase1 = {
    sourceLocation: {
        uri: feature.uri,
        line: 4
    },
    attemptNumber: 1
}

export const testCase2 = {
    sourceLocation: {
        uri: feature.uri,
        line: 7
    },
    attemptNumber: 1
}

export const test_case_prepared_data_1 = {
    sourceLocation: testCase1.sourceLocation,
    steps: [{
        sourceLocation: {
            uri: feature.uri,
            line: 6
        },
        actionLocation: {
            uri: 'steps.js',
            line: 12
        }
    }]
}

export const test_case_prepared_data_2 = {
    sourceLocation: testCase2.sourceLocation,
    steps: [{
        sourceLocation: {
            uri: feature.uri,
            line: 9
        },
        actionLocation: {
            uri: 'steps.js',
            line: 18
        }
    }]
}

export const test_case_started_data_1 = testCase1;
export const test_case_started_data_2 = testCase2;

export const test_step_finished_data_1 = {
    index: 0,
    testCase: testCase1,
    result: {
        duration: 1,
        status: Status.PASSED
    }
}
export const test_step_finished_data_2 = {
    index: 0,
    testCase: testCase2,
    result: {
        duration: 1,
        status: Status.PASSED
    }
}

export const test_case_finished_data_1 = {
    ...testCase1,
    result: {
        duration: 1000,
        status: Status.PASSED
    }
}
export const test_case_finished_data_2 = {
    ...testCase2,
    result: {
        duration: 1000,
        status: Status.PASSED
    }
}

