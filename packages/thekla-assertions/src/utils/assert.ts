import { TheklaAssertionOptions } from "../interfaces/TheklaAssertionOptions";

class AssertionError extends Error {

    public constructor(message: string) {
        super(message);
        this.name = this.constructor.name;
    }
}

export const assert = (
    expression: boolean,
    failMessage: string,
    negatedFailMessage: string,
    options: TheklaAssertionOptions
): boolean => {

    if(!expression)
        if(options.not)
            throw new AssertionError(negatedFailMessage);
        else
            throw new AssertionError(failMessage);

    return true;
};