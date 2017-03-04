/**
 * Created by huchunbo on 2017/3/4.
 */
const _download = require('download-git-repo');

const download = {
    core: function () {
        var done = function (error) {
            console.log(error);
            console.log('done ----------------!!!');
        };
        _download('github:Bijiabo/upt-core#master', 'core', function(err) {
            if (err) return done(err);
            done();
        });
    }
};

module.exports = download;