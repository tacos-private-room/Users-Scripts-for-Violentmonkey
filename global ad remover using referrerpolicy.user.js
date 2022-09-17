// ==UserScript==
// @name         global ad remover using referrerpolicy
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  removes ads routed over the current domain (identified using referrerpolicy=unsafe-url)
// @author       cabtv
// @match        https://*/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    function addGlobalStyle(css) {
        var head, style;
        head = document.getElementsByTagName('head')[0];
        if (!head) { return; }
        style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        head.appendChild(style);
    }

    addGlobalStyle('[referrerpolicy="unsafe-url"] { display: none !important; }');
})();