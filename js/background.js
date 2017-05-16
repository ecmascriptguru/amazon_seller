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
						if (request.next) {
							chrome.tabs.update(sender.tab.id, {url: request.next});
						} else {
							AmazonOrders.stop();
						}
					}
					break;

				default:
					console.log("Unknown message arrived.");
					break;
			}
		});

		chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
			if (tab && tab.url.indexOf("https://sellercentral.amazon.com/gp/orders-v2/list") == 0) {
				chrome.pageAction.show(tabId);
			}
		});

		chrome.runtime.onInstalled.addListener((detail) => {
			chrome.tabs.query({url: "https://sellercentral.amazon.com/gp/orders-v2/list*"}, (tabs) => {
				tabs.map((tab) => {
					chrome.tabs.reload(tab.id, {bypassCache: true});
				});
			});
		});
	};

	return {
		init: init
	};
})();

(function(window, jQuery) {
	Background.init();
})(window, $);