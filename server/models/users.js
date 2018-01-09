var db = require('../../db');
var ObjectID = require('mongodb').ObjectID;


exports.findByEmail = (_email,cb)=>{
    db.get().collection('users').findOne({ email : _email},(err,doc)=>{
        console.log(doc);
        cb(err,doc);
    })
}

exports.create = (user,cb)=>{   
    db.get().collection('users').insert(user, (err,result)=>{
        cb(err,result);
      })
}

exports.verify = (active,cb)=>{
    db.get().collection('users',(err,collection)=>{
        if(!err){
            collection.findAndModify(
                {active: active},
                [],
                {$set:{
                    active:null
                }},
                {new: false, upsert: false}, 
                (e,res)=>{
                    cb(e,res);
            })
        }
    });
}

exports.changePass = (id,newPass,cb)=>{
    console.log(id);
    db.get().collection('users').update(
        {_id:ObjectID(id)},
        {$set:{
            password:newPass
        }},
        (err,res)=>{
            cb(err,res);
        }
    )
}

exports.authenticate = (data,cb)=>{
    db.get().collection('users').findOne({ email : data.email, password : data.password},(err,doc)=>{
        cb(err,doc);
       });
}

exports.checkJWT = (email,cb)=>{
    db.get().collection('users').findOne({ email : email },(err,doc)=>{
        cb(err,doc);
    })
}