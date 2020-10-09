import {Duration}      from "../..";
import {UsesAbilities} from "../Actor";
import {Question}      from "./Question";

/**
 * returns a result after it was queried for x times
 */
class DelayedQueriedResult<PT> implements Question<PT, PT> {
    private counter = 1;
    private defaultValue: PT; // intentionally undefined
    // as long the number of request is not met undefined will be returned as result

    public answeredBy(): Promise<PT> {
        this.counter = this.counter - 1;

        return this.counter < 1 ?
            Promise.resolve(this.value) :
            Promise.resolve(this.defaultValue)
    };

    public toString(): string {
        return `${this.constructor.name}: returns "${this.value}" after it was queried for '${this.iterator}' times.`
    }

    public constructor(private value: PT, private iterator: number) {
        this.counter = iterator
    }
}

class DelayedDurationResult<PT> implements Question<PT, PT> {

    private duration: Duration = Duration.in.milliSeconds(0);
    private description = `Default value. Timeout of ${this.duration.inMs} ms not reached. Second value not set yet.`;
    private delayedValue: PT;
    private valueTimerSet = false;
    private setValue = (): PT => this.delayedValue = this.value;

    public answeredBy(): Promise<PT> {
        if (!this.valueTimerSet && this.duration.inMs > 0)
            setTimeout(this.setValue, this.duration.inMs);

        this.valueTimerSet = true;

        if (this.duration.inMs === 0)
            return Promise.resolve(this.setValue());

        return Promise.resolve(this.delayedValue);
    };

    public delayedBy(duration: Duration): DelayedDurationResult<PT> {
        this.duration = duration;
        this.description = `Default value. Timeout of ${this.duration.inMs} ms not reached. Second value not set yet.`;

        return this;
    }

    public resolvesAtQuery(number: number) {
        return new DelayedQueriedResult(this.value, number)
    }

    public constructor(private value: PT) {
    };

    public toString(): string {
        return `${this.constructor.name}: returns "${this.value}" after timeout of '${this.duration.inMs}' ms is reached.`
    }
}

export class Result<PT> implements Question<PT, PT> {
    private readonly value: PT | undefined;

    public static ofLastActivity<PTS>(): Result<PTS> {
        return new Result()
    }

    public static ofActivities<PTS>(): Result<PTS> {
        return new Result()
    }

    public static of<PTS>(value: PTS): DelayedDurationResult<PTS> {
        return new DelayedDurationResult<PTS>(value)
    }

    public answeredBy(actor: UsesAbilities, activityResult: PT): Promise<PT> {
        return this.value ? Promise.resolve(this.value) : Promise.resolve(activityResult);
    }

    private constructor(value?: PT) {
        this.value = value;
    }

    public toString(): string {
        return `returned ${this.value ? `direct` : `last activities`} result`
    }
}
