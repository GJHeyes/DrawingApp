// io() is a method from the socket library added in our html file
const socket = io(),
  form = document.querySelector("#message-form"),
  input = document.querySelector("#chat"),
  otherCursor = document.querySelector(".otherCursor"),
  canvas = document.getElementById('canvas'),
  ctx = canvas.getContext('2d'),
  ctxOtherUser = canvas.getContext('2d');
let penDown = false
let userSet = false;

/*******************pendrawing***********************/

ctx.styleStroke = '#4EABE5'


function getCoords(event){
  const {pageX,pageY} = event
  const {offsetLeft,offsetTop} = canvas 
  return {x: pageX - offsetLeft, y: pageY-offsetTop}
}

document.addEventListener('mousemove', event=>{
  const {pageX,pageY} = event
  const {x, y} = getCoords(event)
  if(penDown){
    ctx.lineTo(pageX,pageY)
    ctx.stroke()
  }
  socket.emit("pendrawing", {x: x, y: y, userId: localStorage.getItem("user"), penDown: penDown, otherWidth : window.innerWidth, otherHeight:window.innerHeight,
  pageX:pageX, pageY:pageY})
}) 

document.addEventListener('mousedown', event=>{
  const {x, y} = getCoords(event)
  const {pageX,pageY} = event
  penDown = true
  ctx.moveTo(pageX, pageY)
  ctx.beginPath()
})

document.addEventListener('mouseup', event=>{
  penDown = false
})

socket.on("pendrawing", function (userInfo){
  otherUserDrawing(userInfo)
})

function otherUserDrawing(userInfo){
  const {x, y , userId, penDown, otherWidth, otherHeight,pageX,pageY} = userInfo
  var width = window.innerWidth/otherWidth;
  var height = window.innerHeight/otherHeight; 
  console.log(pageX)

  ctx.canvas.height = window.innerHeight-100
  ctx.canvas.width = window.innerWidth-100

  if(userId !== localStorage.getItem("user") && penDown){
   
    otherCursor.setAttribute("style", `top: ${pageY+height}px; left: ${pageX+width}px`)
    ctxOtherUser.lineTo(x,y)
    ctxOtherUser.stroke()
  }else if(userId !== localStorage.getItem("user") && !penDown){
    otherCursor.setAttribute("style", `top: ${pageY+height}px; left: ${pageX-width}px`)

    ctxOtherUser.moveTo(x, y)
  }
}

socket.on("user", function (user){
  if(!userSet){
    localStorage.setItem("user", user)
    userSet = true;
  }
})


/*******************pendrawing***********************/