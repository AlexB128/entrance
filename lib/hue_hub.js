//------------------------------------------------------------------------------
//  Hue Motion Sensor emulater
//------------------------------------------------------------------------------
const http = require('http')
const port = 3000

const requestHandler = function(request, response) {
  console.log(request.url)
  response.end('{"2":{"state":{"temperature":1969}},"3":{"state":{"presence":false}},"4":{"state":{"lightlevel":16000}}}')
}

const server = http.createServer(requestHandler)

server.listen(port, function(err) {
  if (err) {
    return console.log('something bad happened', err)
  }

  console.log(`server is listening on ${port}`)
})
