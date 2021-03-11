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

        assertions.forEach((assertion: (actual: AT) => boolean) => {
            try {
                return assertion(actual)
            } catch (err) {

                // node assertion error defines an operator
                // chai assertion error does not
                // if operator is defined print a detailed message
                const detailedMessage = err.operator
                    ? `: ${stringify(err.actual)} ${err.operator} ${stringify(err.expected)}`
                    : ``;

                error.push(`${err.message}${detailedMessage}`)
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