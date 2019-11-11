// eslint-disable-next-line @typescript-eslint/camelcase
import {__test_gsnff} from "./../JUnitFormatterUtils";

describe(`Creating the suite name`, () => {
    describe(`from an empty string`, () => {
        it(`should return 'master' as a valid suite name
        test id: 8ad56269-95f2-4664-a0b3-f1561f90798b`, () => {
            expect(__test_gsnff(``)).toEqual(`master`);
        });
    });

    describe(`without a folder in the uri`, () => {
        it(`should return 'master' as a valid suite name
        test id: 8e9806e0-17bc-4c6a-b853-cabe4de5a16e`, () => {
            expect(__test_gsnff(`theFeature.feature`))
                .withContext(`specifying no folder in the uri gave an error`)
                .toEqual(`master`);
            expect(__test_gsnff(`/theFeature.feature`))
                .withContext(`a leading '/' gave an error`)
                .toEqual(`master`);
            expect(__test_gsnff(`\\theFeature.feature`))
                .withContext(`a leading '\\' gave an error`)
                .toEqual(`master`);
        });
    });

    describe(`with a single folder in the uri`, () => {
        it(`should return the folder as suite name
        test id: 6fe1e921-28f0-4404-9801-72180b188f01`, () => {

            expect(__test_gsnff(`features/theFile.feature`))
                .withContext(`linux style gave an error`)
                .toEqual(`features`);

            expect(__test_gsnff(`/features/theFile.feature`))
                .withContext(`linux style with leading slash gave an error`)
                .toEqual(`features`);

            expect(__test_gsnff(`features\\theFile.feature`))
                .withContext(`windows style gave an error`)
                .toEqual(`features`);

            expect(__test_gsnff(`\\features\\theFile.feature`))
                .withContext(`windows style with leading back slash gave an error`)
                .toEqual(`features`);

            expect(__test_gsnff(`//features\\theFile.feature`))
                .withContext(`mixed linux and windows style gave an error`)
                .toEqual(`features`);

            expect(__test_gsnff(`\\features//theFile.feature`))
                .withContext(`mixed windows and linux style gave an error`)
                .toEqual(`features`);

            expect(__test_gsnff(`\\\\\\features///////theFile.feature`))
                .withContext(`using multiple delimiters gave an error`)
                .toEqual(`features`);
        });
    });

    describe(`with multiple folders`, () => {
        it(`should return the path as suite name
        test id: ca7f785b-9f4e-4830-9200-64761c8f26da`, () => {

            expect(__test_gsnff(`features/secondFolder/theFile.feature`))
                .withContext(`linux style gave an error`)
                .toEqual(`features-secondFolder`);

            expect(__test_gsnff(`/features/secondFolder/theFile.feature`))
                .withContext(`linux style with leading slash gave an error`)
                .toEqual(`features-secondFolder`);

            expect(__test_gsnff(`features\\secondFolder\\theFile.feature`))
                .withContext(`windows style gave an error`)
                .toEqual(`features-secondFolder`);

            expect(__test_gsnff(`\\features\\secondFolder\\theFile.feature`))
                .withContext(`windows style with leading back slash gave an error`)
                .toEqual(`features-secondFolder`);

            expect(__test_gsnff(`//features\\secondFolder\\theFile.feature`))
                .withContext(`mixed linux and windows style gave an error`)
                .toEqual(`features-secondFolder`);

            expect(__test_gsnff(`\\features//secondFolder//theFile.feature`))
                .withContext(`mixed windows and linux style gave an error`)
                .toEqual(`features-secondFolder`);

            expect(__test_gsnff(`\\\\\\features\\\\///secondFolder///////theFile.feature`))
                .withContext(`using multiple delimiters gave an error`)
                .toEqual(`features-secondFolder`);
        });
    });
});