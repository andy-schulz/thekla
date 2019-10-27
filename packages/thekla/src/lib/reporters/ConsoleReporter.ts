const noopTimer = {
    start: function(){},
    elapsed: function(){ return 0; }
};

export interface JasmineOptions {
    print?: () => {};
    showColors?: boolean;
    timer?: any;
    jasmineCorePath?: string;
    stackFilter?: any;
    order?: {
        random?: boolean;
        seed?: number;
    }
}

interface Ansi {
    [key: string]: string;
};


export class ConsoleReporter {

    private  print = function(...args: string[]) {};
    private showColors = false;
    private timer = noopTimer;
    private jasmineCorePath: string | null = null;
    private specCount: number;
    private executableSpecCount: number;
    private failureCount: number;
    private failedSpecs: any[] = [];
    private pendingSpecs: any[] = [];
    private ansi: Ansi = {
            green: '\x1B[32m',
            red: '\x1B[31m',
            yellow: '\x1B[33m',
            none: '\x1B[0m'
        };
    private failedSuites: any[] = [];
    private stackFilter = this.defaultStackFilter;

    setOptions(options: JasmineOptions) {
        if (options.print) {
            this.print = options.print;
        }
        this.showColors = options.showColors || false;
        if (options.timer) {
            this.timer = options.timer;
        }
        if (options.jasmineCorePath) {
            this.jasmineCorePath = options.jasmineCorePath;
        }
        if (options.stackFilter) {
            this.stackFilter = options.stackFilter;
        }
    };

    jasmineStarted(options: JasmineOptions) {
        this.specCount = 0;
        this.executableSpecCount = 0;
        this.failureCount = 0;
        if (options && options.order && options.order.random) {
            this.print('Randomized with seed ' + options.order.seed);
            this.printNewline();
        }
        this.print('Started');
        this.printNewline();
        this.timer.start();
    };

    jasmineDone(result: any) {
        this.printNewline();
        this.printNewline();
        if(this.failedSpecs.length > 0) {
            this.print('Failures:');
        }
        for (var i = 0; i < this.failedSpecs.length; i++) {
            this.specFailureDetails(this.failedSpecs[i], i + 1);
        }

        for(i = 0; i < this.failedSuites.length; i++) {
            this.suiteFailureDetails(this.failedSuites[i]);
        }

        if (result && result.failedExpectations && result.failedExpectations.length > 0) {
            this.suiteFailureDetails(result);
        }

        if (this.pendingSpecs.length > 0) {
            this.print("Pending:");
        }
        for(i = 0; i < this.pendingSpecs.length; i++) {
            this.pendingSpecDetails(this.pendingSpecs[i], i + 1);
        }

        if(this.specCount > 0) {
            this.printNewline();

            if(this.executableSpecCount !== this.specCount) {
                this.print('Ran ' + this.executableSpecCount + ' of ' + this.specCount + this.plural(' spec', this.specCount));
                this.printNewline();
            }
            let specCounts = this.executableSpecCount + ' ' + this.plural('spec', this.executableSpecCount) + ', ' +
                this.failureCount + ' ' + this.plural('failure', this.failureCount);

            if (this.pendingSpecs.length) {
                specCounts += ', ' + this.pendingSpecs.length + ' pending ' + this.plural('spec', this.pendingSpecs.length);
            }

            this.print(specCounts);
        } else {
            this.print('No specs found');
        }

        this.printNewline();
        var seconds = this.timer.elapsed() / 1000;
        this.print('Finished in ' + seconds + ' ' + this.plural('second', seconds));
        this.printNewline();

        if (result && result.overallStatus === 'incomplete') {
            this.print('Incomplete: ' + result.incompleteReason);
            this.printNewline();
        }

        if (result && result.order && result.order.random) {
            this.print('Randomized with seed ' + result.order.seed);
            this.print(' (jasmine --random=true --seed=' + result.order.seed + ')');
            this.printNewline();
        }
    };

    specDone(result: any) {
        this.specCount++;

        if (result.status == 'pending') {
            this.pendingSpecs.push(result);
            this.executableSpecCount++;
            this.print(this.colored('yellow', '*'));
            return;
        }

        if (result.status == 'passed') {
            this.executableSpecCount++;
            this.print(this.colored('green', '.'));
            return;
        }

        if (result.status == 'failed') {
            this.failureCount++;
            this.failedSpecs.push(result);
            this.executableSpecCount++;
            this.print(this.colored('red', 'F'));
        }
    };

    suiteDone(result: any) {
        if (result.failedExpectations && result.failedExpectations.length > 0) {
            this.failureCount++;
            this.failedSuites.push(result);
        }
    };
    
    printNewline() {
        // this.print('\n');
    }

    colored(color: any, str: any) {
        return this.showColors ? (this.ansi[color] + str + this.ansi.none) : str;
    }

    plural(str: any, count: any) {
        return count == 1 ? str : str + 's';
    }

    repeat(thing: any, times: any) {
        var arr = [];
        for (var i = 0; i < times; i++) {
            arr.push(thing);
        }
        return arr;
    }

    indent(str: any, spaces: any) {
        var lines = (str || '').split('\n');
        var newArr = [];
        for (var i = 0; i < lines.length; i++) {
            newArr.push(this.repeat(' ', spaces).join('') + lines[i]);
        }
        return newArr.join('\n');
    }

    defaultStackFilter(stack: any) {
        if (!stack) {
            return '';
        }

        let filteredStack = stack.split('\n').filter((stackLine: any) => {
            return stackLine.indexOf(this.jasmineCorePath) === -1;
        }).join('\n');
        return filteredStack;
    }

    specFailureDetails(result: any, failedSpecNumber: any) {
        this.printNewline();
        this.print(failedSpecNumber + ') ');
        this.print(result.fullName);
        this.printFailedExpectations(result);
    }

    suiteFailureDetails(result: any) {
        this.printNewline();
        this.print('Suite error: ' + result.fullName);
        this.printFailedExpectations(result);
    }

    printFailedExpectations(result: any) {
        for (var i = 0; i < result.failedExpectations.length; i++) {
            var failedExpectation = result.failedExpectations[i];
            this.printNewline();
            this.print(this.indent('Message:', 2));
            this.printNewline();
            this.print(this.colored('red', this.indent(failedExpectation.message, 4)));
            this.printNewline();
            this.print(this.indent('Stack:', 2));
            this.printNewline();
            this.print(this.indent(this.stackFilter(failedExpectation.stack), 4));
        }

        this.printNewline();
    }

    pendingSpecDetails(result: any, pendingSpecNumber: any) {
        this.printNewline();
        this.printNewline();
        this.print(pendingSpecNumber + ') ');
        this.print(result.fullName);
        this.printNewline();
        let pendingReason = "No reason given";
        if (result.pendingReason && result.pendingReason !== '') {
            pendingReason = result.pendingReason;
        }
        this.print(this.indent(this.colored('yellow', pendingReason), 2));
        this.printNewline();
    }
}
