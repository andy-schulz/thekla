import {configure}                                                                      from "log4js";
import {getStandardTheklaServerConfig, getStandardTheklaDesiredCapabilities}            from "@thekla/support";
import {ServerConfig, DesiredCapabilities}                                              from "@thekla/config";
import {Actor, See}                                                           from "@thekla/core";
import {BrowseTheWeb, RunningBrowser, element, By, frame, Text, UntilElement, Navigate} from "..";
import { Expected } from "@thekla/assertion";

configure(`src/__test__/__config__/log4js.json`);

describe(`Locating Elements inside Frames`, (): void => {

    const config: ServerConfig = getStandardTheklaServerConfig();
    const capabilities: DesiredCapabilities = getStandardTheklaDesiredCapabilities(`spp_frame_spec.ts`);

    let Francine: Actor;

    beforeAll((): void => {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;
        Francine = Actor.named(`Francine`);
        Francine.whoCan(BrowseTheWeb.using(RunningBrowser.startedOn(config).withCapabilities(capabilities)));
    });

    afterAll(async (): Promise<void[]> => {
        return RunningBrowser.cleanup();
    });

    it(`a separate frame change should not be necessary 
    - (test case id: 68f90a8c-ec6c-445b-8276-14af079fc008)`, async (): Promise<void> => {
        const button = element(By.css(`.buttonoutsideframes button`));

        const frame1 = frame(By.css(`.frame-button-in-single-frame`));
        const button1 = frame1.element(By.css(`.btn-secondary`));

        const frame21 = frame(By.css(`.button-in-two-frames`));
        const frame22 = frame21.frame(By.css(`.frame-button-in-single-frame`));
        const button2 = frame22.element(By.css(`.btn-secondary`));

        await Francine.attemptsTo(
            Navigate.to(`/nestedFrames`),
            See.if(Text.of(button)).is(Expected.to.equal(`Button outside of Frame`)),
            See.if(Text.of(button1)).is(Expected.to.equal(`Button inside single frame`)),
            See.if(Text.of(button)).is(Expected.to.equal(`Button outside of Frame`)),
            See.if(Text.of(button2)).is(Expected.to.equal(`Button nested inside frame of frame`)),
            See.if(Text.of(button)).is(Expected.to.equal(`Button outside of Frame`))
        );

    });

    it(`should be possible with wait actions on each frame 
    - (test case id: 19b9fce2-c15b-4b52-a9d5-4211b26602da)`, async (): Promise<void> => {
        const button = element(By.css(`.buttonoutsideframes button`));

        const frame1 = frame(By.css(`.frame-button-in-single-frame`));
        const button1 = frame1.element(By.css(`.btn-secondary`))
                              .shallWait(UntilElement.is.visible.forAsLongAs(5000));

        const frame21 = frame(By.css(`.button-in-two-frames`));
        const frame22 = frame21.frame(By.css(`.frame-button-in-single-frame`));
        const button2 = frame22.element(By.css(`.btn-secondary`))
                               .shallWait(UntilElement.is.visible.forAsLongAs(5000));

        await Francine.attemptsTo(
            Navigate.to(`/nestedFrames`),
            See.if(Text.of(button)).is(Expected.to.equal(`Button outside of Frame`)),
            See.if(Text.of(button1)).is(Expected.to.equal(`Button inside single frame`)),
            See.if(Text.of(button)).is(Expected.to.equal(`Button outside of Frame`)),
            See.if(Text.of(button2)).is(Expected.to.equal(`Button nested inside frame of frame`)),
            See.if(Text.of(button)).is(Expected.to.equal(`Button outside of Frame`))
        );

    });
});
