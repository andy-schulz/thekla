import {DesiredCapabilities, ServerConfig}                                   from "@thekla/config";
import {Actor}                                                               from "@thekla/core";
import {getStandardTheklaDesiredCapabilities, getStandardTheklaServerConfig} from "@thekla/support";
import {RunningBrowser}                                                      from "@thekla/webdriver";
import {configure, getLogger}                                                from "log4js";
import {BrowseTheWeb, Navigate}                                              from "..";

configure(`src/__test__/__config__/log4js.json`);

const logger = getLogger(`Actor`);

describe(`Searching on Google`, (): void => {
    const config: ServerConfig = getStandardTheklaServerConfig();
    const capabilities: DesiredCapabilities = getStandardTheklaDesiredCapabilities(
        `actor_spec.ts`
    );

    let John: Actor;
    logger.trace(`actor_spec stated`);

    beforeAll((): void => {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;

        John = Actor.named(`John`);
        John.whoCan(
            BrowseTheWeb.using(
                RunningBrowser.startedOn(config).withCapabilities(capabilities)
            )
        );
    });

    it(
        `for calculator should show the Google calculator ` +
        `- (test case id: 1761a239-3e50-408a-8e5e-1e4e6e6f07c2)`,
        (): Promise<void> => {
            return Navigate.to(`/`).performAs(John);
        }
    );

    afterAll(
        (): Promise<void[]> => {
            return RunningBrowser.cleanup();
        }
    );
});
