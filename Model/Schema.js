var  mongoose=require('mongoose');

var Schema=mongoose.Schema;
console.log("schema");

var Schema=Schema({
    
    
       
 
    firstname:{type:String},
    lastname:{type:String},
     email:{type:String},
     phone:{type:String},
 
           
   

   
      
})
module.exports=mongoose.model('Schema',Schema) 