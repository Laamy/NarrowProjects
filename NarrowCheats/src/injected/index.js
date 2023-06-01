window.CheatSDK.THREE = window.THREE;
window.CheatSDK.GameRenderer = window.GameRenderer;
window.CheatSDK.Settings = {
    Chams: {
        enabled: true,
        keybind: "z"
    }
};

// should contain threeapi the gamerenderer & the game scene aswell as the cheat settings
console.log(window.CheatSDK);

window.addEventListener("keydown", function (event) {
    for (var table in window.CheatSDK.Settings) {
        if (window.CheatSDK.Settings.hasOwnProperty(table)) {
            var current = window.CheatSDK.Settings[table];

            if (event.key === current.keybind) {
                current.enabled = !current.enabled;
            }
        }
    }
});

window.addEventListener("load", function () {
    function onFrame() {
        if (window.CheatSDK.GameRenderer.context === null) {
            window.CheatSDK.GameRenderer.init();
            console.log(window.CheatSDK.GameRenderer.context);
        }

        if (window.CheatSDK.Scene !== undefined) {
            window.CheatSDK.Scene.traverse(function (object) { // loop over entity(s)
                if (object.name === "player") {
                    if (object.renderOrder == 0 && window.CheatSDK.Settings.Chams.enabled) {
                        object.renderOrder = Infinity;
                        object.material[0].depthTest = false;
                        object.material[1].depthTest = false;
                    }
                    else if (!window.CheatSDK.Settings.Chams.enabled) {
                        object.renderOrder = 0;
                        object.material[0].depthTest = true;
                        object.material[1].depthTest = true;
                    }
                }
            });
        }

        window.CheatSDK.GameRenderer.clearCanvas();
        window.CheatSDK.GameRenderer.drawText("Hello, world!", 50, 50, 24, "red");

        requestAnimationFrame(onFrame.bind(this));
    }

    onFrame(); // forgot to start the animation loop!!!
});