window.NarrowSDK.LoadMap = {
    InitializeHook: function () {
		NarrowSDK.Main.mainMenu.makeMainMenuVisibleFromUserGesture();
		let OfflineRoamingProtoType = Object.getPrototypeOf(NarrowSDK.Main.gameManager.activeGame);
		let origOfflineRoamingLoadMap = OfflineRoamingProtoType.loadMap;
		OfflineRoamingProtoType.loadMap = function () {
			NarrowSDK.Main.mainMenu.makeMainMenuVisibleFromUserGesture(); // gonna keep this as default

			// load different map
			if (window.customMainMenu) {
				if (window.randomMainMenu) {
					NarrowSDK.NarrowMapsAPI.LoadNarrowMap(NarrowSDK.NarrowMaps.maps[Math.floor(Math.random() * 16)]);
				}
				else {
					NarrowSDK.NarrowMapsAPI.LoadNarrowMap(NarrowSDK.NarrowMaps.maps[8]); // castles (0-15)
				}
			}
		}

		NarrowSDK.Main.gameManager.activeGame.loadMap();
    }
}