const { ipcRenderer, contextBridge } = require('electron')
const Store = require('electron-store');

const store = new Store();

function SettingsSet(key, value) { store.set(key, value); }
function SettingsGet(key) { return store.get(key); }

contextBridge.exposeInMainWorld("electronApi", {
    SettingsSet,
    SettingsGet
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

    let scriptObserver = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            for (let node of mutation.addedNodes) {
                // https://narrow.one/js/index-1fbbdae5.js
                if (node.src != undefined && node.src.includes("narrow.one/js/index")) {
                    InjectProps().then();
                }
            }
        }
    });
    scriptObserver.observe(document, {
        childList: true,
        subtree: true
    });
}