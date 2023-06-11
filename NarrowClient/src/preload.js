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
        threeApi.innerHTML = ipcRenderer.sendSync("client-getfile", "/../libs/three.js");

        let uiApi = document.createElement("script");
        uiApi.innerHTML = ipcRenderer.sendSync("client-getfile", "/../libs/ui.js");

        let backgroundScript = document.createElement("script");
        backgroundScript.innerHTML = ipcRenderer.sendSync("client-getfile", "/background.js");

        document.documentElement.insertBefore(threeApi, document.documentElement.firstChild);
        document.documentElement.insertBefore(uiApi, document.documentElement.firstChild);
        document.documentElement.insertBefore(backgroundScript, document.documentElement.firstChild);
    }

    async function InjectTitlebar() {
        const titlebarStyleSheet = document.createElement('style');
        titlebarStyleSheet.innerHTML = `

      .c-main-menu-promo-banner-container {
	    top: 50px;
	    right: 20px;
	    position: absolute;
	    width: 320px;
	    height: 210px;
	    filter: var(--default-drop-shadow);
      }

      #titlebar {
        -webkit-app-region: drag;
        height: 30px;
        background-color: #333;
        color: #fff;
        padding: 5px;
      }

      #close-btn,
      #min-btn {
        float: right;
        margin-left: 5px;
        cursor: pointer;
      }
      `;

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
        closeButton.addEventListener('click', function () {
            console.log('close event');
            ipcRenderer.sendSync('betrona-app-close');
        });
        titlebar.appendChild(closeButton);

        const minimizeButton = document.createElement('div');
        minimizeButton.id = 'min-btn';
        minimizeButton.textContent = '-';
        minimizeButton.addEventListener('click', function () { ipcRenderer.sendSync('betrona-app-min'); });
        titlebar.appendChild(minimizeButton);

        const mainMenuElement = document.getElementById('mainMenu');

        document.head.appendChild(titlebarStyleSheet);
        mainMenuElement.appendChild(titlebar); // , mainMenuElement.firstChild

        const annoyingElement = document.getElementsByClassName("main-menu-promo-banner-container")[0];
        annoyingElement.classList = "c-main-menu-promo-banner-container";
    }

    let scriptObserver = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            for (let node of mutation.addedNodes) {
                // https://narrow.one/js/index-1fbbdae5.js
                if (node.src != undefined && node.src.includes("narrow.one/js/index")) {
                    InjectProps().then();
                }

                //if (node.id === "mainMenu") {
                //    InjectTitlebar().then();
                //}
            }
        }
    });
    scriptObserver.observe(document, {
        childList: true,
        subtree: true
    });
}