// server.js
// where your node app starts

// init project
var express = require('express');
var https = require('https');
var pug = require('pug');
var app = express();
var mongo = require('mongodb').MongoClient;


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



app.get("/image/*", function (req, res) {
  var start = 1;
  var nextPage = 2;
  var word = decodeURIComponent(req.path.slice(7))
  var today = new Date();
  
  
  if (req.query.offset !== undefined) {
    start = 10*(parseInt(req.query.offset)-1) + 1;
    nextPage = parseInt(req.query.offset) + 1;
  }  

  var s_url = "https://www.googleapis.com/customsearch/v1?key=" + process.env.API_KEY + "&cx=" + process.env.CX + "&q=" + word + "&searchType=image&alt=json&start=" + start; 
  var next_url = 'http://pond-lily.glitch.me/' + decodeURIComponent(req.path) + '?offset=' + nextPage;
  var mongo_url = 'mongodb://'+process.env.USER+':'+process.env.PASS+'@'+process.env.HOST+':'+process.env.PORT+'/'+process.env.DB;
  
  mongo.connect(mongo_url, function(err,db) {
    var chopper = db.db('chopper');
    var img_search = chopper.collection('img_search_history')
    img_search.insert([ { 'term': word, 'timestamp': today.toISOString() } ])
  })
  
  var data = '';  
  https.get(s_url, function(resp) {  
  resp.on('data', function(chunk) {
      data += chunk.toString();      
  })
  
  var respond = [];  
  resp.on('end', function() {         
        JSON.parse(data).items.forEach(function(element) {
        respond.push({'url': element.link, 'snip': element.image.contextLink, 'head': element.title, 'thumb': element.image.thumbnailLink})
              });
      res.render('image', {'values': respond, 'next': next_url });      
    
  })
    
  })
  
  
  ;
});

app
 
var listener = app.listen('3000', function () {
  console.log('Your app is listening on ');
});