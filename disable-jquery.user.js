// ==UserScript==
// @name         disable-jquery
// @namespace    https://github.com/ahuanguchi
// @version      1.0.1
// @description  Disable jQuery after the page loads. Useful for sites that rely on jQuery to penalize AdBlock users.
// @author       ahuanguchi
// @match        *://*/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

window.addEventListener("load", function () {
  if (window.hasOwnProperty("$")) {
    window.$ = null;
  }
  if (window.hasOwnProperty("jQuery")) {
    window.jQuery = null;
  }
});
