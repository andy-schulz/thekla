import { Logger }            from "log4js";

export const parseBrowserVersion = (browserVersion?: string): {major: number; minor: number; patch: number} => {
    const version = {
        major: 0,
        minor: 0,
        patch: 0,
    };

    if(!browserVersion)
        return version;

    const majorStringVersion = browserVersion.split(`.`);

    if(majorStringVersion.length < 1)
        return version;

    if(majorStringVersion.length > 0)
        version.major = !isNaN(parseInt(majorStringVersion[0])) ? parseInt(majorStringVersion[0]) : 0;

    if(majorStringVersion.length > 1)
        version.minor = !isNaN(parseInt(majorStringVersion[1])) ? parseInt(majorStringVersion[1]) : 0;

    if(majorStringVersion.length > 2)
        version.patch = !isNaN(parseInt(majorStringVersion[2])) ? parseInt(majorStringVersion[2]) : 0;

    return version;
};

export const checkForFireFoxCyclicError = (
    browserName: string,
    browserVersion: string,
    e: Error,
    logger: Logger,
    testId: string): Promise<void> => {
    // check for bug in firefox < 62
    const {major: browserMajorVersion} = parseBrowserVersion(browserVersion);

    if (browserName === `firefox` &&
        browserMajorVersion > 58 && browserMajorVersion < 62 &&
        e.name === `javascript error` &&
        e.message === `TypeError: cyclic object value`) {

        logger.debug(`Bug in FF version < 62 encountered ... ignoring for now. 
                        Not using FF version < 62? Check test case with id: ${testId}`);
        return Promise.resolve();
    }
    return Promise.reject(e)
};