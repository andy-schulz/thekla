// #!/usr/bin/env node
import * as minimist from "minimist";
import {Command}     from "../lib/command";
import {Thekla}      from "../lib/thekla";
import {configure, getLogger} from "log4js";
configure(`config/log4js/log4js.json`);

const logger = getLogger();
const args: minimist.ParsedArgs = require('minimist')(process.argv.slice(2));

const thekla = new Thekla();
const command = new Command(thekla, args);
command.run().then(() => {
    logger.info("THEKLA DONE")
});



