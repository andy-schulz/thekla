interface TestResult {
    overallStatus: string;
}

export class CompletionReporter {
    private completed = false;
    private _onCompleteCallback: Function = () => {};

    onCompleteCallback(): Function {
        return this._onCompleteCallback;
    };

    onComplete(callback: Function): void {
        this._onCompleteCallback = callback;
    };

    jasmineDone(result: TestResult): void {
        this.completed = true;
        this._onCompleteCallback(result.overallStatus === `passed`);
    };

    isComplete(): boolean {
        return this.completed;
    };
};
