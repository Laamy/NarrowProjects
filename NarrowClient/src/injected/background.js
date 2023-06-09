// DONT TOUCH
window.environment = "dev"; // "dev", "dev-roaming", "release"

window.selected = 0;
window.renderDistance = 3; // default (900 far but i wont be using that)
window.gameSaturation = "1";
window.wireBow = true;
window.clientName = "Betrona";
window.removeTrails = false;

window.adSkip = true; // set to false in public builds cuz I feel bad for making this in the first place lol..

const SettingsGet = window.electronApi.SettingsGet;
const SettingsSet = window.electronApi.SettingsSet;

// ported from my old cheat
NarrowUI = {
	canvas: null,
	context: null,

	init: function () {
		var element = document.getElementsByClassName("mainCanvas")[0];

		this.canvas = document.createElement("canvas");
		this.canvas.style.display = "block";
		this.canvas.style.position = "absolute";
		this.canvas.style.top = "0";
		this.canvas.style.left = "0";
		this.canvas.style.zIndex = "1";

		document.body.insertBefore(this.canvas, element);

		this.context = this.canvas.getContext('2d');

		this.context.antialias = true;

		this.resizeCanvas();

		window.addEventListener("resize", this.resizeCanvas.bind(this));
	},

	clearCanvas: function () {
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	},

	resizeCanvas: function () {
		this.canvas.width = window.innerWidth;
		this.canvas.height = window.innerHeight;

		this.clearCanvas();
	},

	drawText: function (text, x, y, fontSize, color) {
		this.context.font = `${fontSize}px arial`; // arial my love!
		this.context.fillStyle = color;
		this.context.fillText(text, x, y);
	},

	fillRect: function (x, y, width, height, color) {
		this.context.fillStyle = color;
		this.context.fillRect(x, y, width, height);
	},

	pushNotification: function (title, reason) {
		const dialogContainer = document.createElement('div');
		dialogContainer.classList.add('dialog', 'wrinkledPaper');
		dialogContainer.style.setProperty('--wrinkled-paper-seed', '63563');
		dialogContainer.style.setProperty('z-index', '100');

		const dialogTitle = document.createElement('h2');
		dialogTitle.classList.add('dialogTitle', 'blueNight');
		dialogTitle.textContent = 'Connection closed';
		dialogContainer.appendChild(dialogTitle);

		const dialogText = document.createElement('div');
		dialogText.classList.add('dialogText');
		dialogText.textContent = 'You have been kicked for being afk for too long';
		dialogContainer.appendChild(dialogText);

		const dialogButtonsContainer = document.createElement('div');
		dialogButtonsContainer.classList.add('dialogButtonsContainer');

		const dialogButton = document.createElement('button');
		dialogButton.classList.add('dialog-button', 'blueNight', 'wrinkledPaper');
		dialogButton.style.setProperty('--wrinkled-paper-seed', '21569');
		dialogButton.innerHTML = '<span>ok</span>';
		dialogButtonsContainer.appendChild(dialogButton);

		dialogContainer.appendChild(dialogButtonsContainer);

		document.body.append(dialogContainer);

		this.drawShadow();
	},

	drawShadow: function () {
		const dialogCurtain = document.createElement('div');
		dialogCurtain.classList.add('dialogCurtain', 'fullScreen');
		dialogCurtain.style.setProperty('z-index', '99');

		document.body.append(dialogCurtain);
	}
}

let betronaKeybinds = {
	zoom: "KeyE"
}

