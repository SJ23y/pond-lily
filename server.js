// server.js
// where your node app starts

// init project
var express = require('express');
var https = require('https');
var pug = require('pug');
var app = express();


// we've started you off with Express, 
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

app.set('view engine', 'pug');

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

app.get("/wiki", function (request, response) {
  response.sendFile(__dirname + '/views/wiki.html');
});


app.get("/image", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

var data = [];

app.get("/image/*", function (req, res) {
  var s_url = "https://www.googleapis.com/customsearch/v1?key=" + process.env.API_KEY + "&cx=" + process.env.CX + "&q=" + decodeURIComponent(req.url.slice(7)) + "&searchType=image";
  
  https.get(s_url, function(resp) {
  resp.on('data', function(chunk) {
      data.push(chunk);
  })
  
  var urls = [];
  var snippets = [];
  var contexts = [];
  var thumbnails = [];
  var respond = [];
  resp.on('end', function() {
        console.log(Buffer.concat(data).toString().items)
        JSON.parse(Buffer.concat(data).toString()).items.forEach(function(element) {
        respond.push({'url': element.link, 'snip': element.image.contextLink, 'head': element.title, 'thumb': element.image.thumbnailLink})
        urls.push(element.link);
        snippets.push(element.title);
        contexts.push(element.image.contextLink);
        thumbnails.push(element.image.thumbnailLink)
      });
      res.render('image', {
        'link': urls,
        'header': snippets,
        'description': contexts,
        'image': thumbnails,
        'values': respond
      })
  })
    
  })
  
  
  ;
});

// listen for requests :)
var listener = app.listen('3000', function () {
  console.log('Your app is listening on ');
});