// setup globals region
{
	window.environment = "dev"; // "dev", "dev-roaming", "release"

	window.selected = 0;
	window.renderDistance = 3; // default (900 far but i wont be using that)
	window.gameSaturation = "1";
	window.wireBow = true;
	window.clientName = "Betrona";
	window.removeTrails = false;
	window.customMainMenu = true;
	window.randomMainMenu = false;
	window.dragonWings = true;
	window.autoGG = false;
	window.autoGGMsg = "GG - Betrona ontop";

	window.arrowTrail = {
		alphaSmoothing: 0.4, // default
		colourMultiplier: [1, 0, 0]
	}

	window.adSkip = true;

	// set to false in public builds cuz I feel bad for making this in the first place lol..
	if (window.environment === "release") {
		window.adSkip = false;
	}

	// electron api stuff
	window.NarrowSDK.Electron = {};
	window.NarrowSDK.Electron.SettingsGet = window.electronApi.SettingsGet;
	window.NarrowSDK.Electron.SettingsSet = window.electronApi.SettingsSet;
	window.NarrowSDK.Electron.Include = function (file) {
		eval(window.electronApi.SendSync("client-getfile", "/" + file));
	}
}

const Include = window.NarrowSDK.Electron.Include;
const SettingsGet = window.NarrowSDK.Electron.SettingsGet;
const SettingsSet = window.NarrowSDK.Electron.SettingsSet;

// hooks
Include("Hooks/SceneStackHook.js");
Include("Hooks/MainInstanceHook.js");
Include("Hooks/PokiHook.js");
Include("Hooks/LoadMapHook.js");
Include("Hooks/NetConnectHook.js");
Include("Hooks/SquadChatHook.js");
Include("Hooks/RecieveFromServerHook.js");
Include("Hooks/AutoGGHook.js");
//Include("Hooks/SkillLevelHook.js");

/*

i put test hooks here at first

* IDEAS:
* Movable UI
* Player Statistics
* Replay System
* Public Squads
* Singleplayer (no exp/coins duh)
* Custom soundtracks/more based on maps
* Dynamic Map Events (For example a random rock or sand flicking up or maybe wind to make it feel more alive)
* Map Queue (allow some kind of spotify like queue/playlist with repeat & shuffle controls for maps)
* Valorant crosshair like editor menu
* Killfeed
* 

*/

// sdk stuff
Include("SDK/Utils.js");

// game classes
Include("SDK/Structure/InputKey.js");
Include("SDK/Structure/NarrowMaps.js");

// classes
Include("SDK/Classes/NarrowMapsAPI.js");

// code starts here
NarrowSDK.BetronaKeybinds = {
	zoom: "KeyE"
}

let testkeybind = false;

