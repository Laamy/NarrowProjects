window.AnchorSDK = {}

// this wont work anymore so i'll have to rewrite it
WeakMap.prototype.set = new Proxy(WeakMap.prototype.set, {
	apply(target, thisArgs, args) {
		if (args[0].type == "Scene") {
			if (window.AnchorSDK.scene == undefined) {
				window.AnchorSDK.scene = args[0];
			}
		}

		return Reflect.apply(...arguments);
	}
});