import {ScreenshotOptions, ScreenshotSize} from "../../interface/Browser";
import Jimp                                from "jimp";

const resizeScreenshot = (data: string, size: ScreenshotSize): Promise<string> => {

    if(size.width || size.height) {
        const bitmap = Buffer.from(data, `base64`);
        return new Promise((resolve, reject) => {
            Jimp.read(bitmap)
                .then((image) => {
                    image.resize(size.width ? size.width : Jimp.AUTO, size.height ? size.height : Jimp.AUTO)
                        .getBase64(Jimp.MIME_PNG, (err,imageData) => {
                            if(err)
                                return reject();
                            return resolve(imageData.replace(`data:image/png;base64,`,``))
                        })
                })
        });
    }

    return Promise.resolve(data)
};

// data is passed as base64 encoded image
export const processScreenshot = (options?: ScreenshotOptions): (data: string) => Promise<string> => {
    return (data: string): Promise<string> => {
        if(options && options.size)
            return resizeScreenshot(data, options.size);

        return Promise.resolve(data)
    }
};