function RecompileGameShaders() {
	let arrowTrailMat = NarrowSDK.Main.materials.materialsCache.get("arrowTrail");
	arrowTrailMat.fragmentShader = `
			//fragment shader for arrowTrail

			#define FOG
			
			
			

			varying vec3 vColor;
			varying vec4 worldPos;

			uniform vec3 skyHighCol;
			uniform vec3 skyMidCol;
			uniform vec3 skyLowCol;
			uniform float skyPower;
			#ifdef FOG
				uniform float fogAmount;
				uniform float fogHeightAmount;
				uniform float fogHeightOffset;
				uniform float fogHeightDistFalloff;
				uniform float fogHeightAmountMin;
				uniform float fogHeightAmountMax;
				float fogLerpValue;
				#define NEEDS_FOG_COLOR
			#endif
			#ifdef NEEDS_FOG_COLOR
				varying float skyColorLerpValue;
			#endif
			#ifdef NEEDS_MODEL_POS_VARYING
				varying vec3 vModelPos;
			#endif
			#ifdef NEEDS_UV
				varying vec2 vUv;
			#endif

			float alpha = 1.0;

			#include <packing>
			varying vec2 vHighPrecisionZW;

			
					uniform float arrowPosT;
					uniform float arrowShootT;
					uniform vec3 shootStartPos;
					uniform float estimatedXLength;
					varying float vArrowT;
				

			#ifdef NEEDS_FOG_COLOR
				vec3 getFogcolor(){
					float absLerpValue = abs(skyColorLerpValue);
					float lerpValue = pow(max(0.0, absLerpValue), skyPower);
					if (skyColorLerpValue < 0.0) {
						return mix(skyMidCol, skyLowCol, lerpValue);
					} else {
						return mix(skyMidCol, skyHighCol, lerpValue);
					}
				}
			#endif

			#ifdef FOG
			vec3 applyFog(vec3 col){
				col = mix(col, getFogcolor(), fogLerpValue);
				return col;
			}
			#endif

			

			vec3 modifyCol(vec3 col){
				
					float t = arrowPosT - vArrowT;
					float shootT = arrowShootT - vArrowT;
					alpha = 1.0;

					// fade in at start of trail
					alpha = min(alpha, 0.2 * t - 0.5);

					// fade out at end of trail
					alpha = min(alpha, 1.0 - 3.0 * (shootT / estimatedXLength));

					alpha = min(alpha, length(shootStartPos - worldPos.xyz));

					alpha = min(alpha, length(cameraPosition - worldPos.xyz) - 0.3);

					alpha *= ${window.arrowTrail.alphaSmoothing};
				
				return col * vec3(${window.arrowTrail.colourMultiplier[0]} * 255, ${window.arrowTrail.colourMultiplier[1]} * 255, ${window.arrowTrail.colourMultiplier[2]} * 255);
			}

			vec4 modifyTexCol(vec4 col, vec2 uv){
				
				return col;
			}

			float computeFog(float dist, float fogAmount) {
				return 1.0 - exp(-dist * fogAmount);
			}

			float computeHeightFog(float fogAmount, float fogHeightAmount, float dist, float originHeight, float deltaHeight) {
				float h = fogHeightAmount;
				float fog = (fogAmount / h) * exp(-originHeight * h) * (1.0 - exp(-dist * deltaHeight * h)) / deltaHeight;
				return clamp(fog, 0.0, 1.0);
			}

			void main(){
				#ifdef FOG
					vec3 deltaPos = vec3(worldPos) - cameraPosition;
					float fogDistValue = length(deltaPos);
					if (fogHeightAmount < 0.00001) {
						fogLerpValue = computeFog(fogDistValue, fogAmount);
					} else {
						float min = computeFog(fogDistValue, fogHeightAmountMin);
						float max = computeFog(fogDistValue, fogHeightAmountMax);
						float distAmount = fogHeightAmount * pow(fogHeightDistFalloff, - fogDistValue);
						float heightFog = computeHeightFog(fogAmount, distAmount, fogDistValue, cameraPosition.y - fogHeightOffset, normalize(deltaPos).y);
						fogLerpValue = clamp(heightFog, min, max);
					}
				#endif
				vec3 col = modifyCol(vColor);
				#ifdef FOG
					col = applyFog(col);
				#endif
				gl_FragColor = LinearTosRGB(vec4(col, alpha));
			}
		`;
}

// gotta move this to utils later
function hexToRgb(hex) {
	hex = hex.replace("#", "");

	var r = parseInt(hex.substring(0, 2), 16);
	var g = parseInt(hex.substring(2, 4), 16);
	var b = parseInt(hex.substring(4, 6), 16);

	return [r, g, b];
}

function rgbToHex(rgbArray) {
	var hexArray = rgbArray.map(value => value.toString(16).padStart(2, "0"));

	var hexString = "#" + hexArray.join("");

	return hexString;
}

