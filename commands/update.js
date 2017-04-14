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

module.exports.command = 'update';

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

var rmdirSync = (function(){
    function iterator(url,dirs){
        var stat = fs.statSync(url);
        if(stat.isDirectory()){
            dirs.unshift(url);//收集目录
            inner(url,dirs);
        }else if(stat.isFile()){
            fs.unlinkSync(url);//直接删除文件
        }
    }
    function inner(path,dirs){
        var arr = fs.readdirSync(path);
        for(var i = 0, el ; el = arr[i++];){
            iterator(path+"/"+el,dirs);
        }
    }
    return function(dir,cb){
        cb = cb || function(){};
        var dirs = [];

        try{
            iterator(dir,dirs);
            for(var i = 0, el ; el = dirs[i++];){
                fs.rmdirSync(el);//一次性删除所有收集到的目录
            }
            cb()
        }catch(e){//如果文件或目录本来就不存在，fs.statSync会报错，不过我们还是当成没有异常发生
            e.code === "ENOENT" ? cb() : cb(e);
        }
    }
})();

const downloadFiles = function () {
    download.uptScaffold(function () {
        rmdirSync('core', function () {
            download.core(function () {
                console.log('Done.');
            });
        });
    });
};

const createDirectories = function () {
    createDir('components');
    createDir('core');
    createDir('dist');
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