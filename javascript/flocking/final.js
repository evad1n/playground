// Consulted below sources and modified
// https://github.com/evad1n/old-unity-projects/blob/main/source/Flocking/Assets/Scripts/Vehicle.cs
// https://processing.org/examples/flocking.html
// https://processing.org/examples/flocking.html

const NUM_FLOCKERS = 20;

function setup() {
    createCanvas(windowWidth, document.body.offsetHeight);

    stroke(255);

    flock = new Flock(color(0));
    for (let i = 0; i < NUM_FLOCKERS; i++) {
        flock.addFlocker(createFlocker());
    }
}

function windowResized() {
    resizeCanvas(windowWidth, document.body.offsetHeight);
}

function createFlocker(x = random(width), y = random(window.scrollY, windowHeight + window.scrollY)) {
    return new Flocker(createVector(x, y), p5.Vector.random2D());
}

function draw() {
    background(221, 233, 170);

    flock.update();
}



class Flock {
    /**	p5.Color for fill color */
    color;
    /** The array of flockers belonging to this flock */
    flockers;

    constructor(color, type) {
        this.color = color;
        this.flockers = [];
    }

    update() {
        for (const flocker of this.flockers) {
            flocker.update(this.flockers, this.color);
        }
    }

    addFlocker(flocker) {
        this.flockers.push(flocker);
    }

}

class Flocker {
    // General constants
    static MASS = 1;
    static MAX_FORCE = 0.05;
    static DEFAULT_SPEED = 3;

    // Drawing constants
    static RADIUS = 10;

    // Weighting for forces
    static FLOCK_DISTANCE = 100;

    static ALIGN_WEIGHT = 1.0;
    static COHESION_WEIGHT = 1.0;
    static SEPARATION_WEIGHT = 1.5;
    static SEPARATION_DISTANCE = 50;

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
    };

    update(flock, color) {
        // this is where we control movement and interactivity
        this.flock(flock);
        this.updatePosition();
        this.bounds();
        this.draw(color);
    };

    updatePosition() {
        // Add acceleration to velocity
        // this.vel.add(p5.Vector.mult(this.accel, deltaTime / 20));
        this.vel.add(this.accel);
        // Limit speed
        this.vel.limit(this.maxSpeed);
        // Add velocity to position
        // this.pos.add(p5.Vector.mult(this.vel, deltaTime / 20));
        this.pos.add(this.vel);
        // Reset acceleration
        this.accel.mult(0);
    };

    /**
     * Adds a force vector to current acceleration
     * @param {p5.Vector} force The force vector to apply
     */
    applyForce(force,) {
        this.accel.add(p5.Vector.div(force, Flocker.MASS));
    };

    /**
     * Steers towards the target
    * @param {p5.Vector} target The vector position to seek
    * @param {boolean} deccel Whether to deccelerate on approach
    */
    seek(target) {
        let steer, desired = p5.Vector.sub(target, this.pos), d = desired.mag();
        desired.setMag(this.maxSpeed);

        steer = p5.Vector.sub(desired, this.vel);
        steer.limit(Flocker.MAX_FORCE);
        return steer;
    };

    /**
     * Wrap
     */
    bounds() {
        let h = window.scrollY + windowHeight;
        if (this.pos.x < -Flocker.RADIUS) this.pos.x = width + Flocker.RADIUS;
        if (this.pos.y < -Flocker.RADIUS + window.scrollY) this.pos.y = h + Flocker.RADIUS;
        if (this.pos.x > width + Flocker.RADIUS) this.pos.x = -Flocker.RADIUS;
        if (this.pos.y > h + Flocker.RADIUS) this.pos.y = -Flocker.RADIUS + window.scrollY;
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