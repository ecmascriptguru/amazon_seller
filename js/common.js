'use strict';

let AmazonOrders = (function() {
    let _status = JSON.parse(localStorage._status || "{}"),
        _started = JSON.parse(localStorage._started || "false"),
        _orders = JSON.parse(localStorage._orders || "[]");

    let removeTab = (tabId, callback) => {
        chrome.tabs.query({}, function(tabs) {
            let tabIdArray = tabs.map((tab) => tab.id);
            if (tabId && tabIdArray.indexOf(tabId) > -1) {
                chrome.tabs.remove(tabId, () => {
                    if (typeof callback === "function") {
                        callback();
                    }
                });
            } else {
                if (typeof callback === "function") {
                    callback();
                }
            }
        })
    };

    let saveOrders = (orders) => {
        let savedOrders = JSON.parse(localStorage._orders || "[]");
        let count = JSON.parse(localStorage._count || "50");
        savedOrders = savedOrders.concat(orders);

        if (savedOrders.length > count) {
            exportToCSV(savedOrders.slice(0, count));
            savedOrders = savedOrders.slice(count);
        }
        localStorage._orders = JSON.stringify(savedOrders);
    }

    let start = () => {
        localStorage._started = JSON.stringify(true);
        chrome.tabs.query({active: true}, (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id, {
                from: "background",
                action: "start"
            }, (response) => {
                console.log(response);
            });
        })
    };

    let stop = () => {
        localStorage._started = JSON.stringify(false);
    }

    let downloadPlaintext = (data, filename) => {
        let blob = new Blob([data], { type: "text/plain" });

        let el = document.createElement("a")
        el.href = URL.createObjectURL(blob)
        el.download = filename
        document.body.appendChild(el)
        el.click()
        document.body.removeChild(el)
    };

    let exportToCSV = (orders) => {
        let toLine = arr => arr.map(x => `"${(x + "").replace(/"/g, '""')}"`).join(",");
        let content = [toLine(["#", "Customer ID", "Order ID"])];
        let prefix = "amazon_orders_";
        let exportedCount = JSON.parse(localStorage._exportedCount || "0") + 1;
        localStorage._exportedCount = JSON.stringify(exportedCount);

        for (let i = 0; i < orders.length; i ++) {
            content.push(toLine([(i + 1), orders[i].customer, orders[i].order]));
        }
        
        if (content.length > 1) {
            downloadPlaintext(content.join("\n"), `${prefix}_${exportedCount}.csv`);
        }
    };

    let init = () => {
    };

    return {
        init: init,
        start: start,
        stop: stop,
        save: saveOrders
    };
})();