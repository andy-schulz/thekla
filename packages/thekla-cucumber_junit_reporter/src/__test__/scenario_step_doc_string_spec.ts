/* eslint-disable @typescript-eslint/no-var-requires */

import {Status}     from 'cucumber'
import {initializeWorld} from "./__helper__/hooks";
import {
    feature,
    test_case_finished_data,
    test_case_prepared_data,
    test_case_started_data,
    test_step_finished_data
} from "./__helper__/testDataOneFeatureOneScenarioWithDocString";

describe(`JunitFormatter`, () => {
    const world: { [key: string]: any } = {};

    beforeEach(initializeWorld(world, feature.file, feature.uri));

    describe(`one scenario with one step with a doc string`, () => {
        beforeEach(function () {

            world.eventBroadcaster.emit(`test-case-prepared`, test_case_prepared_data);
            world.eventBroadcaster.emit(`test-case-started`, test_case_started_data);
            world.eventBroadcaster.emit(`test-step-finished`, test_step_finished_data);
            world.eventBroadcaster.emit(`test-case-finished`, test_case_finished_data);
            world.eventBroadcaster.emit(`test-run-finished`);
        });

        it(`outputs the doc string as a step argument`, function () {
            expect(world.output).toEqual(
`<?xml version="1.0" encoding="UTF-8"?>
<testsuites>
  <testsuite name="master.a" tests="1" failures="0" errors="0" skipped="0">
    <properties>
      <property name="URI" value="a.feature"/>
    </properties>
    <testcase classname="master.my_doc_string_feature" name="my_scenario" time="0.001"/>
  </testsuite>
</testsuites>`
            )
        })
    })

});
