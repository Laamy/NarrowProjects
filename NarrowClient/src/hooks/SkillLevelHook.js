// define our skill level utilities
NarrowSDK.SkillLevel = {

    // define our replacemethods function that should be called once per page load
    ReplaceMethods: function () {

        // hook then customize the sendMySkillLevel function
        let sendChatMsg = NarrowSDK.Main.network.sendMySkillLevel;
        NarrowSDK.Main.network.sendMySkillLevel = function () {
            let _this = NarrowSDK.Main.network;

            const t = new ArrayBuffer(12);
            const e = new Uint32Array(t);
            const i = new Float32Array(t);

            e[0] = 11; // NetworkManager.SendAction.MY_SKILL_LEVEL
            i[1] = 69420; // _this.matchMaking.getMappedSmoothSkillLevel()
            i[2] = 69420; // _this.matchMaking.elo

            _this.send(t);
        }

        // log hook event to console
        console.log("[NetworkManager.prototype.sendMySkillLevel, SkillLevelHook] Successfully enabled");
    }
};