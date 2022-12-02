// ==UserScript==
// @name         Enable All Tags
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Enables all elements on a web page
// @author       Anthony Littlewood
// @include      *
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    var all = document.getElementsByTagName("*");
    for (var i=0, max=all.length; i < max; i++) {
        all[i].disabled = false;
    }
})();