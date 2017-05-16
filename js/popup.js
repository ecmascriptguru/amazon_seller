'use strict';

let Popup = (function() {
	let _status = JSON.parse(localStorage._status || "{}"),
		_started = JSON.parse(localStorage._started || "false"),
		_panelStart = $("#start-panel"),
		_panelStop = $("#stop-panel"),
		_btnStart = $("#start"),
		_btnStop = $("#stop");

	let showStartPanel = () => {
		_panelStart.show();
		_panelStop.hide();
	};

	let showStopPanel = () => {
		_panelStart.hide();
		_panelStop.show();
	};

	let init = () => {
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