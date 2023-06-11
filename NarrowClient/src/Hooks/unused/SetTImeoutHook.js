// bad idea cuz it moves them all to the main thread the nodejs electron app uses
let origSetTimeout = window.setTimeout;
window.setTimeout = function (callback, timeout) {
	console.log(timeout); // 1500
	origSetTimeout.call(this, callback, timeout);
}