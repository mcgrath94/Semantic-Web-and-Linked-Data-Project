var fs = require('fs'); // Import the fs module so that we can read in files.
var express = require('express');// Import express to create and configure the HTTP server.

var sqlite3 = require('sqlite3').verbose();

//below line stores db in memory, uncomment next line to store as file instead
var db = new sqlite3.Database(':memory:'); 
//var db = new sqlite3.Database('filename'); 

var app = express(); // Create a HTTP server app.

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

var rowHolder;


//create first table "travMeans" if it has not already been done
var travelMeans = JSON.parse(fs.readFileSync('travelMeans.json','utf8')); // Read in the text file and parse it for JSON.
db.serialize(function() {
  db.run('CREATE TABLE IF NOT EXISTS travMeans (areacode TEXT, areatype TEXT, area TEXT, traveltype TEXT, numpeople REAL)');
  var stmt = db.prepare('INSERT INTO travMeans (areacode, areatype, area, traveltype, numpeople) VALUES (?,?,?,?,?)');
  for (var i = 0; i < travelMeans.length; i++) {
      stmt.run(travelMeans[i].AreaCode
               , travelMeans[i].AreaType
               , travelMeans[i].Area
               , travelMeans[i].TravelType
               , travelMeans[i].NumPeople
              );
  }
    stmt.finalize();

    //prints out selected rows to console
 db.each("SELECT * FROM travMeans", function(err, row) {
      console.log(row.area + ": " + row.traveltype + " " + row.numpeople);
  });
});



//create second table "houseCars" if it does not already exist  
var householdCars = JSON.parse(fs.readFileSync('householdCars.json','utf8')); // Read in the text file and parse it for JSON.
 db.serialize(function() {
  db.run('CREATE TABLE IF NOT EXISTS houseCars (areacode1 TEXT, areatype1 TEXT, area1 TEXT, numcars TEXT, numhouses REAL)');
  var stmt = db.prepare('INSERT INTO houseCars (areacode1, areatype1, area1, numcars, numhouses) VALUES (?,?,?,?,?)');
  for (var i = 0; i < householdCars.length; i++) {
      stmt.run(householdCars[i].AreaCode
               , householdCars[i].AreaType
               , householdCars[i].Area
               , householdCars[i].NumCars
               , householdCars[i].NumHouseholds
              );
  }  
        
  stmt.finalize();
      
     //prints out selected rows to console
     db.each("SELECT * FROM houseCars", function(err, row) {
      console.log(row.area1 + ": " + row.numcars + " " + row.numhouses); 
  });
});


//shows page with brief description of the API
app.get('/', function(req, res) {
  res.send("<h1><font color=dark red>API for comparing Cars per Household and Means of Travel</h1> </font><body><p>A user can seach for the means of travel used in all area by searching localhost:8008/travMeans. A user can seach for the means of travel used in a particular area by searching localhost:8008/travMeans/'area' where area is eg Cavan.  A user can seach for the means of travel used in a particular area and by a particualar means by searching localhost:8008/travMeans/'area'/'means' where area is eg 'Cavan' and means is for e.g 'On foot'</p><p>A user can seach for cars per household in all areas by searching localhost:8008/householdCars. A user can seach for the number of household cars in a particular area by searching localhost:8008/houseCars/'area' where area is eg Cavan.  A user can seach for the cars per household used in a particular area and by a particualar amount of cars by searching localhost:8008/houseCars/'area'/'x' where area is eg 'Mayo' and x is for e.g '4+'</p><p>A user can seach for a combination of these tables by searching localhost:8008/both/area/traveltype and localhost:8008/both/area/traveltype using the same examples given already.<body>");
});

/////////////////////
/////////////////////
//travelMeans table operations

//outputs formatted rows from travMeans table 
app.get('/travMeans/', function(req, res){
  db.all("SELECT * FROM travMeans", function(err, row) {
      
    rowHolder = JSON.stringify(row, null, '\t');
    res.sendStatus(rowHolder);
  });
});


//outputs formatted rows from travMeans table for a particular area
app.get('/travMeans/:area/', function(req, res) {
    db.all("SELECT * FROM travMeans WHERE area = " + req.params.area, function(err, row){
        
      rowHolder = JSON.stringify(row, null, '\t');
      res.sendStatus(rowHolder);
    });
});

//outputs formatted rows from travMeans table for a particular area and travel type
app.get('/travMeans/:area/:traveltype', function(req,res){
  db.all("SELECT * FROM travMeans WHERE area = " + req.params.area + " AND traveltype = " + req.params.traveltype, function(err, row){
      
    rowHolder = JSON.stringify(row, null, '\t');
    res.sendStatus(rowHolder);
  });
});

///////////////////////
///////////////////////
//houseCars table operations

//outputs formatted rows from houseCars table
app.get('/houseCars/', function(req, res){
  db.all("SELECT * FROM houseCars", function(err, row) {
      
    rowHolder = JSON.stringify(row, null, '\t');
    res.sendStatus(rowHolder);
  });
});

//outputs formatted rows from houseCars table for a particular area
app.get('/houseCars/:area1/', function(req, res) {
    db.all("SELECT * FROM houseCars WHERE area1 = " + req.params.area1, function(err, row){
        
      rowHolder = JSON.stringify(row, null, '\t');
      res.sendStatus(rowHolder);
    });
});


//outputs formatted rows from houseCars table for a particular area which shows houses with x amount of cars
app.get('/houseCars/:area1/:numcars', function(req,res) {
    
  db.all("SELECT * FROM houseCars WHERE area1 = " + req.params.area1 + " AND numcars = " + req.params.numcars, function(err, row){
    
    rowHolder = JSON.stringify(row, null, '\t');
    res.sendStatus(rowHolder);
  });
});


//////////////////
/////////////////
//travMeans and houseCars operations

//this will display for an area how many people use a certain type of 
//transport and compares this figure to people with different numbers of cars per household
app.get('/both/:area/:traveltype', function(req,res) {
    
  db.all("SELECT area, area1, traveltype, numpeople, numcars, numhouses FROM travMeans AS T JOIN houseCars AS H ON T.area=H.area1 WHERE area = " + req.params.area + " AND traveltype = " + req.params.traveltype, function(err, row){
    
    rowHolder = JSON.stringify(row, null, '\t');
    res.sendStatus(rowHolder);
  });
});


//this will display for an area how many people use a certain type of 
//transport and compares this figure to people with the chosen numbers of cars per household
app.get('/both/:area/:traveltype/:numcars', function(req,res) {
    
  db.all("SELECT area, area1, traveltype, numpeople, numcars, numhouses FROM travMeans AS T JOIN houseCars AS H ON T.area=H.area1 WHERE area = " + req.params.area + " AND traveltype = " + req.params.traveltype + " AND numcars = " + req.params.numcars, function(err, row){
    
    rowHolder = JSON.stringify(row, null, '\t');
    res.sendStatus(rowHolder);
  });
});


/////


//server is running on the port below
var server = app.listen(8008);