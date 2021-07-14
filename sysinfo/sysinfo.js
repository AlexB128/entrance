let getStatus = require('../lib/SysInfo').getStatus;

const portNo = process.env.PORT || 8089;
let http = require('http');

http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'application/json'});
  res.end(JSON.stringify(getStatus()));
}).listen(portNo);

console.log('Server running at ', portNo);
