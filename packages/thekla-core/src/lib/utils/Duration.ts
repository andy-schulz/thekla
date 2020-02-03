import {CanNotCreateDuration} from "../errors/CanNotCreateDuration";

interface DurationUnit {
    milliSeconds: (milliSeconds: number) => Duration;
    seconds: (seconds: number) => Duration;
    minutes: (minutes: number) => Duration;
}

export const DurationUnitImpl: DurationUnit = {
    milliSeconds: (milliSeconds: number): Duration => {
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        return new Duration(milliSeconds);
    },

    seconds: (seconds: number): Duration => {
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        return new Duration(seconds * 1000);
    },

    minutes: (minutes: number): Duration => {
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        return new Duration(minutes * 60 * 1000);
    }
};

export class Duration {
    public static get in(): DurationUnit {
        return DurationUnitImpl
    }

    public get inMs(): number {
        return this._durationInMs;
    }

    public get inSec(): number {
        return this._durationInMs / 1000;
    }

    public get inMin(): number {
        return this._durationInMs / 1000 / 60
    }

    public constructor(private _durationInMs: number) {
        if (_durationInMs < 0)
            throw CanNotCreateDuration.withValueSmallerThanZero(_durationInMs);
    }
}
