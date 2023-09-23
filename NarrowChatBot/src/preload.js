const { ipcRenderer, contextBridge } = require('electron')
const Store = require('electron-store');

const store = new Store();

function SettingsSet(key, value) { store.set(key, value); }
function SettingsGet(key) { return store.get(key); }

function SendSync(sync, args) { // access to ipc sendsync functions functions
    return ipcRenderer.sendSync(sync, args);
}

let dirname = ipcRenderer.sendSync("client-dirname");

contextBridge.exposeInMainWorld("electronApi", {
    SettingsSet,
    SettingsGet,
    SendSync,
    dirname
});

if (!window.cheatLoaded) {
    window.cheatLoaded = true;

    async function InjectProps() {
        let backgroundScript = document.createElement("script");
        backgroundScript.innerHTML = ipcRenderer.sendSync("client-getfile", "/background.js");

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