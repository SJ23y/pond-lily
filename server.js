// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();

// we've started you off with Express, 
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

app.route('/new/*').get(function(req, res) {
    var mongo = require('mongodb').MongoClient
    var mongo_url = 'mongodb://'+process.env.USER+':'+process.env.PASS+'@'+process.env.HOST+':'+process.env.PORT+'/'+process.env.DB
    mongo.connect(mongo_url, function(err,db) {      
    if (err) {console.log('Error occured')}
            var urls = db.db('chopper').collection('urls')
            urls.aggregate( [ { $group : {'_id': null, count: { $sum: 1 } } } ] ).toArray(function(err, doc) {
            var ID = doc[0].count
            var short_url = 'https://observant-carrot.glitch.me/' + ID
            urls.insert( [ { "_id": parseInt(ID),"url": req.url.slice(5) } ] )    
            res.send( { "original_url": req.url.slice(5), "short_url": short_url } ) 
            db.close()    
                                                                                                            })  
                 
   
  
})

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
