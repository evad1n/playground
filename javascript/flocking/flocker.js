// Consulted below sources and heavily modified
// https://github.com/evad1n/old-unity-projects/blob/main/source/Flocking/Assets/Scripts/Vehicle.cs
// https://processing.org/examples/flocking.html
// https://processing.org/examples/flocking.html

class Flock {
	static MAX_FLOCKERS = 20;

	/**	p5.Color for fill color */
	color;
	/** The array of flockers belonging to this flock */
	flockers;
	/** The behavior of this flock in regards to the other flock */
	type;
	/** The other flock */
	other;

	constructor(color, type) {
		this.color = color;
		this.flockers = [];
		this.type = type;
	}

	update() {
		for (const flocker of this.flockers) {
			flocker.update(this.flockers, this.type, this.other);
			flocker.draw(this.color);
		}
	}

	addFlocker(flocker) {
		if (this.flockers.length < Flock.MAX_FLOCKERS) {
			this.flockers.push(flocker);
			if (hostile) {
				switch (this.type) {
					case FlockType.hunter:
						flocker.maxSpeed = Flocker.HUNT_SPEED;
						break;
					case FlockType.runner:
						flocker.maxSpeed = Flocker.FLEE_SPEED;
						break;
					default:
						// Default speed
						flocker.maxSpeed = Flocker.DEFAULT_SPEED;
						break;
				}
			}
		}
	}

}

class Flocker {
	// General constants
	static MASS = 2;
	static MAX_FORCE = 0.04;
	static DEFAULT_SPEED = 1.5;

	// Drawing constants
	static RADIUS = 10;

	static BOUNDS_THRESHOLD = 50;
	static BOUNDS_WEIGHT = 2;

	static MOUSE_THRESHOLD = 500;
	static MOUSE_WEIGHT = 0;

	// Wander constants
	static WANDER_TIMEOUT = 5;
	static WANDER_WEIGHT = 1;
	static WANDER_VARIANCE = 1;
	static WANDER_DIRECTION_SCALE = 50;

	static DECCEL_DISTANCE = 400;

	// Weighting for forces
	static FLOCK_DISTANCE = 100;

	static ALIGN_WEIGHT = 0.5;
	static COHESION_WEIGHT = 0.5;
	static SEPARATION_WEIGHT = 1;
	static SEPARATION_DISTANCE = 50;

	// Interaction weights
	static HUNT_SPEED = 3;
	static HUNT_WEIGHT = 1;
	static FLEE_SPEED = 2;
	static FLEE_WEIGHT = 1;

	// Member variables
	/** p5.Vector Current position */
	pos;
	/** p5.Vector Current position */
	dir;
	/** p5.Vector Current velocity */
	vel;
	/** p5.Vector Current acceleration */
	accel;
	/** Max speed */
	maxSpeed;
	/** Rotation change limiting  */
	lastAngle;
	/** Wander timeout */
	wanderTimeout;

	/**
	 * Set starting position and velocity
	 * @param {p5.Vector} pos Starting position vector
	 * @param {p5.Vector} vel Starting velocity vector
	 */
	constructor(pos, vel, type) {
		this.pos = pos;
		this.vel = vel;
		this.dir = vel;
		this.accel = createVector(0, 0);
		this.maxSpeed = Flocker.DEFAULT_SPEED;
		this.wanderTimeout = 0;
		this.count = 0;
		this.segments = Array(20).fill(createVector());
		this.shortSegments = Array(3).fill(createVector());
	}

	draw(color) {
		// Fill color
		fill(color);
		// Outline color
		stroke(0);
		// Outline widht
		strokeWeight(0);

		// Facing direction
		let angle = this.vel.heading() - radians(90);

		// Transforms
		translate(this.pos.x, this.pos.y);
		rotate(angle);
		scale(2);
		// Draw the flocker
		beginShape();
		vertex(0, 2 * Flocker.RADIUS / 3);
		vertex(-Flocker.RADIUS / 2, -Flocker.RADIUS / 2);
		vertex(0, -Flocker.RADIUS / 10);
		vertex(Flocker.RADIUS / 2, -Flocker.RADIUS / 2);
		endShape(CLOSE);
		resetMatrix();

		// this.drawTail();

	};

	drawTail2() {
		// Draw tail
		let p = this.pos.copy();
		// Get opposite direction vector
		let dir = this.vel.copy();
		dir.normalize();
		dir.rotate(radians(180));

		noFill();
		strokeWeight(2);
		beginShape();
		curveVertex(this.pos.x, this.pos.y);
		for (let i = 0; i < 20; i++) {
			this.count += this.vel.mag() * 10;
			let y = createVector(0, 50 * this.accel.mag() * sin(radians(i * 120) + this.count));
			y.rotate(this.vel.heading());
			let p = dir.copy();
			p.mult(i * 4);
			// print(p);
			p.add(this.pos);
			// let p = p5.Vector.add(p5.Vector.add(this.pos, (p5.Vector.mult(dir, 10 * i))), y);
			p.add(y);
			curveVertex(p.x, p.y);
		}
		endShape();
	}

