import assert from "assert"

/**
 * check for strict equality on values
 * @param expected the expected value
 * @param message
 */
export const strictEqual = <AT>(expected: AT, message = `missed strict equality`): (actual: AT) => boolean => {
    return (actual: AT): boolean => {
        assert.strictEqual(actual, expected, message);
        return true;

    }
};

/**
 * @function check for not strict equality on values
 * @param expected the expected value
 * @param message
 */
export const notStrictEqual = <AT>(expected: AT, message = `missed not strict equality`): (actual: AT) => boolean => {
    return (actual: AT): boolean => {
        assert.notStrictEqual(actual, expected, message);
        return true;

    }
};

/**
 * @function check for deep equality on values
 * @param expected the expected value
 * @param message
 */
export const deepEqual = <AT>(expected: AT, message = `missed deep equality`): (actual: AT) => boolean => {
    return (actual: AT): boolean => {
        assert.deepStrictEqual(actual, expected, message);
        return true;
    }
};

/**
 * @function check for not deep equality on values
 * @param expected the expected value
 * @param message
 */
export const notDeepEqual = <AT>(expected: AT, message = `missed not deep equality`): (actual: AT) => boolean => {
    return (actual: AT): boolean => {
        assert.notDeepStrictEqual(actual, expected, message);
        return true;
    }
};