var package = require('./package');

module.exports.command = 'build';

module.exports.describe = 'download a project or a component';

module.exports.handler = function (argv) {
    package.package();
};