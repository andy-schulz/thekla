const pack = require(`../../../package.json`);
export const versionText = (): void => {
    console.log(`thekla version: ${pack.version}`)
};