let NarrowMaps = { // lazy
	"mainMenuMapHash": "3bbbfa0118cd68ad1b46d2f493583344850ea7bf5702195737b381d1610d979b",
	"maps": [
		{
			"name": "Castles",
			"assetName": "narrowCastles",
			"hash": "d5ebb87e8e7dfe661eac15880f85145b43ff6afa7f9620c86ebff6ae3851d052",
			"configHash": "05f6888df37bfdef71bf1970e8253150f48f5fea726bcc98a28cbc20dadcb12f",
			"size": 2057992
		},
		{
			"name": "Forts",
			"assetName": "narrowForts",
			"hash": "aaa82e8d7528788bdb9eae05e0e986b81594ddf4b794ec0270a92c9a1367c9ce",
			"configHash": "3bb3b9695c5edc741348c96b924fd9bb2fec2272591e6e02aee92b40a7abaabf",
			"size": 1735656
		},
		{
			"name": "Alleys",
			"assetName": "narrowAlleys",
			"hash": "6aef46b604384f7d896554023ff8b10f721815e0ca9490a9964372b85fa7635b",
			"configHash": "30093f8525598318b052e99d780f34ebe2e041c00ee9bbb12c1fb4cc43e2af06",
			"size": 2417552
		},
		{
			"name": "Fields",
			"assetName": "narrowFields",
			"hash": "e86d9d3af827768d87f91c326a6cbbd4fcad53e04c09d51e0861941c9f33d329",
			"configHash": "e07a3ccfcd7c1d64928532ba2247c397ce2e2ea9b38f3e0427cb125b3123e6b2",
			"size": 2437520
		},
		{
			"name": "Ruins",
			"assetName": "narrowRuins",
			"hash": "fdfef595d573d5ffb8ba5550dab3ccbeafbf514a6100535cda6d99e6e75d65a4",
			"configHash": "84712353e290982b13fd9b5e37fb3f2a30644e85079fb571e64c7d82910f8244",
			"size": 1522624
		},
		{
			"name": "Arena",
			"assetName": "narrowArena",
			"hash": "48e4dcb78948209be9c3115ab423d11951bdbd1f97c204abceea3d950b1d4b2e",
			"configHash": "e424f311788484278c6c2e274a72b07775239e6cd219a4c733c1af35e5c2ca8c",
			"size": 1660360
		},
		{
			"name": "Towers",
			"assetName": "narrowTowers",
			"hash": "fd12cd312cece28bba1964789724b444e2bf697efe1ac1abf90b327bc9849b39",
			"configHash": "f000281da3b2798032037d38d1aa86091875997c66e5d4731e077244873f2139",
			"size": 1726336
		},
		{
			"name": "Arch",
			"assetName": "narrowArch",
			"hash": "5d6cf9429ea0190ef0f85293fa5dfe96cb6c6ba02103f27aa9030ce15da41584",
			"configHash": "92bf45895c36e9674d3a53fdc868546d4f7989bd2227ea31cf3dbfbd655e394e",
			"size": 3412008
		},
		{
			"name": "Halls",
			"assetName": "narrowHalls",
			"hash": "9d09c418618d1236e0e18d8dfa737e7a9c11238df3748492bd27f2d87686d578",
			"configHash": "74e1ae9ae8fd992174146531f9216eb25f08ca395d1c8d3a3cd3d0e6eef42dcf",
			"size": 2925336
		},
		{
			"name": "Tombs",
			"assetName": "narrowTombs",
			"hash": "36e46377f1ef3360ed2d3ae95c695928505810129721fc8757ec793affc0f9ac",
			"configHash": "35217cb961b375fc5f765b910f470c9ee7afcae304978bc69ab22ab6f6cb4c8a",
			"size": 1326976
		},
		{
			"name": "Hills",
			"assetName": "narrowHills",
			"hash": "9dfd84a9b3aced7844920d3c049714b592699ed46792f38c07bac9e4b027fb25",
			"configHash": "d9f49ff1c20795b55356fc41ba81c473fbeb3b009c6150545fb718990b906fea",
			"size": 2681136
		},
		{
			"name": "jungle",
			"assetName": "narrowJungle",
			"hash": "24bb95bb81c5da57900109cd0b6c6166557d71808da9efa9b112960568fea50e",
			"configHash": "21d8350c8cc644137cae3a04dba0fff4c18de7c15004889ee4608f95a698784f",
			"size": 1835608
		},
		{
			"name": "wall",
			"assetName": "narrowWall",
			"hash": "80fa63e8d98f2e6a142af03d91200b08dcca481023ed1c8972aa7946be634322",
			"configHash": "80f8d774013d1ba19dafaf2224667bd6f75261287c315b2915a7fe729922db21",
			"size": 3323744
		},
		{
			"name": "temple",
			"assetName": "narrowTemple",
			"hash": "5f5a253ce09547d77b1d4bae181b7f83942c975e6b3132a9c1aaa39adebd47e5",
			"configHash": "07f830904efeb67e8f01f2e9bab3127ca3c7744d9e4fef6a0d243ab2af39afa7",
			"size": 3832752
		},
		{
			"name": "graveyard",
			"assetName": "narrowGraveyard",
			"hash": "bca0789b85e9746166bb7a60562785828a9480acd71dbbae9073db15c4beac37",
			"configHash": "ec869347cab4e15da447c5bf0b804e2791a0851bc1baadd4abfedb61b6c569a6",
			"size": 2154880
		},
		{
			"name": "desert",
			"assetName": "narrowDesert",
			"hash": "3bbbfa0118cd68ad1b46d2f493583344850ea7bf5702195737b381d1610d979b",
			"configHash": "f01470ea7de17cdd4a725471719eee453b157c968ae3ffd04c71d84a5f85abf9",
			"size": 2733379,
			"isNasset": true
		}
	],
	"lastUpdatedTimestamp": 1685351479331
};

// had to be forked rip
class InputKey {
	constructor({
		keyCodes: t = [],
		mouseButtons: e = [],
		gamepadButtons: i = []
	} = {}) {
		this.keyCodes = t,
			this.mouseButtons = e,
			this.gamepadButtons = i,
			this.pressed = !1,
			this.pressedGamepad = !1,
			this.onPressedChangeCbs = new Set,
			this.onPressedDownCbs = new Set,
			this.onPressedUpCbs = new Set
	}
	setKeyCodePressed(t, e, i) {
		let s = !1,
			n = !1;
		return this.keyCodes.includes(t) && (n = this.setKeyPressed(e, i), s = !0), {
			needsPreventDefault: s,
			preventOthers: n
		}
	}
	setMouseButtonPressed(t, e, i) {
		return !!this.mouseButtons.includes(t) && this.setKeyPressed(e, i)
	}
	setPressedGamepadButtons(t, e) {
		let i = !1;
		for (const e of this.gamepadButtons)
			if (t.includes(e)) {
				i = !0;
				break
			}
		return this.pressedGamepad != i && (this.pressedGamepad = i, this.setKeyPressed(i, e))
	}
	setKeyPressed(t, e = !1) {
		let i = !1;
		if (t != this.pressed && (this.pressed = t, !e)) {
			for (const e of this.onPressedChangeCbs) {
				e(t) && (i = !0)
			}
			if (t)
				for (const t of this.onPressedDownCbs) {
					t() && (i = !0)
				}
			else
				for (const t of this.onPressedUpCbs) {
					t() && (i = !0)
				}
		}
		return i
	}
	onPressedChange(t) {
		this.onPressedChangeCbs.add(t)
	}
	onPressedDown(t) {
		this.onPressedDownCbs.add(t)
	}
	onPressedUp(t) {
		this.onPressedUpCbs.add(t)
	}
	removeCb(t) {
		const e = t;
		this.onPressedChangeCbs.delete(e),
			this.onPressedDownCbs.delete(e),
			this.onPressedUpCbs.delete(e)
	}
}

