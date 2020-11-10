window.addEventListener("load", () => {
  let canvas = document.getElementById("canvas");
  let ctx = canvas.getContext('2d');

  ctx.lineWidth = 3;

  // a flag variable
  let isActive = false;

  // an array of elements
  let plots = [];

  // a function draw
  const draw = (event) => {
    if (!isActive) return;
    // gathering coordinates (using more than one to ensure browser compatibality)
    let x = event.offsetX || event.layerX - canvas.offsetLeft;
    let y = event.offsetY || event.layerY - canvas.offsetTop;

    plots.push({ x: x, y: y });

    drawOnCanvas("red", plots);
  }

  const drawOnCanvas = (color, plots) => {
    ctx.beginPath();
    ctx.moveTo(plots[0].x, plots[0].y);

    for (let i = 0; i < plots.length; i++) {
      ctx.lineTo(plots[i].x, plots[i].y);
    }
    ctx.strokeStyle = color;
    ctx.stroke();
  }

  const startDraw = (event) => {
    isActive = true;
  }

  const endDraw = (event) => {
    isActive = false;

    plots = [];
  }

  window.addEventListener("mousedown", startDraw, false);
  window.addEventListener("mouseup", endDraw, false);
  window.addEventListener("mousemove", draw, false);


})

