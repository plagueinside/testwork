var db = require('../../db');
var ObjectID = require('mongodb').ObjectID;

exports.findByEmail = (email,cb) => {
    db.get().collection('pets').find({ email: email}).toArray((err,docs)=>{
        cb(err,docs);
    });
}

exports.create = (pet,cb)=>{  
    db.get().collection('pets',(err,collection)=>{
        collection.insert(pet, (err,result)=>{
            cb(err,result);
        })
    })
}

exports.update = (id,newData,cb)=>{
    db.get().collection('pets').updateOne(
        {
             _id : ObjectID(id),
        },
        newData,
        (err,result)=>{
          cb(err,result);
        });
}

exports.delete = (idArrTemp,cb)=>{
    var iddArr = [];
    for(var i=0;i<idArrTemp.length;i++){
        idArr[i]=ObjectID(idArrTemp[i]);
    }
    db.get().collection('pets').bulkWrite([
        { 
            deleteMany : 
            { 
                filter: 
                {
                    _id:{$in:idArr}
                }
            }
        }
    ],(err,res)=>{
        cb(err,res);
    });
}