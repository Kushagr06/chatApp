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

async function retrieveSockets(){
  const connectedSockets=await io.fetchSockets();
}

// Listen
io.on("connection",(socket)=>{
  console.log(`User connected: ${socket.id}`)

  //join a room
  socket.on("join_room",(data)=>{
    socket.join(data);
    socket.timeout(2000).to(data).emit("newUser",socket.id)
  });

  //broadcast listen message to everyone
  socket.on("send_m",(data) =>{
    // socket.broadcast.emit("receive_m",data)=>send everyone
    socket.to(data.room).emit("receive_m",data);
  });
  
  socket.on("disconnect",()=>{
    console.log('User left:'+socket.id)
  });
});

server.listen(3001,()=>{
  console.log('Hello World');
});