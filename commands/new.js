/**
 * Created by huchunbo on 2017/3/4.
 */

// var yargs = require('yargs');
module.exports.command = 'new <platform> [model]'

module.exports.describe = 'make a get HTTP request'

module.exports.builder = {
    banana: {
        default: 'cool'
    },
    batman: {
        default: 'sad'
    }
};

module.exports.handler = function (argv) {
    // do something with argv.
    console.log('run 21..');
    console.log(argv);
};