// create a "SceneStack" array for us to put the scenes into
window.NarrowSDK.SceneStack = [];

// replace the old function with our new modified one using a function proxy
WeakMap.prototype.set = new Proxy(WeakMap.prototype.set, {

	// define our apply trap which is called when the original function is called
	apply(target, thisArgs, args) {

		// check if the first argument is an object of type "Scene"
		if (args[0].type == "Scene") {
			if (window.NarrowSDK.Scene == undefined) {
				window.NarrowSDK.Scene = args[0];
			}

			// scenes are called with weakmap.set two times so we need to check to
			// see if the scene already exists in our scenestack or not
			for (item of window.NarrowSDK.SceneStack) {
				// if its found in the scenestack then we call the original and
				// discard the rest of the code we run per scene
				if (item.uuid === args[0].uuid) {
					// call the oiginal function and pass in same arguments
					return Reflect.apply(...arguments);
				}
			}

			// if no match found then store scene in the scenestack
			window.NarrowSDK.SceneStack.push(args[0]);
		}

		// call the oiginal function and pass in same arguments
		return Reflect.apply(...arguments);
	}
});

// log info to console
console.log("[WeakMap.prototype.set, SceneStackHook] Successfully enabled");