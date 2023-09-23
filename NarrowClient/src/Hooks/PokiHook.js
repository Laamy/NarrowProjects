// define our poki utilities
NarrowSDK.Poki = {
	// define our replacemethods function that should be called once per page load
	ReplaceMethods: function (SkipAds) {
		// disable the commercial break ads when you go to the next round by replacing it with an empty function
		NarrowSDK.Main.poki.commercialBreak = function () { }
		console.log("[PokiSDK.prototype.commercialBreak, CommercialBreakHook] Successfully enabled");

		// check if first argument is true and if so we replace the reward breaks with a modified function
		// that automatically "skips" the ad while keeping the reward intact
		if (SkipAds) {
			NarrowSDK.Main.poki.rewardedBreak = function () {
				return { success: true };
			}

			// log hook event to console
			console.log("[PokiSDK.prototype.rewardedBreak, RewardedBreakHook] Successfully enabled");
		}
    }
};

// log info to console