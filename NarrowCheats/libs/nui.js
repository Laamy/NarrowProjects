let NarrowUI = {
    // storage idk
    canvas: null,
    context: null,

    // intialize canvas shit
    init: function () {
        var element = document.getElementsByClassName("mainCanvas")[0];

        this.canvas = document.createElement("canvas");
        this.canvas.style.display = "block";
        this.canvas.style.position = "absolute";
        this.canvas.style.top = "0";
        this.canvas.style.left = "0";
        this.canvas.style.zIndex = "1"; // google says this should work (worked)

        document.body.insertBefore(this.canvas, element);

        this.context = this.canvas.getContext('2d');

        this.resizeCanvas();

        window.addEventListener("resize", this.resizeCanvas.bind(this));
    },

    clearCanvas: function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },

    resizeCanvas: function () {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;

        this.clearCanvas();
    },

    // based off documentation idk if this actually works
    drawText: function (text, x, y, fontSize, color) {
        this.context.font = `${fontSize}px arial`; // arial my love!
        this.context.fillStyle = color;
        this.context.fillText(text, x, y);
    },

    fillRect: function (x, y, width, height, color) {
        this.context.fillStyle = color;
        this.context.fillRect(x, y, width, height);
    }
}

window.GameRenderer = NarrowUI;