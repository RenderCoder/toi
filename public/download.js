const _download = require("download-git-repo");
const tip = require('../lib/tip');
const exec = require('child_process').exec;
const ora = require('ora');
const spinner = ora('正在生成...');
const download = {
  core: function (callback) {
    console.log("start download upt-core...");
    var done = function (error) {
      if (error) {
        console.log(error);
        return;
      }
      console.log("download upt-core completed!");
      callback();
    };
    _download("github:Bijiabo/upt-core#master", "core", function (err) {
      if (err) return done(err);
      done();
    });
  },
  uptScaffold: function (callback) {
    console.log("start download upt-scaffold...");
    var done = function (error) {
      if (error) {
        console.log(error);
        return;
      }
      console.log("download upt-scaffold completed!");
      callback();
    };
    _download("github:Bijiabo/upt-scaffold#master", "./", function (err) {
      if (err) return done(err);
      done();
    });
  },
  devicePanel: function (targetPath, callback) {
    const gitUrl = "https://e.coding.net/mxchip/smarthome_panel.git";
    console.log("start download device panel project...");
    var done = function (error, projectName ) {
      spinner.stop();
      if (error) {
        console.log(error);
        tip.fail('请重新运行!');
        return;
      }
      // 删除 git 文件
      exec('cd ' + projectName + ' && rm -rf .git', (err, out) => {
        tip.info(`cd ${projectName} && npm install`);
        tip.suc("download device panel project completed!");
      });
      callback();
    };
    const cmdStr = `git clone ${gitUrl} ${targetPath} && cd ${targetPath}`;
    spinner.start();
    exec(cmdStr, (err) => {
      if (err) return done(err);
      done(err,targetPath);
    });
    // _download(gitUrl, targetPath, { clone: true }, function (err) {
    //   if (err) return done(err);
    //   done();
    // });
  },
};

module.exports = download;