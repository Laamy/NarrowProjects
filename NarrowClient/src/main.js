const { app, BrowserWindow, ipcMain, session } = require('electron');
const fs = require('fs');
const path = require('path');

app.commandLine.appendSwitch('disable-frame-rate-limit');
app.commandLine.appendSwitch('disable-gpu-vsync');

app.on('ready', () => {
	const appSession = session.defaultSession;

	appSession.webRequest.onBeforeRequest((details, callback) => {
		const { method, url } = details;

		let cancelled = false;

		if (url.includes("poki.com")) {
			cancelled = true;
		}

		callback({ cancel: cancelled });
	});

	const mainWindow = new BrowserWindow({
		width: 800,
		height: 600,
		webPreferences: {
			preload: path.join(__dirname, 'preload.js'),
			nodeIntegration: true,
			enableRemoteModule: false,
			webSecurity: false
		},
	});
	mainWindow.removeMenu();

	mainWindow.loadURL("https://narrow.one/");
});

app.on('window-all-closed', () => app.quit());

app.on('activate', () => {
	if (BrowserWindow.getAllWindows().length === 0) {
		createWindow();
	}
});