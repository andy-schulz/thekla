import {Actor, Extract}                                                      from "@thekla/core";
import {ServerConfig, DesiredCapabilities}                                   from "@thekla/config";
import {getStandardTheklaServerConfig, getStandardTheklaDesiredCapabilities} from "@thekla/support";
import {element, By, BrowseTheWeb, RunningBrowser, Enter, Navigate, Value}   from "..";

describe(`Enter`, function () {

    const conf: ServerConfig = getStandardTheklaServerConfig();
    const capabilities: DesiredCapabilities = getStandardTheklaDesiredCapabilities(`extract_interaction_spec.ts`);

    const emailField = element(By.css(`[data-test-id='LoginExampleRow1'] [data-test-id='exampleEmail']`));
    const Emma = Actor.named(`Emma`);

    beforeAll(() => {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;
    });

    describe(`a value into a field`, function () {

        beforeAll(() => {
            const theBrowser = RunningBrowser.startedOn(conf).withCapabilities(capabilities);
            Emma.whoCan(BrowseTheWeb.using(theBrowser));
        });

        afterAll((): Promise<void[]> => {
            return RunningBrowser.cleanup();
        });

        it(`should add the value into the input field
        test id: 734a6687-78c8-4da7-a654-cd8086ae4388`, async () => {
            await Navigate.to(`/`).performAs(Emma);

            await Enter.value(`Extract Test`).into(emailField).performAs(Emma);

            const field: string[] = [];

            await Emma.attemptsTo(

                Extract.the(Value.of(emailField))
                       .by((text: string) => field.push(text))
            );

            expect(field).toEqual([`Extract Test`]);

        });
    });
});