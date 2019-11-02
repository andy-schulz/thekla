export const scrollTo = ({x, y}: {x: number; y: number}): void => {
    return window.scrollTo(x,y<0 ? document.body.scrollHeight : y)
};

export const scrollIntoView = (element: any, center?: boolean): void => {
    const opts: ScrollIntoViewOptions = center ? {block:"center", inline: "center"} : {};
    return element.scrollIntoView(opts);
};

export const boundingRect = (element: any) => {
    const locationInfo: any = {};
    locationInfo.boundingRect = element.getBoundingClientRect();
    locationInfo.innerWidth = window.innerWidth;
    locationInfo.innerHeight = window.innerHeight;
    return locationInfo
};