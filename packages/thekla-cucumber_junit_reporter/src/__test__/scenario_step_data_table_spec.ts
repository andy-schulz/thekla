/* eslint-disable @typescript-eslint/no-var-requires */

import {initializeWorld} from "./__helper__/hooks";
import {
    feature,
    test_case_finished_data,
    test_case_prepared_data,
    test_case_started_data,
    test_step_finished_data
} from "./__helper__/testDataOneFeatureOneScenarioWithDataTable"


describe(`JunitFormatter`, () => {
    const world: { [key: string]: any } = {};

    beforeEach(initializeWorld(world, feature.file, feature.uri));

    describe(`one scenario with one step with a data table string`, () => {
        beforeEach(function () {
            world.eventBroadcaster.emit(`test-case-prepared`, test_case_prepared_data);
            world.eventBroadcaster.emit(`test-case-started`, test_case_started_data);
            world.eventBroadcaster.emit(`test-step-finished`, test_step_finished_data);
            world.eventBroadcaster.emit(`test-case-finished`, test_case_finished_data);
            world.eventBroadcaster.emit(`test-run-finished`)
        });

        it(`outputs the data table as a step argument`, function () {
            expect(world.output).toEqual(
                `<?xml version="1.0" encoding="UTF-8"?>
<testsuites>
  <testsuite name="feature-folder.a" tests="1" failures="0" errors="0" skipped="0">
    <properties>
      <property name="URI" value="feature/folder/a.feature"/>
    </properties>
    <testcase classname="feature-folder.my_data_table_feature" name="my_scenario" time="0.001"/>
  </testsuite>
</testsuites>`
            )
        })
    })
});
