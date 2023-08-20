const express=require('express')
const app=express();
const http=require('http');
const {Server}=require('socket.io');
const cors=require("cors");

// First the the points connect, the message is sent from front to back and then from back to front(broadcast)

app.use(cors());

const server=http.createServer(app);

const io=new Server(server,{
  cors:{
    origin:"http://localhost:3000",
    methods:["GET","POST"],
  },
});

// Listen
io.on("connection",(socket)=>{
  console.log(`User connected: ${socket.id}`)

  //join a room
  socket.on("join_room",(data)=>{
    socket.join(data);
  });

  //broadcast listen message to everyone
  socket.on("send_m",(data) =>{
    // socket.broadcast.emit("receive_m",data)=>send everyone
    socket.to(data.room).emit("receive_m",data);
  });
  
  socket.on("disconnect",()=>{
    console.log('User left')
  });
});

server.listen(3001,()=>{
  console.log('Hello World');
});