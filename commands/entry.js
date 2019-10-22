const path = require("path")
const fs = require("fs")

const __CONSTANT__ = {
  path: {
    navigator_js_file: path.resolve(__dirname, "../store/navigation.js"),
    config_json_file: path.resolve(__dirname, "../app.json"),
  },
}

const updateConfigDeviceTypeForNavigationEntry = () => {
  const file = fs.readFileSync(__CONSTANT__.path.navigator_js_file, "utf8")
  const __f_regex = /(\/\/ Navigator-entry-key=?)[\s\S]+(?=\/\/ Navigator-entry-key)/ig
  const __s_regex = /\{[\s\S]+\}/ig
  const __f_content = file.match(__f_regex)[0]
  const __content = __f_content.match(__s_regex)[0]
  updateConfigDeviceType(__content)
}

const updateConfigDeviceType = config => {
  const __regex = /(\"=?)[\s\S]+(?=\")/ig
  const __key = config.match(__regex)[0].split(",")[0]
  console.log("config___: ",__key )
  const sourceFile = fs.readFileSync(__CONSTANT__.path.config_json_file, "utf8")
  const __sourceFile_JSON = JSON.parse(sourceFile)
  const regex = /(?<=").*?(?=")/
  const __key__ = __key.match(regex)[0]
  __sourceFile_JSON.deviceType = __key__
  const file = JSON.stringify(__sourceFile_JSON)
  const writeFileResponse = fs.writeFileSync(__CONSTANT__.path.config_json_file, file, "utf8")
  console.log("writeFileResponse: ", writeFileResponse)
}

updateConfigDeviceTypeForNavigationEntry()