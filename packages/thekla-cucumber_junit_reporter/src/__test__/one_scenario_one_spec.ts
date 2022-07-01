/* eslint-disable @typescript-eslint/no-var-requires */

import {Status} from 'cucumber'
import {initializeWorld} from "./__helper__/hooks";
import {
    feature,
    test_case_finished_data,
    test_case_prepared_data,
    test_case_started_data,
    test_step_finished_data
} from "./__helper__/testDataOneFeatureOneScenario"

const Gherkin = require(`gherkin`);

describe(`JunitFormatter`, () => {
    const world: { [key: string]: any } = {};

    beforeEach(initializeWorld(world, feature.file, feature.uri));

    describe(`one scenario with one step`, () => {

        describe(`passed`, () => {

            beforeEach(function () {
                world.eventBroadcaster.emit(`test-case-prepared`, test_case_prepared_data);
                world.eventBroadcaster.emit(`test-case-started`, test_case_started_data);
                world.eventBroadcaster.emit(`test-step-finished`, test_step_finished_data);
                world.eventBroadcaster.emit(`test-case-finished`, {
                    ...test_case_finished_data,
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
  <testsuite name="master.a" tests="1" failures="0" errors="0" skipped="0">
    <properties>
      <property name="URI" value="a.feature"/>
    </properties>
    <testcase classname="master.my_feature" name="my_scenario" time="0.002"/>
  </testsuite>
</testsuites>`)

            })
        });

        describe(`failed`, () => {

            beforeEach(function () {
                world.eventBroadcaster.emit(`test-case-prepared`, test_case_prepared_data);
                world.eventBroadcaster.emit(`test-case-started`, test_case_started_data);
                world.eventBroadcaster.emit(`test-step-finished`, {
                    ...test_step_finished_data,
                    result: {duration: 1000, exception: `my error`, status: Status.FAILED}
                });
                world.eventBroadcaster.emit(`test-case-finished`, {
                    ...test_case_finished_data,
                    result: {duration: 1000, exception: `my error`, status: Status.FAILED}
                });
                world.eventBroadcaster.emit(`test-run-finished`)
            });

            it(`includes the error message`, function () {
                expect(world.output).toEqual(
                    `<?xml version="1.0" encoding="UTF-8"?>
<testsuites>
  <testsuite name="master.a" tests="1" failures="1" errors="0" skipped="0">
    <properties>
      <property name="URI" value="a.feature"/>
    </properties>
    <testcase classname="master.my_feature" name="my_scenario" time="0.001">
      <failure message="&quot;my error&quot;"/>
    </testcase>
  </testsuite>
</testsuites>`
                )
            })
        });
    })
});