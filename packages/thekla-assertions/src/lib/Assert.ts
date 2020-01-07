import {Expected as E} from "../interfaces/Expected";
import {ExecuteAssertion, TheklaAssertion} from "../interfaces/TheklaAssertion";
import {TheklaAssertionOptions} from "../interfaces/TheklaAssertionOptions";
import {assertAll, deepEqual, notDeepEqual, notStrictEqual, strictEqual} from "./assertion_functions";

export class AssertionImpl implements TheklaAssertion {

    private options: TheklaAssertionOptions = {
        deep: false,
        not: false
    };

    public constructor(private assertions: ((actual: any) => boolean)[]) {
    }

    public static get to(): TheklaAssertion {
        return new AssertionImpl([]);
    }

    get to(): AssertionImpl {
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

    equal<AT>(expected: AT, message?: string): ExecuteAssertion<AT> {

        const opts = this.options;

        const func = opts.deep ?
            (opts.not ? notDeepEqual : deepEqual) :
            (opts.not ? notStrictEqual : strictEqual);

        this.assertions.push(func(expected, message));

        return assertAll(this.assertions);
    }
}

export const Expected: E = AssertionImpl;