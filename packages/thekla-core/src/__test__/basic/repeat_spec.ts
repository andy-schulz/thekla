import {Expected}                       from "@thekla/assertion";
import {Actor, Duration, Result, Sleep} from "../..";
import {Repeat}                         from "../../lib/actions/Repeat";

describe(`Repeating activities`, () => {

    const Richard: Actor = Actor.named(`Richard`);

    describe(`once`, () => {

        it(`should pass when the assertion passes
        test id: 2ef17acc-b8e6-4a00-b89c-c1c4e1b10f32`, () => {
            return Richard.attemptsTo(
                Repeat.activities(Sleep.for(1))
                      .until(Result.of(true))
                      .is(Expected.to.be.truthy())
            )
        });

        it(`should fail when the assertion fails
        test id: dc95348a-559f-497d-b89b-5c6729041062`, () => {
            return Richard.attemptsTo(
                Repeat.activities(Sleep.for(1))
                      .until(Result.of(true))
                      .is(Expected.to.be.falsy())
            ).then(() => {
                expect(true).toBeFalsy(`Repeat should throw an error but it doesn't`)
            }).catch((e) => {
                expect(e).toContain(`Repeat timed out after 1 retries`);
                expect(e).toContain(`with Error: FailedExpectation: missed falsy assertion: expected true to be false`);
                expect(e).toContain(`for question: DelayedDurationResult: returns expected value after timeout of '0' ms is reached.`);
            })
        });
    });

    describe(`multiple times`, () => {

        it(`should pass when the assertion passes after multiple retries
        test id: cde2399e-a834-4e8d-bd3c-7640d9e54760`, () => {

            return Richard.attemptsTo(
                Repeat.activities(Sleep.for(1))
                      .until(Result.of(true).resolvesAtCheck(6))
                      .is(Expected.to.be.truthy())
                      .retryFor(6, Duration.in.milliSeconds(1))
            )
        });

        it(`should pass when the assertion passes after multiple retries
        test id: cde2399e-a834-4e8d-bd3c-7640d9e54760`, () => {

            return Richard.attemptsTo(
                Repeat.activities(Sleep.for(1))
                      .until(Result.of(true).resolvesAtCheck(6))
                      .is(Expected.to.be.truthy())
                      .retryFor(6, Duration.in.milliSeconds(1))
            )
        });

        it(`should pass when no duration is set
        test id: 1e25396b-8e7b-498a-87e8-bd3d21530f73`, () => {

            return Richard.attemptsTo(
                Repeat.activities(Sleep.for(1))
                      .until(Result.of(true).resolvesAtCheck(3))
                      .is(Expected.to.be.truthy())
                      .retryFor(3)
            )
        });

        it(`should fail when the assertion still fails
        test id: cde2399e-a834-4e8d-bd3c-7640d9e54760`, () => {

            return Richard.attemptsTo(
                Repeat.activities(Sleep.for(1))
                      .until(Result.of(true).resolvesAtCheck(6))
                      .is(Expected.to.be.truthy())
                      .retryFor(5, Duration.in.milliSeconds(1))
            ).then(() => {
                expect(true).toBeFalsy(`Repeat should throw an error but it doesn't`)
            }).catch((e) => {
                expect(e).toContain(`Repeat timed out after 5 retries`);
                expect(e).toContain(`with Error: FailedExpectation: missed truthy assertion: expected undefined to be true`);
                expect(e).toContain(`for question: DelayedQueriedResult: returns expected value after it was queried for '6' times.`);
            })
        });
    });

    describe(`with an retry or duration value out of bounds`, () => {

        it(`should throw an error when the retries value is < 1
        test id: e9a6b08e-3810-4030-8fad-e9d4b8b92e0e`, () => {
            expect(() => Repeat.activities(Sleep.for(1))
                .retryFor(0,Duration.in.milliSeconds(1)))
                .toThrowError(`The retries counter should be between 1 and 1000. But its: 0`)

        });

        it(`should throw an error when the retries value is > 1000
        test id: 9895bc5d-fb70-459d-a537-076731f2aced`, () => {
            expect(() => Repeat.activities(Sleep.for(1))
                               .retryFor(1001,Duration.in.milliSeconds(1)))
                .toThrowError(`The retries counter should be between 1 and 1000. But its: 1001`)

        });

        it(`should throw an error when the duration value is > 60
        test id: 4ef87e2b-4368-4a71-89d1-ab8409beeb27`, () => {
            expect(() => Repeat.activities(Sleep.for(1))
                               .retryFor(1,Duration.in.milliSeconds(60001)))
                .toThrowError(`The 'waitBetweenRetries' duration should be between 1 and 60 s (1 minute). But its: 60.001`)

        });

        it(`should throw an error when the duration value is < 1
        test id: 391c79fb-577c-4f7e-b0a5-7c07f7c37a0e`, () => {
            expect(() => Repeat.activities(Sleep.for(1))
                               .retryFor(1,Duration.in.milliSeconds(-1)))
                .toThrowError(`Can't create a duration of '-1' ms, as it is smaller than 0.`)

        });

    });
});