import {Expected}                                                            from "@thekla/assertion";
import {DesiredCapabilities, ServerConfig}                                   from "@thekla/config";
import {Actor, See}                                                          from "@thekla/core";
import {getStandardTheklaDesiredCapabilities, getStandardTheklaServerConfig} from "@thekla/support";
import {By, RunningBrowser, UntilElement}                                    from "@thekla/webdriver"
import {BrowseTheWeb, element, Hover, Navigate, Status, Text}                from "..";

describe(`Hover`, (): void => {

    const conf: ServerConfig = getStandardTheklaServerConfig();
    const capabilities: DesiredCapabilities = getStandardTheklaDesiredCapabilities(`hover_interaction.ts`);

    const testUrl = process.env.BASEURL ? process.env.BASEURL : `http://localhost:3000`;

    beforeAll((): void => {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;
    });

    describe(`over a web element`, (): void => {
        const userIcon = element(By.css(`[data-test-id='user-icon-no-hover']`))
            .shallWait(UntilElement.is.visible.forAsLongAs(5000))
            .called(`The user icon which displays an information box when hovered upon`);

        const userIconWithHoverInfo = element(By.css(`[data-test-id='usericon']`))
            .shallWait(UntilElement.is.visible.forAsLongAs(5000))
            .called(`The user icon which displays an information box when hovered upon`);

        const userName = element(By.css(`[data-test-id='hoverusername']`))
            // .shallWait(UntilElement.is.visible.forAsLongAs(5000))
            .called(`the user name inside the hover information box`);

        const Howard = Actor.named(`Howard`);

        beforeAll((): void => {
            // and give him the ability to browse the web using a browser of your choice
            Howard.whoCan(BrowseTheWeb.using(RunningBrowser.startedOn(conf).withCapabilities(capabilities)));
        });

        it(`should display additional information 
        - (test case id: f45a3fa4-896c-47d7-bc2f-d77d07a046d3)`, (): Promise<void> => {
            return Howard.attemptsTo(
                Navigate.to(`${testUrl}/pointeractions`),
                See.if(Status.visible.of(userName)).is(Expected.to.be.falsy()),
                Hover.over(userIconWithHoverInfo),
                See.if(Status.visible.of(userName)).is(Expected.to.be.truthy()),
                See.if(Text.of(userName)).is(Expected.to.equal(`Name: User Name`))
            )
        });

        it(`should hide the hover element when the pointer is moved away 
        - (test case id: 6347d82f-c2a2-4bdb-8913-9633f0849352)`, (): Promise<void> => {
            return Howard.attemptsTo(
                Navigate.to(`${testUrl}/pointeractions`),
                See.if(Status.visible.of(userName))
                   .is(Expected.to.be.falsy()),
                Hover.over(userIconWithHoverInfo),
                See.if(Status.visible.of(userName))
                   .is(Expected.to.be.truthy())
                   .repeatFor(3, 1000),
                See.if(Text.of(userName)).is(Expected.to.equal(`Name: User Name`)),
                Hover.over(userIcon),
                See.if(Status.visible.of(userName)).is(Expected.to.be.falsy())
            )
        }, 50000); // dont change the timeout, the url resolve via proxy takes a while

        afterAll((): Promise<void[]> => {
            return RunningBrowser.cleanup();
        })
    });
});