// custom keybind events
window.addEventListener("keydown", function (e) {
	if (NarrowSDK.Main !== undefined) {
		if (e.code === "KeyR") {
			testkeybind = true;
		}

		if (e.code === NarrowSDK.BetronaKeybinds.zoom) {
			window.NarrowSDK.Scene.traverse(function (obj) {
				if (obj.name === "cam" && !["INPUT", "SELECT", "BUTTON"].includes(document.activeElement.tagName)) {
					obj.zoom = 8;
				}
			});

			NarrowSDK.Utils.ForEachFirstPersonObjContainer(function (obj) {
				obj.visible = false;
			});
		}
	}
});
window.addEventListener("keyup", function (e) {
	if (NarrowSDK.Main !== undefined) {
		if (e.code === "KeyR") {
			testkeybind = false;
		}

		if (e.code === NarrowSDK.BetronaKeybinds.zoom) {
			window.NarrowSDK.Scene.traverse(function (obj) {
				if (obj.name === "cam" && !["INPUT", "SELECT", "BUTTON"].includes(document.activeElement.tagName)) {
					obj.zoom = 1;
				}
			});

			NarrowSDK.Utils.ForEachFirstPersonObjContainer(function (obj) {
				obj.visible = true;
			});
		}
	}
});

window.addEventListener("load", function () {
	if (window.NarrowSDK.Scene === undefined) {
		console.log("Fatal error");
		location.reload();
	}

	console.log(window.NarrowSDK);

	// found in Hooks/PokiHook.js
	NarrowSDK.Poki.ReplaceMethods(window.adSkip);

	if (SettingsGet('worldtime')) {
		window.selected = SettingsGet('worldtime');
	}
	if (SettingsGet('renderdistance')) {
		window.renderDistance = SettingsGet('renderdistance');
	}
	if (SettingsGet('theme')) {
		NarrowSDK.Utils.SetUITheme(SettingsGet('theme'));
	}
	if (SettingsGet('mapsaturation')) {
		window.gameSaturation = SettingsGet('mapsaturation');
	}

	if (SettingsGet("keybinds.chat")) {
		NarrowSDK.Utils.SetKeybind("chat", [SettingsGet("keybinds.chat")]);
	}
	if (SettingsGet("keybinds.toggleWeapon")) {
		NarrowSDK.Utils.SetKeybind("toggleWeapon", [SettingsGet("keybinds.toggleWeapon")]);
	}
	if (SettingsGet("keybinds.playerList")) {
		NarrowSDK.Utils.SetKeybind("playerList", [SettingsGet("keybinds.playerList")]);
	}
	if (SettingsGet("keybinds.toggleThirdPerson")) {
		NarrowSDK.Utils.SetKeybind("toggleThirdPerson", [SettingsGet("keybinds.toggleThirdPerson")]);
	}
	if (SettingsGet("keybinds.zoomMod")) {
		NarrowSDK.BetronaKeybinds.zoom = SettingsGet("keybinds.zoomMod");
	}

	if (SettingsGet("mainmenu.enabled") !== undefined) { // modified main menu settings stuff
		window.customMainMenu = SettingsGet("mainmenu.enabled");
	}
	if (SettingsGet("mainmenu.random") !== undefined) {
		window.randomMainMenu = SettingsGet("mainmenu.random");
	}

	if (SettingsGet("game.dragonWings") !== undefined) {
		window.dragonWings = SettingsGet("game.dragonWings");
	}
	if (SettingsGet("game.autoGG") !== undefined) {
		window.autoGG = SettingsGet("game.autoGG");
	}
	if (SettingsGet("game.autoGGMsg") !== undefined) {
		window.autoGGMsg = SettingsGet("game.autoGGMsg");
	}

	if (SettingsGet("arrowtrail.hex") !== undefined) {
		window.arrowTrail.colourMultiplier = hexToRgb(SettingsGet("arrowtrail.hex"));
	}
	if (SettingsGet("arrowtrail.smoothing") == true) { // modified main menu settings stuff
		window.arrowTrail.alphaSmoothing = 0.8;
	}

	// found in Hooks/LoadMapHook.js
	window.NarrowSDK.LoadMap.InitializeHook();

	// found in Hooks/NetConnectHook.js
	window.NarrowSDK.Network.InitializeHook();

	// found in Hooks/SquadChatHook.js
	window.NarrowSDK.SquadNetwork.ReplaceMethods();

	let settingsBtn = undefined;

	let style = document.createElement("style");
	style.innerHTML = `

	.extraBtn {
		position: absolute;
		left: 0;
		bottom: 0;
	}

	#mainMenuLogo{
		background: url(file://${window.electronApi.dirname.replace('\\', '\\\\') + '/assets/override/NarrowOneBetterLogo.svg'});
		position: absolute;
		width: 450px;
		height: 300px;
		left: 50%;
		transform: translateX(-50%);
		filter: var(--default-drop-shadow);
		transform-origin: top;
		pointer-events: none;
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
			settingsGroupHeader.textContent = "Arrow Trails";
			settingsListDiv.appendChild(settingsGroupHeader);
		}

		{
			// <div class="settings-item"><div class="settings-item-text">Color</div><input class="dialog-color-input wrinkledPaper" type="color"></div>
			var settingsItemDiv = document.createElement("div");
			settingsItemDiv.classList.add("settings-item");

			var settingsItemTextDiv = document.createElement("div");
			settingsItemTextDiv.classList.add("settings-item-text");
			settingsItemTextDiv.textContent = "Color(our)";

			var inputColorPicker = document.createElement("input");
			inputColorPicker.setAttribute("type", "color");
			inputColorPicker.classList.add("dialog-color-input", "wrinkledPaper");

			inputColorPicker.value = rgbToHex(window.arrowTrail.colourMultiplier);

			inputColorPicker.addEventListener("change", function (event) {
				window.arrowTrail.colourMultiplier = hexToRgb(event.target.value);

				SettingsSet("arrowtrail.hex", event.target.value);

				RecompileGameShaders();
			});

			settingsItemDiv.appendChild(settingsItemTextDiv);
			settingsItemDiv.appendChild(inputColorPicker);
			settingsListDiv.appendChild(settingsItemDiv);
		}

		{
			var settingsItemDiv = document.createElement("div");
			settingsItemDiv.classList.add("settings-item");

			var settingsItemTextDiv = document.createElement("div");
			settingsItemTextDiv.classList.add("settings-item-text");
			settingsItemTextDiv.textContent = "Smoothing";

			var inputCheckbox = document.createElement("input");
			inputCheckbox.setAttribute("type", "checkbox");
			inputCheckbox.classList.add("dialog-checkbox-input", "wrinkledPaper");

			if (window.arrowTrail.alphaSmoothing === 0.4) {
				inputCheckbox.checked = false;
			}
			else {
				inputCheckbox.checked = true;
			}

			inputCheckbox.addEventListener("change", function (event) {
				SettingsSet("arrowtrail.smoothing", event.target.checked);

				if (event.target.checked) {
					window.arrowTrail.alphaSmoothing = 0.8;
				}
				else {
					window.arrowTrail.alphaSmoothing = 0.4;
				}
			});

			settingsItemDiv.appendChild(settingsItemTextDiv);
			settingsItemDiv.appendChild(inputCheckbox);
			settingsListDiv.appendChild(settingsItemDiv);
		}

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
			settingsGroupHeader.textContent = "Game";
			settingsListDiv.appendChild(settingsGroupHeader);
		}

		{
			var settingsItemDiv = document.createElement("div");
			settingsItemDiv.classList.add("settings-item");

			var settingsItemTextDiv = document.createElement("div");
			settingsItemTextDiv.classList.add("settings-item-text");
			settingsItemTextDiv.textContent = "Dragon Wings";

			var inputCheckbox = document.createElement("input");
			inputCheckbox.setAttribute("type", "checkbox");
			inputCheckbox.classList.add("dialog-checkbox-input", "wrinkledPaper");

			inputCheckbox.checked = window.dragonWings;

			inputCheckbox.addEventListener("change", function (event) {
				SettingsSet("game.dragonWings", event.target.checked);
				window.dragonWings = event.target.checked;
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
			settingsItemTextDiv.textContent = "AutoGG";

			var inputCheckbox = document.createElement("input");
			inputCheckbox.setAttribute("type", "checkbox");
			inputCheckbox.classList.add("dialog-checkbox-input", "wrinkledPaper");

			inputCheckbox.checked = window.autoGG;

			inputCheckbox.addEventListener("change", function (event) {
				SettingsSet("game.autoGG", event.target.checked);
				window.autoGG = event.target.checked;
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
			settingsItemTextDiv.textContent = "GG Message";

			var textBox = document.createElement("input");
			textBox.setAttribute("type", "text");
			textBox.classList.add("textbox-element");

			textBox.value = window.autoGGMsg;

			textBox.addEventListener("input", function (event) {
				SettingsSet("game.autoGGMsg", event.target.value);
				window.autoGGMsg = event.target.value;
				console.log(event.target.value);
			});

			settingsItemDiv.appendChild(settingsItemTextDiv);
			settingsItemDiv.appendChild(textBox);
			settingsListDiv.appendChild(settingsItemDiv);
		}

		{
			const settingsGroupHeader = document.createElement("h3");
			settingsGroupHeader.className = "settings-group-header";
			settingsGroupHeader.textContent = "Main Menu";
			settingsListDiv.appendChild(settingsGroupHeader);
		}

		{
			var settingsItemDiv = document.createElement("div");
			settingsItemDiv.classList.add("settings-item");

			var settingsItemTextDiv = document.createElement("div");
			settingsItemTextDiv.classList.add("settings-item-text");
			settingsItemTextDiv.textContent = "Custom MainMenu";

			var inputCheckbox = document.createElement("input");
			inputCheckbox.setAttribute("type", "checkbox");
			inputCheckbox.classList.add("dialog-checkbox-input", "wrinkledPaper");

			inputCheckbox.checked = window.customMainMenu;

			inputCheckbox.addEventListener("change", function (event) {
				SettingsSet("mainmenu.enabled", event.target.checked);
				window.customMainMenu = event.target.checked;
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
			settingsItemTextDiv.textContent = "Randomize MainMenu";

			var inputCheckbox = document.createElement("input");
			inputCheckbox.setAttribute("type", "checkbox");
			inputCheckbox.classList.add("dialog-checkbox-input", "wrinkledPaper");

			inputCheckbox.checked = window.randomMainMenu;

			inputCheckbox.addEventListener("change", function (event) {
				SettingsSet("mainmenu.random", event.target.checked);
				window.randomMainMenu = event.target.checked;
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

				NarrowSDK.Utils.SetUITheme(event.target.value);
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

				NarrowSDK.Utils.ShowAlert("This setting requires a restart of " + window.clientName, window.clientName, [{ text: "Okay" }]);
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

				NarrowSDK.Utils.ShowAlert("This setting requires a restart of " + window.clientName, window.clientName, [{ text: "Okay" }]);
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

			NarrowSDK.Utils.SetKeybind(actionName, [key]);
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

		createKeybindItem("Zoom", "zoomMod", NarrowSDK.BetronaKeybinds.zoom, function (actionName, key) {
			console.log(`Keybind for ${actionName} changed to ${key}`);

			SettingsSet("keybinds." + actionName, key);

			NarrowSDK.BetronaKeybinds.zoom = key;
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

	// easter egg waypoint temp region
	{
		const geometry = new THREE.BoxGeometry(1, 1, 1);
		const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
		const cube = new THREE.Mesh(geometry, material);
		cube.position.x = -109;
		cube.position.z = 114;
		cube.name = "WayPoint";
		window.NarrowSDK.Scene.add(cube);

		cube.updateMatrix();
		cube.updateWorldMatrix(false, true);
	}

	//window.NarrowSDK.Scene.autoUpdate = true; // this is the reason bows break.. got it..

	const wingsGroup = new THREE.Group();

	// temp wings region
	{
		const texture = new THREE.TextureLoader().load(window.electronApi.dirname + '/assets/default_wing.png');
		texture.transparent = true;
		texture.alphaTest = 0.5;

		const wingGeometry = new THREE.BoxGeometry(0, 0.3, 0.4);
		const wingMaterial = new THREE.MeshBasicMaterial({
			map: texture,
			transparent: true
		});

		const leftWing2 = new THREE.Mesh(wingGeometry, wingMaterial);
		leftWing2.position.x = 0.21;
		leftWing2.rotation.y = -10;

		const leftWing = new THREE.Mesh(wingGeometry, wingMaterial);
		leftWing.position.x = 0.2;
		leftWing.rotation.y = -10;

		const rightWing = new THREE.Mesh(wingGeometry, wingMaterial);
		rightWing.position.x = -0.2;
		rightWing.rotation.y = 10;

		const rightWing2 = new THREE.Mesh(wingGeometry, wingMaterial);
		rightWing2.position.x = -0.21;
		rightWing2.rotation.y = 10;

		wingsGroup.add(leftWing, leftWing2, rightWing, rightWing2);
	}

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

	RecompileGameShaders();

	function onFrame() {
		//for (const e of NarrowSDK.Main.materials.allMaterials()) {
		//	e.uniforms.colorMultiplier.value.set(new THREE.Color(1.4, 1.4, 1.4));
		//	e.uniforms.colorAdder.value.set(new THREE.Color(0, 0, 0));
		//	e.uniforms.saturation.value = 1;
		//	e.uniforms.fogAmount.value = 0;
		//	e.uniforms.fogHeightAmountMin.value = 0;
		//	e.uniforms.fogHeightAmountMax.value = 0;
		//}

		requestAnimationFrame(onFrame.bind(this));

		if (NarrowSDK.AutoGG.Prototype == undefined && NarrowSDK.Main.gameManager.activeGame.doGameEndSteps) {
			NarrowSDK.AutoGG.ReplaceMethods();
		}

		let localPlayer = NarrowSDK.Utils.GetLocalPlayer();

		if (localPlayer !== undefined && localPlayer !== null) { // dont play around with crosshair class cuz it actually edits the spread
			//NarrowSDK.Main.gameManager.activeGame.crosshair.smoothAccuracy = -90;
			//NarrowSDK.Main.gameManager.activeGame.crosshair.currentAccuracy = -90;

			let player = localPlayer.obj;
			if (player !== undefined && player !== null) {
				if (window.dragonWings) {
					const meshWorldPosition = player.position;
					const offsetPosition = offset.clone().applyQuaternion(player.quaternion);
					const groupPosition = meshWorldPosition.add(offsetPosition);
					wingsGroup.position.copy(groupPosition);
					wingsGroup.rotation.copy(player.rotation);

					wingsGroup.updateMatrix();
					wingsGroup.updateWorldMatrix(false, true);

					wingsGroup.visible = player.visible; // third person only
				}
				else {
					wingsGroup.visible = false; // disabeld wings cuz gay person
				}
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
				NarrowSDK.Utils.SetGameSaturation(1)
				break;
			case "1":
				NarrowSDK.Utils.SetGameSaturation(1.2)
				break;
			case "2":
				NarrowSDK.Utils.SetGameSaturation(1.5)
				break;
		}

		if (settingsBtn === undefined) {
			settingsBtn = window.NarrowSDK.NarrowUI.CreateMenu("60%", "static/img/menuUI/settings.svg", "Extra", "65454", StgCallback);
			window.NarrowSDK.NarrowUI.CreateMenu("35%", "static/img/menuUI/shop/categoryIcons/quiver.svg", "Keybinds", "45356", KbsCallback);
		}

		if (firstPersonHandMaterial !== undefined) {
			firstPersonHandMaterial.wireframe = window.wireBow;
		}

		//NarrowSDK.Main.skins.skinPresets.forEach(function (present) {
		//	present.hairColorMultiplier = [0.4, 0, 0.4];
		//	present.eyebrowColorMultiplier = [0.4, 0, 0.4];
		//	present.beardColorMultiplier = [0.4, 0, 0.4];
		//});
		//NarrowSDK.Main.skins.savePresets();

		NarrowSDK.Utils.ForEachFirstPersonObjContainer(function (firstPersonObjContainer) {
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