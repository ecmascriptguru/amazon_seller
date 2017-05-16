'use strict';

let Content = (function() {
    let _status = JSON.parse(localStorage._status || "{}"),
        something = null;

    let parseOrders = () => {
        console.log("Parsing should be started here.");
        alert("Hey");
    };

    let init = () => {
        chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
            if (request.from == "background" && request.action == "start") {
                parseOrders();
            }
        });
    };

    return {
        init: init,
        parse: parseOrders
    }
})();

(function(window, jQuery) {
    chrome.runtime.sendMessage({
        from: "content",
        action: "status"
    }, (response) => {
        Content.init();
        if (response.started) {
            Content.parse();
        }
    })
})(window, $);