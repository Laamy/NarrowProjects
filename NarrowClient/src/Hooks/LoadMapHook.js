// define our loadmap utilities
window.NarrowSDK.LoadMap = {
	InitializeHook: function () {
		// open the game pause menu
		NarrowSDK.Main.mainMenu.makeMainMenuVisibleFromUserGesture();

		// storing the original prototype table
		let OfflineRoamingProtoType = Object.getPrototypeOf(NarrowSDK.Main.gameManager.activeGame);

		// store the original load map function
		let origOfflineRoamingLoadMap = OfflineRoamingProtoType.loadMap;
		OfflineRoamingProtoType.loadMap = function () {

			// open the game pause menu
			NarrowSDK.Main.mainMenu.makeMainMenuVisibleFromUserGesture(); // gonna keep this as default

			// check if the game should load custom main menu scenes
			if (window.customMainMenu) {

				// check if the game should load random custom main menu scenes
				if (window.randomMainMenu) {

					// load random narrow one map
					NarrowSDK.NarrowMapsAPI.LoadNarrowMap(NarrowSDK.NarrowMaps.maps[Math.floor(Math.random() * 16)]);
				}
				else {

					// load cool map cuz its hot
					NarrowSDK.NarrowMapsAPI.LoadNarrowMap(NarrowSDK.NarrowMaps.maps[8]); // (0-15)
				}
			}
		}

		// call the load map function (again) to load the map
		NarrowSDK.Main.gameManager.activeGame.loadMap();
    }
}