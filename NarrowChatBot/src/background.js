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

	window.adSkip = true;

	// set to false in public builds cuz I feel bad for making this in the first place lol..
	if (window.environment === "release") {
		window.adSkip = false;
	}

	// electron api stuff
	window.NarrowSDK = {};
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
Include("Hooks/RecieveFromServerHook.js");
Include("Hooks/MainInstanceHook.js");

function GetLocalPlayer() {
	let player = undefined;

	if (NarrowSDK.Main.gameManager.activeGame === null || NarrowSDK.Main.gameManager.activeGame.players === undefined) {
		return undefined;
	}

	return NarrowSDK.Main.gameManager.activeGame.getMyPlayer();
}

let lastJump = new Date().getTime();
let invert = false;

window.addEventListener("load", function () {
	if (window.NarrowSDK.Main === undefined) {
		console.log("Fatal error");
		location.reload();
	}

	console.log(window.NarrowSDK);

	setInterval(function () {
		let localPlayer = GetLocalPlayer();

		NarrowSDK.Main.vsyncLoop.call(NarrowSDK.Main);
		{ // vsync loop
			let t = performance.now();
			NarrowSDK.Main.useFakeNow && (t = NarrowSDK.Main.fakeNow, NarrowSDK.Main.fakeNow += 30);
			NarrowSDK.Main.prevNow <= 0 && (NarrowSDK.Main.prevNow = t);

			const e = t - NarrowSDK.Main.prevNow;

			if (0 == e)
				return;

			const i = Math.min(e, NarrowSDK.Main.maxDt);
			NarrowSDK.Main.prevNow = t;
			NarrowSDK.Main.now += i;
			t = NarrowSDK.Main.now;

			NarrowSDK.Main.mainMenu.loop(t, i);
			NarrowSDK.Main.input.loop(t, i);
			NarrowSDK.Main.gameManager.loop(t, i);
			NarrowSDK.Main.cam.loop(t, i);
			NarrowSDK.Main.screenFlash.loop(t);
		}

		if (localPlayer !== undefined && localPlayer !== null) {
			let player = localPlayer.obj;
			if (player !== undefined && player !== null) {
				if (localPlayer.playerName.includes("Bot") && new Date().getTime() - lastJump >= 1000) {
					NarrowSDK.Main.mainMenu.visible = false;
					NarrowSDK.Main.dialogManager.needsUnlockedPointer = false;

					if (invert) {
						NarrowSDK.Main.input.walkInput.x = 1;
					}
					else {
						NarrowSDK.Main.input.walkInput.x = -1;
					}

					invert = !invert;
					lastJump = new Date().getTime();
				}
			}
		}
	}, 1000 / 24);
});