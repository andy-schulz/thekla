import {Duration}      from "../..";
import {UsesAbilities} from "../Actor";
import {Question}      from "./Question";

class DelayedResult<PT> implements Question<PT, PT> {
    private duration: Duration = Duration.in.milliSeconds(0);
    private description = `Default value. Timeout of ${this.duration.inMs} ms not reached. Second value not set yet.`;
    private delayedValue: PT;
    private called = false;
    private setValue = (): PT => this.delayedValue = this.value;

    public answeredBy(): Promise<PT> {
        if (!this.called && this.duration.inMs > 0)
            setTimeout(this.setValue, this.duration.inMs);

        this.called = true;

        if (this.duration.inMs === 0)
            return Promise.resolve(this.setValue());

        return Promise.resolve(this.delayedValue);
    };

    public delayedBy(duration: Duration): DelayedResult<PT> {
        this.duration = duration;
        this.description = `Default value. Timeout of ${this.duration.inMs} ms not reached. Second value not set yet.`;

        return this;
    }

    public constructor(private value: PT) {
    };

    public toString(): string {
        return `delayed result with timeout of '${this.duration.inMs} ms'`
    }
}

export class Result<PT> implements Question<PT, PT> {
    private readonly value: PT | undefined;

    public static ofLastActivity<PT>(): Result<PT> {
        return new Result()
    }

    public static of<PT>(value: PT): DelayedResult<PT> {
        return new DelayedResult<PT>(value)
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
