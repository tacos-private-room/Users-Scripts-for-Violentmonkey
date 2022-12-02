// ==UserScript==
// @name         Allow Clipboard Operations
// @namespace    https://greasyfork.org/en/users/85671-jcunews
// @version      1.0.1
// @license      AGPLv3
// @author       jcunews
// @description  Prevent websites from disallowing users to perform clipboard copy, cut, or paste operations. For allowing right-click browser context menu, use the "Prevent Right-Click Context Menu Hijaak" script (https://greasyfork.org/en/scripts/387540-prevent-right-click-context-menu-hijaak).
// @match        *://*/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

ClipboardEvent.prototype.preventDefault = () => {};
