// ==UserScript==
// @name               deAMP
// @description        AMP sucks, thus no AMP thanks.
// @author             Jason Kwok
// @namespace          https://jasonhk.dev/
// @version            1.0.0
// @license            MIT
// @match              http*://*/*
// @run-at             document_end
// @grant              none
// ==/UserScript==

const isAmp = (document.querySelector("html[⚡], html[amp]") !== null);
const canonical = document.head.querySelector("link[rel=canonical][href]");

if (isAmp && (canonical !== null))
{
    const lastVisit = sessionStorage.getItem("deAmp.lastVisit");

    if (location.href !== lastVisit)
    {
        sessionStorage.setItem("deAmp.lastVisit", location.href);
        location.replace(canonical.href);
    }
    else
    {
        sessionStorage.removeItem("deAmp.lastVisit");
    }
}
else
{
    console.debug("[deAMP] Not a valid AMP page.");
    sessionStorage.removeItem("deAmp.lastVisit");
}