	drawTail() {
		let segments = this.segments, shortSegments = this.shortSegments;
		let speed = this.vel.mag();
		let pieceLength = 5 + speed / 3;
		let point = this.pos.copy();
		segments[0] = shortSegments[0] = point.copy();
		// Chain goes the other way than the movement
		let lastVel = p5.Vector.mult(this.vel, -1);
		circle(point.x + lastVel.x * 20, point.y + lastVel.y * 20, 10);
		for (let i = 1; i < 20; i++) {
			let vel = p5.Vector.sub(segments[i], point);
			this.count += speed * 10;
			let wave = sin((this.count + i * 1) / 300);
			let sway = lastVel.copy().rotate(90);
			sway.setMag(wave);
			point.add(lastVel.copy().setMag(pieceLength));
			point.add(sway);
			// print(point);
			segments[i] = point;
			if (i < 3) {
				shortSegments[i] = point.copy();
			}
			lastVel = vel.copy();
		}

		noFill();
		strokeWeight(4);
		beginShape();
		for (const seg of shortSegments) {
			curveVertex(seg.x, seg.y);
		}
		endShape();

		strokeWeight(2);
		beginShape();
		for (const seg of segments) {
			curveVertex(seg.x, seg.y);
		}
		endShape();
	}


	update(flock, type, other) {
		// Reset acceleration
		this.accel.mult(0);
		// this is where we control movement and interactivity
		this.updateForces(flock, type, other.flockers);
		this.updatePosition();
	};

	updatePosition() {
		// Add acceleration to velocity
		this.vel.add(p5.Vector.mult(this.accel, deltaTime / 20));
		// Limit speed
		this.vel.limit(this.maxSpeed);
		// Add velocity to position
		this.pos.add(p5.Vector.mult(this.vel, deltaTime / 20));
		// Debug before resetting acceleration
		if (debug)
			this.debug();
	};

	/**
	 * Adds a force vector to current acceleration
	 * @param {p5.Vector} force The force vector to apply
	 */
	applyForce(force,) {
		this.accel.add(p5.Vector.div(force, Flocker.MASS));
	};

	/**
	 * Calculates and applies new force vectors
	 */
	updateForces(flock, type, others) {
		// Stay in bounds. Short circuit to stay in bounds.
		if (this.bounds())
			return;
		// Random movement
		this.wander();
		// Seek/flee the mouse
		this.mouse();

		if (hostile && others.length > 0) {
			switch (type) {
				case FlockType.hunter:
					// Seek the others
					let closest = others[0], closestDistance = height * 2;
					for (const other of others) {
						let d = this.pos.dist(other.pos);
						if (d < closestDistance) {
							closestDistance = d;
							closest = other;
						}
					}
					if (closest) {
						// Check for collisions
						if (closestDistance < Flocker.RADIUS * 2) {
							// Turn them EVIL
							convertFlocker(closest, FlockType.runner);
						}
						let steer = this.seek(closest.pos);
						steer.mult(Flocker.HUNT_WEIGHT);
						this.applyForce(steer);
					}
					break;
				case FlockType.runner:
					// Flee from the others
					for (const other of others) {
						if (this.pos.dist(other.pos) < FLEE_DISTANCE) {
							let steer = this.flee(other.pos);
							steer.mult(Flocker.FLEE_WEIGHT);
							this.applyForce(steer);
						}
					}
					break;

				default:
					break;
			}
		} else {
			this.maxSpeed = Flocker.DEFAULT_SPEED;
			// Flocking forces
			this.flock(flock);
		}
	}

	/**
	 * Steers towards the target
	* @param {p5.Vector} target The vector position to seek
	* @param {boolean} deccel Whether to deccelerate on approach
	*/
	seek(target, deccel = false) {
		let steer, desired = p5.Vector.sub(target, this.pos), d = desired.mag();
		desired.setMag(this.maxSpeed);

		// Optional decceleration
		if (deccel && d != 0 && d < Flocker.DECCEL_DISTANCE) {
			desired.mult(d / Flocker.DECCEL_DISTANCE);
		}

		steer = p5.Vector.sub(desired, this.vel);
		steer.limit(Flocker.MAX_FORCE);
		return steer;
	};

	/**
	* Flee from the target
	* @param {p5.Vector} target The vector position to flee from
	*/
	flee(target) {
		let steer, desired = p5.Vector.sub(target, this.pos), d = desired.mag();
		desired.setMag(this.maxSpeed);

		// The opposite of seek, subtract the desired from the velocity
		steer = p5.Vector.sub(this.vel, desired);
		steer.limit(Flocker.MAX_FORCE);
		return steer;
	};

