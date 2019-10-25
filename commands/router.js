/**
 * package React Native Panel Project
 *
 */
const {exec} = require("child_process")
exec("node sdk/tool/automaticallyLoadStores.js && node sdk/tool/generateNavigatorConfig.js",function(error, stdout, sterr){
    console.log(sterr)
})