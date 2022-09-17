// ==UserScript==
// @name         Better FPS Everywhere In Your Browser!
// @namespace    Better FPS Everywhere In Your Browser!
// @version      none
// @description  It doesnt have any toggles, everything is simple: you use it - it auto runs and makes you fps better.
// @author       Nexo#9141
// @match        *://*/*
// @require      http://code.jquery.com/jquery-3.3.1.min.js
// @grant        none
// ==/UserScript==

setInterval(function() {
    window.location.native_resolution = true;
    window.devicePixelRatio = 0.2;
}, 1000)