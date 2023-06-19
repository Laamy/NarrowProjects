// define our network utilities
NarrowSDK.Network = {
	InitializeHook: function () {
		// store the prototype (because its remade for the send message)
		let NetworkManagerPrototype = Object.getPrototypeOf(NarrowSDK.Main.network)

		// store the original prototype function for later use
		let origConnect = NetworkManagerPrototype.connect;
		NetworkManagerPrototype.connect = function (...options) {

			// cancel connect event if in dev roaming mode (will cause errors in other parts of code)
			if (window.environment == "dev-roaming") {
				return;
			}

			// call original event unmodified
			origConnect.call(this, ...options);
		}

		// log hook event to console
		console.log("[NetworkManager.prototype.connect, NetConnectHook] Successfully enabled");
    }
}