// io() is a method from the socket library added in our html file
const socket = io(),
  form = document.querySelector("#message-form"),
  input = document.querySelector("#chat"),
  otherCursor = document.querySelector(".otherCursor"),
  myCursor = document.querySelector(".myCursor"),
  //canvas = document.getElementById('canvas'),
  //canvas2 = document.getElementById('canvas2'),
  canvass = document.getElementById('canvass'),
  penbox = document.getElementById('penbox'),
  ctx = canvas.getContext('2d'),
  ctxOtherUser = canvas2.getContext('2d');

let penDown = false
let userSet = false;

/*******************pendrawing***********************/



//ctx.strokeStyle = '#4EABE5'
//ctxOtherUser.strokeStyle = '#FF0000'

function getCoords(event){
  const {pageX,pageY} = event
  const {offsetLeft,offsetTop} = canvas 
  return {x: pageX - offsetLeft, y: pageY-offsetTop}
}

document.addEventListener('mousemove', event=>{
  const {pageX,pageY} = event
  const {x, y} = getCoords(event)
  //myCursor.setAttribute("style", `top: ${pageY}px; left: ${pageX}px`)
  socket.emit("pendrawing", {x: x, y: y, userId: localStorage.getItem("user"), penDown: penDown, otherWidth : window.innerWidth, otherHeight:window.innerHeight,
                pageX:pageX, pageY:pageY} )
  createdPen = true;
}) 

document.addEventListener('mousedown', event=>{
  penDown = true
})

document.addEventListener('mouseup', event=>{
  penDown = false
})

socket.on("pendrawing", function (userInfo){
  otherUserDrawing(userInfo)
})

function otherUserDrawing(userInfo){
  
  const {x, y , userId, penDown, otherWidth, otherHeight,pageX,pageY, createdPen} = userInfo
  addUser(userId)
  //const {offsetLeft,offsetTop} = canvas 
  //const theirX = pageX - offsetLeft
  //const thierY = pageY- offsetTop
  const width = ((window.innerWidth-1400)/2) - ((otherWidth-1400)/2);
  const height = ((window.innerHeight-800)/2) - ((otherHeight-800)/2); 
  const myPen = document.querySelector(`#userPen-${userId}`)
  const myCanvas = document.querySelector(`#userCanvas-${userId}`)
  //const ctx = myCanvas.getContext('2d')
  try{
    if(userId !== localStorage.getItem("user") && penDown){
      //const myPen = document.querySelector(`#userPen-${userId}`)
      //const ctx = myCanvas.getContext('2d')
      ctxOtherUser.strokeStyle = '#4EABE5'
      myPen.setAttribute("style", `top: ${pageY+height}px; left: ${pageX+width}px`)
      ctxOtherUser.lineTo(x,y)
      ctxOtherUser.stroke()
      //ctx.lineTo(x,y)
      //ctx.stroke()
    }else if(userId !== localStorage.getItem("user") && !penDown){
      //const ctx = myCanvas.getContext('2d')
      //const myPen = document.querySelector(`#userPen-${userId}`)
      //otherCursor.setAttribute("style", `top: ${pageY+height}px; left: ${pageX+width}px`)
      myPen.setAttribute("style", `top: ${pageY+height}px; left: ${pageX+width}px`)
      ctxOtherUser.moveTo(x, y)
      //ctx.moveTo(x, y)
    }else if(userId === localStorage.getItem("user") && penDown){
      //const myPen = document.querySelector(`#userPen-${userId}`)
      const ctx = myCanvas.getContext('2d')
      ctx.strokeStyle = '#4EABE5'
      myPen.setAttribute("style", `top: ${pageY+height}px; left: ${pageX+width}px`)
      ctx.lineTo(x,y)
      ctx.stroke()
    }else if(userId === localStorage.getItem("user") && !penDown){
      const ctx = myCanvas.getContext('2d')
      //const myPen = document.querySelector(`#userPen-${userId}`)
      ctx.strokeStyle = '#4EABE5'
      myPen.setAttribute("style", `top: ${pageY+height}px; left: ${pageX+width}px`)
      //myCursor.setAttribute("style", `top: ${pageY+height}px; left: ${pageX+width}px`)
      ctx.moveTo(x, y)
    }
  }catch(error){
    console.log("can't work it")
  }
}

socket.on("user", function (user){
  if(!userSet){
    localStorage.setItem("user", user)
    userSet = true;
    //for()
  }
})

function addUser(user){
  const userCanvas = document.createElement('canvas'),
    userPointer = document.createElement('div'),
    randomColour = colorArray[Math.floor(Math.random()*7)]
  userCanvas.setAttribute('id',`userCanvas-${user}`)
  userCanvas.style.width = "1400px";
  userCanvas.style.height = "800px"
  userPointer.setAttribute('id',`userPen-${user}`)
  userPointer.classList.add('cursor')
  userPointer.classList.add(randomColour)
  canvass.appendChild(userCanvas)
  penbox.appendChild(userPointer)
}

/*******************pendrawing***********************/
