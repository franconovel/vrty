var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

var pos = {
  x:0,
  y:0,
  z:0
};

var params = {
  formas: [
    { id: 'cube', name: 'Cube' },
    { id: 'cone', name: 'Cone' },
    { id: 'ring', name: 'Ring' }
    // { id: 'triangle', name: 'Triangle'},,
    // { id: 'box', name: 'Box'},
    // { id: 'tube', name: 'Tube'},
  ],
  colores: []
};

var r = 1;
var clientId = 1;
var clients = [];

app.use(function(req,res,next) {
    res.header("Access-Control-Allow-Origin","*");
    res.header("Access-Control-Allow-Headers","Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// Connect
app.post('/connect',function(req, res) {
    // Set up for new client
    var newclient = {
      id: clientId,
      pos: req.body.pos,
      shape: req.body.shape,
      color: req.body.color
    };

    // Register new client
    clients.push(newclient);
    clientId++;

    // Return new client connectiondata
    res.json(newclient);
});

// Params
app.get('/params', function(req,res) {
    res.json(params);
});

// Positions
app.post('/pos',function(req, res) {
    clients.forEach(function(client) {
      client.pos = client.id == req.body.id ? req.body.pos : client.pos;
    });
    res.end();
});

app.get('/pos/:clientId',function(req, res) {
    // This is because the client shouldn't see the shape that represents himself
    var result = clients.filter(function(client) {
      return client.id != req.params.clientId;
    });

    res.json(result);
});

app.listen(8000);
console.log("REST POS instalado en port 8000");
