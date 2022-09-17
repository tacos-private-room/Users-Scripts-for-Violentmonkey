// ==UserScript==
// @name			Anti Disabler For All
// @description		禁用各种网页限制，包含右键，复制，选择文字。
// @namespace   b8a2c97204b09fc19cf99340f5fae276
// @include			*
// @exclude			http*://mail.google.com/*
// @exclude			http://maps.google.com/*
// @author			ejin
// @version			2013.09.08
// ==/UserScript==

function restore(){
with (document.wrappedJSObject || document) {
onmouseup = null;
onmousedown = null;
oncontextmenu = null;

// *
onselectstart = null
onbeforecopy = null
onkeydown = null
onkeydown = null

}

// *
void(document.body.onmouseup='');
void(document.body.onselectstart='');
void(document.body.onmouseup='');
void(document.body.oncopy='');

var arAllElements = document.getElementsByTagName('*');
for (var i = arAllElements.length - 1; i >= 0; i--) {
var elmOne = arAllElements[i];
with (elmOne.wrappedJSObject || elmOne) {
onmouseup = null;
onmousedown = null;
}
}
}

window.addEventListener('load',restore,true);

function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

addGlobalStyle("html, * {-moz-user-select:text!important;}");