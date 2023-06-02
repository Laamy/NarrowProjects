const { app, BrowserWindow, ipcMain, session, globalShortcut, clipboard } = require('electron');
const shortcuts = require('electron-localshortcut');
const Store = require('electron-store');
const fs = require('fs');
const path = require('path');

Store.initRenderer();

const settings = new Store();

ipcMain.on('client-getbackground', (event) => {
	fs.readFile(__dirname + '/injected/background.js', 'utf8', (err, data) => {
		if (err) {
			console.error(err);
			return;
		}

		event.returnValue = data
	});
});

ipcMain.on('client-getthree', (event) => {
	fs.readFile(__dirname + '/../libs/three.js', 'utf8', (err, data) => {
		if (err) {
			console.error(err);
			return;
		}

		event.returnValue = data
	});
});

ipcMain.on('client-getui', (event) => {
	fs.readFile(__dirname + '/../libs/ui.js', 'utf8', (err, data) => {
		if (err) {
			console.error(err);
			return;
		}

		event.returnValue = data
	});
});

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
	//mainWindow.removeMenu();

	mainWindow.loadURL("https://narrow.one/");

	//????
	shortcuts.register(mainWindow, 'F11', () => {
		mainWindow.setFullScreen(!mainWindow.isFullScreen());
	});

	shortcuts.register(mainWindow, 'F6', () => mainWindow.loadURL(clipboard.readText()));
	shortcuts.register(mainWindow, 'F5', () => mainWindow.reload());
});

app.on('window-all-closed', () => app.quit());

app.on('activate', () => {
	if (BrowserWindow.getAllWindows().length === 0) {
		createWindow();
	}
});