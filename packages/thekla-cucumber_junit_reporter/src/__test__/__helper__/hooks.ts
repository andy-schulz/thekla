/* eslint-disable @typescript-eslint/no-var-requires */

const EventDataCollector = require(`cucumber/lib/formatter/helpers`).EventDataCollector;

import EventEmitter   from "events";
import JUnitFormatter from "../..";

export const beforeFunc = (world: {[key: string]: any}) => {

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
    };
};