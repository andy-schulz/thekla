import {Duration, Question}             from "../..";
import {Activity, Oracle}               from "../actions/Activities";
import {AnswersQuestions, PerformsTask} from "../Actor";
import {stepDetails}                    from "../decorators/step_decorators";

/**
 * PT = Parameter Type, Type of parameter which could be passed to the interaction
 * MPT = Matcher Parameter Type, type of parameter passed to the given matcher
 */

export class See<PT, MPT> implements Oracle<PT, any> {
    private matcher: (value: MPT) => boolean | Promise<boolean>;
    private repeater = 1;
    private duration = Duration.in.milliSeconds(1000);

    private thenActivities: Activity<any, any>[] = [];
    private otherwiseActivities: Activity<any, any>[] = [];

    private constructor(
        private question: Question<PT, MPT>
    ) {
    }

    public static if<SPT, SMPT>(question: Question<SPT, SMPT>): See<SPT, SMPT> {
        return new See(question)
    }

    @stepDetails<AnswersQuestions, PT, any>(`ask if '<<question>>' fulfills the matcher`)
    public async performAs(actor: AnswersQuestions | PerformsTask, activityResult?: PT): Promise<any> {

        const loop = async (counter: number): Promise<boolean> => {
            const nextLoop = (): Promise<boolean> => {
                // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
                // @ts-ignore setTimeout is taken from node and not from window -> type mismatch
                return new Promise((resolve): number => setTimeout(resolve, this.duration.inMs))
                    .then((): Promise<boolean> => {
                        return loop(counter - 1);
                    });
            };

            if (counter < 1)
                return Promise.resolve(
                    this.matcher(await (actor as AnswersQuestions).toAnswer(this.question, activityResult))
                );

            let promise: Promise<boolean>;
            try {
                const answer: MPT = (await (actor as AnswersQuestions).toAnswer(this.question, activityResult));
                promise = Promise.resolve((
                    this.matcher(answer)
                ));
            } catch (e) {
                return nextLoop();
            }

            return promise
                .then((matched: boolean): Promise<boolean> | boolean => {
                    if (!matched) {
                        return nextLoop();
                    } else {
                        return matched;
                    }
                })
                .catch((): Promise<boolean> => {
                    return nextLoop();
                })
        };

        return loop(this.repeater - 1)
            .then((match: boolean): Promise<any> => {
                if (match && this.thenActivities.length > 0)
                    return (actor as PerformsTask).attemptsTo(...this.thenActivities);
                if (match)
                    return Promise.resolve(activityResult);

                return Promise.reject(new Error(`See interaction with question '${this.question.toString()}' and matcher 
                ${this.matcher.toString()}
                returned ${match}. No 'otherwise' activities were given`));

            })
            .catch((e): Promise<any> => {
                if (this.otherwiseActivities.length > 0)
                    return (actor as PerformsTask).attemptsTo(...this.otherwiseActivities);
                else
                    return Promise.reject(e);
            });
    }

    public then(...activities: Activity<any, any>[]): See<PT, MPT> {
        this.thenActivities = activities;
        return this;
    }

    public otherwise(...activities: Activity<any, any>[]): See<PT, MPT> {
        this.otherwiseActivities = activities;
        return this;
    }

    public is(matcher: (value: MPT) => boolean | Promise<boolean>): See<PT, MPT> {
        this.matcher = matcher;
        return this;
    }

    public repeatFor(times: number, duration: number | Duration = Duration.in.milliSeconds(1000)): See<PT, MPT> {
        this.duration = (typeof duration === `number`) ?
                        Duration.in.milliSeconds(duration) :
                        duration

        if (times < 1 || times > 1000)
            throw new Error(`The repeat 'times' value should be between 1 and 1000. But its: ${times}`);

        if (this.duration.inMs < 0 || this.duration.inMs > 60000)
            throw new Error(`The interval value should be between 1 and 60000 ms (1 minute). But its: ${duration}`);

        this.repeater = times;
        return this;
    }
}