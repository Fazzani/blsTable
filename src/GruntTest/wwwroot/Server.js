var express = require("express");
var app     = express();
var path    = require("path");

app.use('/app', express.static(__dirname + '/app'));
app.use('/Content', express.static(__dirname + '/Content'));
app.use('/lib', express.static(__dirname + '/lib'));
app.use('/Views', express.static(__dirname + '/Views'));
app.use('/templates', express.static(__dirname + '/templates'));
app.use('/temp', express.static(__dirname + '/temp'));
app.use('/dist', express.static(__dirname + '/dist'));

//Store all HTML files in view folder.
app.get('/favicon.ico', function (req, res) {
  res.sendFile(path.join(__dirname+'/favicon.ico'));
  //__dirname : It will resolve to your project folder.
});
app.get('/',function(req,res){
    res.sendFile(path.join(__dirname + '/index.html'));
  //__dirname : It will resolve to your project folder.
});

app.get('*',function(req,res){
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.listen(process.env.PORT || 3003, function() {
    console.log(__dirname);
    console.log("listening on 3003");
});

