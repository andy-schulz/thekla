/**
 * Wait until a condition is met on a given element
 */
import {UsesAbilities, Interaction, stepDetails, AnswersQuestions, Question} from "@thekla/core";
import {Oracle}                                                              from "@thekla/core/dist/lib/actions/Activities";
import {UntilElementCondition}                                               from "@thekla/webdriver";
import {WaitOnElements}                                                      from "../abilities/WaitOnElements";
import {SppElement}                                                          from "../SppWebElements";
import {getLogger}                                                           from "@log4js-node/log4js-api"

class WaitUntil<PT, MPT> implements Oracle<PT, boolean> {

    private matcher: (value: MPT) => boolean | Promise<boolean>;

    public performAs(actor: AnswersQuestions, result: PT): Promise<boolean> {

        return actor.toAnswer(this.question, result)
                    .then((answer: MPT) => {
                        return this.matcher(answer)
                    })
    }

    public is(matcher: (text: MPT) => boolean | Promise<boolean>): WaitUntil<PT, MPT> {
        this.matcher = matcher;
        return this;
    }

    public constructor(private question: Question<PT, MPT>) {
    }

}

export class Wait implements Interaction<void, void> {
    private logger = getLogger(`Wait`);
    private condition: UntilElementCondition;

    /**
     * @ignore
     */
    @stepDetails<UsesAbilities, void, void>(`wait for '<<awaitingElement>>' and check '<<condition>>'.`)
    public performAs(actor: UsesAbilities): Promise<void> {

        return new Promise((resolve, reject): void => {
            WaitOnElements.as(actor).wait(this.condition, this.awaitingElement)
                          .then((message: string): void => {
                              this.logger.debug(message);
                              resolve();
                          })
                          .catch(reject)
        });
    }

    /**
     * wait until a condition is met for the given element
     * @param awaitingElement the elements to wait for
     */
    public static for(awaitingElement: SppElement): Wait {
        return new Wait(awaitingElement);
    }

    public static until<PT, MPT>(question: Question<PT, MPT>): WaitUntil<PT, MPT> {
        return new WaitUntil(question)
    }

    /**
     * specify the condition to wait for of the given element
     * @param condition the condition to be waiting for
     */
    public andCheck(condition: UntilElementCondition): Wait {
        this.condition = condition;
        return this;
    }

    /**
     * @ignore
     */
    private constructor(private awaitingElement: SppElement) {
    }

}