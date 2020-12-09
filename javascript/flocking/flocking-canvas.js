let canvas = document.querySelector("canvas");
let ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Resizing
window.addEventListener('resize', function () {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
});

class Vector2 {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}

	add(other) {
		return new Vector2(this.x + other.x, this.y + other.y);
	};

	sub(other) {
		return new Vector2(this.x - other.x, this.y - other.y);
	};

	scale(n) {
		return new Vector2(this.x * n, this.y * n);
	};

	mag() {
		return Math.sqrt(this.x * this.x + this.y * this.y);
	}

	normalized() {
		// Avoid divide by zero errors
		if (this.mag() == 0) return new Vector2(0, 0);
		let f = 1 / this.mag();
		return new Vector2(this.x * f, this.y * f);
	}

	limit(n) {
		if (this.mag() > n) {
			return this.normalized().scale(n);
		}
		return this;
	};

	dist(other) {
		return Math.sqrt((this.x - other.x) ** 2 + (this.y - other.y) ** 2);
	};
}

function drawTriangle(pos, dir) {
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


// Weighting for forces
const MAX_SPEED = 100;
const MASS = 5;
const MAX_FORCE = 1000;

const BOUNDS_WEIGHT = 150;
const WANDER_WEIGHT = 80;
const MOUSE_WEIGHT = 80;

const ALIGN_WEIGHT = 10;
const COHESION_WEIGHT = 10;
const SEPARATION_WEIGHT = 80;
const SEPARATION_DISTANCE = 100;

class Flocker {
	constructor(x, y) {
		this.pos = new Vector2(x, y);
		// Randomize initial velocity
		let vx = (Math.random() * 2) - 1;
		let vy = (Math.random() * 2) - 1;
		this.dir = new Vector2(vx, vy).normalized();
		this.vel = new Vector2(vx, vy).normalized();
		console.log(this.vel);
		this.accel = new Vector2(0, 0);
		this.flock = [];
	}

	draw() {
		drawTriangle(this.pos, this.dir);
	};

	update(time) {
		// this is where we control movement and interactivity
		this.calcSteeringForces();
		this.updatePosition(time);
		this.draw();
	};

	updatePosition(time) {
		// Create new position
		let newPos = new Vector2(this.pos.x, this.pos.y);
		// Add acceleration to velocity
		this.vel = this.vel.add(this.accel.scale(time));
		// Normalize velocity and limit it
		this.vel = this.vel.limit(MAX_SPEED);
		// Add velocity to new position
		newPos = newPos.add(this.vel.scale(time));
		// Set direction to point towards velocity
		this.dir = this.vel.normalized();
		// Reset acceleration
		this.accel = new Vector2(0, 0);
		// Finally, set the new position
		this.pos = newPos;
	};

	applyForce(force) {
		this.accel = this.accel.add(force.scale(1 / MASS));
	};

	calcSteeringForces() {
		let final = this.dir;

		// Random movement
		final = final.add(this.wander().scale(WANDER_WEIGHT));
		// Stay in bounds
		final = final.add(this.bounds().scale(BOUNDS_WEIGHT));
		// Seek the mouse
		final = final.add(this.mouse().scale(MOUSE_WEIGHT));

		// Flocking forces
		this.refreshFlock();
		final = final.add(this.align().scale(ALIGN_WEIGHT));
		final = final.add(this.separate().scale(SEPARATION_WEIGHT));
		final = final.add(this.cohere().scale(COHESION_WEIGHT));

		// debug(this.pos.add(final));
		final = final.normalized().scale(MAX_FORCE);
		// console.log(final);
		// debug(this.pos.add(final));

		this.applyForce(final);
	};

	seek(target) {
		let desired = target.sub(this.pos);
		desired = desired.normalized().scale(MAX_SPEED);
		return desired.sub(this.vel);
	};

	flee(target) {
		let desired = target.sub(this.pos);
		desired = desired.normalized().scale(MAX_SPEED);
		return this.vel.sub(desired);
	};

	mouse() {
		if (this.pos.dist(mouse) < MOUSE_THRESHOLD) {
			return this.seek(mouse);
		}
		return new Vector2(0, 0);
	}

	wander() {
		let x = (Math.random() * WANDER_SCALE) - (WANDER_SCALE / 2);
		let y = (Math.random() * WANDER_SCALE) - (WANDER_SCALE / 2);
		let dir = new Vector2(x, y);
		let futurePos = this.pos.add(this.vel.scale(1));

		dir = dir.normalized().scale(WANDER_SCALE).add(futurePos);
		return this.seek(dir);
	};

	bounds(target) {
		if (this.pos.x > canvas.width - BOUNDS_THRESHOLD ||
			this.pos.x < BOUNDS_THRESHOLD ||
			this.pos.y > canvas.height - BOUNDS_THRESHOLD ||
			this.pos.y < BOUNDS_THRESHOLD) {
			// If we are nearing the bounds then go towards to center
			return this.seek(new Vector2(canvas.width / 2, canvas.height / 2));
		}
		return new Vector2(0, 0);
	};

	refreshFlock() {
		this.flock = [];
		for (const other of flockers) {
			if (this.pos.dist(other.pos) < FLOCK_DISTANCE) {
				this.flock.push(other);
			}
		}
	};

	align() {
		let dir = new Vector2(0, 0);

		for (const f of this.flock) {
			dir = dir.add(f.vel);
		}

		return this.seek(this.pos.add(dir));
	};

	separate() {
		let close = [];
		for (const f of this.flock) {
			if (this.pos.dist(f.pos) < SEPARATION_DISTANCE)
				close.push(f);
		}

		let steer = new Vector2(0, 0);
		for (const f of close) {
			steer = steer.add(this.flee(f.pos));
		}

		return steer;
	};

	cohere() {
		let center = new Vector2(0, 0);
		for (const f of this.flock) {
			center = center.add(f.pos);
		}

		center.scale(1 / this.flock.length);

		return this.seek(center);
	};
};

// Keep track of mouse position
let mouse = new Vector2(0, 0);

window.addEventListener('mousemove', function (evt) {
	mouse.x = evt.x;
	mouse.y = evt.y;
});

window.addEventListener('click', function (evt) {
	if (flockers.length < MAX_FLOCKERS) {
		flockers.push(new Flocker(mouse.x, mouse.y));
	}
});

// Create the flockers
let flockers = [];
for (let index = 0; index < INITIAL_FLOCKERS; index++) {
	// Random start location
	let x = Math.random() * canvas.width;
	let y = Math.random() * canvas.height;
	let f = new Flocker(x, y);
	flockers.push(f);
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
