// #!/usr/bin/env node
import * as minimist from "minimist";
import {Command}     from "../lib/command";
import {Thekla}      from "../lib/thekla";


console.log(process.argv);

const args: minimist.ParsedArgs = require('minimist')(process.argv.slice(2));

const thekla = new Thekla();
const command = new Command(thekla, args);
command.run();


// const args = minimist(process.argv.slice(2));
// const command = new Command(args);

// console.log(require.resolve('jasmine'));
// var jasmine = new Jasmine({ projectBaseDir: path.resolve() });
// var examplesDir = path.join(path.dirname(require.resolve('jasmine-core')), 'jasmine-core', 'example', 'node_example');
// var command = new Command(path.resolve(), examplesDir, console.log);
//
// command.run(jasmine, process.argv.slice(2));



