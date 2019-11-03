import {getServerUrl}  from "../../lib/config/url_formatter";
import {ServerAddress} from "@thekla/config"

describe(`creating the url`, (): void => {

    describe(`from an empty serverAddress`, (): void => {
        it(`should return the standard selenium location 
        - (test case id: 74226fcd-1475-4196-8a56-4954ca6134bc)`, (): void => {
            expect(getServerUrl(undefined)).toEqual(`http://localhost:4444/wd/hub`)
        });
    });

    describe(`from standard values`, (): void => {
        it(`should return the standard selenium address 
        - (test case id: b0728e7d-f1cd-4109-8610-9751938b4f44)`, (): void => {
            const serverAddress: ServerAddress = {
                hostname: `my.hostname.test`
            };
            expect(getServerUrl(serverAddress)).toEqual(`http://my.hostname.test:4444/wd/hub`)
        });
    });

    describe(`from hostname`, (): void => {

        it(`should return the standard selenium address 
        - (test case id: 55a16a8e-0a6e-469f-88ff-9b766a58de13)`, (): void => {
            const serverAddress: ServerAddress = {
                hostname: ``
            };
            expect(getServerUrl(serverAddress)).toEqual(`http://localhost:4444/wd/hub`)
        });

        it(`should trim trailing / from hostname 
        - (test case id: db49560f-dc28-418f-9dcc-13eae1d4fe33)`, (): void => {
            const serverAddress: ServerAddress = {
                hostname: `my.hostname.com/`
            };

            expect(getServerUrl(serverAddress)).toEqual(`http://my.hostname.com:4444/wd/hub`);

            const serverAddress2: ServerAddress = {
                hostname: `my.hostname.com//`
            };

            expect(getServerUrl(serverAddress2)).toEqual(`http://my.hostname.com:4444/wd/hub`);
        });

        it(`should throw an Error when not a string is passed 
        - (test case id: 9f307da2-8708-4e77-a01c-8c3c66b5776e)`, (): void => {

            const serverAddress: ServerAddress = {
                // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
                // @ts-ignore to pass a number to hostname
                hostname: 123
            };

            expect(() => getServerUrl(serverAddress)).toThrow()
        });

    });

    describe(`from protocol`, (): void => {
        it(`should add the http protocol to the server string 
        - (test case id: 389151db-0f51-43b7-8512-55fed690a695)`, (): void => {
            const serverAddress: ServerAddress = {
                hostname: `my.hostname.com`,
                protocol: "http" //eslint-disable-line
            };

            expect(getServerUrl(serverAddress)).toEqual(`http://my.hostname.com:4444/wd/hub`)
        });

        it(`should add the https protocol and port 443 to the server string 
        - (test case id: 389151db-0f51-43b7-8512-55fed690a695)`, (): void => {
            const serverAddress: ServerAddress = {
                hostname: `my.hostname.com`,
                protocol: "https" //eslint-disable-line
            };

            expect(getServerUrl(serverAddress)).toEqual(`https://my.hostname.com:443/wd/hub`)
        });

        it(`should throw an error for not defined elements
        test id: 3adb573d-84e5-4740-8f00-55c2561f075f`, function () {
            const serverAddress: ServerAddress = {
                hostname: `my.hostname.com`,
                // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
                // @ts-ignore to check not typed values
                protocol: "fail" //eslint-disable-line
            };

            expect(() => getServerUrl(serverAddress)).toThrow()
        });
    });

    describe(`from path`, (): void => {
        it(`should omit the path when it is set to '' 
        - (test case id: bf583ccb-ef3d-43b2-987e-ae614a4f13cf)`, (): void => {
            const serverAddress: ServerAddress = {
                hostname: `my.hostname.com`,
                path: ``
            };

            expect(getServerUrl(serverAddress)).toEqual(`http://my.hostname.com:4444`)
        });

        it(`should return a string with host and path 
        - (test case id: bf583ccb-ef3d-43b2-987e-ae614a4f13cf)`, (): void => {
            const serverAddress: ServerAddress = {
                hostname: `my.hostname.com`,
                path: `/my/path`
            };

            expect(getServerUrl(serverAddress)).toEqual(`http://my.hostname.com:4444/my/path`)
        });
    });

    describe(`from protocol and port`, (): void => {
        it(`should set the given port even with https set 
        - (test case id: c32163c7-83f9-4188-b399-e6a8b978563f)`, (): void => {
            const serverAddress: ServerAddress = {
                hostname: `my.hostname.com`,
                protocol: `https`,
                port: 1234
            };

            expect(getServerUrl(serverAddress)).toEqual(`https://my.hostname.com:1234/wd/hub`)
        });

        it(`should throw an error when port is lower than 0 
        - (test case id: c63a5a86-80aa-482a-b64c-9bb570cf79c2)`, (): void => {
            const serverAddress: ServerAddress = {
                hostname: `my.hostname.com`,
                protocol: `https`,
                port: -1
            };

            expect(() => getServerUrl(serverAddress)).toThrow()
        });

        it(`should throw an error when port is greater than 65535 
        - (test case id: c63a5a86-80aa-482a-b64c-9bb570cf79c2)`, (): void => {
            const serverAddress: ServerAddress = {
                hostname: `my.hostname.com`,
                protocol: `https`,
                port: 65536
            };

            expect(() => getServerUrl(serverAddress)).toThrow()
        });

        it(`should throw an error when port is not of type number 
        - (test case id: 91b1294e-05d6-45ac-860c-900350dc0dd4)`, (): void => {

            const serverAddress: ServerAddress = {
                hostname: `my.hostname.com`,
                protocol: `https`,
                // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
                // @ts-ignore to pass a string as port
                port: `1234`
            };

            expect(() => getServerUrl(serverAddress)).toThrow()
        });
    })
});