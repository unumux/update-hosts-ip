#!/usr/bin/env node
var sudo = require('sudo-prompt');
var exec = require('child_process').exec;
var fs = require('fs');
var path = require('path');
var inquirer = require('inquirer');

var options = {
  name: 'Unum UX Update Hosts IP',
};

exec("prlctl list --no-header -o name", function(err, stdout, stderr) {
  inquirer.prompt([
    {
      type: 'list',
      name: 'vmname',
      message: "Choose VM",
      choices: stdout.split('\n').filter(function(line) { return line.trim().length > 0 })
    }
  ], function(answers) {
    getIP(answers.vmname);
  });
});


function getIP(vmname) {

  exec('prlctl exec "' + vmname + '" ipconfig', function(error, stdout, stderr) {
    var adapterSection = stdout.slice(stdout.indexOf("Ethernet adapter Local Area Connection:"));
    var ip = adapterSection.match(/IPv4 Address[^:]*:(.*)/)[1].trim();
    sudo.exec('/usr/bin/env node set-ip.js ' + ip, options, function(error, stdout, stderr) {
      console.log(error || stdout || stderr);
    });
  });

}
