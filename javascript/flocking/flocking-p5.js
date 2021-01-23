const MAX_FLOCKERS = 20;
const INITIAL_FLOCKERS = 1;
let debug = false;
let hostile = false;

const FLEE_DISTANCE = 300;

// Flock types
const FlockType = Object.freeze({ "hunter": 1, "runner": 2 });

function setup() {
	createCanvas(windowWidth, document.body.offsetHeight);

	stroke(255);

	runners = new Flock(color(0), FlockType.runner);
	hunters = new Flock(color(255, 50, 50), FlockType.hunter);
	runners.other = hunters;
	hunters.other = runners;

	// Start with no hostility
	for (let index = 0; index < INITIAL_FLOCKERS; index++) {
		runners.addFlocker(createFlocker());
	}
}


function windowResized() {
	resizeCanvas(windowWidth, document.body.offsetHeight);
}

function createFlocker(x = random(width), y = random(window.scrollY, windowHeight + window.scrollY)) {
	return new Flocker(createVector(x, y), p5.Vector.random2D());
}

/**
 * Convert a runner flocker to a hunter focker (runner -> hunter)
 * @param {Flocker} flocker The flocker to be converted
 * @param {FlockType} type The initial type of the flocker
 */
function convertFlocker(flocker, type) {
	switch (type) {
		case FlockType.hunter:
			idx = hunters.flockers.indexOf(flocker);
			hunters.flockers.splice(idx, 1);
			runners.flockers.push(flocker);
			flocker.maxSpeed = Flocker.FLEE_SPEED;
			break;
		case FlockType.runner:
			idx = runners.flockers.indexOf(flocker);
			runners.flockers.splice(idx, 1);
			hunters.flockers.push(flocker);
			flocker.maxSpeed = Flocker.HUNT_SPEED;
			break;
		default:
			break;
	}

}

/**
 * This is war
 */
function toggleHostility() {
	hostile = !hostile;
	if (hostile) {
		// Turn up the speed
		for (const flocker of runners.flockers) {
			flocker.maxSpeed = Flocker.FLEE_SPEED;
		}
		// Choose one to be corrupted
		let evil = runners.flockers[floor(random() * runners.flockers.length)];
		convertFlocker(evil, runners.type);
	} else {
		// Reset speeds and set all to nice little flockers
		// Iterate in reverse because we are modifying while iterating
		for (let i = hunters.flockers.length - 1; i >= 0; i--) {
			let flocker = hunters.flockers[i];
			convertFlocker(flocker, hunters.type);
			flocker.maxSpeed = Flocker.DEFAULT_SPEED;
		}
		for (const flocker of runners.flockers) {
			flocker.maxSpeed = Flocker.DEFAULT_SPEED;
		}

	}
}


function draw() {
	background(221, 233, 170);

	runners.update();
	hunters.update();
};

function mousePressed(event) {
	switch (mouseButton) {
		case LEFT:
			runners.addFlocker(createFlocker(mouseX, mouseY));
			break;
		case RIGHT:
			debug = !debug;
			break;

		default:
			break;
	}
}

Flocker.prototype.debug = function () {
	strokeWeight(2);
	// Velocity vector
	stroke(255, 0, 0);
	line(this.pos.x, this.pos.y, this.pos.x + this.vel.x * 50, this.pos.y + this.vel.y * 50);
	// Acceleration vector
	stroke(0, 0, 255);
	line(this.pos.x, this.pos.y, this.pos.x + this.accel.x * 1000, this.pos.y + this.accel.y * 1000);
	circle(this.pos.x, this.pos.y, Flocker.RADIUS * 2);
};;

// Flocker.prototype.drawTail = function () {
// 	noFill();
// 	beginShape();
// 	let len = 10;
// 	let segLength = 5;
// 	let prev = this.position;
// 	let dir = this.dir.mult(-1);
// 	for (let i = 1; i < len; i++) {
// 		let vec = this.position;
// 		var wave = Math.sin(second());
// 		var sway = lastVector.rotate(90).normalize(wave);
// 		point += lastVector.normalize(pieceLength) + sway;
// 		segments[i].point = point;
// 		if (i < 3)
// 			shortSegments[i].point = point;
// 		lastVector = vector;
// 		curveVertex(this.pos.x - vec.x, this.pos.y + i);
// 	}
// 	endShape();
// 	var segments = this.path.segments,
// 		shortSegments = this.shortPath.segments;
// 	var speed = this.vector.length;
// 	var pieceLength = 5 + speed / 3;
// 	var point = this.position;
// 	segments[0].point = shortSegments[0].point = point;
// 	// Chain goes the other way than the movement
// 	var lastVector = -this.vector;
// 	for (var i = 1; i < this.amount; i++) {
// 		var vector = segments[i].point - point;
// 		this.count += speed * 10;
// 		var wave = Math.sin((this.count + i * 3) / 300);
// 		var sway = lastVector.rotate(90).normalize(wave);
// 		point += lastVector.normalize(pieceLength) + sway;
// 		segments[i].point = point;
// 		if (i < 3)
// 			shortSegments[i].point = point;
// 		lastVector = vector;
// 	}
// 	this.path.smooth();
// };