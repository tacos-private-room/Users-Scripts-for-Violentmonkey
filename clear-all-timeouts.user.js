// ==UserScript==
// @name         clear-all-timeouts
// @namespace    https://github.com/ahuanguchi
// @version      1.1.1
// @description  Clear all timeouts after the page loads. Useful for sites that rely on timeouts to penalize AdBlock users (a common anti-AdBlock technique).
// @author       ahuanguchi
// @match        *://*/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

window.addEventListener("load", function () {
  var hostName = document.location.hostname;
  if (!document.getElementsByClassName("cf-browser-verification").length &&
      hostName !== "www.google.com" &&
      hostName !== "disqus.com") {
    var i;
    var latestId = setTimeout(function () {});
    for (i = 0; i < latestId; i += 1) {
      clearTimeout(i);
    }
    console.info("Cleared timeouts.");
  }
});
