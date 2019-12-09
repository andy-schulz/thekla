import {CanNotCreateDuration} from "../errors/CanNotCreateDuration";

export class DurationResult {

    public static from(durationInMs: number): DurationResult {
        if (durationInMs < 0)
            throw CanNotCreateDuration.withValueSmallerThanZero(durationInMs);

        return new DurationResult(durationInMs);
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

    private constructor(private _durationInMs: number) {
    }
}

interface DurationUnit {
    milliSeconds: (milliSeconds: number) => DurationResult;
    seconds: (seconds: number) => DurationResult;
    minutes: (minutes: number) => DurationResult;
}

export const DurationUnitImpl: DurationUnit = {
    milliSeconds: (milliSeconds: number): DurationResult => {
        return DurationResult.from(milliSeconds);
    },

    seconds: (seconds: number): DurationResult => {
        return DurationResult.from(seconds * 1000);
    },

    minutes: (minutes: number): DurationResult => {
        return DurationResult.from(minutes * 60 * 1000);
    }
};

export const Duration = {
    in: DurationUnitImpl
};