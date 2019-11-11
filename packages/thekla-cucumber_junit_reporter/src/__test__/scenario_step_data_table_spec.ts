/* eslint-disable @typescript-eslint/no-var-requires */

import {Status}     from 'cucumber'
import {beforeFunc} from "./__helper__/hooks";

const Gherkin = require(`gherkin`);

describe(`JunitFormatter`, () => {
    const world: { [key: string]: any } = {};

    beforeEach(beforeFunc(world));

    describe(`one scenario with one step with a data table string`, () => {
        beforeEach(function () {
            const events: { [key: string]: any }[] = Gherkin.generateEvents(
                `Feature: my data table feature\n` +
                `  Scenario: my scenario\n` +
                `    Given my step\n` +
                `      |aaa|b|c|\n` +
                `      |d|e|ff|\n` +
                `      |gg|h|iii|\n`,
                `feature/folder/a.feature`
            );
            events.map((event) => {
                world.eventBroadcaster.emit(event.type, event);
                if (event.type === `pickle`) {
                    world.eventBroadcaster.emit(`pickle-accepted`, {
                        type: `pickle-accepted`,
                        pickle: event.pickle,
                        uri: event.uri
                    })
                }
            });
            world.testCase = {sourceLocation: {uri: `feature/folder/a.feature`, line: 2}};
            world.eventBroadcaster.emit(`test-case-prepared`, {
                ...world.testCase,
                steps: [
                    {
                        sourceLocation: {uri: `feature/folder/a.feature`, line: 3},
                        actionLocation: {uri: `steps.js`, line: 10}
                    }
                ]
            });
            world.eventBroadcaster.emit(`test-step-finished`, {
                index: 0,
                testCase: world.testCase,
                result: {duration: 1, status: Status.PASSED}
            });
            world.eventBroadcaster.emit(`test-case-finished`, {
                ...world.testCase,
                result: {duration: 1, status: Status.PASSED}
            });
            world.eventBroadcaster.emit(`test-run-finished`)
        });

        it(`outputs the data table as a step argument`, function () {
            expect(world.output).toEqual(
`<?xml version="1.0" encoding="UTF-8"?>
<testsuites>
  <testsuite name="feature-folder" tests="1" failures="0" errors="0" skipped="0">
    <testcase classname="feature-folder.my_data_table_feature" name="my_scenario" time="0.001"/>
  </testsuite>
</testsuites>`
            )
        })
    })
});
