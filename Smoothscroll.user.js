// ==UserScript==
// @name Smoothscroll
// @author       Creec Winceptor
// @description  Smooth scrolling on pages using javascript
// @namespace https://greasyfork.org/users/3167
// @include     *
// @version 10.1
// ==/UserScript==

var Smoothscroll = {};


//settings
Smoothscroll.Smoothness = 0.5;
Smoothscroll.Acceleration = 0.5;


//debug
Smoothscroll.Debug = 0; //0-none, 1-some, etc.
//autodetected
Smoothscroll.Refreshrate = 30; //initial fps, no need to change

//scrolling and animation
function ScrollSubpixels(element, newvalue)
{
  if (newvalue!=undefined)
  {
    element.scrollsubpixels = newvalue;
    return newvalue;
  }
	else
  {
    var olddelta = element.scrollsubpixels;
    if (olddelta!=undefined)
    {
      return olddelta;
    }
    return 0;
  }
}
function ScrollPixels(element, newvalue)
{
  if (newvalue!=undefined)
  {
    element.scrollpixels = newvalue;
    
    ScrollSubpixels(element, 0);
    
    return newvalue;
  }
	else
  {
    var olddelta = element.scrollpixels;
    if (olddelta!=undefined)
    {
      return olddelta;
    }
    return 0;
  }
}

var last = 0;
function AnimateScroll(target, now) {
  var scrollsubpixels = ScrollSubpixels(target);
  var scrollpixels = ScrollPixels(target);

  if (Smoothscroll.Debug>3) {
    console.log("scrollpixels: " + scrollpixels);
  }
  
  if (Smoothscroll.Debug>3) {
    console.log("target: ", target);
    
    if (target == document.documentElement) {
      console.log("document.documentElement");
    }
  }

  var scrolldirection = 0;
  if (scrollpixels>0) {
    scrolldirection = 1;
  }
  if (scrollpixels<0) {
    scrolldirection = -1;
  }

  var scrollratio = 1-Math.pow( Smoothscroll.Refreshrate, -1/(Smoothscroll.Refreshrate*Smoothscroll.Smoothness));
  
  var scrollrate = scrollpixels*scrollratio;
  
  if (Math.abs(scrollpixels)>2) {
    
    var fullscrolls = Math.floor(Math.abs(scrollrate))*scrolldirection;
    var scrollsubpixelsadded = scrollrate - fullscrolls;

    var additionalscrolls = Math.floor(Math.abs(scrollsubpixels + scrollsubpixelsadded))*scrolldirection;
    var scrollsubpixelsleft = scrollsubpixels + scrollsubpixelsadded - additionalscrolls;

    ScrollPixels(target, scrollpixels-fullscrolls-additionalscrolls);
    ScrollSubpixels(target, scrollsubpixelsleft);
	
    var scrolldelta = fullscrolls + additionalscrolls;  
    if (Smoothscroll.Debug>1) {
      console.log("scrolldelta: " + scrolldelta);
    }
/*
      if (target.scrollBy != null) {
            target.scrollBy({
                top: scrolldelta,
                left: 0,
                behavior: 'auto'
            });


          if (Smoothscroll.Debug>1) {
              console.log("target.scrollBy: " + scrolldelta);
          }
        } else {
        */
      target.style.scrollBehavior="auto"; // fix for pages with changed scroll-behavior
      target.scrollTop = target.scrollTop + scrolldelta;


      if (Smoothscroll.Debug>1) {
          console.log("target.scrollTop: " + target.scrollTop);
      }

	target.scrollanimated = true;
	window.requestAnimationFrame(function() {
      AnimateScroll(target);
    });
  } else
  {
	window.requestAnimationFrame(function() {
		ScrollPixels(target, 0);
    });
    target.scrollanimated = false;
  }
}

Smoothscroll.Stop = function(target) {
	if (target) {
		ScrollPixels(target, 0);
	}
}
Smoothscroll.Start = function(target, scrollamount) {
	if (target) {
        var scrolltotal = ScrollPixels(target, scrollamount);
        if (!target.scrollanimated) {
            AnimateScroll(target);
        }

		//var scrollpixels = ScrollPixels(target);

	}
}

if (typeof module !== 'undefined') {
	module.exports = Smoothscroll;
}


function CanScroll(element, dir) {

  
  if (dir<0)
	{
	  return element.scrollTop>0;
	}
	if (dir>0)
	{
    if (element==document.body) {
      
      if (element.scrollTop==0) {
        element.scrollTop = 3;
        if (element.scrollTop==0) {
          return false;
        }
        element.scrollTop = 0;
      }
      
      return Math.round(element.clientHeight+element.scrollTop)<(element.offsetHeight);
    } 
		return Math.round(element.clientHeight+element.scrollTop)<(element.scrollHeight);
	}
}
function HasScrollbar(element)
{
  //TODO: problem with webkit, body not scrollable?
  if (element==window || element==document) {
    return false;
  }
  
  if (element==document.body) {
    return window.getComputedStyle(document.body)['overflow-y']!="hidden";
  }  
  
  //THANK YOU TO: https://tylercipriani.com/blog/2014/07/12/crossbrowser-javascript-scrollbar-detection/
  if (element==document.documentElement) {
    return window.innerWidth > document.documentElement.clientWidth;
  } else {
    //return (element.clientWidth-element.clientWidth)>0;
    var style = window.getComputedStyle(element);
    return style['overflow-y']!="hidden" && style['overflow-y']!="visible";
  }

}

