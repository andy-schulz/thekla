export const windowSize = function (): {} {
    return {width: window.innerWidth, height: window.innerHeight};
};

export const getUserAgent = (): string => {
    return navigator.userAgent;
};