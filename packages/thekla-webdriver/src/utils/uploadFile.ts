/**
 * the upload file functionality is used from the webdriveio project and updated to be used the
 * context of thekla
 */

import archiver  from "archiver";
import fs        from 'fs'
import path      from 'path'
import {Client} from 'webdriver';

export default async function uploadFile(localPath: string, client: Client): Promise<string> {
    return new Promise((resolve, reject) => {
        if (!client)
            return reject(`number or type of arguments don't agree with uploadFile command`);

        /**
         * parameter check
         */
        if (typeof localPath !== `string`) {
            return reject(`number or type of arguments don't agree with uploadFile command`)
        }

        /**
         * check if command is available
         */
        if (typeof client.file !== `function`) {
            return reject(`The uploadFile command is not available in ${(client as unknown as any).capabilities}`)
        }

        const zipData: Uint8Array[] = [];
        const source = fs.createReadStream(localPath);
        source.on(`error`, reject);

        archiver(`zip`)
            .on(`error`, reject)
            .on(`data`, (data: Uint8Array) => zipData.push(data))
            .on(`end`, () => (client.file(Buffer.concat(zipData).toString(`base64`)) as unknown as Promise<string>).then((filePath: string) => resolve(filePath), reject))
            .append(source, {name: path.basename(localPath)})
            .finalize()
            .then(() => `done`, reject)
            .catch(reject)
    })
}