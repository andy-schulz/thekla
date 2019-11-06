/* eslint-disable @typescript-eslint/no-var-requires */

import {Status}     from 'cucumber'
import {beforeFunc} from "./__helper__/hooks";

const Gherkin = require(`gherkin`);

describe(`JunitFormatter`, () => {
    const world: { [key: string]: any } = {};

    beforeEach(beforeFunc(world));

    describe(`one scenario with one step`, () => {

        beforeEach(function () {
            const events: { [key: string]: any }[] = Gherkin.generateEvents(
                `@tag1 @tag2\n` +
                `Feature: my feature\n` +
                `my feature description\n` +
                `Scenario: my scenario\n` +
                `my scenario description\n` +
                `Given my step`,
                `a.feature`
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
                       }
            );

            world.testCase = {sourceLocation: {uri: `a.feature`, line: 4}}
            world.output = ``;
        });

        describe(`passed`, () => {

            beforeEach(function () {
                world.eventBroadcaster.emit(`test-case-prepared`, {
                    sourceLocation: world.testCase.sourceLocation,
                    steps: [
                        {
                            sourceLocation: { uri: `a.feature`, line: 6 },
                        },
                    ],
                });
                world.eventBroadcaster.emit(`test-step-finished`, {
                    index: 0,
                    testCase: world.testCase,
                    result: { duration: 1, status: Status.PASSED },
                });
                world.eventBroadcaster.emit(`test-case-finished`, {
                    sourceLocation: world.testCase.sourceLocation,
                    result: { duration: 2, status: Status.PASSED },
                });
                world.eventBroadcaster.emit(`test-run-finished`)
            });

            it(`outputs the feature`, function () {

                expect(world.output).toEqual(
`<?xml version="1.0" encoding="UTF-8"?>
<testsuites>
  <testsuite name="master" tests="1" failures="0" errors="0" skipped="0">
    <testcase classname="master.my_feature" name="my_scenario" time="0.001"/>
  </testsuite>
</testsuites>`)

            })
        });

        describe(`failed`, () => {

            beforeEach(function () {
                world.eventBroadcaster.emit(`test-case-prepared`, {
                    sourceLocation: world.testCase.sourceLocation,
                    steps: [
                        {
                            sourceLocation: {uri: `a.feature`, line: 6}
                        }
                    ]
                });
                world.eventBroadcaster.emit(`test-step-finished`, {
                    index: 0,
                    testCase: world.testCase,
                    result: {duration: 1, exception: `my error`, status: Status.FAILED}
                });
                world.eventBroadcaster.emit(`test-case-finished`, {
                    sourceLocation: world.testCase.sourceLocation,
                    result: {duration: 1, status: Status.FAILED}
                });
                world.eventBroadcaster.emit(`test-run-finished`)
            });

           it(`includes the error message`, function () {
                expect(world.output).toEqual(
`<?xml version="1.0" encoding="UTF-8"?>
<testsuites>
  <testsuite name="master" tests="1" failures="1" errors="0" skipped="0">
    <testcase classname="master.my_feature" name="my_scenario" time="0.001">
      <failure message="my error"/>
    </testcase>
  </testsuite>
</testsuites>`
                )
            })
        });

        describe(`with a step definition`, () => {

            beforeEach(function () {
                world.eventBroadcaster.emit(`test-case-prepared`, {
                    sourceLocation: world.testCase.sourceLocation,
                    steps: [
                        {
                            actionLocation: {uri: `steps.js`, line: 10},
                            sourceLocation: {uri: `a.feature`, line: 6}
                        }
                    ]
                });
                world.eventBroadcaster.emit(`test-step-finished`, {
                    index: 0,
                    testCase: world.testCase,
                    result: {duration: 1, status: Status.PASSED}
                });
                world.eventBroadcaster.emit(`test-case-finished`, {
                    sourceLocation: world.testCase.sourceLocation,
                    result: {duration: 1, status: Status.PASSED}
                });
                world.eventBroadcaster.emit(`test-run-finished`)
            });

            it(`outputs the step with a match attribute`, function () {
                expect(world.output).toEqual(
`<?xml version="1.0" encoding="UTF-8"?>
<testsuites>
  <testsuite name="master" tests="1" failures="0" errors="0" skipped="0">
    <testcase classname="master.my_feature" name="my_scenario" time="0.001"/>
  </testsuite>
</testsuites>`
                )
            })
        });

        describe(`with hooks`, () => {

            beforeEach(function () {
                world.eventBroadcaster.emit(`test-case-prepared`, {
                    sourceLocation: world.testCase.sourceLocation,
                    steps: [
                        {
                            actionLocation: {uri: `steps.js`, line: 10}
                        },
                        {
                            sourceLocation: {uri: `a.feature`, line: 6},
                            actionLocation: {uri: `steps.js`, line: 11}
                        },
                        {
                            actionLocation: {uri: `steps.js`, line: 12}
                        }
                    ]
                });
                world.eventBroadcaster.emit(`test-case-finished`, {
                    sourceLocation: world.testCase.sourceLocation,
                    result: {duration: 1, status: Status.PASSED}
                });
                world.eventBroadcaster.emit(`test-run-finished`)
            });

            it(`ignores the hooks`, function () {
                expect(world.output).toEqual(
`<?xml version="1.0" encoding="UTF-8"?>
<testsuites>
  <testsuite name="master" tests="1" failures="0" errors="0" skipped="0">
    <testcase classname="master.my_feature" name="my_scenario" time="0"/>
  </testsuite>
</testsuites>`
                );
            });
        });

        describe(`with attachments`, () => {
            beforeEach(function () {
                world.eventBroadcaster.emit(`test-case-prepared`, {
                    sourceLocation: world.testCase.sourceLocation,
                    steps: [
                        {
                            sourceLocation: {uri: `a.feature`, line: 6},
                            actionLocation: {uri: `steps.js`, line: 11}
                        }
                    ]
                });
                world.eventBroadcaster.emit(`test-step-attachment`, {
                    testCase: {
                        sourceLocation: world.testCase.sourceLocation
                    },
                    index: 0,
                    data: `first data`,
                    media: {type: `first media type`}
                });
                world.eventBroadcaster.emit(`test-step-attachment`, {
                    testCase: {
                        sourceLocation: world.testCase.sourceLocation
                    },
                    index: 0,
                    data: `second data`,
                    media: {type: `second media type`}
                });
                world.eventBroadcaster.emit(`test-case-finished`, {
                    sourceLocation: world.testCase.sourceLocation,
                    result: {duration: 1, status: Status.PASSED}
                });
                world.eventBroadcaster.emit(`test-run-finished`)
            });

            it(`outputs the step with embeddings`, function () {
                expect(world.output).toEqual(
`<?xml version="1.0" encoding="UTF-8"?>
<testsuites>
  <testsuite name="master" tests="1" failures="0" errors="0" skipped="0">
    <testcase classname="master.my_feature" name="my_scenario" time="0"/>
  </testsuite>
</testsuites>`
                )
            })
        })
    })
});