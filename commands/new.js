/**
 * Created by huchunbo on 2017/3/4.
 */

const fse = require('fs-extra');
const path = require('path');
const tip = require('../lib/tip');
const ora = require('ora');
const spinner = ora('正在生成...');
const {exec} = require("child_process")
const inquirer = require('inquirer')
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

    fse.pathExists(pathForTargetPage(pageName), (err, exists) => {
        if(err){
            console.log(err)
            return;
        }
        if(exists){
            tip.fail('Error: 目录 ' + pageName + ' 已存在 ');
            return;
        }
        spinner.start();
        console.log('Creating page [' + pageName + '] ...');
        fse.copy('./sdk/template', './'+defaultFolder+'/'+pageName, err => {
            if (err) return console.error(err)
            spinner.stop();
            tip.suc("文件创建完成。")
            inquirer.prompt([
                {
                    type: 'confirm',
                    name: 'entry',
                    message: '是否设为入口页？',
                    default: true
                }
            ]).then((answers) => {
                let code = `node sdk/tool/automaticallyAddNewPage.js ${firstUpperCase(pageName)} ./${defaultFolder}/${pageName}/index.js ${answers.entry}`
                exec(code,function(error, stdout, sterr){
                    if(sterr){
                        console.log(sterr)
                    }else {
                        console.log(stdout)
                        exec('node sdk/tool/automaticallyLoadStores.js && node sdk/tool/generateNavigatorConfig.js',function(error, stdout, sterr){
                            if (error) return console.error(error)
                            console.log(stdout)
                            if(answers.entry){
                                exec('node sdk/tool/automaticallyUpdateEntry.js',function (error, stdout, sterr) {
                                    if (error) return console.error(error)
                                    console.log(stdout)
                                })
                            }
                        })
                    }
                })
            })

            })
        })

};


module.exports.handler = function (argv) {
    createNewPage(argv.pageName);
};