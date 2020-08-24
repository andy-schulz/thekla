export interface TheklaAssertion extends LanguageCandy, AssertionFlags {
    equal: <AT>(expected: AT, message?: string) => ExecuteAssertion<AT>;
    truthy: (message?: string) => ExecuteAssertion<boolean>;
    falsy: (message?: string) => ExecuteAssertion<boolean>;
    match: (expected: RegExp, message?: string) => ExecuteAssertion<string>;

    // include(needle: string, message?: string): ExecuteAssertion<string>;
    // include<T extends object>(needle: T, message?: string): ExecuteAssertion<WeakSet<T> | ArrayTypes<T> | T>;
    // include<T>(needle: Partial<T>, message?: string): ExecuteAssertion<ArrayTypes<T> | T>;
    include(needle: any, message?: string): ExecuteAssertion<any>;
}

export interface LanguageCandy {
    to: TheklaAssertion;
    be: TheklaAssertion;
    have: TheklaAssertion;
}

/**
 * methods setting flags on assertion object
 */
export interface AssertionFlags {
    not: TheklaAssertion;
    deep: TheklaAssertion;
    nested: TheklaAssertion;
    own: TheklaAssertion;
}

/**
 * assertion execution
 */
export interface TheklaAssertionCall<AT> {
    description?: string;

    (actual: AT): boolean;
}

/**
 * assertion chain
 */
export interface ExecuteAssertion<AT> extends TheklaAssertionCall<AT> {
    and: TheklaAssertion;
}