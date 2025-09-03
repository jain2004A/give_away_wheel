const canvas = document.getElementById("wheel");
const ctx = canvas.getContext("2d");
const spinBtn = document.getElementById("spin");

let allWords = Array.from({length: 60}, (_, i) => `Word ${i+1}`); // Replace with your words
let activeWords = allWords.splice(0, 30); // show first 30
let arc = (2 * Math.PI) / activeWords.length;
let rotation = 0;
let spinning = false;

function drawWheel() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  let radius = canvas.width / 2;
  activeWords.forEach((word, i) => {
    let angle = i * arc + rotation;
    // Slice color
    ctx.fillStyle = i % 2 === 0 ? "#3498db" : "#e74c3c";
    ctx.beginPath();
    ctx.moveTo(radius, radius);
    ctx.arc(radius, radius, radius, angle, angle + arc);
    ctx.closePath();
    ctx.fill();

    // Text
    ctx.save();
    ctx.translate(radius, radius);
    ctx.rotate(angle + arc / 2);
    ctx.textAlign = "right";
    ctx.fillStyle = "white";
    ctx.font = "14px Arial";
    ctx.fillText(word, radius - 10, 5);
    ctx.restore();
  });
}

function spinWheel() {
  if (spinning) return;
  spinning = true;

  let randomSpin = Math.random() * 360 + 720; // spin at least 2 turns
  let finalAngle = (rotation * 180 / Math.PI + randomSpin) % 360;

  let duration = 4000;
  let start = null;

  function animate(timestamp) {
    if (!start) start = timestamp;
    let progress = timestamp - start;
    let easing = 1 - Math.pow(1 - progress / duration, 3);
    let angle = rotation + (randomSpin * Math.PI / 180) * easing;
    rotation = angle;
    drawWheel();

    if (progress < duration) {
      requestAnimationFrame(animate);
    } else {
      rotation %= 2 * Math.PI;
      chooseWinner(finalAngle);
      spinning = false;
    }
  }
  requestAnimationFrame(animate);
}

function chooseWinner(finalAngle) {
  let degrees = (360 - finalAngle + 90) % 360; // adjust so arrow is top
  let slice = Math.floor(degrees / (360 / activeWords.length));
  let winner = activeWords[slice];
  alert("Winner: " + winner);

  // remove winner
  activeWords.splice(slice, 1);
  // add new word if available
  if (allWords.length > 0) {
    activeWords.push(allWords.shift());
  }

  arc = (2 * Math.PI) / activeWords.length;
  drawWheel();
}

spinBtn.addEventListener("click", spinWheel);

drawWheel();
