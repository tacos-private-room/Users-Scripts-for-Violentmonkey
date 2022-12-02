// ==UserScript==
// @name         Disable Page Visibility API
// @namespace    https://www.kookxiang.com/
// @version      0.1
// @description  Disable HTML5 Page Visibility API to prevent website tracking you
// @author       kookxiang
// @match        https://*/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

document.addEventListener('visibilitychange', function (e) { e.stopImmediatePropagation(); }, true);

Object.defineProperty(document, 'visibilityState', { get: function () { return "visible"; } });
