var hostile = require('hostile');

var ip = process.argv[2];

hostile.get(false, function (err, lines) {
  if (err) {
    console.error(err.message)
  }
  lines.forEach(function (line) {
    if(line[1].indexOf('localhost.com') >= 0) {
      hostile.set(ip, line[1], function (err) {
        if (err) {
          console.error(err)
        } else {
          console.log('updated ' + line[1] + ' successfully!')
        }
      });
    }
  });
})
