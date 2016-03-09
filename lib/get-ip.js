var exec = require("child_process").exec;

module.exports = function getIP(vmname) {
    return new Promise(function(resolve, reject) {
        exec('prlctl exec "' + vmname + '" ipconfig', function(error, stdout, stderr) {
            var adapterSection = stdout.slice(stdout.indexOf("Ethernet adapter Local Area Connection:"));
            var ip = adapterSection.match(/IPv4 Address[^:]*:(.*)/)[1].trim();
            resolve(ip);
        });
    })
}
