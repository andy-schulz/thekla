interface TestResult {
    overallStatus: string;
}

export class CompletionReporter {
    private completed: boolean = false;
    private _onCompleteCallback: Function = () => {};
    constructor() {

    }

    onCompleteCallback(): Function {
        return this._onCompleteCallback;
    };

    onComplete(callback: Function) {
        this._onCompleteCallback = callback;
    };

    jasmineDone(result: TestResult) {
        this.completed = true;
        this._onCompleteCallback(result.overallStatus === 'passed');
    };

    isComplete() {
        return this.completed;
    };
};
