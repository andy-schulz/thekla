import {Activity, Duration, Question, See} from "../..";
import {PerformsTask}                      from "../Actor";
import {Task}                              from "./Activities";

export class Repeat<PT, QPT, QRT> extends Task<PT, PT> {

    private question: Question<QPT, QRT>;
    private expected: (text: QRT) => boolean | Promise<boolean>;

    private retries = 1;
    private durationBetweenRetries = Duration.in.seconds(1);

    private lastError: Error;

    public performAs(actor: PerformsTask, result: PT): Promise<PT> {
        let counter: number = this.retries;

        return new Promise((resolve, reject) => {
            const loop = (): void => {
                if (counter < 1)
                    reject(`Repeat timed out after ${this.retries} retries 
    with Error: ${this.lastError}
    for question: ${this.question.toString()}`);
                counter = counter - 1;

                actor.attemptsTo(
                    ...this.activities
                )
                .then(() => {
                     return actor.attemptsTo(
                         See.if(this.question)
                            .is(this.expected)
                     )
                     .then(() => resolve(result))
                     .catch((e) => {
                         this.lastError = e;
                         setTimeout(loop, this.durationBetweenRetries.inMs)
                     })
                })
                .catch(reject)
            };

            loop();
        });
    }

    public static activities(...activities: Activity<any, any>[]): Repeat<any, any, any> {
        return new Repeat(activities);
    }

    public until(question: Question<QPT, QRT>): Repeat<PT, QPT, QRT> {
        this.question = question;
        return this;
    }

    public is(expected: (text: QRT) => boolean | Promise<boolean>): Repeat<PT, QPT, QRT> {
        this.expected = expected;
        return this;
    }

    public retryFor(retries: number, durationBetweenRetries = Duration.in.seconds(1)): Repeat<PT, QPT, QRT> {

        if (retries < 1 || retries > 1000)
            throw new Error(`The retries counter should be between 1 and 1000. But its: ${retries}`);

        if (durationBetweenRetries.inMs < 0 || durationBetweenRetries.inMs > 60000)
            throw new Error(`The 'waitBetweenRetries' duration should be between 1 and 60 s (1 minute). But its: ${durationBetweenRetries.inSec}`);

        this.retries = retries;
        this.durationBetweenRetries = durationBetweenRetries;
        return this;
    }

    private constructor(private activities: Activity<any, any>[]) {
        super();
    }
}