NarrowSDK.NarrowUI2D = NarrowUI; // debugging reasons but dont use this reference
NarrowSDK.LoadNarrowMap = function (cfg) {
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

const originalBind = Function.prototype.bind;
Function.prototype.bind = function (thisRef, ...options) {
	if (thisRef !== undefined && thisRef !== null) {
		if (thisRef.input !== undefined) {
			NarrowSDK.Main = thisRef;
		}
	}

	return originalBind.call(this, thisRef, ...options);
}

/*

NarrowSDK.HandScene = {
	"FirstPersonObjContainer": {
		"Bow asset loader": {
			"Arrow point idle": {},
			"Arrow point loaded": {},
			"merged bow mesh": {},
			"Arrow": {},
		},
		"melee asset loader": {
			"melee": {}
		}
	}
}

*/

function SetUITheme(value) {
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
}

function SetGameSaturation(amount) {
	window.NarrowSDK.Scene.traverse(function (obj) { // can sokmetimes be undefined for some reason
		if ((obj.name === "map_merged" || obj.name === " merged") && obj.material !== undefined) { // merged models tend to be the map
			obj.material[0].uniforms.saturation = { value: amount }; // map

			if (obj.material[1] !== undefined) {
				obj.material[1].uniforms.saturation = { value: amount }; // extra map details like plants
			}
		}
	});
}

function ForEachFirstPersonObjContainer(callback) {
	for (scene of window.NarrowSDK.SceneStack) {
		scene.traverse(function (obj2) {
			if (obj2.name === "FirstPersonObjContainer") {
				callback(obj2);
				return;
			}
		});
	}
}

function GetLocalPlayer() {
	let player = undefined;

	if (NarrowSDK.Main.gameManager.activeGame === null || NarrowSDK.Main.gameManager.activeGame.players === undefined) {
		return undefined;
	}

	return NarrowSDK.Main.gameManager.activeGame.getMyPlayer();
}

function ShowAlert(msg, title, options) {
	return NarrowSDK.Main.dialogManager.showAlert({
		title: title,
		text: msg,
		buttons: options
	});
}

let oldFov;

window.addEventListener("keydown", function (e) {
	if (NarrowSDK.Main !== undefined) {
		if (e.code === betronaKeybinds.zoom) {
			window.NarrowSDK.Scene.traverse(function (obj) {
				if (obj.name === "cam") {
					obj.zoom = 8;
				}
			});

			ForEachFirstPersonObjContainer(function (obj) {
				obj.visible = false;
			});
		}
	}
});

window.addEventListener("keyup", function (e) {
	if (NarrowSDK.Main !== undefined) {
		if (e.code === betronaKeybinds.zoom) {
			window.NarrowSDK.Scene.traverse(function (obj) {
				if (obj.name === "cam") {
					obj.zoom = 1;
				}
			});

			ForEachFirstPersonObjContainer(function (obj) {
				obj.visible = true;
			});
		}
	}
});

function showNotification(text) {
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
}

// ported from narrow.one client source
let ReceiveAction = {
	JOINED_GAME_ID: 0,
	CREATE_PLAYER: 1,
	DESTROY_PLAYER: 2,
	PLAYER_OWNERSHIP: 3,
	PLAYER_DATA: 4,
	CREATE_ARROW: 5,
	CHANGE_FLAG: 6,
	SCOREBOARD: 7,
	FLAG_POSITION: 8,
	PING: 9,
	PLAYER_PING_DATA: 10,
	GAME_END: 11,
	CLAIM_HIT_BY_ARROW: 12,
	DISCONNECT_REASON: 13,
	GAME_MAP_HASH: 14,
	PLAYER_PERFORM_ACTION: 15,
	PLAYER_NAME: 16,
	PLAYER_SCORES: 17,
	CHANGE_SELECTED_CLASS: 18,
	GAME_START: 19,
	SET_AUTOSHOOT_VALUE: 20,
	EQUIPPED_SKIN_DATA: 21,
	OFFSET_PLAYER_SCORE: 22,
	GAME_END_ACCOUNT_STATS: 23,
	GUEST_DATA_CHANGED: 24,
	PLAYER_TEAM_ID: 25,
	SAME_SQUAD_PLAYERS: 26,
	SQUAD_ID_RESPONSE: 27,
	SQUAD_JOIN_ERROR_RESPONSE: 28,
	REQUEST_MAP_HASH: 29,
	GAME_TIME: 30,
	PLAYER_NAME_VERIFIED: 31,
	GAME_SEED: 32,
	SET_PLAYER_HEALTH: 33,
	CHAT_MESSAGE: 34,
	SPAWN: 35,
	SAME_SQUAD_PLAYER_DATA: 36,
	ACTIVE_WEAPON_TYPE: 37,
	HIT_VALIDATION_DATA: 38,
	MELEE_HIT_PLAYER: 39,
	AVG_TEAM_ELO: 40,
	ARROW_HIT_PLAYER: 41,
	PLAYER_KILL_PLAYER: 42
};

function parseStringMessage(t, e = 4) {
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

//EventTarget.prototype.addEventListener = new Proxy(EventTarget.prototype.addEventListener, {
//	apply(target, thisArgs, args) {
//		if (args[0] == "message") {
//			let origFunc = args[1];
//			args[1] = function (...hookArgs) {
//				if (hookArgs[0].currentTarget.url !== undefined) {
//					if (hookArgs[0].currentTarget.url.includes("narrow.one/ws")) {
//						let packetBuffer = hookArgs[0].data;

//						i = new Float32Array(packetBuffer, 0, Math.floor(packetBuffer.byteLength / 4));
//						s = new Uint32Array(packetBuffer, 0, Math.floor(packetBuffer.byteLength / 4));
//						n = new Int32Array(packetBuffer, 0, Math.floor(packetBuffer.byteLength / 4));
//						a = new Uint16Array(packetBuffer, 0, Math.floor(packetBuffer.byteLength / 2));

//						if (s[0] == ReceiveAction.CHAT_MESSAGE) {
//							let msg = parseStringMessage(packetBuffer);
//							if (msg) {
//								const packet = JSON.parse(msg);
//								const n = NarrowSDK.Main.gameManager.activeGame.chat.game.players.get(packet.data.playerId);
//								console.log(n.playerName + ": " + packet.data.message);
//							}
//						}
//					}
//				}
//				origFunc.call(this, ...hookArgs);
//			}
//		}
//		return Reflect.apply(...arguments);
//	}
//});

window.addEventListener("load", function () {
	console.log(window.NarrowSDK);

	if (window.NarrowSDK.Scene === undefined) {
		console.log("Fatal error");
		location.reload();
	}

	let RendererProtoType = Object.getPrototypeOf(NarrowSDK.Main.renderer);
	let reloadRenderer = RendererProtoType.reloadRenderer;
	RendererProtoType.reloadRenderer = function () {
		let _this = NarrowSDK.Main.renderer;

		_this.canvas && (_this.canvas.remove(), _this.canvas = null);
		_this.renderer = null;

		const t = NarrowSDK.Main.settingsManager.getValue("antialias");

		try {
			_this.renderer = new ObfThreeApi.WebGLRenderer({
				antialias: t,
				powerPreference: "high-performance",
				alpha: true
			});

			//_this.renderer.shadowMap.enabled = true;
			//_this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
		} catch (e) {
			console.error("Failed to create WebGLRenderer:", t);
			_this.webglCreationFailed = true;
			NarrowSDK.Main.mainInfoTextManager.updateText();
		}

		_this.renderer && (_this.renderer.outputEncoding = ObfThreeApi.sRGBEncoding, _this.renderer.autoClear = !1, _this.canvas = _this.renderer.domElement, _this.canvas.classList.add("fullScreen", "mainCanvas"), _this.canvas.inert = !0, document.body.appendChild(_this.canvas)),
			_this.updateSmoothFiltering(),
			_this.onResize()
	}

	//const light = new THREE.DirectionalLight(0xffffff, 1);
	//light.position.set(0, 100, 0);
	//light.castShadow = true;
	//light.shadow.mapSize.width = 1024; // Adjust the shadow map size as needed
	//light.shadow.mapSize.height = 1024;
	//light.shadow.camera.near = 0.5; // Adjust the near and far planes of the shadow camera
	//light.shadow.camera.far = 500;
	//light.shadow.camera.left = -10; // Adjust the frustum of the shadow camera if needed
	//light.shadow.camera.right = 10;
	//light.shadow.camera.top = 10;
	//light.shadow.camera.bottom = -10;
	////light.shadow.camera = NarrowSDK.Main.cam.cam;
	//NarrowSDK.Scene.add(light);

	NarrowSDK.Main.renderer.reloadRenderer();

	NarrowSDK.Main.mainMenu.makeMainMenuVisibleFromUserGesture();
	let OfflineRoamingProtoType = Object.getPrototypeOf(NarrowSDK.Main.gameManager.activeGame);
	let origOfflineRoamingLoadMap = OfflineRoamingProtoType.loadMap;
	OfflineRoamingProtoType.loadMap = function () {
		NarrowSDK.Main.mainMenu.makeMainMenuVisibleFromUserGesture();

		// load different map
		NarrowSDK.LoadNarrowMap(NarrowMaps.maps[8]); // castles (0-15) - Math.floor(Math.random() * 16)
	}

	NarrowSDK.Main.gameManager.activeGame.loadMap();

	let NetworkManagerPrototype = Object.getPrototypeOf(NarrowSDK.Main.network)

	let origConnect = NetworkManagerPrototype.connect;
	NetworkManagerPrototype.connect = function (...options) {
		if (window.environment == "dev-roaming") {
			return;
		}

		origConnect.call(this, ...options);
	}

	//let origLoadMap = NarrowSDK.Main.mapLoader.loadMap;
	//NarrowSDK.Main.mapLoader.loadMap = function (t, e) {
	//	//let origMapSetup = e;
	//	//e = function (arg) {
	//	//	console.log(arg);
	//	//}

	//	origLoadMap.call(this, t, e);
	//}

	NarrowSDK.Main.poki.commercialBreak = function () { }

	if (window.adSkip) {
		NarrowSDK.Main.poki.rewardedBreak = function () {
			return { success: true };
		}
	}

	if (SettingsGet('worldtime')) {
		window.selected = SettingsGet('worldtime');
	}
	if (SettingsGet('renderdistance')) {
		window.renderDistance = SettingsGet('renderdistance');
	}
	if (SettingsGet('theme')) {
		SetUITheme(SettingsGet('theme'));
	}
	if (SettingsGet('mapsaturation')) {
		window.gameSaturation = SettingsGet('mapsaturation');
	}

	if (SettingsGet("keybinds.chat")) {
		NarrowSDK.Main.input.keys.set("chat", new InputKey({
			keyCodes: [SettingsGet("keybinds.chat")]
		}))
	}
	if (SettingsGet("keybinds.toggleWeapon")) {
		NarrowSDK.Main.input.keys.set("toggleWeapon", new InputKey({
			keyCodes: [SettingsGet("keybinds.toggleWeapon")]
		}))
	}
	if (SettingsGet("keybinds.playerList")) {
		NarrowSDK.Main.input.keys.set("playerList", new InputKey({
			keyCodes: [SettingsGet("keybinds.playerList")]
		}))
	}
	if (SettingsGet("keybinds.toggleThirdPerson")) {
		NarrowSDK.Main.input.keys.set("toggleThirdPerson", new InputKey({
			keyCodes: [SettingsGet("keybinds.toggleThirdPerson")]
		}))
	}
	if (SettingsGet("keybinds.zoomMod")) {
		betronaKeybinds.zoom = SettingsGet("keybinds.zoomMod");
	}

	let settingsBtn = undefined;

	let style = document.createElement("style");
	style.innerHTML = `

	.extraBtn {
		position: absolute;
		left: 0;
		bottom: 0;
	}

	html.theme-amoled {
		--default-text-color: white;
		--disabled-text-color: #d1d1d1;
		--default-ui-bg-color: #121212;
		--icon-filter: invert(100%);
		--default-wrinkled-paper-border-color: #1b1b1b;
		--button-on-clear-bg-wrinkled-paper-border-color: #000000;
		--disabled-wrinkled-paper-border-color: #3a3a3a;
		--default-wrinkled-paper-top-color-extra: #323232;
		--shop-item-background-color: #3a3a3a;
		--shop-item-background-color-hover: #585858;
		--shop-item-background-color-active: #505050;
		--shop-item-highlight-color: #9c6f2d;
		--blue-highlight-color: #3f92ff;
		--items-table-bg-color: #6d6d6d;
		--items-table-odd-row-color: #0000002b;
	}

	html.theme-amoled .playersListTeam {
		--wrinkled-paper-color: var(--team-bg-color-dark);
	}

	html.theme-amoled .gameoverStatsContainer {
		--wrinkled-paper-color: var(--team-bg-color-dark);
	}

	html.theme-amoled .shopItem {
		--wrinkled-paper-color: #0e0e0e;
	}

	html.theme-purple {
		--default-text-color: white;
		--disabled-text-color: #d1d1d1;
		--default-ui-bg-color: #4e3e5a;
		--icon-filter: invert(100%);
		--default-wrinkled-paper-border-color: #5d4a6d;
		--button-on-clear-bg-wrinkled-paper-border-color: #000000;
		--disabled-wrinkled-paper-border-color: #72617e;
		--default-wrinkled-paper-top-color-extra: #78638c;
		--shop-item-background-color: #72617e;
		--shop-item-background-color-hover: #9c91a5;
		--shop-item-background-color-active: #8b7c95;
		--shop-item-highlight-color: #cfa7d7;
		--blue-highlight-color: #8c73a7;
		--items-table-bg-color: #a096b2;
		--items-table-odd-row-color: #6a597854;
	}

	html.theme-purple .playersListTeam {
		--wrinkled-paper-color: var(--team-bg-color-dark);
	}

	html.theme-purple .gameoverStatsContainer {
		--wrinkled-paper-color: var(--team-bg-color-dark);
	}

	html.theme-purple .shopItem {
		--wrinkled-paper-color: #3c3045;
	}

	html.theme-sapphire {
		--default-text-color: white;
		--disabled-text-color: #d1d1d1;
		--default-ui-bg-color: #3f3f64;
		--icon-filter: invert(100%);
		--default-wrinkled-paper-border-color: #58587f;
		--button-on-clear-bg-wrinkled-paper-border-color: #000000;
		--disabled-wrinkled-paper-border-color: #797995;
		-default-wrinkled-paper-top-color-extra: #7f7f9a;
		-shop-item-background-color: #797995;
		--shop-item-background-color-hover: #a6a6c0;
		--shop-item-background-color-active: #9696b0;
		--shop-item-highlight-color: #cfc092;
		--blue-highlight-color: #5a5acd;
		--items-table-bg-color: #9494ae;
		--items-table-odd-row-color: #5a5a805e;
	}

	html.theme-sapphire .playersListTeam {
		--wrinkled-paper-color: var(--team-bg-color-dark);
	}

	html.theme-sapphire .gameoverStatsContainer {
		--wrinkled-paper-color: var(--team-bg-color-dark);
	}

	html.theme-sapphire .shopItem {
		--wrinkled-paper-color: #363656;
	}

	`;
	document.head.appendChild(style);

	function StgCallback(div) {
		/*
			Converted to JavaScript by YeemiScript
		*/
		const dialogDiv = document.createElement("div");
		dialogDiv.className = "dialog wrinkledPaper";
		dialogDiv.style.setProperty("--wrinkled-paper-seed", "42489");
		dialogDiv.style.setProperty("z-index", "100");

		const dialogTitle = document.createElement("h2");
		dialogTitle.className = "dialogTitle blueNight";
		dialogTitle.textContent = window.clientName + " Settings";
		dialogDiv.appendChild(dialogTitle);

		const settingsListDiv = document.createElement("div");
		settingsListDiv.className = "settings-list";
		dialogDiv.appendChild(settingsListDiv);

		{
			const settingsGroupHeader = document.createElement("h3");
			settingsGroupHeader.className = "settings-group-header";
			settingsGroupHeader.textContent = "World Visuals";
			settingsListDiv.appendChild(settingsGroupHeader);
		}

		{ // time controller
			const settingsItemDiv = document.createElement("div");
			settingsItemDiv.className = "settings-item";
			settingsListDiv.appendChild(settingsItemDiv);

			const settingsItemText = document.createElement("div");
			settingsItemText.className = "settings-item-text";
			settingsItemText.textContent = "Skydome Theme";
			settingsItemDiv.appendChild(settingsItemText);

			const dialogSelectWrapperDiv = document.createElement("div");
			dialogSelectWrapperDiv.className = "dialog-select-wrapper wrinkledPaper";
			settingsItemDiv.appendChild(dialogSelectWrapperDiv);

			const selectElement = document.createElement("select");
			selectElement.className = "dialog-select-input blueNight";
			dialogSelectWrapperDiv.appendChild(selectElement);

			const options = [
				{ value: 0, text: "Sync with server" },
				{ value: 1, text: "Day" },
				{ value: 2, text: "Sunset" },
				{ value: 3, text: "Night" }
			];

			options.forEach(option => {
				const optionElement = document.createElement("option");
				optionElement.value = option.value;
				optionElement.textContent = option.text;
				selectElement.appendChild(optionElement);
			});

			selectElement.selectedIndex = window.selected;

			selectElement.addEventListener("change", function (event) {
				window.selected = event.target.value;
				SettingsSet("worldtime", event.target.value);
			});
		}

		{ // RenderDistance controller
			const settingsItemDiv = document.createElement("div");
			settingsItemDiv.className = "settings-item";
			settingsListDiv.appendChild(settingsItemDiv);

			const settingsItemText = document.createElement("div");
			settingsItemText.className = "settings-item-text";
			settingsItemText.textContent = "Render Distance";
			settingsItemDiv.appendChild(settingsItemText);

			const dialogSelectWrapperDiv = document.createElement("div");
			dialogSelectWrapperDiv.className = "dialog-select-wrapper wrinkledPaper";
			settingsItemDiv.appendChild(dialogSelectWrapperDiv);

			const selectElement = document.createElement("select");
			selectElement.className = "dialog-select-input blueNight";
			dialogSelectWrapperDiv.appendChild(selectElement);

			const options = [
				{ value: 0, text: "Low" },
				{ value: 1, text: "Medium" },
				{ value: 2, text: "High" },
				{ value: 3, text: "Extremely High" }
			];

			options.forEach(option => {
				const optionElement = document.createElement("option");
				optionElement.value = option.value;
				optionElement.textContent = option.text;
				selectElement.appendChild(optionElement);
			});

			selectElement.selectedIndex = window.renderDistance;

			selectElement.addEventListener("change", function (event) {
				window.renderDistance = event.target.value;
				SettingsSet("renderdistance", event.target.value);
			});
		}

		{ // Game saturation controller
			const settingsItemDiv = document.createElement("div");
			settingsItemDiv.className = "settings-item";
			settingsListDiv.appendChild(settingsItemDiv);

			const settingsItemText = document.createElement("div");
			settingsItemText.className = "settings-item-text";
			settingsItemText.textContent = "Map Saturation";
			settingsItemDiv.appendChild(settingsItemText);

			const dialogSelectWrapperDiv = document.createElement("div");
			dialogSelectWrapperDiv.className = "dialog-select-wrapper wrinkledPaper";
			settingsItemDiv.appendChild(dialogSelectWrapperDiv);

			const selectElement = document.createElement("select");
			selectElement.className = "dialog-select-input blueNight";
			dialogSelectWrapperDiv.appendChild(selectElement);

			const options = [
				{ value: 0, text: "Low" },
				{ value: 1, text: "Default" },
				{ value: 2, text: "High" }
			];

			options.forEach(option => {
				const optionElement = document.createElement("option");
				optionElement.value = option.value;
				optionElement.textContent = option.text;
				selectElement.appendChild(optionElement);
			});

			selectElement.selectedIndex = window.gameSaturation;

			selectElement.addEventListener("change", function (event) {
				window.gameSaturation = event.target.value;
				SettingsSet("mapsaturation", event.target.value);
			});
		}

		{
			var settingsItemDiv = document.createElement("div");
			settingsItemDiv.classList.add("settings-item");

			var settingsItemTextDiv = document.createElement("div");
			settingsItemTextDiv.classList.add("settings-item-text");
			settingsItemTextDiv.textContent = "Wireframe Hands";

			var inputCheckbox = document.createElement("input");
			inputCheckbox.setAttribute("type", "checkbox");
			inputCheckbox.classList.add("dialog-checkbox-input", "wrinkledPaper");

			inputCheckbox.checked = window.wireBow;

			inputCheckbox.addEventListener("change", function (event) {
				SettingsSet("wireframe-hands", event.target.checked);
				window.wireBow = event.target.checked;
			});

			settingsItemDiv.appendChild(settingsItemTextDiv);
			settingsItemDiv.appendChild(inputCheckbox);
			settingsListDiv.appendChild(settingsItemDiv);
		}

		{
			var settingsItemDiv = document.createElement("div");
			settingsItemDiv.classList.add("settings-item");

			var settingsItemTextDiv = document.createElement("div");
			settingsItemTextDiv.classList.add("settings-item-text");
			settingsItemTextDiv.textContent = "Arrow Trails";

			var inputCheckbox = document.createElement("input");
			inputCheckbox.setAttribute("type", "checkbox");
			inputCheckbox.classList.add("dialog-checkbox-input", "wrinkledPaper");

			inputCheckbox.checked = window.removeTrails;

			inputCheckbox.addEventListener("change", function (event) {
				SettingsSet("arrow-trails", event.target.checked);
				window.removeTrails = event.target.checked;
			});

			settingsItemDiv.appendChild(settingsItemTextDiv);
			settingsItemDiv.appendChild(inputCheckbox);
			settingsListDiv.appendChild(settingsItemDiv);
		}

		{
			const settingsGroupHeader = document.createElement("h3");
			settingsGroupHeader.className = "settings-group-header";
			settingsGroupHeader.textContent = "UI Visuals";
			settingsListDiv.appendChild(settingsGroupHeader);
		}

		{ // Theme controller
			const settingsItemDiv = document.createElement("div");
			settingsItemDiv.className = "settings-item";
			settingsListDiv.appendChild(settingsItemDiv);

			const settingsItemText = document.createElement("div");
			settingsItemText.className = "settings-item-text";
			settingsItemText.textContent = "Theme";
			settingsItemDiv.appendChild(settingsItemText);

			const dialogSelectWrapperDiv = document.createElement("div");
			dialogSelectWrapperDiv.className = "dialog-select-wrapper wrinkledPaper";
			settingsItemDiv.appendChild(dialogSelectWrapperDiv);

			const selectElement = document.createElement("select");
			selectElement.className = "dialog-select-input blueNight";
			dialogSelectWrapperDiv.appendChild(selectElement);

			const options = [
				{ value: 0, text: "Dark" },
				{ value: 1, text: "Light" },
				{ value: 2, text: "Amoled Black" },
				{ value: 3, text: "Paper Purple" },
				{ value: 4, text: "Sapphire Blue" }
			];

			options.forEach(option => {
				const optionElement = document.createElement("option");
				optionElement.value = option.value;
				optionElement.textContent = option.text;
				selectElement.appendChild(optionElement);
			});

			selectElement.selectedIndex = 1;

			if (document.documentElement.classList == "theme-dark")
				selectElement.selectedIndex = 0;

			if (document.documentElement.classList == "theme-amoled")
				selectElement.selectedIndex = 2;

			if (document.documentElement.classList == "theme-purple")
				selectElement.selectedIndex = 3;

			if (document.documentElement.classList == "theme-sapphire")
				selectElement.selectedIndex = 4;

			selectElement.addEventListener("change", function (event) {
				SettingsSet("theme", event.target.value);

				SetUITheme(event.target.value);
			});
		}

		{
			const settingsGroupHeader = document.createElement("h3");
			settingsGroupHeader.className = "settings-group-header";
			settingsGroupHeader.textContent = "Client Settings (Restart Game)";
			settingsListDiv.appendChild(settingsGroupHeader);
		}

		{
			var settingsItemDiv = document.createElement("div");
			settingsItemDiv.classList.add("settings-item");

			var settingsItemTextDiv = document.createElement("div");
			settingsItemTextDiv.classList.add("settings-item-text");
			settingsItemTextDiv.textContent = "AdBlock";

			var inputCheckbox = document.createElement("input");
			inputCheckbox.setAttribute("type", "checkbox");
			inputCheckbox.classList.add("dialog-checkbox-input", "wrinkledPaper");

			if (SettingsGet("adblock") !== undefined) {
				inputCheckbox.checked = SettingsGet("adblock");
			}
			else {
				inputCheckbox.checked = false; // by default disabled
			}

			inputCheckbox.addEventListener("change", function (event) {
				SettingsSet("adblock", event.target.checked);

				ShowAlert("This setting requires a restart of " + window.clientName, window.clientName, [{ text: "Okay" }]);
			});

			settingsItemDiv.appendChild(settingsItemTextDiv);
			settingsItemDiv.appendChild(inputCheckbox);
			settingsListDiv.appendChild(settingsItemDiv);
		}

		{
			var settingsItemDiv = document.createElement("div");
			settingsItemDiv.classList.add("settings-item");

			var settingsItemTextDiv = document.createElement("div");
			settingsItemTextDiv.classList.add("settings-item-text");
			settingsItemTextDiv.textContent = "V-Sync";

			var inputCheckbox = document.createElement("input");
			inputCheckbox.setAttribute("type", "checkbox");
			inputCheckbox.classList.add("dialog-checkbox-input", "wrinkledPaper");

			inputCheckbox.checked = false;

			inputCheckbox.addEventListener("change", function (event) {
				SettingsSet("vsync", event.target.checked);

				ShowAlert("This setting requires a restart of " + window.clientName, window.clientName, [{ text: "Okay" }]);
			});

			settingsItemDiv.appendChild(settingsItemTextDiv);
			settingsItemDiv.appendChild(inputCheckbox);
			settingsListDiv.appendChild(settingsItemDiv);
		}

		const dialogButtonsContainerDiv = document.createElement("div");
		dialogButtonsContainerDiv.className = "dialogButtonsContainer";
		dialogDiv.appendChild(dialogButtonsContainerDiv);

		const saveButton = document.createElement("button");
		saveButton.className = "dialog-button blueNight wrinkledPaper";
		saveButton.style.setProperty("--wrinkled-paper-seed", "25637");
		dialogButtonsContainerDiv.appendChild(saveButton);

		const saveButtonSpan = document.createElement("span");
		saveButtonSpan.textContent = "Save";
		saveButton.appendChild(saveButtonSpan);

		saveButton.addEventListener("click", function () {
			dialogDiv.remove(); // idk tbh
		});

		document.body.appendChild(dialogDiv);
	}

	function KbsCallback(div) {
		const dialogDiv = document.createElement("div");
		dialogDiv.className = "dialog wrinkledPaper";
		dialogDiv.style.setProperty("--wrinkled-paper-seed", "42489");
		dialogDiv.style.setProperty("z-index", "100");

		const dialogTitle = document.createElement("h2");
		dialogTitle.className = "dialogTitle blueNight";
		dialogTitle.textContent = "Game Keybinds";
		dialogDiv.appendChild(dialogTitle);

		const keybindsListDiv = document.createElement("div");
		keybindsListDiv.className = "keybinds-list";
		dialogDiv.appendChild(keybindsListDiv);

		{
			const settingsGroupHeader = document.createElement("h3");
			settingsGroupHeader.className = "settings-group-header";
			settingsGroupHeader.textContent = "Narrow Keybinds";
			keybindsListDiv.appendChild(settingsGroupHeader);
		}

		function changeKeybind(actionName, key) {
			console.log(`Keybind for ${actionName} changed to ${key}`);

			SettingsSet("keybinds." + actionName, key);

			NarrowSDK.Main.input.keys.set(actionName, new InputKey({
				keyCodes: [key]
			}))
		}

		//NarrowSDK.Main.input.getKey("left");
		//NarrowSDK.Main.input.keys.set("left", new InputKey({
		//	keyCodes: ["KeyA", "ArrowLeft"]
		//}))

		createKeybindItem("Open Chat", "chat", NarrowSDK.Main.input.getKey("chat").keyCodes[0], changeKeybind);
		createKeybindItem("Switch Weapon", "toggleWeapon", NarrowSDK.Main.input.getKey("toggleWeapon").keyCodes[0], changeKeybind);
		createKeybindItem("Player List", "playerList", NarrowSDK.Main.input.getKey("playerList").keyCodes[0], changeKeybind);
		createKeybindItem("Third Person", "toggleThirdPerson", NarrowSDK.Main.input.getKey("toggleThirdPerson").keyCodes[0], changeKeybind);

		{
			const settingsGroupHeader = document.createElement("h3");
			settingsGroupHeader.className = "settings-group-header";
			settingsGroupHeader.textContent = window.clientName + " Keybinds";
			keybindsListDiv.appendChild(settingsGroupHeader);
		}

		createKeybindItem("Zoom", "zoomMod", betronaKeybinds.zoom, function (actionName, key) {
			console.log(`Keybind for ${actionName} changed to ${key}`);

			SettingsSet("keybinds." + actionName, key);

			betronaKeybinds.zoom = key;
		});
		
		function createKeybindItem(label, keyName, defaultKey, onClick) {
			const itemDiv = document.createElement("div");
			itemDiv.className = "keybind-item";

			const labelSpan = document.createElement("span");
			labelSpan.textContent = label;
			itemDiv.appendChild(labelSpan);

			const keyInput = document.createElement("input");
			keyInput.type = "text";
			keyInput.value = defaultKey;
			keyInput.addEventListener("keydown", function (event) {
				event.preventDefault();
				keyInput.value = event.code;
			});

			const saveButton = document.createElement("button");
			saveButton.textContent = "Save";
			saveButton.addEventListener("click", function () {
				onClick(keyName, keyInput.value);
			});

			itemDiv.appendChild(keyInput);
			itemDiv.appendChild(saveButton);

			keybindsListDiv.appendChild(itemDiv);
		}

		const dialogButtonsContainerDiv = document.createElement("div");
		dialogButtonsContainerDiv.className = "dialogButtonsContainer";
		dialogDiv.appendChild(dialogButtonsContainerDiv);

		const saveButton = document.createElement("button");
		saveButton.className = "dialog-button blueNight wrinkledPaper";
		saveButton.style.setProperty("--wrinkled-paper-seed", "25637");
		dialogButtonsContainerDiv.appendChild(saveButton);

		const saveButtonSpan = document.createElement("span");
		saveButtonSpan.textContent = "Save";
		saveButton.appendChild(saveButtonSpan);

		saveButton.addEventListener("click", function () {
			dialogDiv.remove(); // idk tbh
		});

		document.body.appendChild(dialogDiv);
	}

	const geometry = new THREE.BoxGeometry(1, 1, 1);
	const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
	const cube = new THREE.Mesh(geometry, material);
	cube.position.x = -109;
	cube.position.z = 114;
	cube.name = "WayPoint";
	window.NarrowSDK.Scene.add(cube);

	window.NarrowSDK.Scene.autoUpdate = true;

	const texture = new THREE.TextureLoader().load(window.electronApi.dirname + '/assets/default_wing.png'); 
	texture.transparent = true;
	texture.alphaTest = 0.5;

	const wingGeometry = new THREE.BoxGeometry(0, 0.3, 0.4);
	const wingMaterial = new THREE.MeshBasicMaterial({
		map: texture,
		transparent: true
	});

	const leftWing = new THREE.Mesh(wingGeometry, wingMaterial);
	leftWing.position.x = 0.2;
	leftWing.rotation.y = -10;

	const rightWing = new THREE.Mesh(wingGeometry, wingMaterial);
	rightWing.position.x = -0.2;
	rightWing.rotation.y = 10;

	const wingsGroup = new THREE.Group();
	wingsGroup.add(leftWing, rightWing);

	let firstPersonHandMaterial = undefined;

	function calculatePointBehind(pos, rots) {
		//let scalar = 0.0349;
		let rotsRad = new THREE.Vector3(0, (rots.y), 0);

		let direction = new THREE.Vector3(Math.cos(rotsRad.y), Math.sin(rotsRad.y), 0);

		let pointBehind = new THREE.Vector3().copy(pos).sub(direction);

		return pointBehind;
	}

	window.NarrowSDK.Scene.add(wingsGroup);

	const offset = new THREE.Vector3(0, 1.3, -0.2);

	console.log(NarrowSDK.Main.gameManager.activeGame.Prototype);

	function onFrame() {
		if (NarrowUI.context === null) {
			NarrowUI.init();
		}

		if (window.NarrowSDK.Scene !== undefined) {
			// draw essentials here
			let width = NarrowUI.canvas.width;
			let height = NarrowUI.canvas.height;

			NarrowUI.clearCanvas(); // clear last frame drawings
			//NarrowUI.drawText(`NarrowClient`, width - 250, 160, 16, "blue");
		}

		requestAnimationFrame(onFrame.bind(this));

		//NarrowSDK.Main.renderer.renderer.shadowMap.render(NarrowSDK.Scene, NarrowSDK.Main.cam.cam, [light]);

		let localPlayer = GetLocalPlayer();

		if (localPlayer !== undefined && localPlayer !== null) { // dont play around with crosshair class
			//NarrowSDK.Main.gameManager.activeGame.crosshair.smoothAccuracy = -90;
			//NarrowSDK.Main.gameManager.activeGame.crosshair.currentAccuracy = -90;

			let player = localPlayer.obj;
			if (player !== undefined && player !== null) {
				const meshWorldPosition = player.position;
				const offsetPosition = offset.clone().applyQuaternion(player.quaternion);
				const groupPosition = meshWorldPosition.add(offsetPosition);
				wingsGroup.position.copy(groupPosition);
				wingsGroup.rotation.copy(player.rotation);

				wingsGroup.visible = player.visible; // third person only
			}
		}
		else {
			wingsGroup.position.y = -100;
		}

		switch (window.selected) {
			case "1":
				window.NarrowSDK.SetSky(window.NarrowSDK.SkyDomes.Day);
				break;
			case "2":
				window.NarrowSDK.SetSky(window.NarrowSDK.SkyDomes.SunSet);
				break;
			case "3":
				window.NarrowSDK.SetSky(window.NarrowSDK.SkyDomes.Night);
				break;
		}
		window.NarrowSDK.Scene.traverse(function (obj) {
			if (obj.name === "skydome") {
				window.NarrowSDK.Scene.traverse(function (obj2) {
					if (obj2.name === "cam") {
						obj.position = obj2.position;
					}
				});

				obj.renderOrder = 0; // so it can draw over stuff

				switch (window.renderDistance) {
					case "0": // low
						obj.scale.x = 0.1;
						obj.scale.y = 0.1;
						obj.scale.z = 0.1;
						break;
					case "1": // medium
						obj.scale.x = 0.5;
						obj.scale.y = 0.5;
						obj.scale.z = 0.5;
						break;
					case "2": // high
						obj.scale.x = 0.7;
						obj.scale.y = 0.7;
						obj.scale.z = 0.7;
						break;
					case "3": // extremely high
						obj.scale.x = 1;
						obj.scale.y = 1;
						obj.scale.z = 1;
						break;
				}
			}

			if (window.removeTrails) {
				if (obj.name.includes("Arrow trail")) {
					obj.visible = false;
				}
			}
		});

		switch (window.gameSaturation) {
			case "0":
				SetGameSaturation(1)
				break;
			case "1":
				SetGameSaturation(1.2)
				break;
			case "2":
				SetGameSaturation(1.5)
				break;
		}

		if (settingsBtn === undefined) {
			settingsBtn = window.NarrowSDK.NarrowUI.CreateMenu("60%", "static/img/menuUI/settings.svg", "Extra", "65454", StgCallback);
			window.NarrowSDK.NarrowUI.CreateMenu("35%", "static/img/menuUI/shop/categoryIcons/quiver.svg", "Keybinds", "45356", KbsCallback);
		}

		if (firstPersonHandMaterial !== undefined) {
			firstPersonHandMaterial.wireframe = window.wireBow;
		}

		ForEachFirstPersonObjContainer(function (firstPersonObjContainer) {
			try {
				if (firstPersonObjContainer !== undefined) {
					if (firstPersonObjContainer.children[0].name == "melee asset loader") {
						if (firstPersonObjContainer.children[0].children[0]) {
							firstPersonObjContainer.children[0].children[0].material[0] = firstPersonHandMaterial;
						}
					}
					else {
						if (firstPersonHandMaterial === undefined) {
							if (firstPersonObjContainer.children[0].children[2] === undefined) {
								return; // nope
							}
							firstPersonHandMaterial = firstPersonObjContainer.children[0].children[2].material[0].clone();
						}
						firstPersonObjContainer.children[0].traverse(function (obj) {
							if (obj !== undefined && obj.material !== undefined) {
								if (obj.material.uuid !== undefined) {
									obj.material[0] = firstPersonHandMaterial;
								}
								else {
									obj.material = firstPersonHandMaterial;
								}
							}
						});
					}
				}
			}
			catch { }
		});
	}

	onFrame();
});