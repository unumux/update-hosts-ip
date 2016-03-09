var exec = require("child_process").exec;

module.exports = function getVMs() {
    return new Promise(function(resolve, reject) {
        exec("prlctl list --no-header -o name", function(err, stdout, stderr) {
            var choices = stdout.split('\n').filter(function(line) { return line.trim().length > 0 });

            if(choices.length === 0) {
                reject("No running VMs could be found!");
            } else {
                resolve(choices);
            }
        });
    });
}
