const { app, BrowserWindow, ipcMain, session, globalShortcut, clipboard } = require('electron');
const shortcuts = require('electron-localshortcut');
const Store = require('electron-store');
const fs = require('fs');
const path = require('path');

const settings = new Store();

// script stuff
ipcMain.on('client-dirname', (event) => event.returnValue = __dirname);

ipcMain.on('client-getfile', (event, filePath) => {
	fs.readFile(__dirname + filePath, 'utf8', (err, data) => {
		if (err) {
			console.error(err);
			return;
		}

		event.returnValue = data;
	});
});

// titlebar stuff
ipcMain.on('betrona-app-close', (event) => {
	app.quit();
	process.exit(0);
});

ipcMain.on('betrona-app-min', (event) => win.minimize());

if (settings.get("vsync") === false) {
	app.commandLine.appendSwitch('disable-frame-rate-limit');
	app.commandLine.appendSwitch('disable-gpu-vsync');
}

app.commandLine.appendSwitch('ignore-gpu-blacklist');
app.allowRendererProcessReuse = true;

let mainWindow;

app.on('ready', () => {
	const appSession = session.defaultSession;

	appSession.webRequest.onBeforeRequest((details, callback) => {
		const { method, url } = details;

		let cancelled = false;

		if (url.includes("poki.com") &&
			(settings.get("adblock") === undefined || settings.get("adblock") === true)) {
			cancelled = true;
		}

		callback({ cancel: cancelled });
	});

	mainWindow = new BrowserWindow({
		width: 960,
		height: 800,
		webPreferences: {
			preload: path.join(__dirname, 'preload.js'),
			nodeIntegration: true,
			enableRemoteModule: false,
			webSecurity: false
		},
		//frame: false,
		title: `Betrona Client`,
		icon: __dirname + '/assets/build/icon.ico',
		backgroundColor: '#121212FF'
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