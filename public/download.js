/**
 * Created by huchunbo on 2017/3/4.
 */
const downloadRepo = require('download-repo');

const download = {
    core: function () {
        downloadRepo('Bijiabo/upt-core', {target: 'core'})
            .then(function () {
                console.log('done, `cd core` to check out more!')
            });
    }
};

module.exports = download;