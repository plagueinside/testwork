var MongoClient = require('mongodb').MongoClient;

var state = {
    db: null
}

exports.connect = (url,done)=>{
    if(state.db){
        return done();
    }

    MongoClient.connect(url,(err,db)=>{
        if(err){
            return done(err);
        }
        state.db = db;
        done();
    })
}

exports.get = ()=>{
    return state.db;
}