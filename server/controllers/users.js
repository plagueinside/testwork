var Users = require('../models/users');
var nodemailer = require("nodemailer");
const crypto = require('crypto');
var jwt  = require('jsonwebtoken');

var secret = 'testsecretkey';

var smtpTransport = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: "hyskills96@gmail.com",
        pass: "dotaiccup"
    },
    tls: {
        rejectUnauthorized: false
    }
});

var rand,mailOptions,host,link;

var passwordValidator = (password)=>{
    var PASS_REGEXP = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}/;
    
    if( !PASS_REGEXP.test(password))
    {
      return false;
    }
    return true;
};

var emailValidator = (email)=>{
    var EMAIL_REGEXP = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (!EMAIL_REGEXP.test(email)) {
      return false;
    }
    return true; 
}

exports.findByEmail = (req,res) => {
    Users.findByEmail(req.body.email, (err,doc) => {
        if(err){
            return res.sendStatus(500);
          }
          if(doc){res.send({"checked":"false"});}
          else {res.send({"checked":"true"});}
    });
}

exports.create = (req,res) => {
    var user = {
        email : req.body.email,
        password : crypto.createHash('sha1').update(req.body.password).digest('base64'),
        firstname : req.body.firstname,
        surname : req.body.surname,
        date : req.body.date,
        active: crypto.createHash('sha1').update(req.body.email).digest('base64')
    }
    if(emailValidator(user.email) && passwordValidator(req.body.password) && user.email != '' && user.password!=''
        && user.firstname!='' && user.surname!='' && user.date!=''){
        Users.findByEmail( user.email, (err,doc) => {
            if(err){
                return res.sendStatus(500);
              }
              if(doc){ res.send("Write another email"); }
              else { 
                Users.create(user,(e,result) => {
                if(e){
                    return res.sendStatus(500);
                }
                link="http://localhost:4200/verify?id="+crypto.createHash('sha1').update(req.body.email).digest('base64');
                mailOptions={
                    to : req.body.email,
                    subject : "Please confirm your Email account",
                    html : "Hello,<br> Please Click on the link to verify your email.<br><a href="+link+">Click here to verify</a>" 
                }
                smtpTransport.sendMail(mailOptions, function(error, response){
                    if(error){
                        res.end("error");
                    }else{
                        res.end("sent");
                    }
                });
                res.send(JSON.stringify({email:user.email}));
                }); 
            }
        });
    }
    else{
        res.send("Incorrect data");
    }
}

exports.verify = (req,res)=>{
    if((req.protocol+"://"+'localhost:3000')==("http://"+'localhost:3000'))
    {
        Users.verify(req.query.id,(err,doc)=>{
            if(err){
                return res.sendStatus(500);
            }
            if(doc.value){
                res.send("Email "+doc.value.email+" is been Successfully verified");
            }
            else{
                res.send("Email is not verified. Bad Request.");
            }
        });
    }
    else
    {
        res.send("Request is from unknown source");
    }
}

exports.changeMsg = (req,res)=>{
    Users.findByEmail(req.body.email,(err,doc)=>{
        if(err){res.sendStatus(500);}
        if(doc){
            link="http://localhost:4200/change-password-form?id="+doc._id;
            mailOptions={
                to : req.body.email,
                subject : "Change password form",
                html : "Hello,<br> Please Click on the link to create a new password.<br><a href="+link+">Click here</a>" 
            }
            smtpTransport.sendMail(mailOptions, function(error, response){
                if(error){
                    res.send("Error sending message, please repeat.");
                }else{
                    res.send("sent");
                }
            });
        }
        else{
            res.send("unknown email");
        }
    });
}

exports.changePass = (req,res)=>{
    let newPass = crypto.createHash('sha1').update(req.body.password).digest('base64');
    let id = req.body.id;
    Users.changePass(id,newPass,(err,result)=>{
        if(err){
            res.sendStatus(500);
        }
        res.sendStatus(200);
    })
}

exports.authenticate = (req,res)=>{
    var email = req.body.email;
    var password = crypto.createHash('sha1').update(req.body.password).digest('base64');
    Users.authenticate({email:email,password:password},(err,doc)=>{
        if(err){
          return res.sendStatus(500);
        }
        if(doc){
          if(!doc.active){
            const payload = {
              email: doc.email,
              username: doc.firstname 
            };
            var token = jwt.sign(payload,secret,{expiresIn: '10m'});
            return res.send({ status: 200, body: { token: token } });
          }
          else{
            return res.send({status:200,body:{result:"You should confirm your email"}});
          }
        }
        else{
          return res.send({status:200,body:{}});
        }
    });
}

exports.checkJWT = (req,res)=>{
    if(req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer' && 
    req.headers.authorization.split(' ')[1].toString() != 'null'){
      jwt.verify(req.headers.authorization.split(' ')[1],secret,(err,decode)=>{
        if(err){ return res.send(JSON.stringify({result:"error"})); }
        let email = decode.email;
        Users.checkJWT(email,(err,doc)=>{
          if(err){
            return res.sendStatus(500);
          }
          if(doc){
            return res.send(JSON.stringify({result:"fine"}));
          }
          else{
            return res.send(JSON.stringify({result:"unknown user"}));
          }
         });
      })
    }
    else{
      return res.send(JSON.stringify({result:"You should login"}));
    }
}