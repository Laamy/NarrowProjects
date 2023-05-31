let NarrowUI = {
    // storage idk
    canvas: null,
    context: null,

    // intialize canvas shit
    init: function () {
        this.canvas = document.createElement("canvas");
        document.body.appendChild(this.canvas);

        this.resizeCanvas();

        this.context = this.canvas.getContext('2d');

        window.addEventListener("resize", this.resizeCanvas.bind(this));
    },

    clearCanvas: function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },

    resizeCanvas: function () {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;

        clearCanvas();
    },

    // based off documentation idk if this actually works
    drawText: function (text, x, y, fontSize, color) {
        this.context.fontSize = "${fontSize}px Arial"; // arial my love!
        this.context.fillStyle = color;
        this.context.fillText(text, x, y);
    },

    fillRect: function (x, y, width, height, color) {
        this.context.fillStyle = color;
        this.context.fillRect(x, y, width, height);
    }
}

window.GameRenderer = NarrowUI;