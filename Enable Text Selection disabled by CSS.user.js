// ==UserScript==
// @name        Enable Text Selection disabled by CSS
// @namespace   Enable Text Selection disabled by user-select css property
// @description Enable Text Selection disabled by user-select css property.
// @author      SMed79
// @version     1.0
// @icon        http://i.imgur.com/qLZWVRC.png
// @twitterURL  https://twitter.com/SMed79
// @run-at      document-start
// @include     http://*
// @include     https://*
// @grant       GM_addStyle
// ==/UserScript==

GM_addStyle ( "                            \
  * {                                      \
  user-select: text !important;            \
 -moz-user-select: text !important;        \
 -ms-user-select: text !important;         \
 -khtml-user-select: text !important;      \
 -o-user-select: text !important;          \
 -webkit-user-select: text !important;     \
 -webkit-touch-callout: text !important;   \
   }                                       \
 " );
