
const express = require('express') 
var users = express.Router();

var mongoose=require('mongoose');
var Schema=require('../Model/Schema');
var db=require('../Database/db');
var multer=require('multer');
var url=db.url
var storage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'./uploads/images');
    },
     filename:function(req,file,cb){  
        // console.log(new Date().getMinutes+"time before");
         var file=file.originalname;
        cb(null,file);
        console.log(file+"file name is");
  
    }
});
var upload=multer({storage:storage});
var res=[]

users.post('/register',upload.single(''),(req,res,callback)=>{
    var firstname=req.body.firstname;
    var lastname=req.body.lastname;
    var email=req.body.email;
    var phone=req.body.phone;
    mongoose.connect(url, function(err, db){
        if(err){
            throw err;
        }
        else{
            console.log(firstname,lastname,email,phone);
            let chat1 = db.collection('register');
           chat1.insert({firstname:firstname,lastname:lastname,email:email,phone:phone}).then(result=>{
               callback(null,result);
               console.log(result);
                callback.json(data);
               res=result
           }).catch(error=>{
               callback(null,error);
           }).send(res)
        
        
        }
    })
    console.log("-------------------->")
    console.log(res)
     res.send(res)
})

   module.exports = users;