var hostile = require('hostile');

var ip = process.argv[2];
var hostName = process.argv[3];

hostile.get(false, function (err, lines) {
  if (err) {
    console.error(err.message)
  }
  
  hostile.set(ip, hostName, function (err) {
    if (err) {
      console.error(err)
    } else {
      console.log('updated ' + hostName + ' successfully!')
    }
  });
})
