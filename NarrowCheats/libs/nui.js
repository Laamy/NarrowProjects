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

        this.context.antialias = true;

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
    },

    pushNotification: function (title, reason) {
        const dialogContainer = document.createElement('div');
        dialogContainer.classList.add('dialog', 'wrinkledPaper');
        dialogContainer.style.setProperty('--wrinkled-paper-seed', '63563');
        dialogContainer.style.setProperty('z-index', '100');

        const dialogTitle = document.createElement('h2');
        dialogTitle.classList.add('dialogTitle', 'blueNight');
        dialogTitle.textContent = 'Connection closed';
        dialogContainer.appendChild(dialogTitle);

        const dialogText = document.createElement('div');
        dialogText.classList.add('dialogText');
        dialogText.textContent = 'You have been kicked for being afk for too long';
        dialogContainer.appendChild(dialogText);

        const dialogButtonsContainer = document.createElement('div');
        dialogButtonsContainer.classList.add('dialogButtonsContainer');

        const dialogButton = document.createElement('button');
        dialogButton.classList.add('dialog-button', 'blueNight', 'wrinkledPaper');
        dialogButton.style.setProperty('--wrinkled-paper-seed', '21569');
        dialogButton.innerHTML = '<span>ok</span>';
        dialogButtonsContainer.appendChild(dialogButton);

        dialogContainer.appendChild(dialogButtonsContainer);

        document.body.append(dialogContainer);

        this.drawShadow();
    },

    drawShadow: function () {
        const dialogCurtain = document.createElement('div');
        dialogCurtain.classList.add('dialogCurtain', 'fullScreen');
        dialogCurtain.style.setProperty('z-index', '99');

        document.body.append(dialogCurtain);
    }
}

window.GameRenderer = NarrowUI;