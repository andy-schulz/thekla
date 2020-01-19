import {assert as chaiAssert} from "chai";

/**
 * @function check for value to be true
 * @param {string} message to be used in case of an error
 * @returns {(actual: boolean) => boolean} actual value matching function
 */
export const truthy = (message = `missed truthy assertion`): (actual: boolean) => boolean => {
    return (actual: boolean): boolean => {
        chaiAssert.isTrue(actual, message);
        return true;
    }
};

/**
 * @function check value not to be true
 * @param {string} message to be used in case of an error
 * @returns {(actual: boolean) => boolean} actual value matching function
 */
export const notTruthy = (message = `missed not truthy assertion`): (actual: boolean) => boolean => {
    return (actual: boolean): boolean => {
        chaiAssert.isNotTrue(actual, message);
        return true;
    }
};

/**
 * @function check for value to be false
 * @param {string} message to be used in case of an error
 * @returns {(actual: boolean) => boolean} actual value false matching function
 */
export const falsy = (message = `missed falsy assertion`): (actual: boolean) => boolean => {
    return (actual: boolean): boolean => {
        chaiAssert.isFalse(actual, message);
        return true;
    }
};

/**
 * @function check value not to be false
 * @param {string} message to be used in case of an error
 * @returns {(actual: boolean) => boolean} actual value not false matching function
 */
export const notFalsy = (message = `missed not falsy assertion`): (actual: boolean) => boolean => {
    return (actual: boolean): boolean => {
        chaiAssert.isNotFalse(actual, message);
        return true;
    }
};