interface Entry {
    description: string;
    assertions: any[];
    duration: number;
}

export class TheklaReporter {
    // private emitter: any;
    public testResult: any[] = [];
    public failedCount = 0;
    private startTime: Date;

    constructor() {
        // this.emitter = emitter;
    }

    jasmineStarted() {
        this.startTime = new Date();
    }

    specStarted() {
        this.startTime = new Date();
    };

    specDone(result: any) {
        const specInfo = {
            name: result.description,
            category: result.fullName.slice(0, -result.description.length).trim()
        };
        if (result.status == 'passed') {
            // this.emitter.emit('testPass', specInfo);
        } else if (result.status == 'failed') {
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
    };
};