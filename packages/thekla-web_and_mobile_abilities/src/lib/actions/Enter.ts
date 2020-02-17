import {getLogger, Logger}                                 from "@log4js-node/log4js-api";
import {Interaction, Question, stepDetails, UsesAbilities} from "@thekla/core";
import {FindElements}                                      from "../abilities/FindElements";
import {SppElement}                                        from "../SppWebElements";

class EnterBase implements Interaction<void, void> {
    private inputField: SppElement;
    private clearField = false;
    private logger: Logger = getLogger(`Enter`);

    private intoFunc: EnterHelper;

    @stepDetails<UsesAbilities, void, void>(`enter the value '<<keySequence>>' into field: <<inputField>>`)
    public async performAs(actor: UsesAbilities): Promise<void> {
        // if undefined do nothing,
        // it makes it possible to work with data structures on forms
        if (this.sequence === undefined) {
            this.logger.debug(`KeySequence is undefined so nothing is entered into ${this.inputField.toString()}`);
            return Promise.resolve();
        }

        let keySequence = ``;

        if (typeof this.sequence !== `string`)
            keySequence = await this.sequence.answeredBy(actor);
        else
            keySequence = this.sequence;

        return Promise.resolve()
                      .then((): Promise<void> | void => {
                          if (this.clearField)
                              return FindElements.as(actor).findElement(this.inputField).clear();
                      })
                      .then((): Promise<void> => FindElements.as(actor).findElement(this.inputField).sendKeys(keySequence as string));
    }

    get into(): EnterHelper {
        return this.intoFunc;
    }

    /**
     * @deprecated sinse version 3.x - use Enter.value().into.empty() instead
     * @param {boolean} clear
     * @returns {Enter}
     */
    public butClearsTheFieldBefore(clear = true): EnterBase {
        this.clearField = clear;
        return this;
    }

    public constructor(private sequence: string | undefined | Question<void, string>) {
        // build the helper function so that
        // Enter.value().into() and
        // Enter.value().into.empty() works
        const intoFunc = (inputField: SppElement): EnterBase => {
            this.inputField = inputField;
            return this;
        };

        const emptyFunc = (inputField: SppElement): EnterBase => {
            this.inputField = inputField;
            this.clearField = true;
            return this;
        };

        intoFunc.empty = emptyFunc;

        this.intoFunc = intoFunc;
    }
}

export class Enter {
    public static value(inputString: string | undefined): EnterBase {
        return new EnterBase(inputString);
    }

    public static resultOf(question: Question<void, string>): EnterBase {
        return new EnterBase(question)
    }
}

interface EnterHelper extends Function {
    (element: SppElement): EnterBase;

    empty: (element: SppElement) => EnterBase;
}