export interface BoundaryCheck {
    topOutside: boolean;
    leftOutside: boolean;
    bottomOutside: boolean;
    rightOutside: boolean;
    anyOutside: boolean;
    allOutside: boolean;
    elementOutside: boolean;
    elementPartialOutside: boolean;
    elementInside: boolean;
}

export const isElementOutsideOfView = (className: string) => {
    // function taken from https://vanillajstoolkit.com/helpers/isoutofviewport/
    var isOutOfViewport = function (elem: any): BoundaryCheck {

        // Get element's bounding
        var bounding = elem.getBoundingClientRect();

        // Check if it's out of the viewport on each side
        var out: any = {};
        out.topOutside = bounding.top < 0 || bounding.top > (window.innerHeight || document.documentElement.clientHeight);
        out.leftOutside = bounding.left < 0 || bounding.left > (window.innerWidth || document.documentElement.clientWidth);
        out.bottomOutside = bounding.bottom < 0 || bounding.bottom > (window.innerHeight || document.documentElement.clientHeight);
        out.rightOutside = bounding.right  < 0 || bounding.right > (window.innerWidth || document.documentElement.clientWidth);
        out.anyOutside = out.topOutside || out.leftOutside || out.bottomOutside || out.rightOutside;
        out.allOutside = out.topOutside && out.leftOutside && out.bottomOutside && out.rightOutside;
        out.elementOutside = out.topOutside && out.bottomOutside || out.leftOutside && out.rightOutside;
        out.elementPartialOutside = !out.elementOutside && out.anyOutside;
        out.elementInside = !out.anyOutside;

        return out;

    };

    const element = document.querySelector(className);
    // @ts-ignore
    return isOutOfViewport(element);
};

export const clientRect = (): ClientRectList | DOMRectList => {
    return document.documentElement.getClientRects();
};