const { ipcRenderer } = require('electron')

if (!window.cheatLoaded) {
    window.cheatLoaded = true;

    async function InjectProps() {
        let backgroundScript = document.createElement("script");
        backgroundScript.innerHTML = ipcRenderer.sendSync("client-getbackground");

        let nuiApi = document.createElement("script");
        nuiApi.innerHTML = ipcRenderer.sendSync("client-getnui");

        let threeApi = document.createElement("script");
        threeApi.innerHTML = ipcRenderer.sendSync("client-getthree");

        let indexScript = document.createElement("script");
        indexScript.innerHTML = ipcRenderer.sendSync("client-getindex");

        document.documentElement.insertBefore(backgroundScript, document.documentElement.firstChild);
        document.documentElement.insertBefore(nuiApi, document.documentElement.firstChild);
        document.documentElement.insertBefore(threeApi, document.documentElement.firstChild);
        document.documentElement.insertBefore(indexScript, document.documentElement.firstChild);
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