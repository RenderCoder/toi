// 扫描文件内容生成页面专属 store

const path = require("path")
const fs = require("fs")
const pageConfig = require("../navigator")

const __CONSTANT__ = {
  path: {
    store_js_file: path.join(__dirname, "../store/index.js"),
  },
}

Object.defineProperty(Array.prototype, "flat", {
  value: function(depth = 1) {
    return this.reduce(function(flat, toFlatten) {
      return flat.concat(
        Array.isArray(toFlatten) && depth > 1
          ? toFlatten.flat(depth - 1)
          : toFlatten
      )
    }, [])
  },
})

const readNavigatorFileContent = () => {
  try {
    const fileContent = fs.readFileSync(__CONSTANT__.path.navigator_js_file, {
      encoding: "utf8",
    })
    return fileContent
  } catch (error) {
    console.log("[Error] readNavigatorFileContent()", error)
    return false
  }
}

const getPagePathArrayFromNavigatorFileContent = fileContent => {
  let result = fileContent.match(/require\s*\([\.\/\w\'\"]+\)/gi)
  result = result.map(item =>
    item.replace(/^require\s*\([\'\"\`]+|[\'\"\`]+\)$/gi, "")
  )
  // console.log(result)
  return result
}

const getStoreFilesForPathArray = pathArray => {
  return pathArray
    .map(item => {
      const itemPath = item.path
      const targetStoreDirPath = path.join(__dirname, "../", itemPath, "store")
      // console.log('targetStoreDirPath', targetStoreDirPath)
      if (!fs.existsSync(targetStoreDirPath)) {
        return false
      }
      try {
        const dirList = fs.readdirSync(targetStoreDirPath)
        let result = {
          key: item.key,
          path: itemPath,
          storePath: path.join("../", itemPath, "store"),
          storeFileList: dirList,
          code: {},
        }

        // 生成代码 - import 语句
        const pageName = item.key.replace(/^\S/, s => s.toLowerCase())
        result.code.import = dirList.map(fileName => {
          const fileNameWithoutLastFix = fileName.replace(/.js$/gi, "")
          const storeFilePath = path.join(result.storePath, fileName)
          return `const Page_${pageName}_${fileNameWithoutLastFix} = require("${storeFilePath}")`
        })
        // 生成代码 - store 定义语句
        result.code.instance = []
        result.code.instance.push(`\n    // ${pageName}`)
        result.code.instance.push(`    this.page.${pageName} = {}`)
        dirList.map(fileName => {
          const fileNameWithoutLastFix = fileName.replace(/.js$/gi, "")
          const codeItem = `    this.page.${pageName}.${fileNameWithoutLastFix} = new Page_${pageName}_${fileNameWithoutLastFix}()`
          result.code.instance.push(codeItem)
        })
        return result
      } catch (error) {
        console.log("[Error] getStoreFilesForPathArray - map()", error)
      }
    })
    .filter(item => item)
}

// console.log(readNavigatorFileContent())
// const pathArray = getPagePathArrayFromNavigatorFileContent(
//   readNavigatorFileContent()
// )

const storeFiles = getStoreFilesForPathArray(
  Object.keys(pageConfig).map(key => ({
    key,
    path: pageConfig[key].screen,
  }))
)
// console.log(JSON.stringify(storeFiles, null, '  '))

const code = {
  import: storeFiles.map(item => item.code.import).flat(),
  instance: storeFiles.map(item => item.code.instance).flat(),
}
// console.log(code)

// return 
// 写入文件
let fileContent = fs.readFileSync(
  __CONSTANT__.path.store_js_file,
  { encoding: "utf8" }
)
// 替换 import 语句
fileContent = fileContent.replace(
  /\/\/ automatic generate store import code start[\s\S]+\/\/ automatic generate store import code end/gi,
`// automatic generate store import code start
${code.import.join('\n')}
// automatic generate store import code end`
)
// 替换 instance 语句
fileContent = fileContent.replace(
  /\/\/ automatic generate page store config start[\s\S]+\/\/ automatic generate page store config end/gi,
`// automatic generate page store config start
${code.instance.join('\n')}
    // automatic generate page store config end`
)

try {
  fs.writeFileSync(
    __CONSTANT__.path.store_js_file,
    fileContent,
    { encoding: "utf8" }
  )
  console.log('Store 文件更新完成')
} catch (error) {
  console.log('Store 文件更新失败', error)
}
