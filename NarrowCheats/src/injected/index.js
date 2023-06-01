window.CheatSDK.THREE = window.THREE;
window.CheatSDK.GameRenderer = window.GameRenderer;
window.CheatSDK.Settings = {
    Chams: {
        enabled: true,
        keybind: "z",

        onFrame: function (a1, a2) {
            Game.ForeachPlayer(function (plr) {
                if (plr.renderOrder == 0) {
                    plr.renderOrder = Infinity;
                    plr.material[0].depthTest = false;
                }
            })
        },

        onDisabled: function () {
            Game.ForeachPlayer(function (plr) {
                if (plr.renderOrder == Infinity) {
                    plr.renderOrder = 0;
                    plr.material[0].depthTest = true;
                }
            })
        }
    },
    ArrayList: {
        enabled: true,
        keybind: undefined,

        onFrame: function (width, height) {
            let curY = 170;
            Game.ForeachSetting(function (current, table) {
                if (current.keybind === undefined) {
                    window.CheatSDK.GameRenderer.drawText(`${table}: ${current.enabled}`, width - 200, curY, 16, "blue");
                }
                else {
                    window.CheatSDK.GameRenderer.drawText(`${table}[${current.keybind}]: ${current.enabled}`, width - 200, curY, 16, "blue");
                }
                curY += 24;
            });
        }
    }
};

console.log(window.CheatSDK);

window.addEventListener("keydown", function (event) {
    Game.ForeachSetting(function (current) {
        if (event.key === current.keybind) {
            current.enabled = !current.enabled;

            if (current.enabled == true && current.onEnabled !== undefined) {
                current.onEnabled();
            }

            if (current.enabled == false && current.onDisabled !== undefined) {
                current.onDisabled();
            }
        }
    })
});
window.addEventListener("load", function () {
    function onFrame() {
        if (window.CheatSDK.GameRenderer.context === null) {
            window.CheatSDK.GameRenderer.init();
            console.log(window.CheatSDK.GameRenderer.canvas);
        }

        if (window.CheatSDK.Scene !== undefined) {
            // draw essentials here
            let width = window.CheatSDK.GameRenderer.canvas.width;
            let height = window.CheatSDK.GameRenderer.canvas.height;

            window.CheatSDK.GameRenderer.clearCanvas(); // clear last frame drawings

            Game.ForeachSetting(function (current) {
                if (current.enabled == true && current.onFrame !== undefined) {
                    current.onFrame(width, height); // give canvas dims
                }
            });
        }

        requestAnimationFrame(onFrame.bind(this));
    }

    onFrame(); // forgot to start the animation loop!!!
});

let Game = {
    ForeachSetting: function (callback) {
        for (var table in window.CheatSDK.Settings) {
            if (window.CheatSDK.Settings.hasOwnProperty(table)) {
                callback(window.CheatSDK.Settings[table], table);
            }
        }
    },
    ForeachPlayer: function (callback) {
        window.CheatSDK.Scene.traverse(function (object) { // loop over entity(s)
            if (object.name === "player") {
                callback(object);
            }
        });
    }
}