NarrowSDK.NarrowMapsAPI = {
	LoadNarrowMap: function (cfg) {
		const SetupMap = t => {
			let _this = NarrowSDK.Main.gameManager.activeGame;

			if ("colliders" == t.type) {
				_this.physics.removeMapColliders();
				for (const e of t.colliders)
					_this.physics.addMapCollider(e);
				_this.physics.buildOctree(),
					_this.receivedColliders = !0,
					_this.updateGameIsVisible()
			} else
				"scene" == t.type && (_this.destructed ? MapLoader.disposeMapGeometries(t.scene) : _this.setMapScene(t.scene), _this.hingeManager.setHingeObjects(t.hinges))
		};

		NarrowSDK.Main.mapLoader.loadMap({
			request: {
				type: "config",
				config: cfg
			}
		}, SetupMap);
	}
}