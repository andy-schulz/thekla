/* eslint-disable @typescript-eslint/no-var-requires */

import EventEmitter from "events";
import JUnitFormatter from "../..";

const EventDataCollector = require(`cucumber/lib/formatter/helpers`).EventDataCollector;


export const initializeWorld = (world: { [key: string]: any }, featureFile: string, uri: string) => {

    return function () {

        world.eventBroadcaster = new EventEmitter.EventEmitter();

        world.output = ``;

        world.logFn = (data: string): void => {
            world.output += data
        };

        world.collector = new EventDataCollector(world.eventBroadcaster);

        world.junitFormatter = new JUnitFormatter({
            eventBroadcaster: world.eventBroadcaster,
            eventDataCollector: world.collector,
            log: world.logFn
        })

        const Gherkin = require(`gherkin`);
        const events: { [key: string]: any }[] = Gherkin.generateEvents(
            featureFile,
            uri
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
        })
    };
};