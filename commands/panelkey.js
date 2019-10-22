const path = require("path")
const fs = require("fs")
const pageConfig = require("../navigator")

const __CONSTANT__ = {
  path: {
    store_js_file: path.join(__dirname, "../store/index.js"),
    navigator_js_file: path.resolve(__dirname, "../navigator.js"),
    sdk_navigator_js_file: path.resolve(__dirname, "../sdk/navigator.js"),
  }
}

