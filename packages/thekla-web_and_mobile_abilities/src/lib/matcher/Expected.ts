import {Expected as E}   from "@thekla/core"
import {deepStrictEqual} from "assert";
import {ElementStatus}   from "../questions/Status";

export const Expected = E;

export interface NamedMatcherFunction<MPT> extends Function {
    (actual: MPT): boolean | Promise<boolean>;
    description?: string;
}

const toBeVisible = (): NamedMatcherFunction<ElementStatus> => {
    const func: NamedMatcherFunction<ElementStatus> = (actual: ElementStatus): boolean => {
        const a: ElementStatus = {visible: actual.visible};
        const e: ElementStatus = {visible: true};
        deepStrictEqual(a, e);
        return true;
    };
    func.description = `toBeVisible`;
    return func;
};

const notToBeVisible = (): NamedMatcherFunction<ElementStatus> => {
    const func: NamedMatcherFunction<ElementStatus> = (actual: ElementStatus): boolean => {
        const a: ElementStatus = {visible: actual.visible};
        const e: ElementStatus = {visible: false};
        deepStrictEqual(a, e);
        return true;
    };

    func.description = `notToBeVisible`;
    return func;
};

// toBeVisible.description = `toBeVisible`;
// notToBeVisible.description = `notToBeVisible`;

Expected.toBeVisible = toBeVisible;
Expected.notToBeVisible = notToBeVisible;