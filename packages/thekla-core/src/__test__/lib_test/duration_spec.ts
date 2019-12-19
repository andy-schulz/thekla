import {Duration} from "../..";

describe(`Setting the duration`, () => {

    describe(`in milli seconds`, () => {

        it(`should return the correct results in ms, sec and min
        test id: cc249a47-9675-4fc4-9d68-549123de155c`, () => {
            const duration = Duration.in.milliSeconds(1000);
            expect(duration.inMs).toEqual(1000);
            expect(duration.inSec).toEqual(1);
            expect(duration.inMin).toEqual(1/60);
        });
    });

    describe(`in seconds`, () => {

        it(`should return the correct results in ms, sec and min
        test id: f2e74cf5-cd70-49e8-8a8f-b2559957999e`, () => {
            const duration = Duration.in.seconds(1);
            expect(duration.inMs).toEqual(1000);
            expect(duration.inSec).toEqual(1);
            expect(duration.inMin).toEqual(1/60);
        });
    });

    describe(`in minutes`, () => {

        it(`should return the correct results in ms, sec and min
        test id: 21903123-741c-4b4e-9d7a-66778dde14b1`, () => {
            const duration = Duration.in.minutes(1);
            expect(duration.inMs).toEqual(60000);
            expect(duration.inSec).toEqual(60);
            expect(duration.inMin).toEqual(1);
        });
    });

    describe(`with unsupported values`, () => {
        it(`smaller than 0, should throw an CanNotCreateDuration error
        test id: dd23dcda-99d0-46d8-abd9-4d453047b21e`, () => {
            expect(() => Duration.in.milliSeconds(-1)).toThrowError(`Can't create a duration of '-1' ms, as it is smaller than 0.`);
            expect(() => Duration.in.seconds(-1)).toThrowError(`Can't create a duration of '-1000' ms, as it is smaller than 0.`);
            expect(() => Duration.in.minutes(-1)).toThrowError(`Can't create a duration of '-60000' ms, as it is smaller than 0.`);
        });
    });
});