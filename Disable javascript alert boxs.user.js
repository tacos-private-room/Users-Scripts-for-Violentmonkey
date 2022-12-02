// ==UserScript==
// @name        Disable javascript alert boxs
// @namespace   Disable javascript alert boxs
// @description A simple userscript that defeats and disable the javascript alert boxes
// @author      SMed79
// @version     1.0
// @icon        http://i.imgur.com/EMCvngV.png
// @run-at      document-start
// @include     http://*
// @include     https://*
// @grant       none
// ==/UserScript==

window.alert_ = window.alert;
window.alert = function(a) {
    console.log.call(this, a);
}

setTimeout(function() {
    window.alert = window.alert_;
    delete window.alert_;
}, 5000);
