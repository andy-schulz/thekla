import {assert as chaiAssert} from "chai";

export type ArrayTypes<T> = ReadonlyArray<T> | ReadonlySet<T> | ReadonlyMap<any, T>

// export function include(needle: string, message?: string): (haystack: string) => boolean;
// export function include<T extends object>(needle: T, message?: string): (haystack: WeakSet<T> | T | ArrayTypes<T>) => boolean;
// export function include<T>(needle: T, message?: string): (haystack: ArrayTypes<T> | T) => boolean;

export function include(needle: any, message = `does not strict include`): (haystack: any) => boolean {
    return (haystack: any): boolean => {
        chaiAssert.include(haystack, needle, message);
        return true;
    }
}

export function notInclude(needle: any, message = `does strict include`): (haystack: any) => boolean {
    return (haystack: any): boolean => {
        chaiAssert.notInclude(haystack, needle, message);
        return true;
    }
}

export function deepInclude(needle: any, message = `does not have deep include`): (haystack: any) => boolean {
    return (haystack: any): boolean => {
        chaiAssert.deepInclude(haystack, needle, message);
        return true;
    }
}

export function notDeepInclude(needle: any, message = `does have deep include`): (haystack: any) => boolean {
    return (haystack: any): boolean => {
        chaiAssert.notDeepInclude(haystack, needle, message);
        return true;
    }
}

export function ownInclude(needle: any, message = `does not have own include`) {
    return (haystack: any): boolean => {
        chaiAssert.ownInclude(haystack,needle,message);
        return true;
    }
}

export function notOwnInclude(needle: any, message = `does have own include`) {
    return (haystack: any): boolean => {
        chaiAssert.notOwnInclude(haystack,needle,message);
        return true;
    }
}

export function deepOwnInclude(needle: any, message = `does not have deep own include`): (haystack: any) => boolean {
    return (haystack: any): boolean => {
        chaiAssert.deepOwnInclude(haystack, needle, message);
        return true;
    }
}

export function notDeepOwnInclude(needle: any, message = `does have deep own include`): (haystack: any) => boolean {
    return (haystack: any): boolean => {
        chaiAssert.notDeepOwnInclude(haystack, needle, message);
        return true;
    }
}

export function nestedInclude(needle: any, message = `does not have nested include`): (haystack: any) => boolean {
    return (haystack: any): boolean => {
        chaiAssert.nestedInclude(haystack, needle, message);
        return true;
    }
}

export function notNestedInclude(needle: any, message = `does have nested include`): (haystack: any) => boolean {
    return (haystack: any): boolean => {
        chaiAssert.notNestedInclude(haystack, needle, message);
        return true;
    }
}

export function deepNestedInclude(needle: any, message = `does not have deep nested include`): (haystack: any) => boolean {
    return (haystack: any): boolean => {
        chaiAssert.deepNestedInclude(haystack, needle, message);
        return true;
    }
}

export function notDeepNestedInclude(needle: any, message = `does have deep nested include`): (haystack: any) => boolean {
    return (haystack: any): boolean => {
        chaiAssert.notDeepNestedInclude(haystack, needle, message);
        return true;
    }
}
