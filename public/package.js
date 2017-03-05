/**
 * Created by huchunbo on 2017/3/4.
 */
const fs = require('fs');
const path = require('path');
const co = require('co');
const co_fs = require('co-fs');
const ncp = require('ncp').ncp;
const fileSystemOperation = require('./fileSystemOperation');


const cacheDirName = '.cache';

const createCacheDir = function () {
    if (!fs.existsSync(cacheDirName)) {
        co(function* (){
            yield fs.mkdir(cacheDirName, 0777);
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

const removeCacheDir = function () {
    if (fs.existsSync(cacheDirName)) {
        // fs.rmdirSync(cacheDirName);
        rmdirSync(cacheDirName);
    }
};

const newCacheDir = function () {
    removeCacheDir();
    createCacheDir();
};

function subPath(pathName) {
    return path.join(cacheDirName, pathName);
}

const mkdirs = function () {

    co(function *() {
        yield fs.mkdir(subPath(''), 0777);
    });
};

const copyFiles = function () {

    ncp('./core/style', './.cache/style', function (err) {
        if (err) {
            return console.error(err);
        }
        console.log('done!');
    });

    var cp = function* (fileName) {
        console.log(fileName+':');
        var buf = yield co_fs.readFile('./core/' + fileName);
        console.log(buf);
        yield co_fs.writeFile(subPath(fileName), buf);
    };

    co(function *() {
        yield cp('app.js');
        yield cp('app.html');
        yield cp('upt.js');
    });
};

function read(path){
    co(function *(){
        console.log('a');
        var files = yield fs.readdir(path);
        console.log('b');
        console.log(files);

        for (var i = 0; i < files.length; i++) {
            var file = files[i];
            console.log(file);
            // var stat = yield fs.stat(file);
            // if (!stat.isFile()) continue;
            // var buf = yield fs.readFile(file);
            // console.log('copy %s -> %s', src + '/' + file, dst + '/' + file);
            // yield fs.writeFile(dst + '/' + file, buf);
        }

    });
}

const package = {
    package: function (callback) {
        newCacheDir();
        copyFiles();
        // console.log('xxx');
        // var dirList = read('core');

        // console.log(dirList);
    }
};

module.exports = package;