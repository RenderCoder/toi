/**
 * Created by huchunbo on 2017/3/4.
 */

const fs = require('fs');
const path = require('path');
const co = require('co');
const co_fs = require('co-fs');
const ncp = require('ncp').ncp;

module.exports.command = 'new <pageName>';

module.exports.describe = 'make a new page';

const pathForTargetPage = function (pageName) {
    return path.join('app', pageName);
};

const createNewPage = function (pageName) {
    if (fs.existsSync(pathForTargetPage(pageName))) {
        console.log('Error: there has been a file named ' + pageName);
        return;
    }
    console.log('Creating file [' + pageName + '] ...');
    ncp('core/app/viewConfig.js', 'app/'+pageName, function (err) {
        if (err) {
            return console.error(err);
        }
        console.log('Done.');
    });
};

module.exports.handler = function (argv) {
    createNewPage(argv.pageName + '.js');
};