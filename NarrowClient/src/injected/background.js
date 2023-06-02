window.selected = 0;

window.addEventListener("load", function () {
	console.log(window.NarrowSDK);

	let settingsBtn = undefined;

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
		dialogTitle.textContent = "Extra Settings";
		dialogDiv.appendChild(dialogTitle);

		const settingsListDiv = document.createElement("div");
		settingsListDiv.className = "settings-list";
		dialogDiv.appendChild(settingsListDiv);

		const settingsGroupHeader = document.createElement("h3");
		settingsGroupHeader.className = "settings-group-header";
		settingsGroupHeader.textContent = "World Visuals";
		settingsListDiv.appendChild(settingsGroupHeader);

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
		});

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

	function onFrame() {
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

		if (settingsBtn === undefined) {
			settingsBtn = window.NarrowSDK.NarrowUI.CreateMenu("static/img/menuUI/settings.svg", "Extra", StgCallback);
		}

		requestAnimationFrame(onFrame.bind(this));
	}

	onFrame();
});