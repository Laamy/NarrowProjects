window.CheatSDK.THREE = window.THREE;
window.CheatSDK.GameRenderer = window.GameRenderer;
window.CheatSDK.Settings = {
    Chams: true
};

// should contain threeapi the gamerenderer & the game scene aswell as the cheat settings
console.log(window.CheatSDK);

window.addEventListener("load", function () {
    function onFrame() {
        if (window.CheatSDK.Scene !== undefined) {

            // loop over entity(s)
            window.CheatSDK.Scene.traverse(function (object) {
                if (object.name === "player") {

                    if (object.renderOrder == 0 && window.CheatSDK.Settings.Chams) {
                        object.renderOrder = Infinity;
                        object.material[0].depthTest = false;
                        object.material[1].depthTest = false;
                    }
                    else if (!window.CheatSDK.Settings.Chams) {
                        object.renderOrder = 0;
                        object.material[0].depthTest = true;
                        object.material[1].depthTest = true;
                    }
                }
            });
        }

        requestAnimationFrame(onFrame.bind(this));
    }

    onFrame(); // forgot to start the animation loop!!!
});