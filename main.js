var express = require('express');
var sqlite3 = require('sqlite3').verbose();
var fs = require('fs');

var travMeans = JSON.parse(fs.readFileSync('travelMeans.json','utf8'))

var db = new sqlite3.Database('testdb');

//first table "travMeans"
db.serialize(function() {
  db.run('CREATE TABLE IF NOT EXISTS travMeans (areacode TEXT, areatype TEXT, area TEXT, traveltype TEXT, numpeople REAL)');
  var stmt = db.prepare('INSERT INTO travMeans (areacode, areatype, area, traveltype, numpeople) VALUES (?,?,?,?,?)');
  for (var i = 0; i < travMeans.length; i++) {
      stmt.run(travMeans[i].AreaCode
               , travMeans[i].AreaType
               , travMeans[i].Area
               , travMeans[i].TravelType
               , travMeans[i].NumPeople
              );
  }
    stmt.finalize();

 db.each("SELECT * FROM travMeans", function(err, row) {
      console.log(row.areacode + ": " + row.area);
  });
});


//second table "houseCars"
var houseCars = JSON.parse(fs.readFileSync('householdCars.json','utf8'))
    
 db.serialize(function() {
  db.run('CREATE TABLE IF NOT EXISTS houseCars(areacode1 TEXT, areatype1 TEXT, area1 TEXT, numcars TEXT, numhouses REAL)');
  var stmt = db.prepare('INSERT INTO houseCars (areacode1, areatype1, area1, numcars, numhouses) VALUES (?,?,?,?,?)');
  for (var i = 0; i < houseCars.length; i++) {
      stmt.run(houseCars[i].AreaCode
               , houseCars[i].AreaType
               , houseCars[i].Area
               , houseCars[i].NumCars
               , houseCars[i].NumHouseholds
              );
  }  
        
  stmt.finalize();
      
     db.each("SELECT * FROM houseCars", function(err, row) {
      console.log(row.areacode1 + ": " + row.numhouses);
  });
});
//db.close();

//output db houseCars
var posthc = [];
db.serialize(function() {
    db.each("SELECT * FROM houseCars", function(err, row) {
    posthc.push({area1: row.area1, numcars: row.numcars, numhouses: row.numhouses})//just prints out area, numcars, numhouses
    }, function() {       
    })
})
var app = express();
app.get('/test', function(req, res) {
    console.log("Getting houseCars data...");
    res.send(posthc);
});

db.close();

/*var app = express();
app.get('/', function(req, res) {
  res.send("This creates a table for each of the datasets.");
});*/



var server = app.listen(8000);