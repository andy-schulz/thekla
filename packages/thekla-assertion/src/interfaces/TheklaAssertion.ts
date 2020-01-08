export interface TheklaAssertion extends LanguageCandy, AssertionFlags {
    equal: <AT>(expected: AT, message?: string) => ExecuteAssertion<AT>;
}

export interface LanguageCandy {
    to: TheklaAssertion;
}

/**
 * methods setting flags on assertion object
 */
export interface AssertionFlags {
    not: TheklaAssertion;
    deep: TheklaAssertion;
}

/**
 * assertion execution
 */
export interface TheklaAssertionCall<AT> {
    (actual: AT): boolean;
}

/**
 * assertion chain
 */
export interface ExecuteAssertion<AT> extends TheklaAssertionCall<AT> {
    and: TheklaAssertion;
}