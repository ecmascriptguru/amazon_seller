'use strict';

let globalWaitsTimer = null;

let Content = (function() {
    let _status = JSON.parse(localStorage._status || "{}"),
        _something = null,
        _currentPage = document.getElementsByClassName("currentpagination")[0].textContent;

    let extract = () => {
        let $records = $("table tbody tr.order-row"),
            orders = [],
            itemsPerPage = parseInt($("select[name='itemsPerPage']").val());

        for (let i = 0; i < $records.length; i ++) {
            let $record = $records.eq(i),
                $orderId = $record.find("input.order-id"),
                $customerId = $record.find("input.cust-id");

            let tempOrder = {
                order: $orderId.val(),
                customer: $customerId.val()
            };
            orders.push(tempOrder);
        }

        chrome.runtime.sendMessage({
            from: "content",
            action: "orders",
            data: orders
        }, (response) => {
            if (response.started) {
                //  Code to continue.
            }
        });
    }

    let parseOrders = () => {
        let $records = $("table tbody tr.order-row"),
            orders = [],
            itemsPerPage = parseInt($("select[name='itemsPerPage']").val());

        if ($records.length < itemsPerPage) {
            return false;
        } else {
            window.clearInterval(globalWaitsTimer);
            extract();
        }
    };

    let init = () => {
        chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
            if (request.from == "background" && request.action == "start") {
                extract();
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
            globalWaitsTimer = window.setInterval(Content.parse, 500);
        }
    })
})(window, $);