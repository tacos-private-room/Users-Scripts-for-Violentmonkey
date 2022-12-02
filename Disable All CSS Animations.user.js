// ==UserScript==
// @name Disable All CSS Animations
// @namespace url(http://www.w3.org/1999/xhtml);
// @version 1.0.0
// @description Disable all CSS animations.
// @license unlicense
// @grant GM_addStyle
// @run-at document-start
// ==/UserScript==

(function() {
let css = "";
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  let styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
