'use strict';

let Popup = (function() {
	let _status = JSON.parse(localStorage._status || "{}"),
		_started = JSON.parse(localStorage._started || "false"),
		_count = JSON.parse(localStorage._count || "100"),
		_panelStart = $("#start-panel"),
		_panelStop = $("#stop-panel"),
		_btnStart = $("#start"),
		_btnStop = $("#stop"),
		_selectCount = $("#count");

	let showStartPanel = () => {
		_panelStart.show();
		_panelStop.hide();
	};

	let showStopPanel = () => {
		_panelStart.hide();
		_panelStop.show();
	};

	let start = () => {
		chrome.runtime.sendMessage({
            from: "popup",
            action: "start"
        }, (response) => {
            console.log(response);
        });
		showStopPanel();
	}

	let stop = () => {
		showStartPanel();
	}

	let initializeComponents = () => {
		_selectCount.val(_count);
		_btnStart.click(start);
		_btnStop.click(stop);
		_selectCount.change((event) => {
			localStorage._count = JSON.stringify(parseInt(event.target.value));
		});
	};

	let init = () => {
		initializeComponents();
		if (_started) {
			showStopPanel();
		} else {
			showStartPanel();
		}
	};

	return {
		init: init
	}
})();

(function(window, jQuery) {
    Popup.init();
})(window, $);