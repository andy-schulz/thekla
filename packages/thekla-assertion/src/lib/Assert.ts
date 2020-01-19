import {Expected as E}                                        from "../interfaces/Expected";
import {ExecuteAssertion, TheklaAssertion}                    from "../interfaces/TheklaAssertion";
import {TheklaAssertionOptions}                               from "../interfaces/TheklaAssertionOptions";
import {deepEqual, notDeepEqual, notStrictEqual, strictEqual} from "./assertion_equal_functions";
import {assertAll}                                            from "./assertion_helper_functions";
import {ArrayTypes, include}                                  from "./assertion_include_spec";
import {match, notMatch}                                      from "./assertion_match_regexp_function";
import {falsy, notFalsy, notTruthy, truthy}                   from "./assertion_truthy_falsy_functions";

export class AssertionImpl implements TheklaAssertion {

    private options: TheklaAssertionOptions = {
        not: false,
        deep: false,
        own: false,
        nested: false

    };

    public constructor(private assertions: ((actual: any) => boolean)[]) {
    }

    get to(): AssertionImpl {
        return this;
    }

    get be(): AssertionImpl {
        return this;
    }

    get have(): AssertionImpl {
        return this;
    }

    get not(): AssertionImpl {
        this.options.not = true;
        return this;
    }

    get deep(): AssertionImpl {
        this.options.deep = true;
        return this;
    }

    /**
     * @method check for value equality.
     * it is checked for strict equality "==="
     * if the flag "deep" is set the value is checked for deep equality
     *
     * reacts on flags:
     *  - not
     *  - deep
     *
     * @param {AT} expected
     * @param {string} message to throw in case of an assertion error
     * @returns {ExecuteAssertion<AT>}
     */
    public equal<AT>(expected: AT, message?: string): ExecuteAssertion<AT> {
        const equal = this.options.deep ?
            (this.options.not ? notDeepEqual : deepEqual) :
            (this.options.not ? notStrictEqual : strictEqual);

        return this.assert(equal(expected, message));
    }

    /**
     * @method check for true method
     *
     * reacts on flags:
     *  - not
     *
     * @param {string} message to throw in case of an assertion error
     * @returns {ExecuteAssertion<boolean>}
     */
    public truthy(message?: string): ExecuteAssertion<boolean> {
        const checkTruthy = this.options.not ? notTruthy : truthy;

        return this.assert(checkTruthy(message));

    }

    /**
     * @method check for a false value
     *
     *  reacts on flags:
     *  - not
     *
     * @param {string} message to throw in case of an assertion error
     * @returns {ExecuteAssertion<boolean>}
     */
    public falsy(message?: string): ExecuteAssertion<boolean> {
        const checkFalsy = this.options.not ? notFalsy : falsy;

        return this.assert(checkFalsy(message));
    }

    /**
     * @method create matching function checking if a string is matched or not matched by the given regex
     *
     * reacts on flags:
     *  - not
     *
     * @param {RegExp} expected the Regex to match the string
     * @param {string} message to throw in case of an assertion error
     * @returns {ExecuteAssertion<string>}
     */
    public match(expected: RegExp, message?: string): ExecuteAssertion<string> {
        const checkMatch = this.options.not ? notMatch : match;

        return this.assert(checkMatch(expected, message))
    }

    /**
     *
     * @param needle
     * @param {string} message
     * @returns {ExecuteAssertion<any>}
     */
    // include(needle: string, message?: string): ExecuteAssertion<string>;
    // include<T>(needle: T, message?: string): ExecuteAssertion<ArrayTypes<T>>;
    // include<T extends object>(needle: T, message?: string): ExecuteAssertion<WeakSet<T>>;
    // include<T>(needle: Partial<T>, message?: string): ExecuteAssertion<T>
    public include(needle: any, message?: string): ExecuteAssertion<any> {
        const not = this.options.not;
        const deep = this.options.deep;
        const own = this.options.own;
        const nested = this.options.nested;

        const bitMask =
            (not ? 0b0001 << 0 : 0b0000) |
            (deep ? 0b0001 << 1 : 0b0000) |
            (own ? 0b0001 << 2 : 0b0000) |
            (nested ? 0b0001 << 3 : 0b0000);

        let checkInclude = include;

        switch (bitMask) {
            case 0b0000 : // All flags not set
                // do nothing include is already set
                break;
            case 0b0001 : //not flag set
                checkInclude = notInclude;
                break;
            case 0b0010 : //deep flag set
                console.log(``);
                break;
            case 0b0011 : // not and deep flag set
                console.log(``);
                break;
            case 0b0100 : // own flag set
                console.log(``);
                break;
            case 0b0101 : // own and not flag set
                console.log(``);
                break;
            case 0b0110 : // own and deep flag set
                console.log(``);
                break;
            case 0b0111 : // own, deep and not flag set
                console.log(``);
                break;
            case 0b1000 : // nested flag set
                console.log(``);
                break;
            case 0b1001 : // nested and not flag set
                console.log(``);
                break;
            case 0b1010 : // nested and deep flag set
                console.log(``);
                break;
            case 0b1011 : // nested, deep and not flag set
                console.log(``);
                break;
            case 0b1100 : // ERROR own and nested flag set
            case 0b1101 : // ERROR own and nested flag set
            case 0b1110 : // ERROR own and nested flag set
            case 0b1111 : // ERROR own and nested flag set
                throw new Error(`own and nested cant be used in combination for include`);
                break;
            default:
                throw new Error(`Error when evaluation the flags for include`)
        }



        return this.assert(checkInclude(needle, message))
    }

    /**
     * @method return the assertion execution function
     * @param {(actual: AT) => boolean} assertion
     * @returns {ExecuteAssertion<AT>}
     */
    private assert<AT>(assertion: (actual: AT) => boolean): ExecuteAssertion<AT> {
        this.assertions.push(assertion);

        return assertAll(this.assertions);
    }
}

/**
 * the static assertion class returning an Assertion instance
 */
class AssertionStatic {

    /**
     * return a standard assertion class
     * @returns {TheklaAssertion}
     */
    public static get to(): TheklaAssertion {
        return new AssertionImpl([]);
    }

    /**
     * return an assertion instance with a preset not flag
     * @returns {TheklaAssertion}
     */
    public static get not(): TheklaAssertion {
        return new AssertionImpl([]).not;
    }
}

export const Expected: E = AssertionStatic;