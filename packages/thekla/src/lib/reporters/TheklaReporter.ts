import jasmine  from "jasmine";

interface Entry {
    description: string;
    assertions: any[];
    duration: number;
}

export class TheklaReporter implements jasmine.CustomReporter, jasmine.Reporter {
    // private emitter: any;
    public testResult: any[] = [];
    public failedCount = 0;
    private startTime: Date;

    constructor() {
        // this.emitter = emitter;
    }

    reportRunnerStarting(runner: jasmine.Runner): void {
        throw new Error(`Method not implemented.`);
    }
    reportRunnerResults(runner: jasmine.Runner): void {
        throw new Error(`Method not implemented.`);
    }
    reportSuiteResults(suite: jasmine.Suite): void {
        throw new Error(`Method not implemented.`);
    }
    reportSpecStarting(spec: jasmine.Spec): void {
        throw new Error(`Method not implemented.`);
    }
    reportSpecResults(spec: jasmine.Spec): void {
        throw new Error(`Method not implemented.`);
    }
    log(str: string): void {
        throw new Error(`Method not implemented.`);
    }

    jasmineStarted() {
        this.startTime = new Date();
    }

    specStarted() {
        this.startTime = new Date();
    }

    specDone(result: any) {
        const specInfo = {
            name: result.description,
            category: result.fullName.slice(0, -result.description.length).trim()
        };
        if (result.status == `passed`) {
            // this.emitter.emit('testPass', specInfo);
        } else if (result.status == `failed`) {
            // this.emitter.emit('testFail', specInfo);
            this.failedCount++;
        }

        const entry: Entry = {
            description: result.fullName,
            assertions: [],
            duration: new Date().getTime() - this.startTime.getTime()
        };

        if (result.failedExpectations.length === 0) {
            entry.assertions.push({
                passed: true
            });
        }

        result.failedExpectations.forEach((item: any) => {
            entry.assertions.push({
                passed: item.passed,
                errorMsg: item.passed ? undefined : item.message,
                stackTrace: item.passed ? undefined : item.stack
            });
        });
        this.testResult.push(entry);
    }
}