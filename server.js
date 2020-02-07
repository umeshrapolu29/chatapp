
const express = require('express');
// const route=express.Router();
const app = express()
var mongoose=require('mongoose');
var Schema=require('./Model/Schema');
server = app.listen(process.env.PORT || 4000)
var db=require('./Database/db');
var multer=require('multer');
var url=db.url
var bodyparser=require('body-parser');
app.use(express.static(__dirname+'/uploads'))
app.use(bodyparser.urlencoded({extended:true}))
app.use(bodyparser.json())
app.use((req,res,next)=>{
  res.header('Access-Control-Allow-Origin','*');
  res.header('Access-Control-Allow-Headers','Origin,X-Requested-With,Content-Type,Accept,Authoriuzation');
  if(req.method==='OPTIONS'){
      res.header('Access-Control-Allow-Methods','PUT,POST,DELETE,PATCH,GET')
      return res.status(200).json({});
  }
  next();

})
// app.use(app.router);

const client = require('socket.io')(server)
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

//Listen on port 3000



    app.get('/', (req, res) => {
    //  res.sendFile(path.join(__dirname+'./index.html'));
        // res.send("helo")
        res.sendFile('./index.html', {root: __dirname })
    })
    var register=require('./Routes/register');{
        app.use('/register',register);
    }

    



 
    
    


mongoose.connect(url, function(err, db){
    if(err){
        throw err;
    }

    console.log('MongoDB connected...');
    let id=0;

    // Connect to Socket.io
    client.on('connection', function(socket){
        let chat = db.collection('chatbot');

        // Create function to send 
        // io.on('connection', function(socket) {
        //     socket.on('message', function(msg) {
        //       io.emit('message', msg);
        //     });
        sendStatus = function(s){
            socket.emit('status', s);
        }

        // Get chats from mongo collection
        chat.find().limit(100).sort({_id:-1}).toArray(function(err, res){
            if(err){
                throw err;
            }

            // Emit the messages
            socket.emit('output', res);
        });

        //Handle input events
        socket.on('input', function(data){
            let name = data.name;
            let message = data.message;
           
            let id1=id++
            console.log(name,message,id1);

           // Check for name and message
            if(name == '' || message == ''){
                // Send error status
                sendStatus('Please enter a name and message');
            } else {
                // // Insert message
                chat.insert({name: name, message: message,id1: id1}, function(){

                    
                 client.emit('output', [data]);
                     console.log(data);
                    // chat.find({message:{$ne : null}}),function(){
                    //     client.emit('output', [data]);
                    //     console.log(data);
                    // }
// 
                    // Send status object
                    sendStatus({
                        message: 'Message sent',
                        clear: true
                    });
                  });
            }
        });
        
 

        // Handle clear
        socket.on('clear', function(data){
            // Remove all chats from collection
            chat.remove({}, function(){
                // Emit cleared
                socket.emit('cleared');
            });
        });
    });
   
});

