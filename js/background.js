'use strict';

let Background = (function() {
	let _status = JSON.parse(localStorage._status || "{}"),
		_data = null;

	let init = () => {
		chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
			switch(request.from) {
				case "popup":
					//	Something to do.
					break;

				case "amazon":
					//	something to do.
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