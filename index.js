#!/usr/bin/env node

var path = require("path");
var inquirer = require("inquirer");
var sudo = require("sudo-prompt");
var hostile = require("hostile");

var getIP = require("./lib/get-ip");
var getVMs = require("./lib/get-vms");
var getHosts = require("./lib/get-hosts");

const options = {
    name: "Unum UX Update Hosts IP"
};

var hostsPromise = getHosts();

getVMs().then(function(choices) {
    inquirer.prompt([{
        type: "list",
        name: "vmname",
        message: "Choose VM",
        choices: choices
    }, {
        type: "list",
        name: "updateOrAdd",
        message: "Do you want to update an existing host IP or add a new one?",
        choices: [
            "Update existing",
            "Add new"
        ]
    }, {
        type: "list",
        name: "hostName",
        message: "Which hostname should be updated?",
        choices: function() {
            var done = this.async();
            hostsPromise.then(done);
        },
        when: function(answers) {
            return answers.updateOrAdd === "Update existing";
        } 
    }, {
        type: "input",
        name: "hostName",
        message: "Enter a hostname to map to VM",
        when: function(answers) {
            return answers.updateOrAdd === "Add new";
        } 
    }], function(answers) {        
        getIP(answers.vmname).then(function(ip) {
            var setIPPath = path.join(__dirname, "lib", "set-ip.js");
            sudo.exec("/usr/bin/env node " + setIPPath + " " + ip + " \"" + answers.hostName + "\"", options, function(error, stdout, stderr) {
                console.log(error || stdout || stderr);
            });
        });
    });
}).catch(function(msg) {
    console.log(msg);
    process.exit();
});