function Scrollable(element, dir)
{
  //TODO: problem with webkit, body not scrollable?
  if (element==document.body) {
    //return false;
  }  
  
  var scrollablecheck = CanScroll(element, dir);
  if (!scrollablecheck) {  
    if (Smoothscroll.Debug>1) {
      console.log("scrollablecheck: " + scrollablecheck);
    }
    return false;
  }  
  
  var scrollbarcheck = HasScrollbar(element);
  if (!scrollbarcheck) {
    if (Smoothscroll.Debug>1) {
      console.log("scrollbarcheck: " + scrollbarcheck);
    }
    return false;
  }  

  if (Smoothscroll.Debug>1) {
    console.log("scrollablecheck: " + scrollablecheck);
    console.log("scrollbarcheck: " + scrollbarcheck);
  }
	return true;
}
function GetPath(e) {
  if (e.path) {
    return e.path;
  }
  if (e.composedPath) {
    return e.composedPath();
  }
  if (Smoothscroll.Debug>1) {
    console.log("Smoothscroll: e.path is undefined");
  }
  return null;
}

function GetTarget(e) {
  var direction = e.deltaY;
  var nodes = GetPath(e);
  if (!nodes) {
    return null;
  }
  
  if (Smoothscroll.Debug>2) {
    console.log("nodes: ");
    console.log(nodes);
  
    console.log("target: ");
  }
  
  for (var i=0; i<(nodes.length); i++) { 
    var node = nodes[i];
    
    if (Smoothscroll.Debug>2) {
      console.log(node);
    }
    
    if (Scrollable(node, direction))
    {
      if (Smoothscroll.Debug>2) {
        console.log("true");
        
      }
      return node;
    }
    
   
  }
  if (Smoothscroll.Debug>1) {
    console.log("false");

  }

  return null;
}

function GetStyleProperty(el, styleprop){
	if(window.getComputedStyle){
		var heightprop = document.defaultView.getComputedStyle(el, null).getPropertyValue(styleprop);
    if (heightprop) {
      return parseInt(heightprop);
    }
	}
	else if(el.currentStyle){
		var heightprop = el.currentStyle[styleprop.encamel()];
    if (heightprop) {
      return parseInt(heightprop);
    }
	}
	return null;
}

//mouse event scroll handlers
function StopScroll(e) {
  var nodes = GetPath(e);
  if (!nodes) {
    return null;
  }

  for (var i=0; i<(nodes.length); i++) { 
    var node = nodes[i];
    
    Smoothscroll.Stop(node);
  }
}
function StartScroll(e, target) {

  if (e.defaultPrevented)
  {
    return true;
  }
  else
  {
	  var delta = e.deltaY;
      if (Smoothscroll.Debug) {
          console.log("e: ", e);
      }

    if (e.deltaMode && e.deltaMode==1) {
      var line = GetStyleProperty(target, 'line-height');
        if (Smoothscroll.Debug) {
            console.log("line: " + line);
        }
      if (line && line>0) {
        delta = e.deltaY * line;
      }
    }

    if (e.deltaMode && e.deltaMode==2) {
      var page = target.clientHeight;
        if (Smoothscroll.Debug) {
            console.log("page: " + page);
        }
      if (page && page>0) {
        delta = e.deltaY * page;
      }
    }

    var scrollpixels = ScrollPixels(target);

    var accelerationratio = Math.sqrt(Math.abs(scrollpixels/delta*Smoothscroll.Acceleration));

    var acceleration = Math.round(delta*accelerationratio);

    var totalscroll = scrollpixels + delta + acceleration;
      if (Smoothscroll.Debug) {
          console.log("scrollpixels: " + scrollpixels);
          console.log("delta: " + delta);
          console.log("acceleration: " + acceleration);
          console.log("totalscroll: " + totalscroll);
      }

    Smoothscroll.Start(target, totalscroll);

    e.preventDefault();
  }
}

//mouse event call handlers
function WheelEvent(e) {
  var target = GetTarget(e);

  if (target) {
    StartScroll(e, target);
  }
}
function ClickEvent(e) {
  StopScroll(e);
}

var now0 = null;
function Fps(now) {
	if (now0 != null) {
		Smoothscroll.Refreshrate = 1000 / (now - now0);
	}
	now0 = now;

	window.requestAnimationFrame(Fps);
};

//init function
function Init()
{

  if (window.top != window.self) {
    //console.log("Smoothscroll: ignoring iframe");
    return null;
  }
  if (window.Smoothscroll && window.Smoothscroll.Loaded) {
    //console.log("Smoothscroll: already loaded");
    return null;
  }

	if (!window.requestAnimationFrame) {
		window.requestAnimationFrame =
			window.mozRequestAnimationFrame ||
			window.webkitRequestAnimationFrame;
	}

  document.documentElement.addEventListener("wheel", function(e){
    WheelEvent(e);
    
    if (Smoothscroll.Debug>0) {
      console.log(e);
    }
  },{ passive: false });

  document.documentElement.addEventListener("mousedown", function(e){
    ClickEvent(e);
    
    if (Smoothscroll.Debug>0) {
      console.log(e);
    }
  });
  
  window.Smoothscroll = Smoothscroll;
  window.Smoothscroll.Loaded = true;
  
	window.requestAnimationFrame(Fps);
  
  console.log("Smoothscroll: loaded");
}
Init();
