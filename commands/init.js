/**
 * Created by huchunbo on 2017/3/4.
 */

const fs = require('fs');
const path = require('path');
const co = require('co');
const co_fs = require('co-fs');
const prompt = require('prompt');
const colors = require("colors/safe");
const download = require('./../public/download');

module.exports.command = 'init';

module.exports.describe = 'make a new project';

module.exports.builder = {
    model: {
        default: 'MODEL'
    },
    platform: {
        default: 'aliSmart'
    }
};

const createDir = function (dirName) {
    if (!fs.existsSync(dirName)) {
        co(function* (){
            yield fs.mkdir(dirName, 0777);
        });
    }
};

const downloadFiles = function () {
    download.uptScaffold(function () {
        download.core(function () {
            console.log('Done.');
            askUserTapInformation();
        });
    });
};

const createDirectories = function () {
    createDir('components');
    createDir('core');
    createDir('dist');
};

const askUserTapInformation = function () {
    prompt.message = colors.red("@_@");
    // prompt.delimiter = colors.green("--");

    prompt.start();
    prompt.get(
        {
            properties: {
                author: {
                    description: colors.green("What is your name?")
                },
                projectName: {
                    description: colors.green("What is the project name?")
                },
                platform: {
                    description: colors.green("What is the platform of the project?")
                },
                model: {
                    description: colors.green("What is the project model?")
                }
            }
        },
        // ['author', 'platform', 'model'],
        function (err, result) {
            if (err) {
                console.log('\nERROR: prompt error.');
                console.log(err);
                return;
            }
            console.log('Command-line input received:');
            console.log(result.name);
            updateConfigFile(result.author, result.projectName, result.platform, result.model);
        });
};

const updateConfigFile = function (author, projectName, platform, model) {
    var configFileName = 'toi.config';
    if (!fs.existsSync(configFileName)) {
        console.log('ERROR: can not find toi.config file.');
        return;
    }

    var config = undefined;
    var readConfigFile = function* () {
        var buf = yield co_fs.readFile(configFileName, 'utf8');
        return buf;
    };

    co(function *() {
        var configFileContent = yield readConfigFile();
        try {
            config = JSON.parse(configFileContent);
        } catch (err) {
            console.log('ERROR: parse toi.config file failed. [JSON.parse error]');
            console.log(err);
            return;
        }
        if (!config) {
            console.log('ERROR: parse toi.config file failed. [undefined]');
            return;
        }

        var timeNow = new Date();
        config.createdTime = timeNow;
        config.lastUpdatedTime = timeNow;
        config.projectName = projectName || '';
        config.author = author || '';
        config.platform = platform || '';
        config.model = model || '';

        // write config to file
        config = JSON.stringify(config, null, '\t');
        yield co_fs.writeFile(configFileName, config, 'utf8');
        console.log('update toi.config completed.');
    });
};



module.exports.handler = function (argv) {
    console.log('run toi init...');

    downloadFiles();
    createDirectories();
};