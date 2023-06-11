NarrowSDK.Network = {
    InitializeHook: function () {
		let NetworkManagerPrototype = Object.getPrototypeOf(NarrowSDK.Main.network)

		let origConnect = NetworkManagerPrototype.connect;
		NetworkManagerPrototype.connect = function (...options) {
			if (window.environment == "dev-roaming") {
				return;
			}

			origConnect.call(this, ...options);
		}
    }
}