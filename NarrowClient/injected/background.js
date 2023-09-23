window.CheatSDK = {}

// this wont work anymore so i'll have to rewrite it
WeakMap.prototype.set = new Proxy(WeakMap.prototype.set, {
	apply(target, thisArgs, args) {
		if (args[0].type == "Scene") {
			if (window.CheatSDK.Scene == undefined) {
				window.CheatSDK.Scene = args[0];
			}
		}

		return Reflect.apply(...arguments);
	}
});