	mouse() {
		let mouse = createVector(mouseX, mouseY);
		if (this.pos.dist(mouse) < Flocker.MOUSE_THRESHOLD) {
			let steer = this.flee(mouse, true);
			steer.mult(Flocker.MOUSE_WEIGHT);
			this.applyForce(steer);
		}
	}

	// FIX: Make wandering smoother and more drastic.. idk how yet
	/**
	 * Periodically choose a random vector to wander too
	 */
	wander() {
		if (this.wanderTimeout > Flocker.WANDER_TIMEOUT) {
			this.wanderTimeout = 0;
			let r = p5.Vector.random2D();
			r.mult(Flocker.WANDER_VARIANCE);
			let nextPos = p5.Vector.add(this.pos, p5.Vector.mult(this.vel, Flocker.WANDER_DIRECTION_SCALE));
			r.add(nextPos);
			if (debug) {
				fill(0);
				circle(r.x, r.y, 30);
			}
			let steer = this.seek(r);
			steer.mult(Flocker.WANDER_WEIGHT);
			this.applyForce(steer);
		}
		this.wanderTimeout++;
	};

	bounds() {
		// Bounds takes priority over everything
		let override = false;
		let steer = this.pos.copy();
		if (this.pos.x < (hostile ? Flocker.BOUNDS_THRESHOLD * 3 : Flocker.BOUNDS_THRESHOLD) || this.pos.x > width - (hostile ? Flocker.BOUNDS_THRESHOLD * 3 : Flocker.BOUNDS_THRESHOLD)) {
			steer.x = width / 3;
			override = true;
		}
		// For y take scrolling into account so flockers always try to be on screen
		if (this.pos.y < (hostile ? Flocker.BOUNDS_THRESHOLD * 3 : Flocker.BOUNDS_THRESHOLD) + window.scrollY ||
			this.pos.y > (windowHeight + window.scrollY) - (hostile ? Flocker.BOUNDS_THRESHOLD * 3 : Flocker.BOUNDS_THRESHOLD)) {
			steer.y = window.scrollY + (windowHeight / 2);
			override = true;
		}
		if (override) {
			steer = p5.Vector.sub(steer, this.pos);
			// If we are nearing the bounds then go towards to center
			steer.limit(Flocker.MAX_FORCE);
			steer.mult(Flocker.BOUNDS_WEIGHT);
			this.applyForce(steer);
			return override;
		}
		return false;
	};

	/**
	 * Gets current flock in vicinity and calls flocking methods: align, separate, cohere
	 */
	flock(flock) {
		let nearby = [];
		for (const other of flock) {
			let d = this.pos.dist(other.pos);
			if (d > 0 && d < Flocker.FLOCK_DISTANCE) {
				nearby.push(other);
			}
		}

		let alignment = this.align(nearby);
		let separation = this.separate(nearby);
		let cohesion = this.cohere(nearby);
		// Apply weights
		alignment.mult(Flocker.ALIGN_WEIGHT);
		separation.mult(Flocker.SEPARATION_WEIGHT);
		cohesion.mult(Flocker.COHESION_WEIGHT);
		// Apply forces
		this.applyForce(alignment);
		this.applyForce(separation);
		this.applyForce(cohesion);
	};

	/**
	* Calculates alignment vector for flock
	* @param {Flocker[]} flock
	*/
	align(flock) {
		let sum = flock.reduce((acc, other) => acc.add(other.vel), createVector());

		if (flock.length > 0) {
			sum.div(flock.length);
			sum.setMag(this.maxSpeed);
			let steer = p5.Vector.sub(sum, this.vel);
			steer.limit(Flocker.MAX_FORCE);
			return steer;
		}
		// Nothing to align to
		return sum;
	};

	/**
	 * Calculates separation vector for flock
	 * @param {Flocker[]} flock 
	 */
	separate(flock) {
		let steer = createVector(), count = 0;

		for (const other of flock) {
			let d = this.pos.dist(other.pos);
			if (d > 0 && d < Flocker.SEPARATION_DISTANCE) {
				let diff = p5.Vector.sub(this.pos, other.pos);
				diff.normalize();
				diff.div(d);
				steer.add(diff);
				count++;
			}
		}

		if (count > 0) {
			steer.div(count);
		}

		if (steer.mag() > 0) {
			// Don't just call seek(steer) as the steer vector already takes into account the desired location
			steer.setMag(this.maxSpeed);
			steer.sub(this.vel);
			steer.limit(Flocker.MAX_FORCE);
		}
		return steer;
	};

	/**
	* Calculates cohesion vector for flock
	* @param {Flocker[]} flock
	*/
	cohere(flock) {
		let center = flock.reduce((acc, other) => acc.add(other.pos), createVector());

		// Average to find center and then seek
		if (flock.length > 0) {
			center.div(flock.length);
			return this.seek(center);
		}
		// Nothing to cohere to
		return center;
	};
};