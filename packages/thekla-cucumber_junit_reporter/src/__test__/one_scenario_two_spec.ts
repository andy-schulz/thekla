/* eslint-disable @typescript-eslint/no-var-requires */

import {Status} from 'cucumber'
import {initializeWorld} from "./__helper__/hooks";
import {
    feature,
    test_case_finished_data_1,
    test_case_finished_data_2,
    test_case_prepared_data_1,
    test_case_prepared_data_2,
    test_case_started_data_1,
    test_case_started_data_2,
    test_step_finished_data_1,
    test_step_finished_data_2
} from "./__helper__/testDataOneFeatureTwoScenario"

const Gherkin = require(`gherkin`);

describe(`JunitFormatter`, () => {
    const world: { [key: string]: any } = {};

    beforeEach(initializeWorld(world, feature.file, feature.uri));

    describe(`two scenarios with one step`, () => {

        beforeEach(function () {
            world.output = ``;
        });

        describe(`passed`, () => {

            beforeEach(function () {
                world.eventBroadcaster.emit(`test-case-prepared`, test_case_prepared_data_1);
                world.eventBroadcaster.emit(`test-case-started`, test_case_started_data_1);
                world.eventBroadcaster.emit(`test-step-finished`, test_step_finished_data_1);
                world.eventBroadcaster.emit(`test-case-finished`, {
                    ...test_case_finished_data_1,
                    result: {
                        duration: 2000,
                        status: Status.PASSED
                    }
                });

                world.eventBroadcaster.emit(`test-case-prepared`, test_case_prepared_data_2);
                world.eventBroadcaster.emit(`test-case-started`, test_case_started_data_2);
                world.eventBroadcaster.emit(`test-step-finished`, test_step_finished_data_2);
                world.eventBroadcaster.emit(`test-case-finished`, {
                    ...test_case_finished_data_2,
                    result: {
                        duration: 2000,
                        status: Status.PASSED
                    }
                });

                world.eventBroadcaster.emit(`test-run-finished`)
            });

            it(`outputs the feature`, function () {

                expect(world.output).toEqual(
                    `<?xml version="1.0" encoding="UTF-8"?>
<testsuites>
  <testsuite name="master.a" tests="2" failures="0" errors="0" skipped="0">
    <properties>
      <property name="URI" value="a.feature"/>
    </properties>
    <testcase classname="master.my_feature" name="my_scenario_number_one" time="0.002"/>
    <testcase classname="master.my_feature" name="my_scenario_number_two" time="0.002"/>
  </testsuite>
</testsuites>`)

            })
        });

        describe(`failed`, () => {

            beforeEach(function () {
                world.eventBroadcaster.emit(`test-case-prepared`, test_case_prepared_data_1);
                world.eventBroadcaster.emit(`test-case-started`, test_case_started_data_1);
                world.eventBroadcaster.emit(`test-step-finished`, {
                    ...test_step_finished_data_1,
                    result: {duration: 1000, exception: `my error`, status: Status.FAILED}
                });
                world.eventBroadcaster.emit(`test-case-finished`, {
                    ...test_case_finished_data_1,
                    result: {duration: 1000, exception: `my error`, status: Status.FAILED}
                });

                world.eventBroadcaster.emit(`test-case-prepared`, test_case_prepared_data_2);
                world.eventBroadcaster.emit(`test-case-started`, test_case_started_data_2);
                world.eventBroadcaster.emit(`test-step-finished`, {
                    ...test_step_finished_data_2,
                    result: {duration: 1000, exception: `my error`, status: Status.FAILED}
                });
                world.eventBroadcaster.emit(`test-case-finished`, {
                    ...test_case_finished_data_2,
                    result: {duration: 1000, exception: `my error`, status: Status.FAILED}
                });
                world.eventBroadcaster.emit(`test-run-finished`)
            });

            it(`includes the error message`, function () {
                expect(world.output).toEqual(
                    `<?xml version="1.0" encoding="UTF-8"?>
<testsuites>
  <testsuite name="master.a" tests="2" failures="2" errors="0" skipped="0">
    <properties>
      <property name="URI" value="a.feature"/>
    </properties>
    <testcase classname="master.my_feature" name="my_scenario_number_one" time="0.001">
      <failure message="&quot;my error&quot;"/>
    </testcase>
    <testcase classname="master.my_feature" name="my_scenario_number_two" time="0.001">
      <failure message="&quot;my error&quot;"/>
    </testcase>
  </testsuite>
</testsuites>`
                )
            })
        });
    })
});