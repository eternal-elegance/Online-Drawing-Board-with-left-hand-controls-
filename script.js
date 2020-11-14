window.addEventListener("load", () => {
  let canvas = document.getElementById("canvas");
  let ctx = canvas.getContext('2d');
  let wid = 3;
  ctx.lineWidth = wid;

  let plusB = document.getElementById("plusB");
  plusB.addEventListener("click", (e) => {
    wid = wid + 2;
    ctx.lineWidth = wid;
    console.log("+2");
  })

  let minusB = document.getElementById("minusB").addEventListener("click", (e) => {
    wid = wid - 2;
    ctx.lineWidth = wid;
    console.log("-2");
  })

  var color = "yellow";

  // change colour function
  let blueB = document.getElementById("blueB").addEventListener("click", () => {
    color = "rgb(2, 236, 253)";
    canvas.style.cursor = "url(cursors/blue.cur) , auto";
  })
  let blueG = document.getElementById("blueG").addEventListener("click", () => {
    color = "rgb(12, 240, 12)";
    canvas.style.cursor = "url(cursors/green.cur),auto";
  })
  let blueR = document.getElementById("blueR").addEventListener("click", () => {
    color = "rgb(255, 0, 0)";
    canvas.style.cursor = "url(cursors/red.cur), auto";
  })

  let clear = document.getElementById("clear").addEventListener("click", () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  })


  let save = document.getElementById("save").addEventListener("click", (e) => {
    let dataURL = canvas.toDataURL('image/png').replace("image/png", "image/octet-stream");
    window.location.href = dataURL;
    console.log("saved")
  })

  // a flag variable
  let isActive = false;

  // an array of elements
  let plots = [];

  // a function draw
  const draw = (e) => {
    if (!isActive) return;
    // gathering coordinates (using more than one to ensure browser compatibality)
    let x = e.layerX - canvas.offsetLeft;
    let y = e.layerY - canvas.offsetTop;

    plots.push({ x: x, y: y });

    drawOnCanvas(color, plots);
  }

  const drawOnCanvas = (color, plots) => {
    ctx.lineTo(plots[0].x, plots[0].y);
    ctx.beginPath();
    ctx.moveTo(plots[0].x, plots[0].y);

    for (let i = 0; i < plots.length; i++) {
      ctx.lineTo(plots[i].x, plots[i].y);
    }
    ctx.lineCap = "round";
    ctx.strokeStyle = color;
    ctx.stroke();
  }

  const startDraw = (event) => {
    isActive = true;
    draw(event);
  }

  const endDraw = (event) => {
    isActive = false;

    /* sending data to pnub */
    pubnub.publish({
      channel: channel,
      message: { 
        plots: plots, // your array goes here
        color:color
      }
    });
    
    plots = [];
  }

  /* TO GET OTHER USERS DATA FROM THE STREAM */
  pubnub.subscribe({
    channel: channel,
    callback: drawFromStream
});

/* THIS IS A CALLBACK FUNCTION TO DRAW THE GOT DATA */
function drawFromStream(message) {
  if(!message) return;        

  ctx.beginPath();
  drawOnCanvas(message.color,message.plots);
}

  const mouseOut = (e) => {
    isActive = false;
    ctx.beginPath();
  }

  window.addEventListener("mousedown", startDraw, false);
  window.addEventListener("mouseup", endDraw, false);
  window.addEventListener("mousemove", draw, false);
  window.addEventListener("mouseout", mouseOut, false);


})

