#!/usr/bin/env node

var inquirer = require("inquirer");

var getIP = require("./lib/get-ip");
var getVMs = require("./lib/get-vms");

getVMs().then(function(choices) {
    inquirer.prompt([{
        type: "list",
        name: "vmname",
        message: "Choose VM",
        choices: choices
    }], function(answers) {
        getIP(answers.vmname).then(function(ip) {
            console.log(ip);
        });
    });
}).catch(function(msg) {
    console.log(msg);
    process.exit();
});
