/**
 * Created by huchunbo on 2017/3/4.
 */

var package = require('./../public/package');

module.exports.command = 'build';

module.exports.describe = 'download a project or a component';

module.exports.handler = function (argv) {
    package.package();
};