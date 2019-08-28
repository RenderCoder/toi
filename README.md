# toi

NOTE: this package need special environment now.

A tool for develop IoT project.

```
Usage: toi [options]

Commands:
  init     make a new project
  run      run server
  package  package project
  `package no-zip` package project without zip bundle
  version

Options:
  -h, --help  Show help                                                [boolean]

Examples:
  toi init demo       create a demo device panel project
  toi package --map   //build zip with bundle.map
  toi package --type xxx   //custimize deviceType
copyright 2019
```

## Update

* `2018/12/27` `Fix`: copy `app.json` into package bundle.
* `2019/01/01` `Fix`: wrong path for Android package
* `2019/01/02` `Add`: command `toi package no-zip`
* `2019/08/27` `Add`: command `toi package --map`
* `2019/08/27` `Add`: command `toi package --type xxx`
