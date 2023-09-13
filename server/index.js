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
  var user_no;
  var user_name;

  socket.on("join_room",(data,name)=>{
    user_name=name;
    if(room_no!=data && room_no!=''){
      socket.to(room_no).emit("disconnected_user",socket.id,user_name,--user_no)
    socket.join(data);
    room_no=data
    user_no= io.sockets.adapter.rooms.get(data).size;
    
    io.to(data).emit("Number",user_no)
    if( socket.rooms.has(data)){
    io.timeout(2000).to(data).emit("newUser",socket.id,name)
    }
    }

   

  });

 
  //broadcast listen message to everyone
  socket.on("send_m",(data) =>{
    // socket.broadcast.emit("receive_m",data)=>send everyone
    // console.log(data)
    socket.to(data.room).emit("receive_m",data);
  });

  socket.on("download_chats",(name)=>{
    console.log(`User ${name} downloaded the chats`)
    io.timeout(1000).emit("downloading_chats",name)
  });
  

  socket.on("disconnecting",()=>{
    // console.log(room_no)
    console.log(socket.id+" has Disconnected")
    socket.to(room_no).emit("disconnected_user",socket.id,user_name,--user_no)
   
  });

 

});


server.listen(3001,()=>{
  console.log('Now Active');
});