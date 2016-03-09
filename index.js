#!/usr/bin/env node

var path = require("path");
var inquirer = require("inquirer");
var sudo = require("sudo-prompt");

var getIP = require("./lib/get-ip");
var getVMs = require("./lib/get-vms");

const options = {
    name: "Unum UX Update Hosts IP"
};


getVMs().then(function(choices) {
    inquirer.prompt([{
        type: "list",
        name: "vmname",
        message: "Choose VM",
        choices: choices
    }], function(answers) {
        getIP(answers.vmname).then(function(ip) {
            var setIPPath = path.join(__dirname, "lib", "set-ip.js");
            sudo.exec("/usr/bin/env node " + setIPPath + " " + ip, options, function(error, stdout, stderr) {
                console.log(error || stdout || stderr);
            });
        });
    });
}).catch(function(msg) {
    console.log(msg);
    process.exit();
});
