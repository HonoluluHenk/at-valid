declare const require: any;

// find all tests
const context = require.context('./', true, /\.spec\.ts$/);
// And load the modules.
context.keys()
    .map(context);
