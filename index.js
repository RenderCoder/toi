#!/usr/bin/env node
require("shelljs/global");
var path = require("path");
var yargs = require("yargs");

var argv = yargs
  .command(require("./commands/init"))
  .command(require("./commands/run"))
  .command(require("./commands/package"))
  .command(require("./commands/version"))
  .command(require("./commands/entry"))
  .command(require("./commands/panelkey"))
  .command(require("./commands/store"))
  .command(require("./commands/navconfig"))
  // .command(require('./commands/start'))
  // .command(require('./commands/new'))
  // .command(require('./commands/update'))
  // .command(require('./commands/download'))
  /*
  .option('i', {
      alias : 'init',
      demand: false,
      // default: '',
      describe: 'init a new project',
      // type: 'string'
      function (yargs) {
          // console.log(yargs);
      }
  })
  .option('p', {
      alias : 'platform',
      demand: false,
      default: 'alismart',
      describe: 'set platform         设定项目所属平台',
      choices: ['alismart', 'jdsmart'],
      type: 'string'
  })
  */
  // .alias("n", "new")
  // .alias("s", "start")
  .alias("v", "version")
  .usage("Usage: toi [options]")
  // 示例
  .example("toi init demo", "create a demo device panel project")
  .example("toi run", "")
  .example("toi run --port 8001", "")
  .help("h")
  .alias("h", "help")
  .alias("sm","sourcemap")
  .epilog("copyright 2019")
  .argv;
