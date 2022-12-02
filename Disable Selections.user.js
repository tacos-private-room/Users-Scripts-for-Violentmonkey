// ==UserScript==
// @name        Disable Selections
// @namespace   tag: utils
// @description Disable selections for ALL websites
// @author      Unbroken
// @match       *://*/*
// @version     1.00
// @grant       none
// ==/UserScript==
(function() {
    var disableSelections = function() {
        document.getSelection = window.getSelection = function() {
            return { isCollapsed: true };
        };
    };
    var script = document.createElement ("script");
    script.appendChild (document.createTextNode ("(" + disableSelections + ")();"));
    (document.body || document.head || document.documentElement).appendChild (script);
})();