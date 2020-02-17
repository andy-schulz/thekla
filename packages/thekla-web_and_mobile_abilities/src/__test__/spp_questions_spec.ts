import {Expected}                                                            from "@thekla/assertion";
import {DesiredCapabilities, ServerConfig}                                   from "@thekla/config";
import {Actor, Extract, See}                                                 from "@thekla/core";
import {getStandardTheklaDesiredCapabilities, getStandardTheklaServerConfig} from "@thekla/support";
import {configure}                                                           from "log4js";
import {
    all,
    Attribute,
    Browser,
    BrowseTheWeb,
    By,
    Click,
    Count,
    element,
    Navigate,
    RunningBrowser,
    Status,
    Text,
    TheSites,
    Value
}                                                                            from "..";
import {RemoteFileLocation}                                                  from "../lib/questions/RemoteFileLocation";

configure(`src/__test__/__config__/log4js.json`);

describe(`Using`, (): void => {

    const seleniumConfig: ServerConfig = getStandardTheklaServerConfig();
    const capabilities: DesiredCapabilities = getStandardTheklaDesiredCapabilities(`spp_questions_spec.ts`);

    let browser: Browser;

    const testUrl = process.env.BASEURL ? process.env.BASEURL : `http://localhost:3000`;

    beforeAll((): void => {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;
        browser = RunningBrowser.startedOn(seleniumConfig).withCapabilities(capabilities);
    });

    afterAll(async (): Promise<void[]> => {
        return RunningBrowser.cleanup();
    });

    describe(`the Site question`, (): void => {
        const Joanna: Actor = Actor.named(`Joanna`);

        beforeAll((): void => {
            Joanna.can(BrowseTheWeb.using(browser))
        });

        it(`with >See<: should check for the current site url ` +
               `- (test case id: 332e9252-aec9-44b5-b936-728561523e27)`, async (): Promise<void> => {
            await Joanna.attemptsTo(
                Navigate.to(`/delayed`),
                See.if(TheSites.url).is(Expected.to.equal(`${testUrl}/delayed`))
            )
        });

        it(`with >See<: should check for the sites title ` +
               `- (test case id: 7974c013-4234-43e4-8330-6ec788512eb8)`, async (): Promise<void> => {
            await Joanna.attemptsTo(
                Navigate.to(`/delayed`),
                See.if(TheSites.url).is(Expected.to.equal(`${testUrl}/delayed`))
            )
        });
    });

    describe(`the Status question`, (): void => {
        const John: Actor = Actor.named(`John`);

        const appearButton =
            element(By.css(`[data-test-id='AppearButtonBy4000']`))
                .called(`button which appears after 4 seconds`);

        const disappearButton =
            element(By.css(`[data-test-id='DisappearButtonBy4000']`))
                .called(`button which disappears after 4 seconds`);

        const beingEnabledButton =
            element(By.css(`[data-test-id='EnabledButtonBy4000']`))
                .called(`button which will be enabled after 4 seconds`);

        const beingDisabledButton =
            element(By.css(`[data-test-id='DisabledButtonBy4000']`))
                .called(`button which will be disabled after 4 seconds`);

        const multipleAppearButtons =
            all(By.css(`[data-test-id^='AppearButtonBy']`))
                .called(`all buttons appearing after a 4 or 8 seconds`);

        const multipleDisappearButtons =
            all(By.css(`[data-test-id^='DisappearButtonBy']`))
                .called(`all buttons disappearing after a 4 or 8 seconds`);

        const multipleEnabledButtons =
            all(By.css(`[data-test-id^='EnabledButtonBy']`))
                .called(`all buttons enabled after a 4 or 8 seconds`);

        const multipleDisabledButtons =
            all(By.css(`[data-test-id^='DisabledButtonBy']`))
                .called(`all buttons disabled after a 4 or 8 seconds`);

        beforeAll((): void => {
            John.can(BrowseTheWeb.using(browser));
        });

        beforeEach(() => {
            return Navigate.to(`/delayed`).performAs(John);
        });

        it(`should return the visibility status false of a single button` +
               `- (test case id: a9223ac1-37af-4198-bb3a-498192523c95)`, async (): Promise<void> => {

            expect(await Status.visible.of(appearButton).answeredBy(John)).toBeFalse();
            expect(await Status.of(appearButton).answeredBy(John)).toEqual({visible: false, enabled: true});
        });

        it(`should return the visibility status true of a single button` +
               `- (test case id: dbd31ad2-ae19-4bf4-bf78-b5b957915945)`, async (): Promise<void> => {

            expect(await Status.visible.of(disappearButton).answeredBy(John)).toBeTrue();
            expect(await Status.of(disappearButton).answeredBy(John)).toEqual({visible: true, enabled: true});
        });

        it(`should return the enabled status of a single button` +
               `- (test case id: c9543656-f5a0-4f8d-9fbc-335bd9a600bb)`, async (): Promise<void> => {

            expect(await Status.enable.of(beingDisabledButton).answeredBy(John)).toBeTrue();
            expect(await Status.enable.of(beingEnabledButton).answeredBy(John)).toBeFalse();
        });

        it(`should return the Status of multiple not visible elements as single value` +
               `- (test case id: a3fcc0e7-d963-4676-aeeb-c6b74d546f73)`, async (): Promise<void> => {

            expect(await Status.ofAll(multipleAppearButtons).answeredBy(John))
                .toEqual({visible: false, enabled: true});
        });

        it(`should return the Status of multiple visible elements as single value
        test id: b4f802d7-d27f-4f6d-9da8-2bfdd053cd39`, async () => {

            expect(await Status.ofAll(multipleDisappearButtons).answeredBy(John))
                .toEqual({visible: true, enabled: true});
        });

        it(`should return the Status of an element list, as separate values` +
               `- (test case id: b4ebcb2f-3ab4-4d80-abbf-dee9ae8421aa)`, async (): Promise<void> => {

            expect(await Status.ofAll(multipleAppearButtons, {all: true}).answeredBy(John))
                .toEqual({visible: [false, false], enabled: [true, true]});

            expect(await Status.ofAll(multipleDisappearButtons, {all: true}).answeredBy(John))
                .toEqual({visible: [true, true], enabled: [true, true]});

        });

        it(`should return the status of an element list as separate values (single element in list)` +
               `- (test case id: 00893a42-ba85-4ce4-b2b8-0695a97d0b51)`, async (): Promise<void> => {

            expect(await Status.ofAll(multipleEnabledButtons, {all: true}).answeredBy(John))
                .toEqual({visible: [true], enabled: [false]});

            expect(await Status.ofAll(multipleDisabledButtons, {all: true}).answeredBy(John))
                .toEqual({visible: [true], enabled: [true]});

        });

        it(`with the visibility state should be successful, when the button is eventually` +
               `- (test case id: 6eaa9c48-b786-467e-8f70-8196de34ea52)`, async (): Promise<void> => {

            await John.attemptsTo(
                Navigate.to(`/delayed`),
                See.if(Status.visible.of(disappearButton))
                   .is(Expected.to.be.falsy())
                   .repeatFor(6, 1000)
            )
        });

        it(`should return the Status description of multiple elements` +
               `- (test case id: a4c0d6ac-544f-4844-be68-e3b79b4a1bdc)`, async (): Promise<void> => {

            expect(Status.ofAll(multipleAppearButtons).toString())
                .toEqual(`Status of multiple elements
    called 'SppElementList' located by >>byCss: [data-test-id^='AppearButtonBy']<<`)

        });
    });

    describe(`the Count question`, (): void => {
        const Jonathan: Actor = Actor.named(`Jonathan`);

        beforeAll((): void => {
            Jonathan.can(BrowseTheWeb.using(browser));
        });

        it(`should return the correct number of table rows ` +
               `- (test case id: 74cbc743-7a32-428d-847e-1dc4aa8c4ddd)`, async (): Promise<void> => {

            const tableRows = all(By.css(`tr`));

            await Jonathan.attemptsTo(
                Navigate.to(`/tables`),
                See.if(Count.of(tableRows)).is(Expected.to.equal(107))
            );
        });
    });

    describe(`the Attribute question`, (): void => {
        const Jonathan: Actor = Actor.named(`Jonathan`);

        beforeAll((): void => {
            Jonathan.can(BrowseTheWeb.using(browser));
        });

        it(`on the elements attribute should return the calculated value 
        - (test case id: b9b77405-54c1-48dc-8e2e-036d9382f192)`, async (): Promise<void> => {

            const elementWithCalculatedValueAttribute = element(By.css(`[data-test-id='elementAttribute']`));
            const divWithText = element(By.css(`[data-test-id='innerHtmlTextOfDiv']`));
            const setElementsValueButton = element(By.css(`[data-test-id='setElementsValueButton']`));

            const arr: string[] = [];
            const saveTo = (text: string): void => {
                arr.push(text);
            };

            await Jonathan.attemptsTo(
                Navigate.to(`/`),
                Click.on(setElementsValueButton),
                Extract.the(Text.of(divWithText)).by(saveTo),
                See.if(Attribute
                           .of(elementWithCalculatedValueAttribute)
                           .called(`value`)
                )
                   .is((actual: string): boolean => {
                       expect(actual).toEqual(arr[0]);
                       return true;
                   })
            );
        });

        it(`on the tags attribute should return the tags value 
        - (test case id: 7e0e83eb-8744-4d1a-985f-20cc5eb24907)`, async (): Promise<void> => {

            const elementHtmlAttribute = element(By.css(`[data-test-id='htmlAttribute']`));
            const divWithText = element(By.css(`[data-test-id='innerHtmlTextOfDiv']`));
            const setElementsValueButton = element(By.css(`[data-test-id='setElementsValueButton']`));

            const arr: string[] = [];
            const saveTo = (text: string): void => {
                arr.push(text);
            };

            await Jonathan.attemptsTo(
                Navigate.to(`/`),
                Click.on(setElementsValueButton),
                Extract.the(Text.of(divWithText)).by(saveTo),
                See.if(Attribute.of(elementHtmlAttribute).called(`value`))
                   .is((actual: string): boolean => {
                       expect(actual).toEqual(arr[0], `expected tag attribute was not found`);
                       return true;
                   })
            );
        });
    });

    describe(`the Value question`, () => {

        it(`should return the questions description
        test id: 72b192c5-c996-4286-ba5a-a50636940dd5`, async () => {

            const testElement = element(By.xpath(`//tag[text()='myTestText']`));
            expect(await Value.of(testElement).toString())
                .toEqual(`Attribute 'value' of element ''SppElement' 
    located by >>byXpath: //tag[text()='myTestText']<<'`)
        });
    });

    describe(`the RemoteFileLocation question`, () => {
        const Jonathan: Actor = Actor.named(`Jonathan`);

        beforeAll((): void => {
            Jonathan.can(BrowseTheWeb.using(browser));
        });

        it(`should return the remote file location
        test id: e2045a44-6861-4563-83f5-ee3aec8e32ca`, async () => {
            const file = `${__dirname}/../../__fixtures__/upload.test`;
            const fileLocation = await RemoteFileLocation.of(file).answeredBy(Jonathan);
            expect(fileLocation).toContain(`upload.test`);
        });

        it(`should return an error when the file does not exist
        test id: 415eae82-ffff-49d0-8c8b-da9ca5093d14`, () => {
            const file = `${__dirname}/../../__fixtures__/doesNotExist.log`;

            return RemoteFileLocation.of(file).answeredBy(Jonathan)
                                     .then(() => {
                                         expect(true).toBeFalsy(`should throw an error but is doesnt`);
                                     }, (e) => {
                                         expect(e.toString()).toContain(`no such file or directory`);
                                         return Promise.resolve();
                                     })
                                     .catch((e) => {
                                         expect(e.toString()).toContain(`no such file or directory`);
                                         return Promise.resolve();
                                     });
        });
    });
});