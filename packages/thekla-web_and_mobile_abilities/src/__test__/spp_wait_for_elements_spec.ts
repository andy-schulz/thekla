import {Browser}                                                             from "@thekla/webdriver";
import {WebElementListWd}                                                    from "@thekla/webdriver/dist/lib/element/WebElementListWd";
import {getLogger}                                                           from "log4js";
import {getStandardTheklaServerConfig, getStandardTheklaDesiredCapabilities} from "@thekla/support";
import {ServerConfig, DesiredCapabilities}                                   from "@thekla/config";
import {Actor, See, Expected}                                                from "@thekla/core";
import {
    RunningBrowser, BrowseTheWeb, ClientHelper, By,
    element, UntilElement, Navigate, Text, Wait, Status
}                                                                            from "..";
import { ElementStatus } from "../lib/questions/Status";

const logger = getLogger(`Spec: Spp wait for elements`);

describe(`Waiting for SPP Elements`, (): void => {

    const seleniumConfig: ServerConfig = getStandardTheklaServerConfig();
    const capabilities: DesiredCapabilities = getStandardTheklaDesiredCapabilities(`spp_wait_for_elements_spec.ts`);

    logger.trace(`test started`);
    let walterTheWaiter: Actor;
    let browser: Browser;

    beforeAll((): void => {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;
        walterTheWaiter = Actor.named(`Walter`);
        browser = RunningBrowser.startedOn(seleniumConfig).withCapabilities(capabilities);
        walterTheWaiter.whoCan(BrowseTheWeb.using(browser));
    });

    afterAll(async (): Promise<void[]> => {
        return ClientHelper.cleanup()
    });

    describe(`explicitly on the element itself`, (): void => {

        const appearingButton = element(By.css(`[data-test-id='AppearButtonBy4000']`))
            .called(`Test appearing element after 5 seconds`)
            .shallWait(UntilElement.is.visible.forAsLongAs(20000));

        const toBeEnabledButton = element(By.css(`[data-test-id='EnabledButtonBy4000']`))
            .called(`Test enabled element after 5 seconds`)
            .shallWait(UntilElement.is.enabled.forAsLongAs(20000));

        const toBeDisabledButton = element(By.css(`[data-test-id='DisabledButtonBy4000']`))
            .called(`Test enabled element after 5 seconds`)
            .shallWait(UntilElement.isNot.enabled.forAsLongAs(20000));

        it(`should be possible with wait actions on an element and a redirecting page ` +
               `- (test case id: 4406f09a-5b80-4106-b46a-9f2683faefc9)`, (): Promise<void> => {
            return walterTheWaiter.attemptsTo(
                Navigate.to(`/redirectToDelayed`),
                See.if(Text.of(appearingButton)).is(Expected.toEqual(`Appeared after 4 seconds`))
            );
        });

        it(`should be possible with wait actions on an to be enabled element ` +
               `- (test case id: 8419865d-b444-459d-8101-7e6912af1e08)`, (): Promise<void> => {
            return walterTheWaiter.attemptsTo(
                Navigate.to(`/delayed`),
                See.if(Text.of(toBeEnabledButton)).is(Expected.toEqual(`Enabled after 4 seconds`))
            );
        });

        it(`should be possible with wait actions on an to be disabled element ` +
               `- (test case id: a0899cd4-6548-4f15-ab19-579bd6ca1ccd)`, (): Promise<void> => {
            return walterTheWaiter.attemptsTo(
                Navigate.to(`/delayed`),
                See.if(Text.of(toBeDisabledButton)).is(Expected.toEqual(`Disabled after 4 seconds`))
            );
        });
    });

    describe(`explicitly on the element itself`, (): void => {
        const appearingButton = element(By.css(`[data-test-id='AppearButtonBy4000']`))
            .called(`Test appearing element after 4 seconds`);

        const disappearingButton = element(By.css(`[data-test-id='DisappearButtonBy4000']`))
            .called(`Test disappearing element after 4 seconds`)
            // .shallNotImplicitlyWait();

        beforeAll(() => {

        });

        afterEach(() => {
            WebElementListWd.setStandardWait(0);
        });

        it(`should find the element after it appears
        test id: cc66501a-788e-40b6-a4a3-4093578c99ab`, async () => {
            WebElementListWd.setStandardWait(6000);

            await Navigate.to(`/delayed`).performAs(walterTheWaiter);
            const status: ElementStatus = await Status.of(appearingButton).answeredBy(walterTheWaiter);
            expect(status.visible).toBeTruthy();
        });

        it(`should wait until the element disappears
        test id: 36053a0d-e598-4094-bb2f-0a6f5352fef3`, async () => {
            WebElementListWd.setStandardWait(2000);

            await Navigate.to(`/delayed`).performAs(walterTheWaiter);

            const statusPresent: ElementStatus = await Status.of(disappearingButton).answeredBy(walterTheWaiter);
            expect(statusPresent.visible).toBeTruthy();

            await Wait.for(disappearingButton).andCheck(UntilElement.isNot.visible).performAs(walterTheWaiter);

            const status: ElementStatus = await Status.of(disappearingButton).answeredBy(walterTheWaiter);
            expect(status.visible).toBeFalsy();

        });

        it(`should wait until the element disappears when the element has no implicit wait
        test id: e6ec6994-9cee-4711-95a3-0cd914b34c37`, async () => {
            const disappear = disappearingButton.shallNotImplicitlyWait();

            WebElementListWd.setStandardWait(6000);

            await Navigate.to(`/delayed`).performAs(walterTheWaiter);

            const statusPresent: ElementStatus = await Status.of(disappear).answeredBy(walterTheWaiter);
            expect(statusPresent.visible).toBeTruthy();

            await Wait.for(disappear).andCheck(UntilElement.isNot.visible).performAs(walterTheWaiter);

            const status: ElementStatus = await Status.of(disappear).answeredBy(walterTheWaiter);
            expect(status.visible).toBeFalsy();

        });
    });

    describe(`with Wait.for() on the task flow`, (): void => {

        const button = element(By.css(`[data-test-id='buttonBehindModal']`))
            .called(`button behind modal window`);

        const modal = element(By.css(`[id='ModalView']`))
            .called(`The modal window`);

        it(`should time out when the timeout is reached` +
               `- (test case id: 5812e00b-580d-4330-899c-9f62cedc0a6e)`, (): Promise<void> => {
            return walterTheWaiter.attemptsTo(
                Navigate.to(`/modals`),
                See.if(Text.of(button)).is(Expected.toEqual(`Danger!`)),
                Wait.for(modal).andCheck(UntilElement.isNot.visible.forAsLongAs(500))
            ).then((): void => {
                expect(true).toBe(false, `Action should time out after 500ms but it doesnt`)
            }).catch((e): void => {
                expect(e.toString()).toContain(`Wait timed out after 500 ms -> (Waiting until element called 'The modal window' is not visible).`)
            });

        });

        it(`should continue when the wait times out and the error is ignored` +
               `- (test case id: a9cd8aac-9a38-47f3-ad1e-4d23430a7d4be)`, (): Promise<void> => {
            return walterTheWaiter.attemptsTo(
                Navigate.to(`/modals`),
                See.if(Text.of(button)).is(Expected.toEqual(`Danger!`)),
                Wait.for(modal)
                    .andCheck(UntilElement.isNot.visible.forAsLongAs(500))
                    .butContinueInCaseOfError(`to test if it works`)
            ).then((): void => {
                expect(true).toBeTruthy(`The timeout was ignored ... OK.`)
            }).catch((e: Error): void => {
                console.log(e);
                expect(false).toBeTruthy(`The timeout should have been ignored, but it wasn't.`)
            });
        });

        it(`should succeed after 5 seconds when the modal view is gone  ` +
               `- (test case id: c93f9af5-b5ea-49d2-99ba-45e7b31018b0)`, (): Promise<void> => {
            return walterTheWaiter.attemptsTo(
                Navigate.to(`/modals`),
                See.if(Text.of(button)).is(Expected.toEqual(`Danger!`)),
                Wait.for(modal).andCheck(UntilElement.isNot.visible.forAsLongAs(10000))
            )
        });
    });

    describe(`with Wait.until()`, () => {
        const modal = element(By.css(`[id='ModalView']`))
            .called(`The modal window`);

        beforeEach(() => {
            return walterTheWaiter.attemptsTo(
                Navigate.to(`/modals`)
            );
        });

        it(`should time out after 500 ms
        - (test case id: 2faab3b4-54b0-43cf-a616-71995c4f0440)`, (): Promise<void> => {
            return walterTheWaiter.attemptsTo(
                Navigate.to(`/modals`),
                Wait.until(Status.of(modal))
                    .is(Expected.notToBeVisible())
                    .forAsLongAs(500)
            ).then((): void => {
                expect(true).toBe(false, `Action should time out after 5000 ms but it doesnt`)
            }).catch((e): void => {
                expect(e.toString()).toContain(
                    `Waiting until 
Status of element 
    called 'The modal window' 
    located by >>byCss: [id='ModalView']<< 
which was expected notToBeVisible 
timed out after 500 ms.`)
            });

        });

        it(`should wait for the modal element to disappear
        - (test case id: 2faab3b4-54b0-43cf-a616-71995c4f0440)`, async (): Promise<void> => {

            const start = Date.now();

            return walterTheWaiter.attemptsTo(
                Wait.until(Status.of(modal))
                    .is(Expected.notToBeVisible())
                    .forAsLongAs(7000)
            ).then((): void => {
                const end = Date.now();
                expect(end - start).toBeGreaterThan(4000);
            }).catch((e: Error): void => {
                expect(false).toBeTruthy(`test should wait for the element to disappear, but it doesn't. Error caught: ${e.toString()}`)
            });

        });
    });
});
