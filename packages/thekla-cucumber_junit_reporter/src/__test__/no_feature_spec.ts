import {initializeWorld} from "./__helper__/hooks";

describe(`JunitFormatter`, () => {
    const world: {[key: string]: any} = {};

    beforeAll(initializeWorld(world, "", ""));

    describe(`no features`, () => {

        beforeEach(function () {
            world.eventBroadcaster.emit(`test-run-finished`)
        });

        it(`outputs an empty array`, function () {
            expect(world.output).toEqual(
`<?xml version="1.0" encoding="UTF-8"?>
<testsuites/>`
            )
        })
    })
});