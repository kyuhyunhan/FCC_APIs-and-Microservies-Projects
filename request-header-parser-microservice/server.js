// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();
const requestIp = require('request-ip');

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({optionsSuccessStatus: 200}));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// using request-ip MW
const ipMW = (req, res, next) => {
  console.log('res.locals object:',res.locals,'//////////////////////////////');
  res.locals.clientIp = requestIp.getClientIp(req); // to attach value to "res.locals" Object
  next();
}

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});

app.route('/api/whoami').get((req, res) => {
  // const ipAddress = res.locals.clientIp;

  // console.log(req.headers['x-forwarded-for']);
  // console.log(req.connection.remoteAddress);
  // console.log(req.socket.remoteAddress);
  // console.log(req.connection.socket.remoteAddress);
  /*
  const ipAddress = (req.headers['x-forwarded-for'] ||
                      req.connection.remoteAddress ||
                      req.socket.remoteAddress ||
                      req.connection.socket.remoteAddress).split(",")[0];
  */
  const ipAddress = requestIp.getClientIp(req);
  const language = req.headers['accept-language'];
  const software = req.headers['user-agent'];
  res.json({ ipaddress: ipAddress, language: language, software: software })
})


// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
