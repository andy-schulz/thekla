import {AnswersQuestions, PerformsTask} from "../../Actor";
import {Question}                       from "./Question";
import {Activity, Oracle}               from "../actions/Activities";
import {step}                           from "../../..";

export class See<U> implements Oracle {
    matcher: (value: U) => boolean | Promise<boolean>;
    private repeater: number = 1;
    private ms: number = 1000;

    private thenActivities: Activity[] = [];
    private otherwiseActivities: Activity[] = [];


    // @step<AnswersQuestions>("to check a condition")
    async performAs(actor: AnswersQuestions | PerformsTask): Promise<void> {

        const loop = async (counter: number): Promise<boolean> => {
            const nextLoop = () => {
                return new Promise(resolve => setTimeout(resolve, this.ms))
                    .then(() => {
                        return loop(counter -1);
                    });
            };

            if(counter < 1)
                return Promise.resolve((this.matcher(await (actor as AnswersQuestions).toAnswer(this.question))));

            let promise;
            try {
                const answer = await (actor as AnswersQuestions).toAnswer(this.question);
                promise = Promise.resolve((
                    this.matcher(answer)
                ));
            } catch (e) {
                return nextLoop();
            }

            return promise
                .then((matched: boolean) => {
                    if(!matched) {
                        return nextLoop();
                    } else {
                        return matched;
                    }
                })
                .catch((e) => {
                    return nextLoop();
                })
        };

        return loop(this.repeater - 1)
            .then((match: boolean) => {
                if(this.thenActivities.length > 0) {
                    return (actor as PerformsTask).attemptsTo(...this.thenActivities);
                }
                else {
                    return;
                }
            })
            .catch((e) => {
                if(this.otherwiseActivities.length > 0)
                    return (actor as PerformsTask).attemptsTo(...this.otherwiseActivities);
                else
                    return Promise.reject(e);
            });
    }

    static if <T>(question: Question<T>): See<T> {
        return new See(question)
    }

    public then(...activities: Activity[]) {
        this.thenActivities = activities;
        return this;
    }

    public otherwise(...activities: Activity[]) {
        this.otherwiseActivities = activities;
        return this;
    }

    is(matcher: (text: U) => boolean | Promise<boolean>): See<U> {
        this.matcher = matcher;
        return this;
    }

    repeatFor(times: number, interval: number = 1000): See<U> {

        if(times < 1 || times > 1000)
            throw new Error(`The repeat value should be between 1 and 1000. But its: ${times}`);

        if(interval < 0 || interval > 60000)
            throw new Error(`The interval value should be between 1 and 60000 ms (1 minute). But its: ${interval}`);

        this.repeater = times;
        this.ms = interval;
        return this;
    }


    constructor(
        private question: Question<U>
    ) {}
}