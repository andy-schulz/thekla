import {ServerConfig}                             from "@thekla/config";
import {ScreenshotOptions, BrowserScreenshotData} from "../../interface/Browser";
import {ClientWdio}                               from "../../wdio/ClientWdio";
import _                                          from "lodash";
import {ClientHelper}                             from "./ClientHelper";

export class RunningBrowser {

    public static startedOn(config: ServerConfig): ClientHelper {
        return new ClientHelper(config as ServerConfig);
    }

    // function returns an array of Browser implementations
    // right now there is only the BrowserWdjs implementation
    // other implementations can be added here
    public static cleanup(): Promise<void[]> {
        return ClientWdio.cleanup()
    }

    public static takeScreenshots(options?: ScreenshotOptions): Promise<BrowserScreenshotData[]> {
        return Promise.all([ClientWdio.takeScreenshots(options)])
            .then((screenshots: BrowserScreenshotData[][]): BrowserScreenshotData[] => {
                return _.flatten(screenshots);
            });
        // return BrowserWdjs.takeScreenshots()
    }

    public static saveScreenshots(filePath: string, baseFileName: string): Promise<string[]> {
        return Promise.all([
            ClientWdio.saveScreenshots(filePath, baseFileName)])
            .then((screenshots: string[][]): string[] => {
                return _.flatten(screenshots)
            });
        // return BrowserWdjs.saveScreenshots(filePath, baseFileName);
    }
}