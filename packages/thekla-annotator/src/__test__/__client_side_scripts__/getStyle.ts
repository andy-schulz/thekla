export const getStyle = function (selector?: string): Function {

    return function (): string | null {
        const element: Element | null = document.querySelector(arguments[0]);
        if(!element) {
            return `none found`;
        }
        else {
            const style = element.getAttribute(`style`);
            return style === `null` ? null : style;
        }
    }
};