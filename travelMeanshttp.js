// Import the fs module so that we can read in files.
var fs = require('fs');
// Import express to create and configure the HTTP server.
var express = require('express');

// Read in the text file and parse it for JSON.
var data = JSON.parse(fs.readFileSync('travelMeans.json','utf8'));

// Create a HTTP server app.
var app = express();

// When a user goes to /, return a small help string.
app.get('/', function(req, res) {
  res.send('Try http://127.0.0.1:8000/travelMeans/TravelType/On foot or http://127.0.0.1:8000/travelMeans/Area/Cavan.');
});

// Send back the JSON for travelMeans j at /travelMeans/TravelType/j.

app.get('/travelMeans/TravelType/:TravelType', function(req, res) {
  travelMeans = [];

  for (var j = 0; j < data.length; j++)
    if (data[j].TravelType == req.params.TravelType)
      travelMeans.push(data[j]);
      

  res.json(travelMeans);
});

// Send back the JSON for the means of travel from Area i at /travelMeans/Area/i.
app.get('/travelMeans/Area/:Area', function(req, res) {
  travelMeans = [];

  for (var i = 0; i < data.length; i++)
    if (data[i].Area == req.params.Area)
      travelMeans.push(data[i]);
      

  res.json(travelMeans);
});

// Start the server.
var server = app.listen(8888);