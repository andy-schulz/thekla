import {TheklaAssertion} from "./TheklaAssertion";

export interface Expected {
    to: TheklaAssertion;
    not: TheklaAssertion;
}