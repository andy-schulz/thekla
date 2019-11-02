const fs = require("fs");
const moment = require("moment");

const tagName = process.env.CIRCLE_TAG ? `${CIRCLE_TAG}_` : ``;

const buildName = `${tagName}${moment().format(`YYYY-MM-DD_HH:mm:ss`)}`;

const  wstream = fs.createWriteStream(`.build`);
wstream.write(`BUILD_NAME=${buildName}`);
wstream.end();

