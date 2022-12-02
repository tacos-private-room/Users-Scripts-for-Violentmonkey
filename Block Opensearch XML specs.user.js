// ==UserScript==
// @name       Block Opensearch XML specs
// @namespace  *
// @version    0.3.2
// @description  Block opensearch xml links
// @match      http://*/*
// @match      https://*/*
// @copyright  2012+, Christian Huang
// ==/UserScript==

var i;
var val;
var len;
var opensearches;

opensearches = document.getElementsByTagName('link');
len = opensearches.length;
for (i = 0; i < len;i++) {
    val = opensearches[i].type;
    if ( val == "application/opensearchdescription+xml") {
        opensearches[i].parentNode.removeChild(opensearches[i]);
    }
}