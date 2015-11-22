var express = require('express');
var sqlite3 = require('sqlite3').verbose();
var fs = require('fs');

var travMeans = JSON.parse(fs.readFileSync('travelMeans.json','utf8'))

var db = new sqlite3.Database('projectdb');

var posthc = [];
var posttm = [];

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

 /*db.each("SELECT * FROM travMeans", function(err, row) {
      console.log(row.areacode + ": " + row.area);
  });*/
});


//second table "houseCars"
var houseCars = JSON.parse(fs.readFileSync('householdCars.json','utf8'))
    
 db.serialize(function() {
  db.run('CREATE TABLE IF NOT EXISTS houseCars (areacode1 TEXT, areatype1 TEXT, area1 TEXT, numcars TEXT, numhouses REAL)');
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
      console.log(row.areacode1 + ": " + row.numhouses); //prints out the areacode and number of houses from the houseCars table
  });
});

//must declare express for the below statement to work
var app = express();
app.get('/', function(req, res) {
  res.send("This is an API which uses a dataset for the number of households with cars seperated by area and also the means of travel used to commute");//Brief description of the API
});



///////////////////////////////
// Here we will put the main work
//////////////////////////////


//This pushes all selected data out to the address below e.g '/hosuecars'
db.serialize(function() {
    db.each("SELECT * FROM houseCars", function(err, row) {
    posthc.push({area1: row.area1, numcars: row.numcars, numhouses: row.numhouses})//outputs area, numcars, numhouses
    }, function() {       
    })
})
app.get('/housecars', function(req, res) {
    console.log("Getting houseCars data...");
    res.send(posthc);
});

/////
//Pushed data for travel means table
db.serialize(function() {
    db.each("SELECT * FROM travMeans", function(err, row) {
    posttm.push({area: row.area, traveltype: row.traveltype, numpeople: row.numpeople})//outputs area, traveltype, numpeople
    }, function() {       
    })
})
//var app = express();
app.get('/travelmeans', function(req, res) {
    console.log("Getting travel means data...");
    res.send(posttm);
});
//////////////////////////////////
//////////////////////////


db.close();




var server = app.listen(8080);