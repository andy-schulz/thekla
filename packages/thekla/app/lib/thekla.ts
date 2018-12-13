import * as path            from "path";
import {CompletionReporter} from "../lib/reporters/CompletionReporter";
import {ConsoleReporter}    from "../lib/reporters/ConsoleReporter";

export class Thekla {
    private jasmineCore = require('jasmine-core');
    private jasmineCorePath = path.join(this.jasmineCore.files.path, 'jasmine.js');
    private jasmine = this.jasmineCore.boot(this.jasmineCore);
    private projectBaseDir = path.resolve();

    private env = this.jasmine.getEnv({suppressLoadErrors: true});
    private defaultReporterConfigured = false;

    constructor() {
        // var specDir = '';
        // var specFiles = [];
        // var helperFiles = [];
        // var requires = [];


        // var reportersCount = 0;
        // var completionReporter = new CompletionReporter();
        // var onCompleteCallbackAdded = false;
        // var exit = process.exit;
        // var showingColors = true;
        var reporter = new ConsoleReporter();



        var options: any = {};
        options.timer = this.jasmine.Timer();
        options.print = console.log;
        options.showColors = true;
        options.jasmineCorePath = this.jasmineCorePath;
        reporter.setOptions(options);
        this.env.addReporter(reporter);
        this.defaultReporterConfigured = true;
    }

    loadSpecs(specs: string[]) {
        if(specs.length == 0) {
            throw new Error(`no Specs found.`)
        }

        for(let spec of specs) {
            require(this.projectBaseDir + "/" + spec);
        }
    }

    run() {
        this.env.execute();
    }
}



