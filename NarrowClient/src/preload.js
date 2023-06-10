const { ipcRenderer, contextBridge } = require('electron')
const Store = require('electron-store');

const store = new Store();

function SettingsSet(key, value) { store.set(key, value); }
function SettingsGet(key) { return store.get(key); }

let dirname = ipcRenderer.sendSync("client-dirname");

contextBridge.exposeInMainWorld("electronApi", {
    SettingsSet,
    SettingsGet,
    dirname
});

if (!window.cheatLoaded) {
    window.cheatLoaded = true;

    async function InjectProps() {
        let threeApi = document.createElement("script");
        threeApi.innerHTML = ipcRenderer.sendSync("client-getthree");

        let uiApi = document.createElement("script");
        uiApi.innerHTML = ipcRenderer.sendSync("client-getui");

        let backgroundScript = document.createElement("script");
        backgroundScript.innerHTML = ipcRenderer.sendSync("client-getbackground");

        document.documentElement.insertBefore(threeApi, document.documentElement.firstChild);
        document.documentElement.insertBefore(uiApi, document.documentElement.firstChild);
        document.documentElement.insertBefore(backgroundScript, document.documentElement.firstChild);
    }

    async function InjectTitlebar() {
        const titlebar = document.createElement('div');
        titlebar.id = 'titlebar';
        titlebar.style.webkitAppRegion = 'drag';
        titlebar.style.backgroundColor = '#333';
        titlebar.style.color = '#fff';
        titlebar.style.height = '30px';
        titlebar.style.lineHeight = '30px';
        titlebar.style.padding = '0 10px';

        const titleText = document.createElement('span');
        titleText.textContent = 'Betrona Client';
        titlebar.appendChild(titleText);

        const closeButton = document.createElement('div');
        closeButton.id = 'close-btn';
        closeButton.textContent = 'X';
        closeButton.style.cursor = 'pointer';
        closeButton.style.float = 'right';
        closeButton.style.marginLeft = '10px';
        closeButton.addEventListener('click', function () { ipcRenderer.sendSync('betrona-app-close'); });
        titlebar.appendChild(closeButton);

        const minimizeButton = document.createElement('div');
        minimizeButton.id = 'min-btn';
        minimizeButton.textContent = '-';
        minimizeButton.style.cursor = 'pointer';
        minimizeButton.style.float = 'right';
        minimizeButton.style.marginLeft = '10px';
        minimizeButton.addEventListener('click', function () { ipcRenderer.sendSync('betrona-app-min'); });
        titlebar.appendChild(minimizeButton);

        const mainMenuElement = document.getElementById('mainMenu');

        mainMenuElement.appendChild(titlebar); // , mainMenuElement.firstChild
    }

    let scriptObserver = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            for (let node of mutation.addedNodes) {
                // https://narrow.one/js/index-1fbbdae5.js
                if (node.src != undefined && node.src.includes("narrow.one/js/index")) {
                    InjectProps().then();
                }

                if (node.id === "mainMenu") {
                    InjectTitlebar().then();
                }
            }
        }
    });
    scriptObserver.observe(document, {
        childList: true,
        subtree: true
    });
}