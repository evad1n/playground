class Vector2 {
    static zero = createVector(0, 0);

    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    get mag() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    get normalized() {
        // Avoid divide by zero errors
        if (this.mag == 0) return Vector2.zero;
        let f = 1 / this.mag;
        return createVector(this.x * f, this.y * f);
    }

    add(other) {
        return createVector(this.x + other.x, this.y + other.y);
    };

    sub(other) {
        return createVector(this.x - other.x, this.y - other.y);
    };

    scale(n) {
        return createVector(this.x * n, this.y * n);
    };

    limit(n) {
        if (this.mag > n) {
            return this.normalized.scale(n);
        }
        return this;
    };

    dist(other) {
        return Math.sqrt((this.x - other.x) ** 2 + (this.y - other.y) ** 2);
    };
}