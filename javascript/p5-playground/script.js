const Scenes = ["spiky", "spinny", "window-snap"];

const Dirs = Object.freeze({ "left": 1, "right": 2, "top": 4, "bot": 8 });
const SnapThreshold = 10;
const ResizeThreshold = 5;

let currentScene = "window-snap";

function setup() {
    createCanvas(windowWidth, windowHeight);

    // Scene selector
    sel = createSelect();
    sel.position(width / 2 - (sel.width), 0);
    for (const s of Scenes) {
        sel.option(s);
    }
    sel.changed(() => {
        currentScene = sel.value();
    });
    // Starting scene
    sel.selected(currentScene);

    // Frame rate slider
    slider = createSlider(1, 60, 40);
    slider.position(10, 40);
    slider.input(() => {
        print(frameRate());
    });
    frameRate(slider.value());

    // Scene variables

    // spiky
    distribution = new Array(360);
    for (let i = 0; i < distribution.length; i++) {
        distribution[i] = floor(randomGaussian(0, 100));
    }

    // window-snap
    windows = [];

    windows.push(new Window(50, 50, color(255, 0, 0)));
    windows.push(new Window(50, 50, color(0, 255, 0)));
    windows.push(new Window(50, 50, color(0, 0, 255)));

    selected = null;
    currSnap = null;
    resizing = false;
    resizeDir = null;
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function draw() {
    background(204);

    // UI
    fill(0);
    stroke(0);
    textSize(30);
    text("FPS: " + round(frameRate()), 30, 30);
    text("Frame: " + frameCount, width - 200, 40);


    switch (currentScene) {
        case "spiky":
            strokeWeight(2);
            stroke(20);
            // Center
            translate(width / 2, height / 2);
            drawRandomDistribution(100);
            break;
        case "spinny":
            strokeWeight(2);
            stroke(20);
            // Center
            translate(width / 2, height / 2);
            // print(frameRot);
            for (let i = 0; i < distribution.length; i++) {
                rotate((TWO_PI / distribution.length));
                rotate(millis());
                let dist = abs(distribution[i]);
                line(0, 0, dist, 0);
            }
            break;
        case "window-snap":
            for (const w of [...windows].reverse()) {
                w.draw();
            }
            if (currSnap != null) {
                fill(color('rgba(180, 238, 242, 0.5)'));
                strokeWeight(2);
                stroke(240);
                rect(currSnap.x, currSnap.y, currSnap.w, currSnap.h);
            }
            break;
        default:
            break;
    }
}

// Spiky
function drawRandomDistribution(max) {
    for (let i = 0; i < distribution.length; i++) {
        distribution[i] = floor(randomGaussian(0, max));
        rotate(TWO_PI / distribution.length);
        let dist = abs(distribution[i]);
        line(0, 0, dist, 0);
    }
}

function mouseMoved() {
    switch (currentScene) {
        case "window-snap":
            for (const w of windows) {
                resizeDir = w.onBorder();
                if (resizeDir != null) {
                    cursor(resizeDir);
                    return;
                }
                if (w.isInside()) {
                    cursor('grab');
                    return;
                }
            }
            // Otherwise default to normal cursor
            cursor();
            break;

        default:
            break;
    }
}

function mousePressed() {
    switch (currentScene) {
        case "window-snap":
            let w;
            for (let i = 0; i < windows.length; i++) {
                w = windows[i];
                resizeDir = w.onBorder();
                if (resizeDir != null) {
                    resizing = true;
                    selectWindow(w, i);
                    break;
                }
                if (w.isInside()) {
                    cursor('grabbing');
                    w.setAnchor();
                    selectWindow(w, i);
                    break;
                }
            }
            break;

        default:
            break;
    }
}

function mouseDragged() {
    switch (currentScene) {
        case "window-snap":
            if (selected != null) {
                if (resizing) {
                    selected.resize();
                } else {
                    selected.followMouse();
                    // Test for snapping
                    let snap = getSnap();
                    if (snap != null) {
                        // Draw snap
                        currSnap = snap;
                    } else {
                        currSnap = null;
                    }
                }
            }
            break;

        default:
            break;
    }
}


function mouseReleased() {
    switch (currentScene) {
        case "window-snap":
            if (selected != null) {
                let snap = getSnap();
                if (snap != null) {
                    // Snap on release
                    selected.snapTo(snap);
                }
            }
            currSnap = null;
            resizing = false;
            cursor();
            selected = null;
            break;

        default:
            break;
    }
}

function selectWindow(window, idx) {
    // Move most recently selected window to front
    selected = window;
    windows.splice(idx, 1);
    windows.unshift(window);
}

class Window {
    constructor(width, height, color) {
        this.x = random(width / 2, windowWidth - width);
        this.y = random(height / 2, windowHeight - height);
        this.width = width;
        this.height = height;
        this.color = color;
        this.anchor = {};
    }

    draw() {
        stroke(0);
        if (selected && selected.color == this.color) {
            stroke(255);
        }
        fill(this.color);
        rect(this.x, this.y, this.width, this.height);
    }

    onBorder() {
        let dirs = 0;
        if (mouseX > this.x - ResizeThreshold && mouseX < this.x + ResizeThreshold && mouseY > this.y - ResizeThreshold && mouseY < this.y + this.height + ResizeThreshold) {
            // Left
            dirs |= Dirs.left;
        }
        if (mouseX > this.x + this.width - ResizeThreshold && mouseX < this.x + this.width + ResizeThreshold && mouseY > this.y - ResizeThreshold && mouseY < this.y + this.height + ResizeThreshold) {
            // Right
            dirs |= Dirs.right;
        }
        if (mouseY > this.y - ResizeThreshold && mouseY < this.y + ResizeThreshold && mouseX > this.x - ResizeThreshold && mouseX < this.x + this.width + ResizeThreshold) {
            // Top
            dirs |= Dirs.top;
        }
        if (mouseY > this.y + this.height - ResizeThreshold && mouseY < this.y + this.height + ResizeThreshold && mouseX > this.x - ResizeThreshold && mouseX < this.x + this.width + ResizeThreshold) {
            // Bot
            dirs |= Dirs.bot;
        }

        return getResizeDir(dirs);
    }

    isInside() {
        return (mouseX > this.x && mouseX < this.x + this.width &&
            mouseY > this.y && mouseY < this.y + this.height);
    }

    setAnchor() {
        this.anchor = { x: mouseX - this.x, y: mouseY - this.y };
    }

    followMouse() {
        this.x = mouseX - this.anchor.x;
        this.y = mouseY - this.anchor.y;
    }

    snapTo(snap) {
        this.x = snap.x;
        this.y = snap.y;
        this.width = snap.w;
        this.height = snap.h;
    }

    resize() {
        let oldY = this.y;
        let oldX = this.x;
        switch (resizeDir) {
            case "n-resize":
                this.y += movedY;
                this.height += oldY - this.y;
                break;
            case "s-resize":
                this.height += movedY;
                break;
            case "e-resize":
                this.width += movedX;
                break;
            case "w-resize":
                this.x += movedX;
                this.width += oldX - this.x;
                break;
            case "ne-resize":
                this.y += movedY;
                this.height += oldY - this.y;
                this.width += movedX;
                break;
            case "nw-resize":
                this.y += movedY;
                this.height += oldY - this.y;
                this.x += movedX;
                this.width += oldX - this.x;
                break;
            case "se-resize":
                this.height += movedY;
                this.width += movedX;
                break;
            case "sw-resize":
                this.height += movedY;
                this.x += movedX;
                this.width += oldX - this.x;
                break;
            default:
                break;
        }

        this.width = max(this.width, 10);
        this.height = max(this.height, 10);
    }
}

function getSnap() {
    let dirs = 0;
    // Left
    if (mouseX < SnapThreshold) {
        dirs |= Dirs.left;
    }
    // Right
    if (mouseX > width - SnapThreshold) {
        dirs |= Dirs.right;
    }
    // Top
    if (mouseY < SnapThreshold) {
        dirs |= Dirs.top;
    }
    // Bottom
    if (mouseY > height - SnapThreshold) {
        dirs |= Dirs.bot;
    }

    return getSnapRect(dirs);
}

function getSnapRect(dirs) {
    if (dirs & Dirs.left) {
        if (dirs & Dirs.top) {
            // Top left
            return { x: 0, y: 0, w: width / 2, h: height / 2 };
        } else if (dirs & Dirs.bot) {
            // Bot left
            return { x: 0, y: height / 2, w: width / 2, h: height / 2 };
        } else {
            // Left
            return { x: 0, y: 0, w: width / 2, h: height };
        }
    } else if (dirs & Dirs.right) {
        if (dirs & Dirs.top) {
            // Top right
            return { x: width / 2, y: 0, w: width / 2, h: height / 2 };
        } else if (dirs & Dirs.bot) {
            // Bot right
            return { x: width / 2, y: height / 2, w: width / 2, h: height / 2 };
        } else {
            // Right
            return { x: width / 2, y: 0, w: width / 2, h: height };
        }
    } else if (dirs & Dirs.top) {
        // Top
        return { x: 0, y: 0, w: width, h: height };
    }
    return null;
}

function getResizeDir(dirs) {
    if (dirs & Dirs.left) {
        if (dirs & Dirs.top) {
            // Top left
            return "nw-resize";
        } else if (dirs & Dirs.bot) {
            // Bot left
            return "sw-resize";
        } else {
            // Left
            return "w-resize";
        }
    } else if (dirs & Dirs.right) {
        if (dirs & Dirs.top) {
            // Top right
            return "ne-resize";
        } else if (dirs & Dirs.bot) {
            // Bot right
            return "se-resize";
        } else {
            // Right
            return "e-resize";
        }
    } else if (dirs & Dirs.top) {
        // Top
        return "n-resize";
    } else if (dirs & Dirs.bot) {
        // Top
        return "s-resize";
    }
    return null;
}