window.selected = 0;
window.renderDistance = 3; // default (900 far but i wont be using that)
window.gameSaturation = "1";

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

NarrowSDK.NarrowUI2D = NarrowUI; // debugging reasons but dont use this reference

/*

NarrowSDK.HandScene = {
	"FirstPersonObjContainer": {
		"Bow asset loader": {
			"Arrow point idle": {},
			"Arrow point loaded": {},
			"merged bow mesh": {},
			"Arrow": {},
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

function GetFirstPersonObjContainer() {
	let container = undefined;

	for (scene of window.NarrowSDK.SceneStack) {
		scene.traverse(function (obj2) {
			if (obj2.name === "FirstPersonObjContainer") {
				container = obj2;
				return;
			}
		});
	}

	return container;
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

let defaultKeyBindings = { // dont modify this one
	switchWeapon: "KeyQ", // toggleWeapon
	playerList: "Tab",
	toggleThirdPerson: "KeyY",
	openChat: "KeyT"
};

// default keybinds
let keyBindings = {
	switchWeapon: "KeyQ",
	playerList: "Tab",
	toggleThirdPerson: "KeyY",
	openChat: "Enter"
};

const originalAddEventListener = EventTarget.prototype.addEventListener;
EventTarget.prototype.addEventListener = function (type, listener, options) {
	const modifiedListener = function (event) {
		if (type === 'keyup' || type === 'keydown') {
			if (!(document.activeElement && ["INPUT", "SELECT", "BUTTON"].includes(document.activeElement.tagName))) {
				Object.keys(keyBindings).forEach(function (key) {
					if (event.code === keyBindings[key]) {
						listener.call(this, {
							code: defaultKeyBindings[key],
							preventDefault: function () {
								event.preventDefault();
							},
							isCustom: true
						});
					}

					if (keyBindings[key] !== defaultKeyBindings[key] && event.code === defaultKeyBindings[key]) {
						if (!event.isCustom) {
							event.preventDefault();
							return; // cancel key event cuz its not one of ours!!
						}
					}
				});
			}
		}

		listener.call(this, event);
	};

	originalAddEventListener.call(this, type, modifiedListener, options);
};

window.addEventListener("load", function () {
	console.log(window.NarrowSDK);

	if (window.NarrowSDK.Scene === undefined) {
		console.log("Fatal error");
		location.reload();
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

	let settingsBtn = undefined;

	let style = document.createElement("style"); // forgot to do the other two elements, my bad !
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
		dialogTitle.textContent = "Narrow Client Settings";
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
				inputCheckbox.checked = true;
			}

			inputCheckbox.addEventListener("change", function (event) {
				SettingsSet("adblock", event.target.checked);
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

			if (SettingsGet("vsync") !== undefined) {
				inputCheckbox.checked = SettingsGet("vsync");
			}
			else {
				inputCheckbox.checked = true;
			}

			inputCheckbox.addEventListener("change", function (event) {
				SettingsSet("vsync", event.target.checked);
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
		dialogTitle.textContent = "Narrow Keybinds";
		dialogDiv.appendChild(dialogTitle);

		const keybindsListDiv = document.createElement("div");
		keybindsListDiv.className = "keybinds-list";
		dialogDiv.appendChild(keybindsListDiv);

		function changeKeybind(actionName, key) {
			console.log(`Keybind for ${actionName} changed to ${key}`);
		}

		createKeybindItem("Open Chat", "openChat", keyBindings.openChat, changeKeybind);
		createKeybindItem("Switch Weapon", "switchWeapon", keyBindings.switchWeapon, changeKeybind);
		createKeybindItem("Player List", "playerList", keyBindings.playerList, changeKeybind);
		createKeybindItem("Third Person", "toggleThirdPerson", keyBindings.toggleThirdPerson, changeKeybind);
		
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
				keyBindings[keyName] = keyInput.value;
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
	//window.NarrowSDK.Scene.autoUpdate = true;

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

		//window.NarrowSDK.Scene.traverse(function (obj) {
		//	if (obj.name.includes("Arrow trail")) {
		//		// gotta compile my own shader bruh
		//	}
		//});

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
	}

	onFrame();
}); 

//function CreateArrowTrailShader() {
//	new ShaderMaterial({
//		name: "narrowClientSkinned",
//		vertexShader: "",
//		fragmentShader: "",
//		uniforms: {
//			saturation: {
//				value: 1
//			},
//			colorMultiplier: {
//				value: new Color(1, 1, 1)
//			},
//			colorAdder: {
//				value: new Color(0, 0, 0)
//			},
//			skyHighCol: {
//				value: new Color
//			},
//			skyMidCol: {
//				value: new Color
//			},
//			skyLowCol: {
//				value: new Color
//			},
//			skyPower: {
//				value: 1
//			},
//			fogAmount: {
//				value: .002
//			},
//			fogHeightAmount: {
//				value: 0
//			},
//			fogHeightOffset: {
//				value: 0
//			},
//			fogHeightDistFalloff: {
//				value: 0
//			},
//			fogHeightAmountMin: {
//				value: 0
//			},
//			fogHeightAmountMax: {
//				value: 0
//			},
//			...a
//		},
//		side: THREE.FrontSide,
//		vertexColors: true,
//		depthWrite: true,
//		depthTest: true
//	});
//}