const mongo = require('mongodb').MongoClient;
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

users.post('/register',upload.single(''),(req,res)=>{
    var firstname=req.body.firstname;
    var lastname=req.body.lastname;
    var email=req.body.email;
    var phone=req.body.phone;

    console.log(firstname,lastname,email,phone);
     let chat1 = db.collection('register');
    chat1.insert({firstname:firstname,lastname:lastname,email:email,phone:phone},function(err,res){
        if(err){
            console.log(err)
        }
        else{
            console.log(res+"res is");
        }
    })
    

 
   })
   module.exports = users;