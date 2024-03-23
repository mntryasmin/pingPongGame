// info - fillRect (x, y, width, height)
// info - arc (x, y, r, 2 * Math.PI, false)

const
    canvasEl = document.querySelector("canvas"),
    canvasCtx = canvasEl.getContext("2d"),
    gapX = 10,
    centralLineWidth = 8,
    racketsHeight = 200;

const mouse = { x: 0, y: 0 };

const score = {
    human: 0,
    computer: 0,
    increaseHuman: function () {
        this.human++;
    },
    increaseComputer: function () {
        this.computer++;
    },
    draw: function () {
        canvasCtx.font = "bold 72px Arial";
        canvasCtx.textAlign = "center";
        canvasCtx.textBaseline = "top";
        canvasCtx.fillStyle = "#01341D";
        canvasCtx.fillText(this.human, background.w / 4, 50);
        canvasCtx.fillText(this.computer, background.w / 2 + background.w / 4, 50);
    }
}

const
    background = {
        w: window.innerWidth,
        h: window.innerHeight,
        draw: function () {
            canvasCtx.fillStyle = "#286047";
            canvasCtx.fillRect(0,
                0,
                this.w,
                this.h);
        }
    },
    centralLine = {
        w: centralLineWidth,
        h: background.h,
        draw: function () {
            canvasCtx.fillStyle = "#fff";
            canvasCtx.fillRect(background.w / 2 - this.w / 2,
                0,
                this.w,
                this.h);
        }
    },
    leftRacket = {
        x: gapX,
        y: (background.h - racketsHeight) / 2,
        w: centralLineWidth,
        h: racketsHeight,
        _move: function () {
            this.y = mouse.y - (racketsHeight / 2);
        },
        draw: function () {
            canvasCtx.fillStyle = "#fff";
            canvasCtx.fillRect(this.x,
                this.y,
                this.w,
                this.h);

            this._move();
        }
    },
    rightRacket = {
        x: background.w - centralLine.w - gapX,
        y: (background.h - racketsHeight) / 2,
        w: centralLine.w,
        h: racketsHeight,
        speed: 1,
        _move: function () {
            if (this.y + this.h / 2 < ball.y + ball.r) {
                this.y += this.speed;
            } else {
                this.y -= this.speed;
            }

            this.y = ball.y - (racketsHeight / 2);
        },
        speedUp: function () {
            this.speed++;
        },
        draw: function () {
            canvasCtx.fillStyle = "#fff";
            canvasCtx.fillRect(this.x,
                this.y,
                this.w,
                this.h);

            this._move();
        }
    },
    ball = {
        x: background.w / 2,
        y: background.h / 2,
        r: 12,
        speed: 5,
        directionX: 1,
        directionY: 1,
        _calcPosition: function () {

            // checks whether the human player scored a point
            if (this.x > background.w - this.r - rightRacket.w - gapX) {
                if (this.y + this.r > rightRacket.y && this.y - this.r < rightRacket.y + rightRacket.h) {
                    // bounces ball
                    this._reverseX();
                } else {
                    // score point
                    score.increaseHuman();
                    this._pointUp();
                }
            }

            // checks whether the computer player scored a point
            if (this.x < this.r + leftRacket.w + gapX) {
                if (this.y + this.r > leftRacket.y && this.y - this.r < leftRacket.y + leftRacket.h) {
                    // bounces ball
                    this._reverseX();
                } else {
                    // score point
                    score.increaseComputer();
                    this._pointUp();
                }
            }

            // limits ball movement within the top and bottom (y-axis) edges of the screen
            if ((this.y - this.r < 0 && this.directionY < 0)
                || (this.y > background.h && this.directionY > 0)) {
                this._reverseY();
            }
        },
        _reverseY: function () {
            this.directionY *= - 1;
        },
        _reverseX: function () {
            this.directionX *= - 1;
        },
        _speedUp: function () {
            this.speed += 3;
        },
        _pointUp: function () {
            this.x = background.w / 2;
            this.y = background.h / 2;

            this._reverseX();
            this._speedUp();
            rightRacket.speed();
        },
        _move: function () {
            this.x += this.directionX * this.speed;
            this.y += this.directionY * this.speed;
        },
        draw: function () {
            canvasCtx.fillStyle = "#fff";
            canvasCtx.beginPath();
            canvasCtx.arc(this.x, this.y, this.r, 0, 2 * Math.PI, false);
            canvasCtx.fill();

            this._calcPosition();
            this._move();
        }
    }

// setup: function responsible for defining the dimensions of constants
function setup() {
    canvasEl.width = canvasCtx.width = window.innerWidth;
    canvasEl.height = canvasCtx.height = window.innerHeight;
}

// draw: function responsible for drawing the game
function draw() {
    background.draw();
    centralLine.draw();
    leftRacket.draw();
    rightRacket.draw();
    ball.draw();
    score.draw();
}

window.animateFrame = (function () {
    return (
        window.requestAnimationFrame
        || window.webkitRequestAnimationFrame
        || window.mozRequestAnimationFrame
        || window.oRequestAnimationFrame
        || window.msRequestAnimationFrame
        || function (callback) {
            return window.setTimeout(callback, 1000 / 60)
        }
    )
})();

function main() {
    animateFrame(main);
    draw();
}

setup();
main();

canvasEl.addEventListener('mousemove', function (e) {
    mouse.x = e.pageX;
    mouse.y = e.pageY;
});
