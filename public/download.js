const _download = require("download-git-repo");

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
    const gitUrl = "github:Bijiabo/Business-Template-APP-DemoPanelProject";
    console.log("start download device panel project...");
    var done = function (error) {
      if (error) {
        console.log(error);
        return;
      }
      console.log("download device panel project completed!");
      callback();
    };
    _download(gitUrl, targetPath, function (err) {
      if (err) return done(err);
      done();
    });
  },
};

module.exports = download;