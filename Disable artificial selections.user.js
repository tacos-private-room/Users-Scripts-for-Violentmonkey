// ==UserScript==
// @name        Disable artificial selections
// @description Tries to prevent script-initiated selection tweaks.
// @namespace   http://eldar.cz/myf/
// @license     MIT
// @version     1.0.4
// @run-at      document-start
// @grant       none
// ==/UserScript==

Selection.prototype.addRange = function () {
	console.warn('This Selection method is deliberately disabled by user.');
}

HTMLTextAreaElement.prototype.select =
HTMLInputElement.prototype.select =
function(){
	console.warn('Forced artificial selection of',this,'value is deliberately disabled by user. Focusing instead.');
	this.focus();
}
