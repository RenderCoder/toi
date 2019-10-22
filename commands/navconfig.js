const path = require("path")
const fs = require("fs")
const pageConfig = require("../navigator")

const __CONSTANT__ = {
  path: {
    navigator_js_file: path.resolve(__dirname, "../navigator.js"),
    sdk_navigator_js_file: path.resolve(__dirname, "../sdk/navigator.js"),
  },
}

const generateCodePiece = (key, targetPath) => {
  return `  ${key}: {
    screen: require ('${path.join("../", targetPath)}'),
  },`
}

const generateCode = () => {
  const pageConfigArray = Object.keys(pageConfig).map(key => {
    return generateCodePiece(key, pageConfig[key].screen)
  })

  return `// automatic generate nacigator config start
const PageConfig = {
${pageConfigArray.join("\n")}
}
// automatic generate nacigator config end`
}

const pageConfigContent = generateCode()

try {
  let SDKNavigatorFileContent = fs.readFileSync(
    __CONSTANT__.path.sdk_navigator_js_file,
    { encoding: "utf8" }
  )
  SDKNavigatorFileContent = SDKNavigatorFileContent.replace(
    /\/\/ automatic generate nacigator config start[\s\S]+\/\/ automatic generate nacigator config end/gi,
    pageConfigContent
  )
  fs.writeFileSync(
    __CONSTANT__.path.sdk_navigator_js_file,
    SDKNavigatorFileContent,
    { encoding: "utf8" }
  )
  console.log('页面导航文件更新完成')
} catch (error) {
  console.log('页面导航文件更新失败', error)
}
