window.CheatSDK.THREE = window.THREE;
window.CheatSDK.GameRenderer = window.GameRenderer;
window.CheatSDK.Settings = {
    Chams: {
        enabled: true,
        keybind: "z"
    },
    ArrayList: {
        enabled: true,
        keybind: undefined,

        onFrame: function (width, height) {
            let curY = 170;
            for (var table in window.CheatSDK.Settings) {
                if (window.CheatSDK.Settings.hasOwnProperty(table)) {
                    var current = window.CheatSDK.Settings[table];

                    if (current.keybind === undefined) {
                        window.CheatSDK.GameRenderer.drawText(`${table}: ${current.enabled}`, width - 200, curY, 16, "blue");
                    }
                    else {
                        window.CheatSDK.GameRenderer.drawText(`${table}[${current.keybind}]: ${current.enabled}`, width - 200, curY, 16, "blue");
                    }
                    curY += 24;
                }
            }
        }
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

                if (current.enabled == true && current.onEnabled !== undefined) {
                    current.onEnabled();
                }

                if (current.enabled == false && current.onDisabled !== undefined) {
                    current.onDisabled();
                }
            }
        }
    }
});

window.addEventListener("load", function () {
    function onFrame() {
        if (window.CheatSDK.GameRenderer.context === null) {
            window.CheatSDK.GameRenderer.init();
            console.log(window.CheatSDK.GameRenderer.canvas);
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

        // draw essentials here
        let width = window.CheatSDK.GameRenderer.canvas.width;
        let height = window.CheatSDK.GameRenderer.canvas.height;

        window.CheatSDK.GameRenderer.clearCanvas(); // clear last frame drawings

        for (var table in window.CheatSDK.Settings) {
            if (window.CheatSDK.Settings.hasOwnProperty(table)) {
                var current = window.CheatSDK.Settings[table];

                if (current.enabled == true && current.onFrame !== undefined) {
                    current.onFrame(width, height); // give canvas dims
                }
            }
        }

        requestAnimationFrame(onFrame.bind(this));
    }

    onFrame(); // forgot to start the animation loop!!!
});