import {ActivityLog, ActivityLogNode} from "..";

describe(`ActivityLog:`, (): void => {

    describe(`upon activity log creation`, (): void => {

        it(`an empty activity log shall be created 
        - (test case id: e42347b1-6df5-41be-9a26-2dfbe2c92cdd)`, (): void => {

            const activityLog = new ActivityLog(`Logan`);

            const expected: ActivityLogNode = {
                name: "START",
                description: "Logan attempts to",
                logType: `Task`,
                status: `passed`,
                activityNodes: [],
            };

            expect(activityLog.getLogTree()).toEqual(expected);
            expect(activityLog.getStructuredLog()).toEqual(`[START] - Logan attempts to`);
            expect(activityLog.getStructuredHtmlLog()).toContain(`<ul id="ActivityLog"><li><span class="task passed"><span class="logMessage"><span class="activityName">[START]</span> - <span class="activityDescription">Logan attempts to</span></span></span><ul class="nested"></ul></li></ul>`);
        });
    });
});