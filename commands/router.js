/**
 * package React Native Panel Project
 *
 */
const {exec} = require("child_process")
exec("node tool/automaticallyLoadStores.js && node tool/generateNavigatorConfig.js")