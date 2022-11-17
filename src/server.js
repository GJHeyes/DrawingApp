const express = require("express"), // Importing express to create our manipulatable web server
  http = require("http"), // Importing Node's http module to create a seperate server to listen with
  { Server } = require("socket.io"), // Importing the Server constructor from socket.io to create our web socket methods
  app = express(), // Creating our express web server for adding endpoints
  server = http.createServer(app), // Creating our Node server for use with socket.io
  io = new Server(server); // Creating our web socket server with our node web server
let user = 0
// Adding our public folder to our express server
app.use("/", express.static("public"));

// Using the "on event" method to run our controller function on connection
io.on("connection", (socket) => {
  user++
  io.emit("user",user)
  
  socket.on("pendrawing", (userInfo)=>{
    io.emit("pendrawing", userInfo)
  })
});

// Listening on port 5001
server.listen(5001);
