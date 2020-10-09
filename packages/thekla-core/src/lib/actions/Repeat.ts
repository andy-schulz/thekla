import {Activity, Duration, Question, See} from "../..";
import {PerformsTask}                      from "../Actor";
// TODO: execution error when stepDetails are imported from ../.. ... investigate
import {stepDetails}                       from "../decorators/step_decorators";
import {Task}                              from "./Activities";

type A<P, R> = Activity<P, R>

export class Repeat<PT, RT, QPT, QRT> extends Task<PT, RT> {

    private question: Question<QPT, QRT>;
    private expected: (text: QRT) => boolean | Promise<boolean>;

    private retries = 3;
    private durationBetweenRetries = Duration.in.seconds(1);

    private lastError: Error;

    private constructor(private activities: Activity<any, any>[], private passResult: boolean) {
        super();
    }

    public static activities<PT, P, R1>(a1?: A<P, R1>): Repeat<PT, R1, any, any>;
    public static activities<PT, P, R1, R2>(a1: A<P, R1>, a2: A<R1, R2>): Repeat<PT, R2, any, any>;
    public static activities<PT, P, R1, R2, R3>(a1: A<P, R1>, a2: A<R1, R2>, a3: A<R2, R3>): Repeat<PT, R3, any, any>;
    public static activities<PT, P, R1, R2, R3, R4>(a1: A<P, R1>, a2: A<R1, R2>, a3: A<R2, R3>, a4: A<R3, R4>): Repeat<PT, R4, any, any>;
    public static activities<PT, P, R1, R2, R3, R4, R5>(a1: A<P, R1>, a2: A<R1, R2>, a3: A<R2, R3>, a4: A<R3, R4>, a5: A<R4, R5>): Repeat<PT, R5, any, any>;
    public static activities<PT, P, R1, R2, R3, R4, R5, R6>(a1: A<P, R1>, a2: A<R1, R2>, a3: A<R2, R3>, a4: A<R3, R4>, a5: A<R4, R5>, a6: A<R5, R6>): Repeat<PT, R6, any, any>;
    public static activities<PT, P, R1, R2, R3, R4, R5, R6, R7>(a1: A<P, R1>, a2: A<R1, R2>, a3: A<R2, R3>, a4: A<R3, R4>, a5: A<R4, R5>, a6: A<R5, R6>, a7: A<R6, R7>): Repeat<PT, R2, any, any>;
    public static activities<PT, P, R1, R2, R3, R4, R5, R6, R7, R8>(a1: A<P, R1>, a2: A<R1, R2>, a3: A<R2, R3>, a4: A<R3, R4>, a5: A<R4, R5>, a6: A<R5, R6>, a7: A<R6, R7>, a8: A<R7, R8>): Repeat<PT, R8, any, any>;
    public static activities<PT, P, R1, R2, R3, R4, R5, R6, R7, R8, R9>(a1: A<P, R1>, a2: A<R1, R2>, a3: A<R2, R3>, a4: A<R3, R4>, a5: A<R4, R5>, a6: A<R5, R6>, a7: A<R6, R7>, a8: A<R7, R8>, a9: A<R8, R9>): Repeat<PT, R9, any, any>;
    public static activities<PT, P, R1, R2, R3, R4, R5, R6, R7, R8, R9, R10>(a1: A<P, R1>, a2: A<R1, R2>, a3: A<R2, R3>, a4: A<R3, R4>, a5: A<R4, R5>, a6: A<R5, R6>, a7: A<R6, R7>, a8: A<R7, R8>, a9: A<R8, R9>, a10: A<R9, R10>): Repeat<PT, R10, any, any>;
    public static activities<PT, P, R1, R2, R3, R4, R5, R6, R7, R8, R9, R10>(a1: A<P, R1>, a2: A<R1, R2>, a3: A<R2, R3>, a4: A<R3, R4>, a5: A<R4, R5>, a6: A<R5, R6>, a7: A<R6, R7>, a8: A<R7, R8>, a9: A<R8, R9>, a10: A<R9, R10>, ...activities: A<any, any>[]): Repeat<PT, any, any, any>;
    public static activities(...activities: Activity<any, any>[]): Repeat<any, any, any, any> {
        return new Repeat(activities, false);
    }

    public static test<PT, P, R1>(a1: A<P, R1>): Repeat<any, any, any, any> {
        return new Repeat([a1], false);
    }

    // public static activitiesAndPassResult(...activities: Activity<any, any>[]): Repeat<any, any, any> {
    //     return new Repeat(activities, true);
    // }

    @stepDetails<PerformsTask, PT, RT>(`repeat task for <<retries>> times and wait for <<durationBetweenRetries>> in between`)
    public performAs(actor: PerformsTask, result?: PT): Promise<RT> {
        let counter: number = this.retries;

        return new Promise((resolve, reject) => {
            const loop = (): void => {
                if (counter < 1)
                    reject(`Repeat timed out after ${this.retries} retries 
    with Error: ${this.lastError}
    for question: ${this.question.toString()}`);
                counter = counter - 1;

                actor
                    .attemptsTo(
                        ...this.activities)
                    .then(activitiesResult => {
                        return actor
                            .attemptsTo_(
                                See.if(this.question)
                                    .is(this.expected))(activitiesResult)
                            .then(() => resolve(activitiesResult))
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

    public until(question: Question<QPT, QRT>): Repeat<PT, RT, QPT, QRT> {
        this.question = question;
        return this;
    }

    public is(expected: (text: QRT) => boolean | Promise<boolean>): Repeat<PT, RT, QPT, QRT> {
        this.expected = expected;
        return this;
    }

    public retryFor(retries: number, durationBetweenRetries = Duration.in.seconds(1)): Repeat<PT, RT, QPT, QRT> {

        if (retries < 1 || retries > 1000)
            throw new Error(`The retries counter should be between 1 and 1000. But its: ${retries}`);

        if (durationBetweenRetries.inMs < 0 || durationBetweenRetries.inMs > 60000)
            throw new Error(`The 'waitBetweenRetries' duration should be between 1 and 60 s (1 minute). But its: ${durationBetweenRetries.inSec}`);

        this.retries = retries;
        this.durationBetweenRetries = durationBetweenRetries;
        return this;
    }
}