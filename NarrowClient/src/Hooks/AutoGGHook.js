// define our autogg utilities
NarrowSDK.AutoGG = {

    // define our replacemethods function that should be called once per page load
    ReplaceMethods: function () {

        // storing the original prototype table
        let GameProtoType = Object.getPrototypeOf(NarrowSDK.Main.gameManager.activeGame);

        NarrowSDK.AutoGG.Prototype = GameProtoType;

        // hook then customize the doGameEndSteps function
        let doGameEndSteps = GameProtoType.doGameEndSteps;
        GameProtoType.doGameEndSteps = function () {

            if (window.autoGG) {
                NarrowSDK.Main.network.sendChatMessage(window.autoGGMsg);
            }

            doGameEndSteps.call(NarrowSDK.Main.gameManager.activeGame);
        }

        // log hook event to console
        console.log("[Game.prototype.doGameEndSteps, AutoGGHook] Successfully enabled");
    }
};