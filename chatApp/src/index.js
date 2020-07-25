const path = require("path");
const http = require("http");

const express = require("express");
const app = express();
const socketio = require("socket.io");

const {generateMessages, genereatLocation} = require('./utils/message')
const { addUsers, removeUser, getUser, getUserInRoom} = require('./utils/users')

const server = http.createServer(app);

const port = process.env.PORT || 3000;
const io = socketio(server);

const publicDerectory = path.join(__dirname, "../public");

app.use(express.static(publicDerectory));


io.on("connection", (socket) => {
  
  socket.on('join', ({name, room}, callback)=>{

    const {error, user} = addUsers({id:socket.id, name:name, room:room})
    if(error){
      return callback(error, undefined)
    }else{
      callback(undefined, user.id)
    }
   
    socket.join(user.room)

    const usersInRoom = getUserInRoom(user.room)
    io.to(user.room).emit('roomData', user.room, usersInRoom)
    
    //socket.to(room).emit("message", generateMessages(''), user.name, user.id);
    socket.to(room).broadcast.emit("message", generateMessages(`${user.name} has joined just now`),'Admin', '@admin');
    
    socket.on("send", (msg, callback) => {
      io.to(user.room).emit("message", generateMessages(msg), user.name, user.id);
      callback(undefined, user.id)
    });
 
    
  socket.on("location", (coords,callback) => {
    io.emit(
      "sendLocation",
      genereatLocation(`https://google.com/maps?q=${coords.latitude},${coords.longitude}`), user.name, user.id
    );
    callback()
  });

  socket.on("disconnect", () => {
    const user = removeUser(socket.id)
    const usersInRoomAfter = getUserInRoom(user.room)

    if(user){
      io.to(user.room).emit("message", generateMessages(`${user.name} has left`), 'Admin', '@admin');
      io.to(user.room).emit('roomData', user.room, usersInRoomAfter)
    }

  });
    
  })

});

server.listen(port, () => {
  console.log(`port is run in ${port}`);
});
