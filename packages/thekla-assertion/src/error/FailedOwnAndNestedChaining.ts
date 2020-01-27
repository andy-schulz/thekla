export class FailedOwnAndNestedChaining extends Error {

    public static for(error: string): FailedOwnAndNestedChaining {
        return new FailedOwnAndNestedChaining(`Own and Nested can't be chained for ${error} assertion`);
    }

    private constructor(message: string) {
        super(message);
        this.name = FailedOwnAndNestedChaining.name
    }
}