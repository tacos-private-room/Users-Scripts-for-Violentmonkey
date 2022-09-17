// ==UserScript==
// @name               Unlock Website Limit
// @name:zh-TW         解鎖網頁事件
// @namespace          https://github.snkms.com/
// @version            0.7
// @description        Unlock website events, including right click, selection lock, copy and cut, etc.
// @description:zh-TW  使用Javascript解除部分網頁事件，包括鎖右鍵、鎖複製等等
// @author             SN-Koarashi (5026)
// @match              *://*/*
// @grant              none
// @require            https://code.jquery.com/jquery-3.5.1.min.js
// @supportURL         https://www.facebook.com/smileopwe/
// @license            MIT
// ==/UserScript==

(function() {
    'use strict';

    var $ = window.jQuery;
    function unBlockFunc(a) {
        var onData = "on" + a;
        if (window.addEventListener) {
            window.addEventListener(a, function(e) {
                for (var n = e.originalTarget; n; n = n.parentNode) n[onData] = null;
            }, true);
        }
        window[onData] = null;
        document[onData] = null;
        if (document.documentElement) document.documentElement[onData] = null;
        if (document.body) document.body[onData] = null;
        document.body.oncopy = null;
    }
    function ObjectLength( object ) {
        var length = 0;
        for( var key in object ) {
            if( object.hasOwnProperty(key) ) {
                length++;
            }
        }
        return length;
    };
    $(function() {
        var hookEvents = {
            0:"contextmenu",
            1:"click",
            2:"mousedown",
            3:"mouseup",
            4:"keydown",
            5:"keyup",
            6:"selectstart",
            7:"select",
            8:"copy",
            9:"cut",
            10:"dragstart"
        };
        for(var i = 0;i <= ObjectLength(hookEvents);i++){
            unBlockFunc(hookEvents[i]);
        }

        var css = document.createElement("style");
        var style = document.createTextNode("*{-ms-user-select: auto !important;-moz-user-select: auto !important;-webkit-user-select: auto !important;user-select: auto !important;}");

        css.appendChild(style);
        document.body.appendChild(css);
    });
})();