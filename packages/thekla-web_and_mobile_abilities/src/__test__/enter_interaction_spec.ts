import {Actor}                                                               from "@thekla/core";
import {ServerConfig, DesiredCapabilities}                                   from "@thekla/config";
import {getStandardTheklaServerConfig, getStandardTheklaDesiredCapabilities} from "@thekla/support";
import {element, By, BrowseTheWeb, RunningBrowser, Enter, Navigate, Value}   from "..";

describe(`Enter`, function () {

    const conf: ServerConfig = getStandardTheklaServerConfig();
    const capabilities: DesiredCapabilities = getStandardTheklaDesiredCapabilities(`enter_interaction_spec.ts`);

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

            await Enter.value(`Enter Test`).into(emailField).performAs(Emma);

            const text = await Value.of(emailField).answeredBy(Emma);

            expect(text).toEqual(`Enter Test`);

        });

        it(`should clear the value before entering a new value
        test id: 27e769b7-25d0-4c75-8ff6-38d0e33f05c7`, async () => {
            await Navigate.to(`/`).performAs(Emma);
            await Enter.value(`one`).into(emailField).performAs(Emma);
            await Enter.value(`two`).into(emailField).performAs(Emma);

            const first = await Value.of(emailField).answeredBy(Emma);

            expect(first).toEqual(`onetwo`);

            await Enter.value(`cleared`)
                       .into(emailField)
                       .butClearsTheFieldBefore()
                       .performAs(Emma);

            const second = await Value.of(emailField).answeredBy(Emma);

            expect(second).toEqual(`cleared`)
        });

        it(`should not change the value if nothing is entered into the field
        test id: b5ea22f5-12ba-4c24-86f7-0ba292e8b55b`, async () => {
            await Navigate.to(`/`).performAs(Emma);

            await Enter.value(`Enter Test`).into(emailField).performAs(Emma);

            const text = await Value.of(emailField).answeredBy(Emma);

            expect(text).toEqual(`Enter Test`);

            await Enter.value(undefined).into(emailField).performAs(Emma);

            expect(text).toEqual(`Enter Test`);
        });
    });
});