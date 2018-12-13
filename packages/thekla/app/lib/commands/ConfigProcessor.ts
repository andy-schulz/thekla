export interface TheklaConfig {
    [key: string]: any;

    specs: string[];

    seleniumConfig: SeleniumConfig;
    restConfig: RestConfig;
    params?: {
        [key: string]: string | object
    };
    testFramework: TestFramework;
}

type CapabilitiesFunction = () => Capabilities[]

interface SeleniumConfig {
    multiBrowserTest?: boolean;
    capabilities: Capabilities[] | CapabilitiesFunction;
}

interface Capabilities {
    [key: string]: any;

    browserName?: string;
    seleniumServerAddress?: string;
    baseUrl?: string;


    firefoxConfig?: {
        path: string
    };

    chromeConfig?: {
        path: string;
    };
}

interface RestConfig {}

interface TestFramework {
    frameworkName: "jasmine" | "cucumber"
    options: JasmineOptions | CucumberOptions
}

interface JasmineOptions {}
interface CucumberOptions {}

export class ConfigProcessor {
    constructor(config: TheklaConfig) {
    }
}