// esversion: 6
// ==UserScript==
// @name         Disable autoplay and visiblity API
// @namespace    https://www.androidacy.com/
// @version      0.7.2
// @description  Block autoplay and pagevisibility events
// @author       Androidacy
// @include      http://*
// @include      https://*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';
    // For debugging, run localStorage.setItem('_daua_debug', 'true') in your console
    const debug = localStorage.getItem('_daua_debug')
    // Intercept all focus events
    for (let i of ["blur", "focus", "visibilitychange", "webkitvisiblitychange"]) {
        if (debug) {
            console.debug("Nooping " + i + " events");
        }
        window.addEventListener(i, function(event) {
            event.stopImmediatePropagation();
            console.debug("Stopped " + i + " from triggering");
        }, true);
    }
    // Disable autoplay
    let x = document.querySelectorAll('video')
    for (let i of x) {
        i.removeAttribute('autoplay');
        i.pause();
        i.origPlay = i.play;
        i.play = function () {};
        i.addEventListener("click", (evt) => {
            if (evt.isTrusted && !window._apun) {
                if (debug) {
                    console.debug("Unblocking play because user clicked on:");
                    console.debug(evt.target);
                }
                i.play = i.origPlay;
                i.play();
                window._apun = true
            }
        });
        i.parentNode.addEventListener("click", (evt) => {
            if (evt.isTrusted && !window._apun) {
                if (debug) {
                    console.debug("Unblocking play because user clicked on:");
                    console.debug(evt.target);
                }
                i.play = i.origPlay;
                i.play();
                window._apun = true;
            }
        });
    }
})();