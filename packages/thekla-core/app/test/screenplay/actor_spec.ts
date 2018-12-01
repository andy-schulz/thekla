import {
    Actor, BrowseTheWeb, Config, BrowserFactory, Enter, Wait, Navigate, See, Key, Value, all, By, Count, Text
} from "../..";
import {GoogleSearch}     from "../PageObjects/GoogleSearch/GoogleSearch";
import {Add}              from "../PageObjects/GoogleCalculator/Add";
import {GoogleCalculator} from "../PageObjects/GoogleCalculator/GoogleCalculator";

let config: Config = {
    browserName: "chrome",
    serverUrl: "http://localhost:4444/wd/hub",
    // firefoxOptions: {
    //     binary: "C:\\PProgramme\\FirefoxPortable\\App\\Firefox\\firefox.exe",
        // proxy: {
        //     proxyType: "direct"
        // }
    // }
};


describe('Searching on Google', () => {
    let andy: Actor;

    beforeAll(() => {
        andy = Actor.named("Andy");
        andy.whoCan(BrowseTheWeb.using(BrowserFactory.create(config)));
    });

    it('for calculator should show the Google calculator', async () => {

        const  match = (text: string) => {
            return (test: string) => expect(test).toEqual(text);
        };


        await andy.attemptsTo(
            Navigate.to("https://www.google.de"),
            Enter.value("calculator").into(GoogleSearch.searchField),
            Enter.value(Key.ENTER).into(GoogleSearch.searchField),
            Wait.for(500),
            Add.number(1).to(5),
            See.if(Text.of(GoogleCalculator.input)).fulfills(match("6")),
            Wait.for(500),
        );

    }, 20000);

    it('for calculator should show the Google calculator', async () => {
        const  match = (text: string) => {
            return (test: string) => expect(test).toEqual(text);
        };
        await andy.attemptsTo(
            Navigate.to("https://www.google.de"),
            Enter.value("calculator").into(GoogleSearch.searchField),
            Enter.value(Key.ENTER).into(GoogleSearch.searchField),
            Wait.for(500),
            Add.number(1).to(5),
            See.if(Value.of(GoogleCalculator.input)).fulfills(match("6")),
            Wait.for(500),
        );

    }, 20000);

    it('for calculator with the all method', async () => {

        const tableRows = all(By.css("tr"));
        let matcher: (count: number) => boolean = (count: number ) => expect(count).toEqual(6);
        await andy.attemptsTo(
            Navigate.to("http://localhost:3000"),
            See.if(Count.of(tableRows)).fulfills(matcher),
        );
    }, 20000);

    afterAll(() => {
        BrowserFactory.cleanup();
    })
});