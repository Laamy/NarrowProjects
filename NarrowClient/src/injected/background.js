window.selected = 0;
window.renderDistance = 3; // default (900 far but i wont be using that)
window.gameSaturation = "1";
window.wireBow = true;
window.clientName = "Betrona";

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

function GetLocalPlayerModel() {
	let playerModel = undefined;

	window.NarrowSDK.Scene.traverse(function (obj2) {
		if (playerModel === undefined && obj2.name === "player") {
			playerModel = obj2; // i cant figure out a unique way to identify the player
			return;
		}
	});

	return playerModel;
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

window.addEventListener("load", function () {
	console.log(window.NarrowSDK);

	if (window.NarrowSDK.Scene === undefined) {
		console.log("Fatal error");
		location.reload();
	}

	NarrowSDK.Main.poki.commercialBreak = function () { }

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

			inputCheckbox.checked = window.wireBow;

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

		let player = GetLocalPlayerModel();
		if (player !== undefined) {
			const meshWorldPosition = player.position;
			const offsetPosition = offset.clone().applyQuaternion(player.quaternion);
			const groupPosition = meshWorldPosition.add(offsetPosition);
			wingsGroup.position.copy(groupPosition);
			wingsGroup.rotation.copy(player.rotation);

			wingsGroup.visible = player.visible; // third person only
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