const {exec} = require("child_process")
const svgAdd = () =>{
    exec("node sdk/tool/getSvg.js",function(error, stdout, sterr){
        console.log(sterr)
    })
}
module.exports.handler = function (argv) {
    svgAdd()
}