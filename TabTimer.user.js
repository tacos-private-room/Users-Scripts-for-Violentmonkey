// ==UserScript==
// @name        标签计时 
// @name:en     TabTimer 
// @namespace   https://greasyfork.org/zh-CN/scripts/422523-%E6%A0%87%E7%AD%BE%E8%AE%A1%E6%97%B6/code
// @match       *://*/*
// @grant       none
// @version     1.0
// @author      neysummer2000
// @description    在标签上显示页面打开后经过的时间
// @description:en Show the time spent since the page was opened on the tab
// ==/UserScript==

(function(){
  
  var _lastURL = location.href;
  var _title = document.title;
  var _sec = 0;
  setInterval(() => {
    if(_lastURL != location.href){
      _lastURL = location.href;
      let arr = document.title.split(' | ');
      _title = arr.length > 1 ? arr[1] : arr[0];
      _sec = 0;
    }else{
      document.title = getTimeString(++_sec) + _title;
    }
  }, 1000);

 

  function getTimeString(s){
    function _s(s, j = ''){
      s = parseInt(s);
      return (s == 0 ? '' : (s<10 ? '0'+s : s) + j);
    }

    function _s1(s, j = '', d = ''){
      s = parseInt(s);
      return s<10 ? '0'+s : s;
    }
    
      s = Number(s);
      var h = 0, m = 0;
      if(s >= 3600){
          h = parseInt(s / 3600);
          s %= 3600;
      }
      if(s >= 60){
          m = parseInt(s / 60);
          s %= 60;
      }
      return '['+_s(h, ':')+_s(m, ':')+_s1(s, '')+'] | ';
  }

})();
