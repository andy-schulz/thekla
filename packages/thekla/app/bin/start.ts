// #!/usr/bin/env node
import * as minimist from "minimist";
import {Command}     from "../lib/command";
import {Thekla}      from "../lib/thekla";
import {configure} from "log4js";
configure(`config/log4js/log4js.json`);

const args: minimist.ParsedArgs = require('minimist')(process.argv.slice(2));

const thekla = new Thekla();
const command = new Command(thekla, args);
command.run().then(() => {
    console.log("DONE")
});


// const args = minimist(process.argv.slice(2));
// const command = new Command(args);

// console.log(require.resolve('jasmine'));
// var jasmine = new Jasmine({ projectBaseDir: path.resolve() });
// var examplesDir = path.join(path.dirname(require.resolve('jasmine-core')), 'jasmine-core', 'example', 'node_example');
// var command = new Command(path.resolve(), examplesDir, console.log);
//
// command.run(jasmine, process.argv.slice(2));



