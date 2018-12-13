interface Args {
    [key: string]: string;
}
const menus: Args = {
    main: `
    thekla [command | <configFile>] <options>
    
    help .............. print help menu
    version ........... show version number
    configFile ........ pass the config file to thekla and start the tests
    
    --specs     - the spec files to execute (glob style can be passed)`,


};

export const helpText = (args: any) => {
    const subCmd = args._[0] === 'help'
        ? args._[1]
        : args._[0];

    console.log(menus[subCmd] || menus.main)
}