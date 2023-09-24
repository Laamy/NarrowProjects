// just smth funky I made cuz i was bored

let ReceiveAction = {
	JOINED_GAME_ID: 0,
	CREATE_PLAYER: 1,
	DESTROY_PLAYER: 2,
	PLAYER_OWNERSHIP: 3,
	PLAYER_DATA: 4,
	CREATE_ARROW: 5,
	CHANGE_FLAG: 6,
	SCOREBOARD: 7,
	FLAG_POSITION: 8,
	PING: 9,
	PLAYER_PING_DATA: 10,
	GAME_END: 11,
	CLAIM_HIT_BY_ARROW: 12,
	DISCONNECT_REASON: 13,
	GAME_MAP_HASH: 14,
	PLAYER_PERFORM_ACTION: 15,
	PLAYER_NAME: 16,
	PLAYER_SCORES: 17,
	CHANGE_SELECTED_CLASS: 18,
	GAME_START: 19,
	SET_AUTOSHOOT_VALUE: 20,
	EQUIPPED_SKIN_DATA: 21,
	OFFSET_PLAYER_SCORE: 22,
	GAME_END_ACCOUNT_STATS: 23,
	GUEST_DATA_CHANGED: 24,
	PLAYER_TEAM_ID: 25,
	SAME_SQUAD_PLAYERS: 26,
	SQUAD_ID_RESPONSE: 27,
	SQUAD_JOIN_ERROR_RESPONSE: 28,
	REQUEST_MAP_HASH: 29,
	GAME_TIME: 30,
	PLAYER_NAME_VERIFIED: 31,
	GAME_SEED: 32,
	SET_PLAYER_HEALTH: 33,
	CHAT_MESSAGE: 34,
	SPAWN: 35,
	SAME_SQUAD_PLAYER_DATA: 36,
	ACTIVE_WEAPON_TYPE: 37,
	HIT_VALIDATION_DATA: 38,
	MELEE_HIT_PLAYER: 39,
	AVG_TEAM_ELO: 40,
	ARROW_HIT_PLAYER: 41,
	PLAYER_KILL_PLAYER: 42
};

function SendChatAsBot(msg) {
	NarrowSDK.Main.network.sendChatMessage("* " + msg);
}

EventTarget.prototype.addEventListener = new Proxy(EventTarget.prototype.addEventListener, {
	apply(target, thisArgs, args) {
		if (args[0] == "message") {
			let origFunc = args[1];
			args[1] = function (...hookArgs) {
				if (hookArgs[0].currentTarget.url !== undefined) {
					if (hookArgs[0].currentTarget.url.includes("narrow.one/ws")) {
						let packetBuffer = hookArgs[0].data;

						i = new Float32Array(packetBuffer, 0, Math.floor(packetBuffer.byteLength / 4));
						s = new Uint32Array(packetBuffer, 0, Math.floor(packetBuffer.byteLength / 4));
						n = new Int32Array(packetBuffer, 0, Math.floor(packetBuffer.byteLength / 4));
						a = new Uint16Array(packetBuffer, 0, Math.floor(packetBuffer.byteLength / 2));

						if (s[0] == ReceiveAction.CHAT_MESSAGE) {
							let msg = NarrowSDK.Utils.parseStringMessage(packetBuffer);
							if (msg) {
								const packet = JSON.parse(msg);
								const n = NarrowSDK.Main.gameManager.activeGame.chat.game.players.get(packet.data.playerId);
								//console.log(n.playerName + ": " + packet.data.message);
							}
						}
					}
				}
				origFunc.call(this, ...hookArgs);
			}
		}
		return Reflect.apply(...arguments);
	}
});