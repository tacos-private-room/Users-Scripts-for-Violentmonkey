// ==UserScript==
// @name       π₯π₯π₯ζζ¬ιδΈ­ε€εΆ(ιη¨)π₯π₯π₯
// @name:en    Text Copy Universal
// @name:zh-CN π₯π₯π₯ζζ¬ιδΈ­ε€εΆ(ιη¨)π₯π₯π₯
// @description       ζζ¬ιδΈ­ε€εΆιη¨ηζ¬οΌιη¨δΊε€§ε€ζ°η½η«
// @description:en    Text copy general version, suitable for most websites.
// @description:zh-CN ζζ¬ιδΈ­ε€εΆιη¨ηζ¬οΌιη¨δΊε€§ε€ζ°η½η«
// @namespace  https://github.com/WindrunnerMax/TKScript
// @version    1.0.3
// @author     Czy
// @match      http://*/*
// @match      https://*/*
// @supportURL https://github.com/WindrunnerMax/TKScript/issues
// @license    GPL License
// @run-at     document-start
// @grant      GM_registerMenuCommand
// @grant      GM_unregisterMenuCommand
// @grant      GM_notification
// ==/UserScript==
(function () {
    'use strict';

    var utils = {
        insertCSS: function (id, css) {
            var style = document.createElement("style");
            style.id = id;
            style.innerHTML = css;
            var head = document.getElementsByTagName("head")[0];
            if (head) {
                head.appendChild(style);
            }
            else {
                window.onload = function () { return document.getElementsByTagName("head")[0].appendChild(style); };
            }
        },
        removeCSS: function (id) {
            document.getElementsByTagName("head")[0].removeChild(document.getElementById(id));
        },
    };

    var BUTTON_STATUS;
    (function (BUTTON_STATUS) {
        BUTTON_STATUS[BUTTON_STATUS["OPEN"] = 0] = "OPEN";
        BUTTON_STATUS[BUTTON_STATUS["CLOSE"] = 1] = "CLOSE";
    })(BUTTON_STATUS || (BUTTON_STATUS = {}));
    var STORAGE_VALUE = {
        OPEN: "true",
        CLOSE: "false",
    };
    var STORAGE_KEY_PREFIX = "copy-currency--";
    var stopNativePropagation = function (event) { return event.stopPropagation(); };
    var controllerMapper = [
        {
            status: BUTTON_STATUS.CLOSE,
            storageKey: "selectstart-and-copy",
            openName: "β ε―ε¨θ§£ι€ε€εΆιεΆ",
            closeName: "β ε³ι­θ§£ι€ε€εΆιεΆ",
            openFunction: function () {
                document.addEventListener("selectstart", stopNativePropagation, true);
                document.addEventListener("copy", stopNativePropagation, true);
                utils.insertCSS(STORAGE_KEY_PREFIX + "selectstart-and-copy", "*{user-select: auto !important;-webkit-user-select: auto !important;}");
            },
            closeFunction: function () {
                document.removeEventListener("selectstart", stopNativePropagation, true);
                document.removeEventListener("copy", stopNativePropagation, true);
                utils.removeCSS(STORAGE_KEY_PREFIX + "selectstart-and-copy");
            },
        },
        {
            status: BUTTON_STATUS.CLOSE,
            storageKey: "contextmenu",
            openName: "β ε―ε¨θ§£ι€ε³ι?ιεΆ",
            closeName: "β ε³ι­θ§£ι€ε³ι?ιεΆ",
            openFunction: function () { return document.addEventListener("contextmenu", stopNativePropagation, true); },
            closeFunction: function () {
                return document.removeEventListener("contextmenu", stopNativePropagation, true);
            },
        },
        {
            status: BUTTON_STATUS.CLOSE,
            storageKey: "keydown",
            openName: "β ε―ε¨θ§£ι€ι?ηιεΆ",
            closeName: "β ε³ι­θ§£ι€ι?ηιεΆ",
            openFunction: function () { return document.addEventListener("keydown", stopNativePropagation, true); },
            closeFunction: function () { return document.removeEventListener("keydown", stopNativePropagation, true); },
        },
    ];
    var menuIds = [];
    var switchFunctions = [];
    var batchUpdateButtons = function () {
        controllerMapper.forEach(function (item, index) {
            GM_unregisterMenuCommand(menuIds[index]);
            if (item.status === BUTTON_STATUS.OPEN) {
                menuIds[index] = GM_registerMenuCommand(item.closeName, switchFunctions[index]);
            }
            else {
                menuIds[index] = GM_registerMenuCommand(item.openName, switchFunctions[index]);
            }
        });
    };
    (function () {
        controllerMapper.forEach(function (item) {
            var localHookInfo = localStorage.getItem(STORAGE_KEY_PREFIX + item.storageKey);
            var switchButtonStatus = function () {
                if (item.status === BUTTON_STATUS.OPEN) {
                    item.status = BUTTON_STATUS.CLOSE;
                    item.closeFunction();
                    localStorage.setItem(STORAGE_KEY_PREFIX + item.storageKey, STORAGE_VALUE.CLOSE);
                }
                else {
                    item.status = BUTTON_STATUS.OPEN;
                    item.openFunction();
                    localStorage.setItem(STORAGE_KEY_PREFIX + item.storageKey, STORAGE_VALUE.OPEN);
                }
                batchUpdateButtons();
            };
            switchFunctions.push(switchButtonStatus);
            if (localHookInfo === STORAGE_VALUE.OPEN) {
                item.status = BUTTON_STATUS.OPEN;
                item.openFunction();
            }
            else {
                item.status = BUTTON_STATUS.CLOSE;
            }
        });
        batchUpdateButtons();
    })();

})();
