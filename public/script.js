// io() is a method from the socket library added in our html file
const socket = io(),
  form = document.querySelector("#message-form"),
  input = document.querySelector("#chat"),
  otherCursor = document.querySelector(".otherCursor"),
  myCursor = document.querySelector(".myCursor"),
  canvas = document.getElementById('canvas'),
  ctx = canvas.getContext('2d'),
  ctxOtherUser = canvas.getContext('2d');
let penDown = false
let userSet = false;
let draw = false;

/*******************pendrawing***********************/

ctx.strokeStyle = '#4EABE5'
ctxOtherUser.strokeStyle = '#FF0000'

function getCoords(event){
  const {pageX,pageY} = event
  const {offsetLeft,offsetTop} = canvas 
  console.log(offsetLeft,offsetTop)
  return {x: pageX - offsetLeft, y: pageY-offsetTop}
}

document.addEventListener('mousemove', event=>{
  const {pageX,pageY} = event
  const {x, y} = getCoords(event)
  myCursor.setAttribute("style", `top: ${pageY}px; left: ${pageX}px`)
  if(penDown){
    ctx.lineTo(x,y)
    ctx.stroke()
    ctx.strokeStyle = '#FF0000'
    draw = true;
  }
  socket.emit("pendrawing", {x: x, y: y, userId: localStorage.getItem("user"), penDown: penDown, otherWidth : window.innerWidth, otherHeight:window.innerHeight,

pageX:pageX, pageY:pageY} )
}) 

document.addEventListener('mousedown', event=>{
  const {x, y} = getCoords(event)
  penDown = true
  ctx.moveTo(x, y)
  ctx.beginPath()
  
})

document.addEventListener('mouseup', event=>{
  const {x, y} = getCoords(event)
  penDown = false
  if(draw = true){
    ctx.moveTo(x, y)
    ctx.beginPath()
    ctx.lineTo(x,y)
    ctx.stroke()
    draw=false
    closePath()
  }
})

socket.on("pendrawing", function (userInfo){
  otherUserDrawing(userInfo)
})

function otherUserDrawing(userInfo){
  
  const {x, y , userId, penDown, otherWidth, otherHeight,pageX,pageY} = userInfo
  //const {offsetLeft,offsetTop} = canvas 
  //const theirX = pageX - offsetLeft
  //const thierY = pageY- offsetTop
  const width = ((window.innerWidth-1400)/2) - ((otherWidth-1400)/2);
  const height = ((window.innerHeight-800)/2) - ((otherHeight-800)/2); 

  if(userId !== localStorage.getItem("user") && penDown){
    otherCursor.setAttribute("style", `top: ${pageY+height}px; left: ${pageX+width}px`)
    ctxOtherUser.strokeStyle = '#A020F0'
    ctxOtherUser.lineTo(x,y)
    ctxOtherUser.stroke()
  }else if(userId !== localStorage.getItem("user") && !penDown){
    otherCursor.setAttribute("style", `top: ${pageY+height}px; left: ${pageX+width}px`)
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
