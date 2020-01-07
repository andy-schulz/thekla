import assert              from "assert"
import {FailedExpectation} from "../error/FailedExpectation";
import {ExecuteAssertion}  from "../interfaces/TheklaAssertion";
import {AssertionImpl}     from "./Assert";

type AssertionFunc = ((actual: any) => boolean)[];

/**
 * execute all assertion function
 * @param assertions array of assertion functions to execute
 */
export const assertAll = <AT>(assertions: AssertionFunc): ExecuteAssertion<AT> => {

    const stringify = (value: AT): string => {
        return JSON.stringify(value)
    };

    const func = (actual: AT): boolean => {

        const error: string[] = [];

        assertions.map((assertion: (actual: AT) => boolean) => {
            try {
                return assertion(actual)
            } catch (err) {
                error.push(`${err.message}: ${stringify(err.actual)} ${err.operator} ${stringify(err.expected)}`)
            }
        });

        if (error.length > 0)
            throw FailedExpectation.for(error.join(`\n`));
        else
            return true
    };

    func.and = new AssertionImpl(assertions);

    return func;
};

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
 * check for not strict equality on values
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
 * check for deep equality on values
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
 * check for not deep equality on values
 * @param expected the expected value
 * @param message
 */
export const notDeepEqual = <AT>(expected: AT, message = `missed not deep equality`): (actual: AT) => boolean => {
    return (actual: AT): boolean => {
        assert.notDeepStrictEqual(actual, expected, message);
        return true;
    }
};