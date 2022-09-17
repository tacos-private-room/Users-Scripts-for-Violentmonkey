// ==UserScript==
// @name        localstorage_spoofing
// @description  disable localstorage
// @namespace   http://userscripts.org/users/
// @include	http://*
// @include	https://*
// @version     0.1
// @run-at      document-start
// @grant	none
// ==/UserScript==

var mockStorage={
	length:0,
	clear:function (){},
	getItem:function (){return null;},
	key:function (){return null;},
	removeItem:function (){},
	setItem:function (){},
};

Object.defineProperty(unsafeWindow, 'localStorage', {
  get: function () {
    return mockStorage;
  }
});
