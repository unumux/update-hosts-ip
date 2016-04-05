var hostile = require("hostile");

module.exports = function getHosts() {
    return new Promise((resolve, reject) => {
        hostile.get(false, function(err, lines) {
            var hosts = lines.map((line) => line[1]).filter((line) => line !== "localhost" && line !== "broadcasthost");
            resolve(hosts);
        });
    });
}