window.selected = 0;
window.renderDistance = 3; // default (900 far but i wont be using that)
window.gameSaturation = "1";

const SettingsGet = window.electronApi.SettingsGet;
const SettingsSet = window.electronApi.SettingsSet;

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

function GetLocalPlayerModel() {
	let playerModel = undefined;

	window.NarrowSDK.Scene.traverse(function (obj2) {
		if (playerModel === undefined && obj2.name === "player") {
			playerModel = obj2;
			return;
		}
	});

	return playerModel;
}

window.addEventListener("load", function () {
	console.log(window.NarrowSDK);

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

	html.theme-purple {
		--default-text-color: #DDDDDD;
		--disabled-text-color: #59076e;
		--default-ui-bg-color: #3f024a;
		--icon-filter: invert(100%);
		--default-wrinkled-paper-border-color: #490256;
		--button-on-clear-bg-wrinkled-paper-border-color: #000000;
		--disabled-wrinkled-paper-border-color: #490256;
		--default-wrinkled-paper-top-color-extra: #323232;
		--shop-item-background-color: #3a3a3a;
		--shop-item-background-color-hover: #580368;
		--shop-item-background-color-active: #500060;
		--shop-item-highlight-color: #9c6f2d;
		--blue-highlight-color: #aaa9ad;
		--items-table-bg-color: #630071;
		--items-table-odd-row-color: #0000002b;
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

	const geometry = new THREE.BoxGeometry(1, 1, 1);
	const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
	const cube = new THREE.Mesh(geometry, material);
	cube.position.x = -109;
	cube.position.z = 114;
	cube.name = "WayPoint";
	window.NarrowSDK.Scene.add(cube);
	//window.NarrowSDK.Scene.autoUpdate = true;

	window.NarrowSDK.Scene.autoUpdate = true;

	const wingGeometry = new THREE.BoxGeometry(0.05, 0.5, 0.3);
	const wingMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });

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
		requestAnimationFrame(onFrame.bind(this));

		let player = GetLocalPlayerModel();
		if (player !== undefined) {
			const meshWorldPosition = player.position;

			const offsetPosition = offset.clone().applyQuaternion(player.quaternion);
			const groupPosition = meshWorldPosition.add(offsetPosition);

			wingsGroup.position.copy(groupPosition);
			wingsGroup.rotation.copy(player.rotation);
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
			settingsBtn = window.NarrowSDK.NarrowUI.CreateMenu("static/img/menuUI/settings.svg", "Extra", StgCallback);
		}
	}

	onFrame();
});