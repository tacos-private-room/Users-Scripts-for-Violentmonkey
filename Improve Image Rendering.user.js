// ==UserScript==
// @name         Improve Image Rendering
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  ""
// @author       Eva1ent
// @match        *
// @grant        none
// ==/UserScript==

;(function(d) {
  'use strict'
  d.body.style.imageRendering = "-webkit-optimize-contrast"
})(document)
