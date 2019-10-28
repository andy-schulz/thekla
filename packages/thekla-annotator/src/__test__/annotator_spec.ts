import {getNewStandardWdioConfig} from "@thekla/support";
import WebDriver                  from "webdriver"
import {AnnotatorWdio}            from "../lib/AnnotatorWdio";
import {getStyle}                 from "./__client_side_scripts__/getStyle";


describe(`Using the Annotator`, (): void => {
    let client: WebDriver.Client;

    const conf: WebDriver.Options = getNewStandardWdioConfig();

    const baseUrl = process.env.BASEURL ? process.env.BASEURL : `http://localhost:3000`;
    // conf.annotateElement = true;

    // setBrowserStackSessionName(capabilities, `annotator_spec.ts`);
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;
    beforeAll(async (): Promise<void> => {
        client = await WebDriver.newSession(conf);
    });

    afterAll(async (): Promise<void> => {
        await client.deleteSession()
    });

    describe(`to highlight an element`, (): void => {
        let searchInput: any;
        let searchInput2: any;

        it(`should fail when an empty element is passed 
        - (test case id: 51ca3807-06ee-43ff-97bf-643400f60488)`, async (): Promise<void> => {
            let emptyElement: any;
            await client.navigateTo(baseUrl);
            await AnnotatorWdio.highlight(emptyElement)(client)
                .then(() => {
                    expect(false).toBeTruthy(`AnnotatorWdio.highlight() should reject the promise in case an empty element is passed, but it doesn't`)
                })
                .catch((e) => {
                    expect(e.toString()).toEqual(`cant annotate an empty element`);
                })
        });

        it(`should set and unset the style
        - (test case id: 9f5d9b10-f864-45ed-8d85-8ce1c661300f)`, async (): Promise<void> => {

            await client.navigateTo(baseUrl);
            searchInput = await client.findElement(`css selector`, `[data-test-id='LoginExampleRow1'] #exampleEmail`);
            searchInput2 = await client.findElement(`css selector`, `[data-test-id='LoginExampleRow2'] #exampleEmail`);

            const execFunc = `return (${getStyle()}).apply(null, arguments)`;

            const styleBeforeHighlight = await client.executeScript(execFunc, [`[data-test-id='LoginExampleRow1'] #exampleEmail`]);
            expect(styleBeforeHighlight).toBeNull();

            await AnnotatorWdio.highlight(searchInput)(client);

            const styleAfterHighlight = await client.executeScript(execFunc, [`[data-test-id='LoginExampleRow1'] #exampleEmail`]);
            expect(styleAfterHighlight.trim()).toEqual(`/* annotation start */ color: red; border: 2px solid red; /* annotation end */`);

            await AnnotatorWdio.highlight(searchInput2)(client);

            const styleAfterReset = await client.executeScript(execFunc, [`[data-test-id='LoginExampleRow1'] #exampleEmail`]);
            expect(styleAfterReset).toBeNull();

            const style2AfterReset = await client.executeScript(execFunc, [`[data-test-id='LoginExampleRow2'] #exampleEmail`]);
            expect(style2AfterReset.trim()).toEqual(`/* annotation start */ color: red; border: 2px solid red; /* annotation end */`);

        });

        it(`should reset the Annotator and highlight both elements
        - (test case id: 70c2f29a-0a3e-4d41-a0ee-697884357232)`, async (): Promise<void> => {

            await client.navigateTo(baseUrl);
            searchInput = await client.findElement(`css selector`, `[data-test-id='LoginExampleRow1'] #exampleEmail`);
            searchInput2 = await client.findElement(`css selector`, `[data-test-id='LoginExampleRow2'] #exampleEmail`);

            const execFunc = `return (${getStyle()}).apply(null, arguments)`;

            const styleBeforeHighlight = await client.executeScript(execFunc, [`[data-test-id='LoginExampleRow1'] #exampleEmail`]);
            expect(styleBeforeHighlight).toBeNull();

            await AnnotatorWdio.highlight(searchInput)(client);

            const styleAfterHighlight = await client.executeScript(execFunc, [`[data-test-id='LoginExampleRow1'] #exampleEmail`]);
            expect(styleAfterHighlight.trim()).toEqual(`/* annotation start */ color: red; border: 2px solid red; /* annotation end */`);

            await AnnotatorWdio.resetHighlighter(client);

            const styleAfterResetHighlight = await client.executeScript(execFunc, [`[data-test-id='LoginExampleRow1'] #exampleEmail`]);
            expect(styleAfterResetHighlight.trim()).toEqual(`/* annotation start */ color: red; border: 2px solid red; /* annotation end */`);


            await AnnotatorWdio.highlight(searchInput2)(client);

            const style1AfterSecondHighlight = await client.executeScript(execFunc, [`[data-test-id='LoginExampleRow1'] #exampleEmail`]);
            expect(style1AfterSecondHighlight.trim()).toEqual(`/* annotation start */ color: red; border: 2px solid red; /* annotation end */`);

            const style2AfterSecondHighlight = await client.executeScript(execFunc, [`[data-test-id='LoginExampleRow2'] #exampleEmail`]);
            expect(style2AfterSecondHighlight.trim()).toEqual(`/* annotation start */ color: red; border: 2px solid red; /* annotation end */`);
        });

        it(`should not throw an error when the element to be highlighted does not exist 
        - (test case id: 178f5d62-74a2-4429-9665-0fa0437b5d6c)`, async (): Promise<void> => {
            await client.navigateTo(baseUrl);

            searchInput = await client.findElement(`css selector`, `[data-test-id='LoginExampleRow1'] #exampleEmail`);

            await client.navigateTo(baseUrl);

            const error = await AnnotatorWdio.highlight(searchInput)(client);

            expect(error).toContain(`stale element reference`)

        });

        it(`should not throw an error when the element to be unhighlighted does not exist 
        - (test case id: 178f5d62-74a2-4429-9665-0fa0437b5d6c)`, async (): Promise<void> => {
            await client.navigateTo(baseUrl);

            searchInput = await client.findElement(`css selector`, `[data-test-id='LoginExampleRow1'] #exampleEmail`);

            await AnnotatorWdio.highlight(searchInput)(client);

            await client.navigateTo(baseUrl);

            searchInput = await client.findElement(`css selector`, `[data-test-id='LoginExampleRow1'] #exampleEmail`);

            const error = await AnnotatorWdio.highlight(searchInput)(client);

            expect(error).toContain(`element highlighted`)

        });
    });

    describe(`to show the element search  message`, (): void => {

        it(`should show and remove the message 
        - (test case id: 671178e0-fe12-4ca8-a91d-3854cd531f3c)`, async (): Promise<void> => {

            const test = "test";

            await client.navigateTo(baseUrl);

            await AnnotatorWdio.displayTestMessage(`This is a message`)(client);

            const execFunc = `return (${getStyle()}).apply(null, arguments)`;

            const styleMessage = await client.executeScript(execFunc, [`.alert`]);

            expect(styleMessage).toEqual(`z-index: 1000000;padding: 5px;background-color: #f96b6b; /* Red */color: white;position: fixed;opacity: 0.7;font-size: 15px;top: 0;left: 0;right: 0;margin: auto;text-align: center;`);

            await AnnotatorWdio.hideTestMessage(client);

            const goneMessage = await client.executeScript(execFunc, [`.alert`]);

            expect(goneMessage).toContain(`display: none;`);
        });

        it(`should not reject the promise when the test message to hide is not available 
        - (test case id: 2eb84e8d-50ba-4995-8d16-0f5f3deae50b)`, async (): Promise<void> => {

            await client.navigateTo(baseUrl);

            await AnnotatorWdio.hideTestMessage(client)
                .catch((e: Error) => {
                    expect(false).toBeTruthy(`hiding a non existing test message should not throw an error, but it does`)
                });
        });
    });
});