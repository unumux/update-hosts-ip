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
  var choices = stdout.split('\n').filter(function(line) { return line.trim().length > 0 });

  if(choices.length === 0) {
      console.log("No running VMs could be found!")
      process.exit();
  }

  inquirer.prompt([
    {
      type: 'list',
      name: 'vmname',
      message: "Choose VM",
      choices: choices
    }
  ], function(answers) {
    getIP(answers.vmname);
  });
});


function getIP(vmname) {

  exec('prlctl exec "' + vmname + '" ipconfig', function(error, stdout, stderr) {
    var adapterSection = stdout.slice(stdout.indexOf("Ethernet adapter Local Area Connection:"));
    var ip = adapterSection.match(/IPv4 Address[^:]*:(.*)/)[1].trim();
    var setIPPath = path.join(__dirname, 'set-ip.js');
    sudo.exec('/usr/bin/env node ' + setIPPath + ' ' + ip, options, function(error, stdout, stderr) {
      console.log(error || stdout || stderr);
    });
  });

}
