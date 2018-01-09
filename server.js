const express = require('express');
const path = require('path');
const http = require('http');
var cors = require('cors');
const bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
const app = express();
var ObjectID = require('mongodb').ObjectID;
var db = require('./db');
var userController = require('./server/controllers/users');
var userPetsController = require('./server/controllers/pets');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Hi API');
});

const port = process.env.PORT || '3000';
app.set('port', port);


db.connect('mongodb://localhost:27017/test',function(err){
  if(err){
    return console.log(err);
  }
  const server = http.createServer(app);
  server.listen(port, () => console.log(`API running on localhost:${port}`));
});

app.post('/registration',userController.create);
app.post('/checkEmail',userController.findByEmail);
app.post('/authenticate',userController.authenticate);
app.post('/checkJWT',userController.checkJWT);
app.get('/verify',userController.verify);
app.post('/msg-for-change',userController.changeMsg);
app.put('/change-password',userController.changePass);

app.get('/user/pets',userPetsController.findByEmail);
app.post('/user/pets/create',userPetsController.create);
app.put('/user/pets/update',userPetsController.update);
app.put('/user/pets/delete',userPetsController.delete);