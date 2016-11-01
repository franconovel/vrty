var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
var pos = {
  x:0,
  y:0,
  z:0
};

var params = {
  formas: [
    { id: 'sphere', name: 'Esfera' },
    { id: 'cube', name: 'Cubo' },
    { id: 'cone', name: 'Cono' }
  ],
  colores: [
{
        id: 'red',
        name: 'Rojo'
    }, {
        id: 'yellow',
        name: 'Amarillo'
    }, {
        id: 'blue',
        name: 'Azul'
    }, {
        id: 'green',
        name: 'Verde'
    }
]
};

var r = 1;
var clientId = 1;
var clients = [];

app.use(function(req,res,next) {
    res.header("Access-Control-Allow-Origin","*");
    res.header("Access-Control-Allow-Headers","Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.post('/connect',function(req, res) {
    var newclient = {
      id: clientId,
      pos: req.body.pos,
      shape: req.body.shape,
      color: req.body.color
    };
    clients.push(newclient);
    clientId++;
    res.json(newclient);
});

app.get('/params', function(req,res) {
    res.json(params);
});

app.post('/pos',function(req, res) {
    clients.forEach(function(client) {
      client.pos = client.id == req.body.id ? req.body.pos : client.pos;
    });
    res.end();
});

app.get('/pos/:clientId',function(req, res) {
    var result = clients.filter(function(client) {
      return client.id != req.params.clientId;
    });

    res.json(result);
});

app.listen(8004);
console.log("REST POS instalado en port 8004");
