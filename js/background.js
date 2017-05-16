'use strict';

let Background = (function() {
	let _status = JSON.parse(localStorage._status || "{}"),
		_data = null;

	let init = () => {
		chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
			switch(request.from) {
				case "popup":
					if (request.action == "start") {
						AmazonOrders.start();
					} else if (request.action == "stop") {
						AmazonOrders.stop();
					}
					break;

				case "content":
					if (request.action == "status") {
						sendResponse({
							started: JSON.parse(localStorage._started || "false")
						});
					} else if (request.action == "orders") {
						AmazonOrders.save(request.data);
						sendResponse({
							started: JSON.parse(localStorage._started || "false")
						});
					}
					break;

				default:
					console.log("Unknown message arrived.");
					break;
			}
		});
	};

	return {
		init: init
	};
})();

(function(window, jQuery) {
	Background.init();
})(window, $);