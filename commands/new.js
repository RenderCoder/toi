/**
 * Created by huchunbo on 2017/3/4.
 */

const fs = require('fs');
const path = require('path');
const co = require('co');
const co_fs = require('co-fs');
const ncp = require('ncp').ncp;
const tip = require('../lib/tip');
const ora = require('ora');
const spinner = ora('正在生成...');
const {exec} = require("child_process")
module.exports.command = 'new <pageName>';

module.exports.describe = 'make a new page';

const defaultFolder = 'pages'

const pathForTargetPage = function (pageName) {
    return path.join(defaultFolder, pageName);
};

const firstUpperCase = (str) => {
    return str.toLowerCase().replace(/( |^)[a-z]/g, (L) => L.toUpperCase());
}

const createNewPage = function (pageName) {
    let reg = /^[a-zA-Z]+$/;
    if(!reg.test(pageName)){
        tip.fail('Error: 名称请使用纯英文字母 ' + pageName);
        return;
    }
    const fileName = pageName  + '.js';
    if (fs.existsSync(pathForTargetPage(fileName))) {
        tip.fail('Error: there has been a file named ' + fileName);
        return;
    }
    spinner.start();
    console.log('Creating file [' + fileName + '] ...');
    ncp('sdk/template.js', defaultFolder + '/' + fileName, function (err) {
        spinner.stop();
        if (err) {
            return console.error(err);
        }
        tip.suc("文件创建完成。");
        //todo 调用添加路由代码
        let code = `node sdk/tool/automaticallyAddNewPage.js ${firstUpperCase(pageName)} ./${defaultFolder}/${fileName}`
        exec(code,function(error, stdout, sterr){
            if(sterr){
                console.log(sterr)
            }else {
                console.log(stdout)
                exec('toi router',function(error, stdout, sterr){
                    console.log(stdout)
                    console.log(sterr)
                })
            }
        })
    });
};

module.exports.handler = function (argv) {
    createNewPage(argv.pageName);
};