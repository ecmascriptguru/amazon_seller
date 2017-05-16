'use strict';

let ManageOrders = (function() {
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
    }

    let downloadPlaintext = (data, filename) => {
        let blob = new Blob([data], { type: "text/plain" })

        let el = document.createElement("a")
        el.href = URL.createObjectURL(blob)
        el.download = filename
        document.body.appendChild(el)
        el.click()
        document.body.removeChild(el)
    }

    let exportToCSV = (leads) => {
        let toLine = arr => arr.map(x => `"${(x + "").replace(/"/g, '""')}"`).join(",");
        let content = [toLine(["#", "Customer ID", "Order ID"])];
        let status = JSON.parse(localStorage._status || "{}")
        let prefix = JSON.parse(localStorage._prefix || "null") || (status.location + "_" + status.state);
        prefix = templateToFileName(prefix);
        let exportedCount = JSON.parse(localStorage._exportedCount || "0") + 1;
        localStorage._exportedCount = JSON.stringify(exportedCount);

        for (let i = 0; i < leads.length; i ++) {
            content.push(toLine([leads[i].name, leads[i].email]));
        }
        
        if (content.length > 1) {
            downloadPlaintext(content.join("\n"), `${prefix}_${exportedCount}.csv`);
        }
    }

    let init = () => {
    };

    return {
        init: init
    };
})();