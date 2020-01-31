const mongo = require('mongodb').MongoClient;
const express = require('express') 
const app = express()
var mongoose=require('mongoose');
server = app.listen(process.env.PORT || 4000)
var db=require('./Database/db');
var url=db.url

const client = require('socket.io')(server)

//Listen on port 3000


 //app.set('view engine', 'html')
 //app.use(express.static(__dirname + './'));
    app.get('/', (req, res) => {
    //  res.sendFile(path.join(__dirname+'./index.html'));
        // res.send("helo")
        res.sendFile('./index.html', {root: __dirname })
    })

    
    


mongoose.connect(url, function(err, db){
    if(err){
        throw err;
    }

    console.log('MongoDB connected...');

    // Connect to Socket.io
    client.on('connection', function(socket){
        let chat = db.collection('chats');

        // Create function to send status
        sendStatus = function(s){
            socket.emit('status', s);
        }

        // Get chats from mongo collection
        chat.find().limit(100).sort({_id:1}).toArray(function(err, res){
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
            console.log(name,message);

           // Check for name and message
            if(name == '' || message == ''){
                // Send error status
                sendStatus('Please enter a name and message');
            } else {
                // // Insert message
                chat.insert({name: name, message: message}, function(){
                    client.emit('output', [data]);
                    console.log(data);
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

