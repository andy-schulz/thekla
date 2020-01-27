import {FailedOwnAndNestedChaining}                           from "../error/FailedOwnAndNestedChaining";
import {Expected as E}                                        from "../interfaces/Expected";
import {ExecuteAssertion, TheklaAssertion}                    from "../interfaces/TheklaAssertion";
import {TheklaAssertionOptions}                               from "../interfaces/TheklaAssertionOptions";
import {deepEqual, notDeepEqual, notStrictEqual, strictEqual} from "./assertion_equal_functions";
import {assertAll}                                            from "./assertion_helper_functions";
import {
    deepInclude,
    deepNestedInclude,
    deepOwnInclude,
    include,
    nestedInclude,
    notDeepInclude,
    notDeepNestedInclude,
    notDeepOwnInclude,
    notInclude,
    notNestedInclude,
    notOwnInclude,
    ownInclude
}                                                             from "./assertion_include_spec";
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

    get own(): AssertionImpl {
        this.options.own = true;
        return this;
    }

    get nested(): AssertionImpl {
        this.options.nested = true;
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

        const map = new Map();
        //[not,deep,own,nested]
        map.set([false, false, false, false].toString(), include);
        map.set([true, false, false, false].toString(), notInclude);
        map.set([false, true, false, false].toString(), deepInclude);
        map.set([true, true, false, false].toString(), notDeepInclude);
        map.set([false, false, true, false].toString(), ownInclude);
        map.set([true, false, true, false].toString(), notOwnInclude);
        map.set([false, true, true, false].toString(), deepOwnInclude);
        map.set([true, true, true, false].toString(), notDeepOwnInclude);
        map.set([false, false, false, true].toString(), nestedInclude);
        map.set([true, false, false, true].toString(), notNestedInclude);
        map.set([false, true, false, true].toString(), deepNestedInclude);
        map.set([true, true, false, true].toString(), notDeepNestedInclude);
        map.set([false, false, true, true].toString(),
                () => {throw FailedOwnAndNestedChaining.for(`include`)});
        map.set([true, false, true, true].toString(),
                () => {throw FailedOwnAndNestedChaining.for(`include`)});
        map.set([false, true, true, true].toString(),
                () => {throw FailedOwnAndNestedChaining.for(`include`)});
        map.set([true, true, true, true].toString(),
                () => {throw FailedOwnAndNestedChaining.for(`include`)});

        const checkInclude = map.get([not, deep, own, nested].toString());

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