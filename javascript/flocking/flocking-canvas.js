let canvas = document.querySelector("canvas");
let ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Resizing
window.addEventListener('resize', function () {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
});

function drawFlocker(pos, dir) {
	let angle = Math.atan2(dir.y, dir.x);
	ctx.save();
	ctx.fillStyle = "#434f37";
	// ctx.fillStyle = "#c2c7bf";
	ctx.translate(pos.x, pos.y);
	ctx.rotate(angle);
	ctx.beginPath();
	ctx.moveTo(20, 0);
	ctx.lineTo(-20, 10);
	ctx.lineTo(-15, 0);
	ctx.lineTo(-20, -10);
	ctx.lineTo(20, 0);
	ctx.fill();
	// borders
	ctx.lineWidth = 1;
	// ctx.strokeStyle = "#9ba393";
	ctx.strokeStyle = "white";
	ctx.stroke();
	ctx.restore();
}

function debug(pos) {
	ctx.beginPath();
	ctx.arc(pos.x, pos.y, 10, 0, 2 * Math.PI);
	ctx.stroke();
}

// Constants
const INITIAL_FLOCKERS = 10;
const MAX_FLOCKERS = 50;
const FPS = 60;

const FLOCK_DISTANCE = 200;
const BOUNDS_THRESHOLD = 150;
const MOUSE_THRESHOLD = 2000;
const WANDER_SCALE = 10;

// Declare drawing function
Flocker.prototype.draw = function () {
	drawFlocker(this.pos, this.dir);
};

// Keep track of mouse position
let mouse = new Vector2(0, 0);

window.addEventListener('mousemove', function (evt) {
	mouse.x = evt.x;
	mouse.y = evt.y;
});

window.addEventListener('click', function (evt) {
	if (flockers.length < MAX_FLOCKERS) {
		createFlocker(mouse.x, mouse.y);
	}
});

function createFlocker(x = Math.random() * canvas.width, y = Math.random() * canvas.height) {
	let dx = Math.random() * 2 - 1;
	let dy = Math.random() * 2 - 1;
	let f = new Flocker(x, y, dx, dy);
	flockers.push(f);
}

// Create the flockers
let flockers = [];
for (let index = 0; index < INITIAL_FLOCKERS; index++) {
	// Random start location
	createFlocker();
}

let fpsInterval, startTime, now, then, elapsed;

// initialize the timer variables and start the animation
function startAnimating() {
	fpsInterval = 1000 / FPS;
	then = window.performance.now();
	startTime = then;
	animate();
}

// the animation loop calculates time elapsed since the last loop
// and only draws if your specified fps interval is achieved
function animate() {

	// request another frame

	requestAnimationFrame(animate);

	// calc elapsed time since last loop

	now = window.performance.now();
	elapsed = now - then;

	// if enough time has elapsed, draw the next frame

	if (elapsed > fpsInterval) {

		// Get ready for next frame by setting then=now, but also adjust for your
		// specified fpsInterval not being a scaleiple of RAF's interval (16.7ms)
		then = now - (elapsed % fpsInterval);
		// Clear the canvas
		ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
		// Put your drawing code here
		for (const f of flockers) {
			f.update(elapsed / 1000);
		}
	}
}

startAnimating();
