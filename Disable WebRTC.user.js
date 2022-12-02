// ==UserScript==
// @name         Disable WebRTC
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Disable WebRTC for all web site
// @author       292695903@qq.com
// @include     	http://*
// @include			https://*
// @grant        none
// @run-at			document-start
// ==/UserScript==

(function() {
    'use strict'
    navigator.getUserMedia = undefined
    window.MediaStreamTrack = undefined
    window.RTCPeerConnection = undefined
    window.RTCSessionDescription = undefined
    //
    navigator.mozGetUserMedia = undefined
    window.mozMediaStreamTrack = undefined
    window.mozRTCPeerConnection = undefined
    window.mozRTCSessionDescription = undefined
    //
    navigator.webkitGetUserMedia = undefined
    window.webkitMediaStreamTrack = undefined
    window.webkitRTCPeerConnection = undefined
    window.webkitRTCSessionDescription = undefined
})();