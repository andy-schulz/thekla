import {assert as chaiAssert} from "chai";

/**
 * @function match the string against the given RegExp
 * @param {RegExp} expected the RegExp to match the string
 * @param {string} message to be used in case of an error
 * @returns {(actual: string) => boolean} actual value RegExp matching function
 */
export const match = (expected: RegExp, message = `does not match RegEx`): (actual: string) => boolean => {
    return (actual: string): boolean => {
        chaiAssert.match(actual, expected, message);
        return true;
    }
};

/**
 * @function check that the Regexp does not match the string
 * @param {RegExp} expected the RegExp which should not match the string
 * @param {string} message to be used in case of an error
 * @returns {(actual: string) => boolean} actual value RegExp not matching function
 */
export const notMatch = (expected: RegExp, message = `does match the RegExp`): (actual: string) => boolean => {
    return (actual: string): boolean => {
        chaiAssert.notMatch(actual,expected, message);
        return true;
    }
};