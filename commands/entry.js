const {exec} = require("child_process")
const updateEntry = () =>{
    exec('node sdk/tool/automaticallyUpdateEntry.js',function (error, stdout, sterr) {
        if (error) return console.error(error)
        console.log(stdout)
    })
}
module.exports.handler = function (argv) {
    updateEntry()
}