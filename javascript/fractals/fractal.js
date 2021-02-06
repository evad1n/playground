function setup() {
    createCanvas(windowWidth, windowHeight);
    // noLoop();
    frameRate(5);

    angle = radians(30);
    center = createVector(width / 2, height / 2);
    ratio = 3 / 5;
    scale = 10;
    frameTimeout = 10;
    lastFrame = 0;
}

function mouseMoved() {
    let mouse = createVector(mouseX, mouseY);
    angle = degrees(mouse.sub(center).heading());
    scale = mouseX / width * 100;
    // print(frameCount);
    // redraw();
}

function draw() {
    background(255);
    stroke(0);
    strokeWeight(1);
    noFill();
    // drawCircle(width / 2, height / 2, width / 2);
    // drawSquare(width / 2, height / 2, width / 2);
    // drawTriangle(0, height, width / 2, 0, width, height);
    // cantor(9, height / 2, width);
    branch(createVector(width / 2, height), createVector(0, -height * 1 / 4), angle, 3);
    // branch(createVector(width / 4, height), createVector(0, -height * 1 / 4), angle);
    // branch(createVector(width * 3 / 4, height), createVector(0, -height * 1 / 4), angle);
}

function branch(pos, vec, angle, bf) {
    strokeWeight(vec.mag() / 50);
    let nextPos = p5.Vector.add(pos, vec);
    line(pos.x, pos.y, nextPos.x, nextPos.y);
    if (vec.mag() > 5) {
        for (let i = 0; i < bf; i++) {
            let a = (i * angle / (bf - 1)) + (-angle / 2);
            branch(nextPos, vec.copy().rotate(radians(a)).setMag(vec.mag() * ratio), angle, bf);
        }
    }
}

function cantor(x, y, len) {
    if (len >= 1) {
        line(x, y, x + len, y);
        y += 20;
        cantor(x, y, len / 3);
        cantor(x + len * 2 / 3, y, len / 3);
    }
}

function drawCircle(x, y, radius) {
    circle(x, y, radius);
    if (radius > scale) {
        drawCircle(x + radius / 2, y, radius / 2);
        drawCircle(x - radius / 2, y, radius / 2);
        drawCircle(x, y + radius / 2, radius / 2);
        drawCircle(x, y - radius / 2, radius / 2);
    }
}

function drawSquare(x, y, size) {
    square(x, y, size);
    if (size > scale) {
        drawSquare(x + size / 2, y, size / 2);
        drawSquare(x - size / 2, y, size / 2);
        drawSquare(x, y + size / 2, size / 2);
        drawSquare(x, y - size / 2, size / 2);
    }
}

function drawTriangle(x1, y1, x2, y2, x3, y3) {
    // fill(255 - (255 * (x3 - x1) / width));
    triangle(x1, y1, x2, y2, x3, y3);
    let center = createVector(x1 + ((x3 - x1) / 2), (y2 + ((y1 - y2) / 2)));
    if (x3 - x1 > scale) {
        // drawTriangle(x1, y1, x2 / 2, height - (height - y2) / 2, x3 - (x3 - x1) / 2, y3);
        // drawTriangle(x1 + (x3 - x1) / 2, y3, width - ((width - x2) / 2), height - (height - y2) / 2, x3, y3);
        // drawTriangle(x2 / 2, height - (height - y2) / 2, x2, y2, width - (x2 / 2), height - (height - y2) / 2);
        let midLeft = createVector(x1 + ((x2 - x1) / 2), y2 + ((y1 - y2) / 2));
        let midRight = createVector(x2 + ((x3 - x2) / 2), midLeft.y);
        let midBot = createVector(x1 + ((x3 - x1) / 2), y3);
        drawTriangle(x1, y1, midLeft.x, midLeft.y, midBot.x, midBot.y);
        drawTriangle(midLeft.x, midLeft.y, x2, y2, midRight.x, midRight.y);
        drawTriangle(midBot.x, midBot.y, midRight.x, midRight.y, x3, y3);
    }
}