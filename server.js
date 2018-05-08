// server.js
// where your node app starts

// init project
var express = require('express');
var https = require('https');
var app = express();


// we've started you off with Express, 
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

app.get("/wiki", function (request, response) {
  response.sendFile(__dirname + '/views/wiki.html');
});


app.get("/image", function (request, response) {
  response.sendFile(__dirname + '/views/img.html');
});

var data = [];

app.get("/image/*", function (req, res) {
  var s_url = "https://www.googleapis.com/customsearch/v1?key=" + process.env.API_KEY + "&cx=" + process.env.CX + "&q=" + req.url.slice(7);
  https.get(s_url, function(resp) {
  resp.on('data', function(chunk) {
      data.push(chunk);
  }) 
  resp.on('end', function() {
      
      res.send(JSON.parse(Buffer.concat(data).toString()).items)
  }) 
  })
  
  
  ;
});

// listen for requests :)
var listener = app.listen('3000', function () {
  console.log('Your app is listening on ');
});