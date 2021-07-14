let getStatus = require('../lib/SysInfo').getStatus;

const portNo = process.env.PORT || 8089;
var express = require('express');
var cors = require('cors');

var app = express();

app.use(cors());
//app.use(express.static(path.join(__dirname, '../')));

app.get('/', function (req, res) {
  console.log("received");
  res.writeHead(200, {'Content-Type': 'application/json'});
  res.end(JSON.stringify(getStatus()));
}).listen(portNo);

console.log('express ', portNo);
