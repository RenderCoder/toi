/**
 * Created by huchunbo on 2017/3/4.
 */

const fs = require('fs');
const path = require('path');
const co = require('co');
const co_fs = require('co-fs');
const ncp = require('ncp').ncp;
const express = require('express');
const url = require('url');

module.exports.command = 'start';

module.exports.describe = 'start local dev mode';

const getPath = function (targetPath) {
    return path.join(process.cwd(),targetPath);
};

const startServer = function () {
    var app = express();

    app.use('/resources', express.static('core'));

    app.get('*', function(req, res){
        // var params = JSON.stringify(req.params);
        // 获取请求路径数组
        var requestPathArray = [];
        for (var key in req.params) {
            var item = req.params[key];
            var itemArray =item.split('/').filter(function (x) {
                return x.length>0;
            });
            requestPathArray.push(itemArray);
        }
        requestPathArray = requestPathArray[0];
        if (requestPathArray.length === 0) {
            res.send({error: 0, des: 'request url error.'});
        }

        // 判断是否为请求子目录
        var returnString = 'return string...';
        var isSubDirectory = requestPathArray.length > 1;
        var requestFile = requestPathArray[requestPathArray.length - 1];
        switch (true) {
            case requestFile === 'app.html':
                returnString = 'app.html';
                res.sendfile('core/app.html');
                break;
            case ['app.js', 'viewConfig.js'].indexOf(requestFile) >= 0:
                returnString = 'app.js';
                res.sendFile(getPath('core/'+requestFile));
                break;
            default:
                res.send('Yo! What are you requesting ???');
                break;
        }


    });

    app.use(function(err, req, res, next){
        console.error(err.stack);
        res.send(500, 'Something broke!');
    });

    var server = app.listen(3165, function() {
        console.log('Listening on port %d', server.address().port);
    });
};

module.exports.handler = function (argv) {
    console.log('start dev server...');
    startServer();
};