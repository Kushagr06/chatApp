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
  
  
  var room_no;

  socket.on("join_room",(data)=>{
    socket.join(data);
    room_no=data
    num= io.sockets.adapter.rooms.get(data).size;
    io.to(data).emit("Number",num)
    if( socket.rooms.has(data)){
    io.timeout(2000).to(data).emit("newUser",socket.id)
    
    }

   

  });

 
  //broadcast listen message to everyone
  socket.on("send_m",(data) =>{
    // socket.broadcast.emit("receive_m",data)=>send everyone
    console.log(data)
    socket.to(data.room).emit("receive_m",data);
  });
  

  socket.on("disconnect",()=>{
    console.log(room_no)
    console.log(socket.id+" has Disconnected")
    socket.to(room_no).emit("disconnected_user",socket.id)
   
  });

});


server.listen(3001,()=>{
  console.log('HelloChats');
});