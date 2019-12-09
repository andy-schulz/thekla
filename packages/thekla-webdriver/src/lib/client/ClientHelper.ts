import {getLogger}                                         from "@log4js-node/log4js-api";
import {DesiredCapabilities, ServerConfig}                 from "@thekla/config";
import {Browser, BrowserScreenshotData, ScreenshotOptions} from "../../interface/Browser";
import {ClientWdio}                                        from "../../wdio/ClientWdio";
import _                                                   from "lodash";
import {WebElementListWd}                                  from "../element/WebElementListWd";

export class ClientHelper {

    public withCapabilities(capabilities: DesiredCapabilities): Browser {
        return ClientWdio.create({serverConfig: this.config, capabilities: capabilities});
    }

    public constructor(private config: ServerConfig) {
        if(config?.automationFramework?.waitToBeVisibleForAsLongAs)
            WebElementListWd.implicitlyWaitFor = config.automationFramework.waitToBeVisibleForAsLongAs;
    }

    public static create(conf: ServerConfig, capabilities: DesiredCapabilities, clientName?: string): Browser {
        return ClientWdio.create({serverConfig: conf, capabilities: capabilities, clientName: clientName});
    }

    public static attachToSession(conf: ServerConfig, capabilities: DesiredCapabilities, sessionId: string, clientName?: string): Browser {
        return ClientWdio.create({serverConfig: conf, capabilities: capabilities, sessionId: sessionId, clientName: clientName});
    }

    public static cleanup(browserToClean: Browser[] = [], cleanAttachedSession = false): Promise<void[]> {
        return ClientWdio.cleanup(browserToClean, cleanAttachedSession);
    }

    public static get availableSessions(): string[] {
        return [...ClientWdio.availableNewClients]
    }

    public static get availableAttachedSessions(): string[] {
        return [...ClientWdio.availableAttachedClients]
    }

    public static getClient(clientName: string): Browser | undefined {
        return ClientWdio.getClientByName(clientName)
    }

    public static takeScreenshots(options?: ScreenshotOptions): Promise<BrowserScreenshotData[]> {
        return Promise.all([ClientWdio.takeScreenshots(options)])
            .then((screenshots: BrowserScreenshotData[][]) => {
                return _.flatten(screenshots)
            });
    }

    public static saveScreenshots(filepath: string, baseFileName: string): Promise<string[]> {
        return Promise.all([
            ClientWdio.saveScreenshots(filepath, baseFileName)])
            .then((screenshots: string[][]) => {
                return _.flatten(screenshots)
            });
    }
}

const cleanUpLogger = getLogger(`CLEANUP  FUNCTION`);
export function cleanupClients(browserMap: Map<string, Browser>, browserToClean?: Browser[]): Promise<void[]> {

    if (browserToClean && browserToClean.length > 0) {
        const browserCleanupPromises: Promise<void>[] = [];

        const entries = [...browserMap.entries()];
        browserToClean.map((browser: Browser): void => {
            entries.map((browserEntry: [string, Browser]): void => {
                if (browser === browserEntry[1]) {
                    browserCleanupPromises.push(browser.quit());
                    browserMap.delete(browserEntry[0]);
                }
            });
        });

        return Promise.all(browserCleanupPromises);
    }

    return Promise.all(
        [...browserMap.values()]
            .map((browser): Promise<void> => {
                cleanUpLogger.debug(`Quit browser:`);
                return browser.quit();
            })
    )
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .then((result: any[]): any[] => {
            cleanUpLogger.debug(`Clear BrowserMap BEFORE ${browserMap.size} : ${[...browserMap.keys()]}`);
            browserMap.clear();
            cleanUpLogger.debug(`Clear BrowserMap AFTER ${browserMap.size}`);
            return result;
        }).catch((e: Error) => {
            cleanUpLogger.debug(`Caught Error while deleting client sessions. ${e}`);
            browserMap.clear();
            // in case a session delete went wrong just return an empty Array
            return [];
        })
}