// ==UserScript==
// @name         CSSreloader
// @namespace    DuKaT
// @version      0.6
// @description  That allows you to reload all the CSS files of any site or local HTML file without you have to reload the page itself. Just press F8.
// @author       DuKaT
// @include      file:///*
// @include      http://*/*
// @include      https://*/*
// @grant        none
// ==/UserScript==

(function() {
	'use strict';

	// @see https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/keyCode
	const reloadKeyCode = 119; // F8

	const CSSReloader = function() {

		function reload() {
			const reloader = 'cssreloader=' + Date.now();

			[].forEach.call(document.querySelectorAll('link[rel="stylesheet"][href]'), function(element) {
				const href = element.href.replace(/[\?\&]cssreloader=\d+$/, '');
				element.href = href + (href.indexOf('?') === -1 ? '?' : '&') + reloader;
			});
		}

		return { reload };

	}();

	document.addEventListener('keyup', (e) => {
		if (e.keyCode === reloadKeyCode) {
			CSSReloader.reload();
		}
	});

})();