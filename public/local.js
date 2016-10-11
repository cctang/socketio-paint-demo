// Start a WebSocket connection with the server using SocketIO
var socket = io();

// Create a variable for the web page's canvas element, which has id="mycanvas"
var canvas = document.getElementById('mycanvas');

// Create a variable to access the two-dimensional canvas drawing functions
var pen = canvas.getContext('2d');

// Set event listeners for when the mouse button is pressed down, when the mouse moves, and when the mouse button is released
canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', drawStuff);
canvas.addEventListener('mouseup', stopDrawing);

var isDrawing = false;

function startDrawing(event) {
  console.log("START: " + event.clientX + ", " + event.clientY);

  // Which canvas drawing functions should go here??
  // HINT: start with pen.beginPath();
  isDrawing = true;
  pen.beginPath();
  pen.moveTo(event.clientX, event.clientY );
  socket.emit('mousedown', {x: event.clientX, y: event.clientY});
}

function drawStuff(event) {
  console.log("Moved to: " + event.clientX + ", " + event.clientY);

  // Which canvas drawing functions should go here?? (or none at all?)
  if (isDrawing) {
    pen.lineTo(event.clientX, event.clientY);
    pen.stroke();
    socket.emit('mousemove', {x: event.clientX, y: event.clientY});
  }
}

function stopDrawing(event) {
  console.log("STOP: " + event.clientX + ", " + event.clientY);

  // Which canvas drawing functions should go here?? (or none at all?)
  isDrawing = false;
}

socket.on('mousedown', function(data) {
    pen.beginPath();
    pen.moveTo(data.x, data.y);
});

socket.on('mousemove', function(data) {
    pen.lineTo(data.x, data.y);
    pen.stroke();
});
