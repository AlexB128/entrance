exports.motion = function(sensor) {
  const http = require("http");
  const url = (process.env.NODE_ENV === 'simulator') ?
    "http://localhost:3000" :
    "http://192.168.29.20/api/5CcGQgdzWyYqcF9bfgQ1IAOZT7waTG6Aca7V4hFL/sensors";

  http.get(url, function(res) {
    var statusCode = res.statusCode;
    if (statusCode != 200) {
      console.log("response status code:", res.statusCode);
      return;
    }

    res.setEncoding("utf8");
    let body = "";

    res.on("data", function(data) {
      body += data;
    });
    res.on("end", function() {
      body = JSON.parse(body);
      sensor.presence = body["3"]["state"]["presence"];
      sensor.lightlevel = body["4"]["state"]["lightlevel"];
    });
  }).on("error", () => console.log("GET request error") );;
}
