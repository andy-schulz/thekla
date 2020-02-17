import {DesiredCapabilities, ServerConfig}                                   from "@thekla/config";
import {Actor, Result}                                                       from "@thekla/core";
import {getStandardTheklaDesiredCapabilities, getStandardTheklaServerConfig} from "@thekla/support";
import {BrowseTheWeb, By, element, Enter, Navigate, RunningBrowser, Value}   from "..";

describe(`Enter`, function () {

    const conf: ServerConfig = getStandardTheklaServerConfig();
    const capabilities: DesiredCapabilities = getStandardTheklaDesiredCapabilities(`enter_interaction_spec.ts`);

    const emailField = element(By.css(`[data-test-id='LoginExampleRow1'] [data-test-id='exampleEmail']`));
    const Emma = Actor.named(`Emma`);

    beforeAll(() => {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;
        const theBrowser = RunningBrowser.startedOn(conf).withCapabilities(capabilities);
        Emma.whoCan(BrowseTheWeb.using(theBrowser));
    });

    afterAll((): Promise<void[]> => {
        return RunningBrowser.cleanup();
    });

    describe(`a value into a field`, function () {

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
                       .into.empty(emailField)
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

            const secondText = await Value.of(emailField).answeredBy(Emma);

            expect(secondText).toEqual(`Enter Test`);
        });

        it(`should clear the field before a new value is entered
        id: 21355df0-04e0-45a6-b1bc-1bc7e8e6e931`, async () => {
            await Navigate.to(`/`).performAs(Emma);

            await Enter.value(`First Text`).into(emailField).performAs(Emma);
            const firstText = await Value.of(emailField).answeredBy(Emma);
            expect(firstText).toEqual(`First Text`);

            await Enter.value(`Second Text`).into(emailField).performAs(Emma);
            const secondText = await Value.of(emailField).answeredBy(Emma);
            expect(secondText).toEqual(`First TextSecond Text`);

            await Enter.value(`Third Text`).into.empty(emailField).performAs(Emma);
            const thirdText = await Value.of(emailField).answeredBy(Emma);
            expect(thirdText).toEqual(`Third Text`);
        });
    });

    describe(`a questions result into a field`, () => {

        it(` should add the questions result into the field
        test id: 4c7a1783-b09f-4857-ae40-23ef83d4d19e`, async () => {
            await Navigate.to(`/`).performAs(Emma);

            await Enter.resultOf(Result.of(`Enter question result`))
                       .into(emailField).performAs(Emma);

            const text = await Value.of(emailField).answeredBy(Emma);

            expect(text).toEqual(`Enter question result`);
        });

        it(`should clear the value before entering the questions result
        test id: 5bee27bb-36f1-43bd-9844-e7f3240121bb`, async () => {
            await Navigate.to(`/`).performAs(Emma);
            await Enter.value(`one`).into(emailField).performAs(Emma);
            await Enter.value(`two`).into(emailField).performAs(Emma);

            const first = await Value.of(emailField).answeredBy(Emma);

            expect(first).toEqual(`onetwo`);

            await Enter.resultOf(Result.of(`my questions result`))
                       .into.empty(emailField)
                       .performAs(Emma);

            const second = await Value.of(emailField).answeredBy(Emma);

            expect(second).toEqual(`my questions result`)
        });
    });
});