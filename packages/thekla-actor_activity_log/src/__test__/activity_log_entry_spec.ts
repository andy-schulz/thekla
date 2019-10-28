import {ActivityLogEntry, ActivityLogNode} from "../lib/ActivityLogEntry";

describe(`ActivityLogEntry: `, (): void => {

    describe(`after creating a new log entry, it`, (): void => {

        it(`should return the structured information as ActivityLogNode
        - (test case id: fe260e56-8ea6-4d59-bd41-d12243ea3ba7)`, (): void => {
            const entry = new ActivityLogEntry(
                `new Activity`,
                `with description`,
                `Interaction`,
                `passed`,
                null
            );

            const expectedLogTree: ActivityLogNode = {
                activityNodes: [],
                description: `with description`,
                logType: `Interaction`,
                name: `new Activity`,
                status: `passed`
            };

            expect(entry.getLogTree()).toEqual(expectedLogTree)
        });

        describe(`after appending a second ActivityLogEntry`, (): void => {

            it(`should return the structured information as object tree 
            - (test case id: 4425b57c-6cbc-4645-9c34-b9e810c80e65)`, (): void => {
                const parent = new ActivityLogEntry(
                    `new Parent Activity`,
                    `with description`,
                    `Task`,
                    `passed`,
                    null
                );

                const child = new ActivityLogEntry(
                    `new Child Activity`,
                    `with a child's description`,
                    `Interaction`,
                    `running`,
                    parent
                );

                const expectedLogTree: ActivityLogNode = {
                    name: `new Parent Activity`,
                    description: `with description`,
                    logType: `Task`,
                    status: `passed`,
                    activityNodes: [
                        {
                            name: `new Child Activity`,
                            description: `with a child's description`,
                            logType: `Interaction`,
                            status: `running`,
                            activityNodes: []
                        }],
                };

                expect(parent.getLogTree()).toEqual(expectedLogTree)
            });
        });
    });
});