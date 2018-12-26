// var yargs = require('yargs');
var download = require('./../public/download');

module.exports.command = 'download <platform> [model]';

module.exports.describe = 'download a project or a component';

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
    download.core();
};