'use strict';

let Content = (function() {
    let _status = JSON.parse(localStorage._status || "{}"),
        something = null;

    let init = () => {
        //
    };

    return {
        init: init
    }
})();

(function(window, jQuery) {
    Content.init();
})(window, $);