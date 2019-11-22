import {staleCheck} from "../../lib/decorators/staleCheck";

// checkStale repeats the method for at least 3 times, after that it just throws the last generated error
// The TestClass just returns a stale error or a resolved Promise depending on the given parameter
// the parameter indicates how many times the method should be called until a resolved Promise will be returned
class TestClass {
    private errorCounter = 0;

    @staleCheck<boolean>()
    public returnSuccess(): Promise<boolean> {
        return Promise.resolve(true);
    }

    @staleCheck<string>()
    public returnGeneralError(returnSuccessAfter: number): Promise<string> {
        this.errorCounter = this.errorCounter + 1;

        if (this.errorCounter > returnSuccessAfter)
            return Promise.resolve(`success`);

        return Promise.reject(new Error(`my general error`))
    }

    @staleCheck<void>()
    public returnStaleError1(returnSuccessAfter: number): Promise<void> {
        this.errorCounter = this.errorCounter + 1;

        if (this.errorCounter > returnSuccessAfter)
            return Promise.resolve();

        return Promise.reject(new Error(`stale element reference error`))
    }

    @staleCheck<number>()
    public returnStaleError2(returnSuccessAfter: number): Promise<number> {
        this.errorCounter = this.errorCounter + 1;

        if (this.errorCounter > returnSuccessAfter)
            return Promise.resolve(1);

        return Promise.reject(new Error(`STALEELEMENTREFERENCEERROR`))
    }

    @staleCheck<{}>()
    public returnStaleError3(returnSuccessAfter: number): Promise<{}> {
        this.errorCounter = this.errorCounter + 1;

        if (this.errorCounter > returnSuccessAfter)
            return Promise.resolve({done: true});

        return Promise.reject(new Error(`StaleElementReferenceError`))
    }
}

describe(`Checking for stale`, () => {

    const testClass = new TestClass();

    describe(`on a successful method`, () => {

        it(`should return the success result
        test id: 6cc9dd2a-90bc-4894-bebd-814ae3c271b9`, async () => {
            expect(await (new TestClass()).returnSuccess()).toEqual(true)
        });

    });

    describe(`on a non stale element reference error`, () => {

        it(`should return the success result
        test id: 1144bfe9-c257-4b9a-b2d2-c5e6cd76a2aa`, async () => {

            return Promise.all(
                [
                    (new TestClass()).returnGeneralError(2)
                                     .then(() => expect(true).toBeFalsy(`should throw an error, but it doesn't`))
                                     .catch((e: Error) => expect(e.toString()).toContain(`my general error`)),

                    // for a general error it should not make a difference which parameter is passed
                    // its just for cross checking that my test implementation is correct
                    (new TestClass()).returnGeneralError(4)
                                     .then(() => expect(true).toBeFalsy(`should throw an error, but it doesn't`))
                                     .catch((e: Error) => expect(e.toString()).toContain(`my general error`))
                ])
        });

    });

    describe(`on a stale element reference error`, () => {

        it(`should succeed after 2 retries
        test id: 6dd049c9-c772-4d9c-a50d-1ad5fcabe485`, () => {
            return Promise.all(
                [
                    (new TestClass()).returnStaleError1(2)
                                     .then(() => expect(true).toBeTruthy())
                                     .catch((e: Error) => expect(false).toBeTruthy(`function returnStaleError1 should succeed, 
                                     but it fails with ${e.toString()}`)),

                    (new TestClass()).returnStaleError2(2)
                                     .then((value: number) => expect(value).toEqual(1))
                                     .catch((e: Error) => expect(false).toBeTruthy(`function returnStaleError2 should succeed, 
                                     but it fails with ${e.toString()}`)),

                    (new TestClass()).returnStaleError3(2)
                                     .then((value: {}) => expect(value).toEqual({done: true}))
                                     .catch((e: Error) => expect(false).toBeTruthy(`function returnStaleError3 should succeed, 
                                     but it fails with ${e.toString()}`))
                ])

        });

        it(`should throw an error after the method was called 3 times unsuccessfully
        test id: 77e353e0-dce1-4843-a5cc-718d7571cd0c`, () => {
            return Promise.all(
                [
                    (new TestClass()).returnStaleError1(4)
                                     .then(() => expect(true).toBeFalsy(`function returnStaleError1 should fail, but it doesn't`))
                                     .catch((e: Error) => expect(e.toString()).toContain(`stale element reference error`,
                                                                                         `checkStale() did not return the stale exception`)),

                    (new TestClass()).returnStaleError2(4)
                                     .then(() => expect(true).toBeFalsy(`function returnStaleError2 should fail, but it doesn't`))
                                     .catch((e: Error) => expect(e.toString()).toContain(`STALEELEMENTREFERENCEERROR`,
                                                                                         `checkStale() did not return the stale exception`)),

                    (new TestClass()).returnStaleError3(4)
                                     .then(() => expect(true).toBeFalsy(`function returnStaleError3 should fail, but it doesn't`))
                                     .catch((e: Error) => expect(e.toString()).toContain(`StaleElementReferenceError`,
                                                                                         `checkStale() did not return the stale exception`))
                ]);
        });

    });
});