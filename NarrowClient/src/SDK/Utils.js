NarrowSDK.Utils = {
	SetKeybind: function (tag, keys) {
		let oldKey = NarrowSDK.Main.input.getKey("toggleThirdPerson");
		oldKey.keyCodes = [SettingsGet("keybinds.toggleThirdPerson")];
	},
	SetUITheme: function (value) {
		switch (value) {
			case "0":
				document.documentElement.classList = "theme-dark";
				break;
			case "1":
				document.documentElement.classList = "theme-light"; // not needed
				break;
			case "2":
				document.documentElement.classList = "theme-amoled";
				break;
			case "3":
				document.documentElement.classList = "theme-purple";
				break;
			case "4":
				document.documentElement.classList = "theme-sapphire";
				break;
		}
	},
	SetGameSaturation: function (amount) {
		window.NarrowSDK.Scene.traverse(function (obj) { // can sokmetimes be undefined for some reason
			if ((obj.name === "map_merged" || obj.name === " merged") && obj.material !== undefined) { // merged models tend to be the map
				obj.material[0].uniforms.saturation = { value: amount }; // map

				if (obj.material[1] !== undefined) {
					obj.material[1].uniforms.saturation = { value: amount }; // extra map details like plants
				}
			}
		});
	},
	ForEachFirstPersonObjContainer: function (callback) {
		for (scene of window.NarrowSDK.SceneStack) {
			scene.traverse(function (obj2) {
				if (obj2.name === "FirstPersonObjContainer") {
					callback(obj2);
					return;
				}
			});
		}
	},
	GetLocalPlayer: function () {
		let player = undefined;

		if (NarrowSDK.Main.gameManager.activeGame === null || NarrowSDK.Main.gameManager.activeGame.players === undefined) {
			return undefined;
		}

		return NarrowSDK.Main.gameManager.activeGame.getMyPlayer();
	},
	ShowAlert: function (msg, title, options) {
		return NarrowSDK.Main.dialogManager.showAlert({
			title: title,
			text: msg,
			buttons: options
		});
	},
	showNotification: function (text) {
		let _this = NarrowSDK.Main.gameManager.activeGame.scoreOffsetNotificationsUi;

		let s = .5;

		const n = document.createElement("div");
		n.classList.add("scoreOffsetNotification"),
			_this.listEl.appendChild(n),
			_this.createdNotifications.unshift({
				el: n,
				destroyTime: Date.now() + 1e3 * s + 1e3
			});

		const a = document.createElement("div");
		if (a.classList.add("scoreOffsetNotificationAnim"), a.style.animation = `1s notificationIconFade ${s}s both, 0.2s notificationIconPop`, n.appendChild(a)) {
			const t = document.createTextNode(text);
			a.appendChild(t);
		}

		_this.destroyOldNotifications();
		_this.updateNotificationOffsets();
	},
	parseStringMessage: function (t, e = 4) {
		if (t.byteLength < e + 4)
			return null;
		const i = new Uint32Array(t, e, 1)[0];
		try {
			const s = new Uint8Array(t, e + 4, i);
			return (new TextDecoder).decode(s)
		} catch (t) {
			return null
		}
	}
};