// define our squad chat utilities
NarrowSDK.SquadNetwork = {
    // game filter directly from js/index-hash.js found in html/body/module
	bannedWords: ["anal", "anus", "arse", "ballsack", "balls", "bitch", "biatch", "blowjob", "boner", "boob", "butt", "clitoris", "cock", "cunt", "damn", "dick", "dildo", "faggot", "fuck", "homo", "jew", "jizz", "nigger", "nigga", "penis", "piss", "poop", "pussy", "queer", "slut", "twat", "vagina", "whore"]
};

// define our replacemethods function that should be called once per page load
NarrowSDK.SquadNetwork.ReplaceMethods = function() {
    // hook then customize the send chat message function so we can avoid the filter
    let sendChatMsg = NarrowSDK.Main.network.sendChatMessage;
    NarrowSDK.Main.network.sendChatMessage = function (msg) {
        let modifiedMsg = msg;

        // loop over all the games filtered words
        for (let i = 0; i < NarrowSDK.SquadNetwork.bannedWords.length; i++) {
            let bannedWord = NarrowSDK.SquadNetwork.bannedWords[i];

            // check if message contains word
            if (modifiedMsg.includes(bannedWord)) {
                let invisibleChar = String.fromCharCode(8203); // Invisible character
                let modifiedWord = bannedWord.split('').join(invisibleChar); // modified word with invisible characters between each letter

                // replace with modified banned word that has inivisible characters inbetween each letter
                modifiedMsg = modifiedMsg.replace(bannedWord, modifiedWord);
            }
        }

        // post modified message
        sendChatMsg.call(this, modifiedMsg);
    }

    // log hook event to console
    console.log("[NetworkManager.prototype.sendChatMessage, SendChatMessage] Successfully enabled");
}