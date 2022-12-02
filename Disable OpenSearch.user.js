// ==UserScript==
// @name         Disable OpenSearch
// @namespace    Disable OpenSearch
// @version      1.0
// @description  Remove the OpenSearch <link> tag to prevent Google Chrome from auto-adding custom search engines.
// @author       Snie
// @match        http*://*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
var elOpenSearch = document.querySelector('[type="application/opensearchdescription+xml"]');
if (elOpenSearch) elOpenSearch.remove();
})();