var Pets = require('../models/pets');
var jwt  = require('jsonwebtoken');

var secret = 'testsecretkey';

exports.findByEmail = (req,res)=>{
    if(req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer' && 
    req.headers.authorization.split(' ')[1].toString() != 'null'){
        jwt.verify(req.headers.authorization.split(' ')[1],secret,(err,decode)=>{
            if(err){ return res.send(JSON.stringify({result:"error"})); }
            let email = decode.email;
            Pets.findByEmail(email,(err,docs)=>{
                if(err){
                    return res.sendStatus(500);
                }
                res.send(docs);
            })
          })
    }
}

exports.create = (req,res) => {
    if(req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer' && 
    req.headers.authorization.split(' ')[1].toString() != 'null'){
        jwt.verify(req.headers.authorization.split(' ')[1],secret,(err,decode)=>{
            if(err){ return res.send(JSON.stringify({result:"error"})); }
            var pet = {
                name: req.body.name,
                type: req.body.type,
                age: req.body.age,
                email : decode.email
            }
            Pets.create(pet,(err,result) => {
                if(err){
                    return res.sendStatus(500);
                }
                res.send(pet);
            });
        });
    }
}

exports.update = (req,res)=>{
    if(req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer' && 
    req.headers.authorization.split(' ')[1].toString() != 'null'){
        jwt.verify(req.headers.authorization.split(' ')[1],secret,(err,decode)=>{
            if(err){ return res.send(JSON.stringify({result:"error"})); }
            Pets.update(req.body.id, 
                {
                    name: req.body.name,
                    type: req.body.type,
                    age: req.body.age,
                    email: decode.email
                },(err,result)=>{
                if(err){
                    return res.sendStatus(500);
                }
                res.sendStatus(200);
            })
        });
    }
}

exports.delete = (req,res)=>{
    if(req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer' && 
    req.headers.authorization.split(' ')[1].toString() != 'null'){
        jwt.verify(req.headers.authorization.split(' ')[1],secret,(err,decode)=>{
            if(err){ return res.send(JSON.stringify({result:"error"})); }
            idArr = req.body;
            Pets.delete(idArr,(err,result)=>{
                if(!err){
                    res.send("success");
                }
                else{
                    res.sendStatus(500);
                }
            });
        })
    }
}