/**
 * Created by huchunbo on 2017/3/4.
 */
const _download = require('download-git-repo');

const download = {
    core: function (callback) {
        console.log('start download upt-core...');
        var done = function (error) {
            if (error) {
                console.log(error);
                return;
            }
            console.log('download upt-core completed!');
            callback();
        };
        _download('github:Bijiabo/upt-core#master', 'core', function(err) {
            if (err) return done(err);
            done();
        });
    },
    uptScaffold: function (callback) {
        console.log('start download upt-scaffold...');
        var done = function (error) {
            if (error) {
                console.log(error);
                return;
            }
            console.log('download upt-scaffold completed!');
            callback();
        };
        _download('github:Bijiabo/upt-scaffold#master', './', function(err) {
            if (err) return done(err);
            done();
        });
    }
};

module.exports = download;