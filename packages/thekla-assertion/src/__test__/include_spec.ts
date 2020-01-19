describe(`Expect`, () => {

    describe(`the standard include assertion`, () => {

        fit(`to pass
        test id: d8dd482a-dd8e-4563-920c-11ec8a97e6e3`, () => {
            // Expected.to.deep.include({'a.b': `1`, 'a.c': [2]})({a: {b: `1`, c: [1,2,3,4]}})

            const not = false;
            const deep = false;
            const own = false;
            const nested = false;

            const bitMask =
                (not ? 0b0001 << 0 : 0b0000) |
                (deep ? 0b0001 << 1 : 0b0000) |
                (own ? 0b0001 << 2 : 0b0000) |
                (nested ? 0b0001 << 3 : 0b0000);

            console.log(bitMask);

            switch (bitMask) {
                case 0b0000 :
                    console.log(`All not set`);
                    break;
                case 0b0001 :
                    console.log(`not flag set`);
                    break;
                case 0b0010 :
                    console.log(`deep flag set`);
                    break;
                case 0b0011 :
                    console.log(`not and deep flag set`);
                    break;
                case 0b0100 :
                    console.log(`own flag set`);
                    break;
                case 0b0101 :
                    console.log(`own and not flag set`);
                    break;
                case 0b0110 :
                    console.log(`own and deep flag set`);
                    break;
                case 0b0111 :
                    console.log(`own, deep and not flag set`);
                    break;
                case 0b1000 :
                    console.log(`nested flag set`);
                    break;
                case 0b1001 :
                    console.log(`nested and not flag set`);
                    break;
                case 0b1010 :
                    console.log(`nested and deep flag set`);
                    break;
                case 0b1011 :
                    console.log(`nested, deep and not flag set`);
                    break;
                case 0b1100 :
                    console.log(`ERROR own and nested flag set`);
                    break;
                case 0b1101 :
                    console.log(`ERROR own and nested flag set`);
                    break;
                case 0b1110 :
                    console.log(`ERROR own and nested flag set`);
                    break;
                case 0b1111 :
                    console.log(`ERROR own and nested flag set`);
                    break;
                default:
                    throw new Error(`Error when evaluation the flags for include`)
            }

        });
    });
});