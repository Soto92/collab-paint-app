const socket = io();
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight - 60;

let currentTool = "pencil";
let currentColor = "black";
let drawing = false;
let startX, startY;
let currentStroke = null;

function drawShape(shape) {
  ctx.strokeStyle = shape.type === "eraser" ? "white" : shape.color;
  ctx.lineWidth = shape.type === "eraser" ? 20 : 2;

  if (shape.type === "pencil" || shape.type === "eraser") {
    ctx.beginPath();
    ctx.moveTo(shape.segments[0].x0, shape.segments[0].y0);
    shape.segments.forEach((seg) => ctx.lineTo(seg.x1, seg.y1));
    ctx.stroke();
  } else if (shape.type === "rect") {
    const w = shape.x1 - shape.x0;
    const h = shape.y1 - shape.y0;
    ctx.strokeRect(shape.x0, shape.y0, w, h);
  } else if (shape.type === "circle") {
    const r = Math.sqrt(
      (shape.x1 - shape.x0) ** 2 + (shape.y1 - shape.y0) ** 2
    );
    ctx.beginPath();
    ctx.arc(shape.x0, shape.y0, r, 0, Math.PI * 2);
    ctx.stroke();
  } else if (shape.type === "triangle") {
    ctx.beginPath();
    ctx.moveTo(shape.x0, shape.y1);
    ctx.lineTo(shape.x1, shape.y1);
    ctx.lineTo((shape.x0 + shape.x1) / 2, shape.y0);
    ctx.closePath();
    ctx.stroke();
  }
}

function getTouchPos(e) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: e.touches[0].clientX - rect.left,
    y: e.touches[0].clientY - rect.top,
  };
}

// --- Mouse Events ---
canvas.addEventListener("mousedown", (e) => {
  startX = e.offsetX;
  startY = e.offsetY;
  drawing = true;
  if (currentTool === "pencil" || currentTool === "eraser") {
    currentStroke = { type: currentTool, color: currentColor, segments: [] };
  }
});

canvas.addEventListener("mousemove", (e) => {
  if (!drawing) return;
  if (currentTool === "pencil" || currentTool === "eraser") {
    const seg = { x0: startX, y0: startY, x1: e.offsetX, y1: e.offsetY };
    currentStroke.segments.push(seg);
    drawShape({ type: currentTool, color: currentColor, segments: [seg] });
    startX = e.offsetX;
    startY = e.offsetY;
  }
});

canvas.addEventListener("mouseup", (e) => {
  if (!drawing) return;
  drawing = false;
  if (currentTool === "pencil" || currentTool === "eraser") {
    if (currentStroke.segments.length > 0) socket.emit("op", currentStroke);
    currentStroke = null;
  } else if (["rect", "circle", "triangle"].includes(currentTool)) {
    const shape = {
      type: currentTool,
      x0: startX,
      y0: startY,
      x1: e.offsetX,
      y1: e.offsetY,
      color: currentColor,
    };
    drawShape(shape);
    socket.emit("op", shape);
  }
});

// --- Touch Events ---
canvas.addEventListener("touchstart", (e) => {
  e.preventDefault();
  const pos = getTouchPos(e);
  startX = pos.x;
  startY = pos.y;
  drawing = true;
  if (currentTool === "pencil" || currentTool === "eraser") {
    currentStroke = { type: currentTool, color: currentColor, segments: [] };
  }
});

canvas.addEventListener("touchmove", (e) => {
  e.preventDefault();
  if (!drawing) return;
  const pos = getTouchPos(e);
  if (currentTool === "pencil" || currentTool === "eraser") {
    const seg = { x0: startX, y0: startY, x1: pos.x, y1: pos.y };
    currentStroke.segments.push(seg);
    drawShape({ type: currentTool, color: currentColor, segments: [seg] });
    startX = pos.x;
    startY = pos.y;
  }
});

canvas.addEventListener("touchend", (e) => {
  e.preventDefault();
  if (!drawing) return;
  drawing = false;
  if (currentTool === "pencil" || currentTool === "eraser") {
    if (currentStroke.segments.length > 0) socket.emit("op", currentStroke);
    currentStroke = null;
  }
});

// --- Toolbar ---
document
  .querySelectorAll(".toolbar button[data-tool]")
  .forEach((btn) =>
    btn.addEventListener("click", () => (currentTool = btn.dataset.tool))
  );
document
  .getElementById("undo")
  .addEventListener("click", () => socket.emit("undo"));
document
  .getElementById("clear")
  .addEventListener("click", () => socket.emit("clear"));
document
  .querySelectorAll(".color")
  .forEach((c) =>
    c.addEventListener("click", () => (currentColor = c.dataset.color))
  );
document
  .getElementById("colorPicker")
  .addEventListener("input", (e) => (currentColor = e.target.value));

// --- Socket.IO ---
socket.on("op", drawShape);
socket.on("redraw", (ops) => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ops.forEach(drawShape);
});
