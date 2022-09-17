// ==UserScript==
// @name          Backspace goes back
// @include       *
// @description   Backspace key = "go back" as it was before Chrome 52
// @version       1.1.0
// @author        wOxxOm
// @namespace     wOxxOm.scripts
// @license       MIT License
// @run-at        document-start
// ==/UserScript==

document.addEventListener('keyup', e => {
  if (e.which !== 8 || e.altKey || e.shiftKey || e.metaKey || e.ctrlKey) {
    return;
  }
  let el = document;
  while (el && (el = el.activeElement)) {
    if (el.isContentEditable ||
        el.localName == 'input' &&
          /^(text|color|date*|email|month|number|password|range|search|tel|time|url|week)$/.test(el.type) ||
        el.localName == 'textarea') {
      return;
    }
    el = el.shadowRoot;
  }
  history.back();
  e.preventDefault();
});
