import {Expected as E}   from "@thekla/core"
import {deepStrictEqual} from "assert";
import {ElementStatus}   from "../questions/Status";

export const Expected = E;

const toBeVisible = (): (actual: ElementStatus) => boolean => {
    return (actual: ElementStatus): boolean => {
        const a: ElementStatus = {visible: actual.visible};
        const e: ElementStatus = {visible: true};
        deepStrictEqual(a, e);
        return true;
    }
};

const notToBeVisible = (): (actual: ElementStatus) => boolean => {
    return (actual: ElementStatus): boolean => {
        const a: ElementStatus = {visible: actual.visible};
        const e: ElementStatus = {visible: false};
        deepStrictEqual(a, e);
        return true;
    }
};

Expected.toBeVisible = toBeVisible;
Expected.notToBeVisible = notToBeVisible;