#!/usr/bin/env node

import minimist    from "minimist";
import {getLogger} from "@log4js-node/log4js-api";
import {run}       from "../lib/Runner";

const logger = getLogger();
const args = minimist(process.argv.slice(2));

run(args)
    .then(() => {
        logger.info(`THEKLA DONE`)
    })
    .catch(() => {
        process.exit(1);
    });