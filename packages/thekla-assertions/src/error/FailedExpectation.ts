export class FailedExpectation extends Error {

    public static for(error: string): FailedExpectation {
        return new FailedExpectation(error);
    }

    private constructor(message: string) {
        super(message);
        this.name = FailedExpectation.name
    }
}