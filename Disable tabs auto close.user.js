// ==UserScript==
// @name                Disable tabs auto close
// @name:zh-CN          禁止标签页自动关闭
// @namespace           https://greasyfork.org/zh-CN/users/193133-pana
// @homepage            https://www.sailboatweb.com
// @version             1.0.0
// @description         Disable tabs auto close event.
// @description:zh-CN   禁止标签页自动关闭的事件。
// @author              pana
// @license             GNU General Public License v3.0 or later
// @match               *://*/*
// @grant               none
// @noframes
// ==/UserScript==

(function () {
  'use strict';

  window.close = () => {
    console.warn('disabled window.close()');
  };
})();
