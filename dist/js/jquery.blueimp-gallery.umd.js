!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?module.exports=e(require("jquery")):"function"==typeof define&&define.amd?define(["jquery"],e):t["blueimp-gallery"]=e(t.$)}(this,function(t){"use strict";t=t&&t.hasOwnProperty("default")?t.default:t;function e(t,e){var i;for(i in e)e.hasOwnProperty(i)&&(t[i]=e[i]);return t}function i(t){if(!this||this.find!==i.prototype.find)return new i(t);if(this.length=0,t)if("string"==typeof t&&(t=this.find(t)),t.nodeType||t===t.window)this.length=1,this[0]=t;else{var e=t.length;for(this.length=e;e;)this[e-=1]=t[e]}}i.extend=e,i.contains=function(t,e){do{if((e=e.parentNode)===t)return!0}while(e);return!1},i.parseJSON=function(t){return window.JSON&&JSON.parse(t)},e(i.prototype,{find:function(t){var e=this[0]||document;return"string"==typeof t&&(t=e.querySelectorAll?e.querySelectorAll(t):"#"===t.charAt(0)?e.getElementById(t.slice(1)):e.getElementsByTagName(t)),new i(t)},hasClass:function(t){return!!this[0]&&new RegExp("(^|\\s+)"+t+"(\\s+|$)").test(this[0].className)},addClass:function(t){for(var e,i=this.length;i;){if(!(e=this[i-=1]).className)return e.className=t,this;if(this.hasClass(t))return this;e.className+=" "+t}return this},removeClass:function(t){for(var e,i=new RegExp("(^|\\s+)"+t+"(\\s+|$)"),s=this.length;s;)(e=this[s-=1]).className=e.className.replace(i," ");return this},on:function(t,e){for(var i,s,n=t.split(/\s+/);n.length;)for(t=n.shift(),i=this.length;i;)(s=this[i-=1]).addEventListener?s.addEventListener(t,e,!1):s.attachEvent&&s.attachEvent("on"+t,e);return this},off:function(t,e){for(var i,s,n=t.split(/\s+/);n.length;)for(t=n.shift(),i=this.length;i;)(s=this[i-=1]).removeEventListener?s.removeEventListener(t,e,!1):s.detachEvent&&s.detachEvent("on"+t,e);return this},empty:function(){for(var t,e=this.length;e;)for(t=this[e-=1];t.hasChildNodes();)t.removeChild(t.lastChild);return this},first:function(){return new i(this[0])}}),"undefined"!=typeof window&&(window.blueimp=window.blueimp||{},window.blueimp.helper=i);function s(t,e){return void 0===document.body.style.maxHeight?null:this&&this.options===s.prototype.options?void(t&&t.length?(this.list=t,this.num=t.length,this.initOptions(e),this.initialize()):this.console.log("blueimp Gallery: No or empty list provided as first argument.",t)):new s(t,e)}i.extend(s.prototype,{options:{container:"#blueimp-gallery",slidesContainer:"div",titleElement:"h3",displayClass:"blueimp-gallery-display",controlsClass:"blueimp-gallery-controls",singleClass:"blueimp-gallery-single",leftEdgeClass:"blueimp-gallery-left",rightEdgeClass:"blueimp-gallery-right",playingClass:"blueimp-gallery-playing",slideClass:"slide",slideLoadingClass:"slide-loading",slideErrorClass:"slide-error",slideContentClass:"slide-content",toggleClass:"toggle",prevClass:"prev",nextClass:"next",closeClass:"close",playPauseClass:"play-pause",typeProperty:"type",titleProperty:"title",urlProperty:"href",srcsetProperty:"urlset",displayTransition:!0,clearSlides:!0,stretchImages:!1,toggleControlsOnReturn:!0,toggleControlsOnSlideClick:!0,toggleSlideshowOnSpace:!0,enableKeyboardNavigation:!0,closeOnEscape:!0,closeOnSlideClick:!0,closeOnSwipeUpOrDown:!0,emulateTouchEvents:!0,stopTouchEventsPropagation:!1,hidePageScrollbars:!0,disableScroll:!0,carousel:!1,continuous:!0,unloadElements:!0,startSlideshow:!1,slideshowInterval:5e3,index:0,preloadRange:2,transitionSpeed:400,slideshowTransitionSpeed:void 0,event:void 0,onopen:void 0,onopened:void 0,onslide:void 0,onslideend:void 0,onslidecomplete:void 0,onclose:void 0,onclosed:void 0},carouselOptions:{hidePageScrollbars:!1,toggleControlsOnReturn:!1,toggleSlideshowOnSpace:!1,enableKeyboardNavigation:!1,closeOnEscape:!1,closeOnSlideClick:!1,closeOnSwipeUpOrDown:!1,disableScroll:!1,startSlideshow:!0},console:window.console&&"function"==typeof window.console.log?window.console:{log:function(){}},support:function(t){var e={touch:void 0!==window.ontouchstart||window.DocumentTouch&&document instanceof DocumentTouch},s={webkitTransition:{end:"webkitTransitionEnd",prefix:"-webkit-"},MozTransition:{end:"transitionend",prefix:"-moz-"},OTransition:{end:"otransitionend",prefix:"-o-"},transition:{end:"transitionend",prefix:""}};for(var n in s)if(s.hasOwnProperty(n)&&void 0!==t.style[n]){e.transition=s[n],e.transition.name=n;break}function o(){var i,s,n=e.transition;document.body.appendChild(t),n&&(i=n.name.slice(0,-9)+"ransform",void 0!==t.style[i]&&(t.style[i]="translateZ(0)",s=window.getComputedStyle(t).getPropertyValue(n.prefix+"transform"),e.transform={prefix:n.prefix,name:i,translate:!0,translateZ:!!s&&"none"!==s})),void 0!==t.style.backgroundSize&&(e.backgroundSize={},t.style.backgroundSize="contain",e.backgroundSize.contain="contain"===window.getComputedStyle(t).getPropertyValue("background-size"),t.style.backgroundSize="cover",e.backgroundSize.cover="cover"===window.getComputedStyle(t).getPropertyValue("background-size")),document.body.removeChild(t)}return document.body?o():i(document).on("DOMContentLoaded",o),e}(document.createElement("div")),requestAnimationFrame:window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame,cancelAnimationFrame:window.cancelAnimationFrame||window.webkitCancelRequestAnimationFrame||window.webkitCancelAnimationFrame||window.mozCancelAnimationFrame,initialize:function(){if(this.initStartIndex(),!1===this.initWidget())return!1;this.initEventListeners(),this.onslide(this.index),this.ontransitionend(),this.options.startSlideshow&&this.play()},slide:function(t,e){window.clearTimeout(this.timeout);var i,s,n,o=this.index;if(o!==t&&1!==this.num){if(e||(e=this.options.transitionSpeed),this.support.transform){for(this.options.continuous||(t=this.circle(t)),i=Math.abs(o-t)/(o-t),this.options.continuous&&(s=i,(i=-this.positions[this.circle(t)]/this.slideWidth)!==s&&(t=-i*this.num+t)),n=Math.abs(o-t)-1;n;)n-=1,this.move(this.circle((t>o?t:o)-n-1),this.slideWidth*i,0);t=this.circle(t),this.move(o,this.slideWidth*i,e),this.move(t,0,e),this.options.continuous&&this.move(this.circle(t-i),-this.slideWidth*i,0)}else t=this.circle(t),this.animate(o*-this.slideWidth,t*-this.slideWidth,e);this.onslide(t)}},getIndex:function(){return this.index},getNumber:function(){return this.num},prev:function(){(this.options.continuous||this.index)&&this.slide(this.index-1)},next:function(){(this.options.continuous||this.index<this.num-1)&&this.slide(this.index+1)},play:function(t){var e=this;window.clearTimeout(this.timeout),this.interval=t||this.options.slideshowInterval,this.elements[this.index]>1&&(this.timeout=this.setTimeout(!this.requestAnimationFrame&&this.slide||function(t,i){e.animationFrameId=e.requestAnimationFrame.call(window,function(){e.slide(t,i)})},[this.index+1,this.options.slideshowTransitionSpeed],this.interval)),this.container.addClass(this.options.playingClass)},pause:function(){window.clearTimeout(this.timeout),this.interval=null,this.cancelAnimationFrame&&(this.cancelAnimationFrame.call(window,this.animationFrameId),this.animationFrameId=null),this.container.removeClass(this.options.playingClass)},add:function(t){var e;for(t.concat||(t=Array.prototype.slice.call(t)),this.list.concat||(this.list=Array.prototype.slice.call(this.list)),this.list=this.list.concat(t),this.num=this.list.length,this.num>2&&null===this.options.continuous&&(this.options.continuous=!0,this.container.removeClass(this.options.leftEdgeClass)),this.container.removeClass(this.options.rightEdgeClass).removeClass(this.options.singleClass),e=this.num-t.length;e<this.num;e+=1)this.addSlide(e),this.positionSlide(e);this.positions.length=this.num,this.initSlides(!0)},resetSlides:function(){this.slidesContainer.empty(),this.unloadAllSlides(),this.slides=[]},handleClose:function(){var t=this.options;this.destroyEventListeners(),this.pause(),this.container[0].style.display="none",this.container.removeClass(t.displayClass).removeClass(t.singleClass).removeClass(t.leftEdgeClass).removeClass(t.rightEdgeClass),t.hidePageScrollbars&&(document.body.style.overflow=this.bodyOverflowStyle),this.options.clearSlides&&this.resetSlides(),this.options.onclosed&&this.options.onclosed.call(this)},close:function(){var t=this;this.options.onclose&&this.options.onclose.call(this),this.support.transition&&this.options.displayTransition?(this.container.on(this.support.transition.end,function e(i){i.target===t.container[0]&&(t.container.off(t.support.transition.end,e),t.handleClose())}),this.container.removeClass(this.options.displayClass)):this.handleClose()},circle:function(t){return(this.num+t%this.num)%this.num},move:function(t,e,i){this.translateX(t,e,i),this.positions[t]=e},translate:function(t,e,i,s){var n=this.slides[t].style,o=this.support.transition,a=this.support.transform;n[o.name+"Duration"]=s+"ms",n[a.name]="translate("+e+"px, "+i+"px)"+(a.translateZ?" translateZ(0)":"")},translateX:function(t,e,i){this.translate(t,e,0,i)},translateY:function(t,e,i){this.translate(t,0,e,i)},animate:function(t,e,i){if(i)var s=this,n=(new Date).getTime(),o=window.setInterval(function(){var a=(new Date).getTime()-n;if(a>i)return s.slidesContainer[0].style.left=e+"px",s.ontransitionend(),void window.clearInterval(o);s.slidesContainer[0].style.left=(e-t)*(Math.floor(a/i*100)/100)+t+"px"},4);else this.slidesContainer[0].style.left=e+"px"},preventDefault:function(t){t.preventDefault?t.preventDefault():t.returnValue=!1},stopPropagation:function(t){t.stopPropagation?t.stopPropagation():t.cancelBubble=!0},onresize:function(){this.initSlides(!0)},onmousedown:function(t){t.which&&1===t.which&&"VIDEO"!==t.target.nodeName&&(t.preventDefault(),(t.originalEvent||t).touches=[{pageX:t.pageX,pageY:t.pageY}],this.ontouchstart(t))},onmousemove:function(t){this.touchStart&&((t.originalEvent||t).touches=[{pageX:t.pageX,pageY:t.pageY}],this.ontouchmove(t))},onmouseup:function(t){this.touchStart&&(this.ontouchend(t),delete this.touchStart)},onmouseout:function(t){if(this.touchStart){var e=t.target,s=t.relatedTarget;s&&(s===e||i.contains(e,s))||this.onmouseup(t)}},ontouchstart:function(t){this.options.stopTouchEventsPropagation&&this.stopPropagation(t);var e=(t.originalEvent||t).touches[0];this.touchStart={x:e.pageX,y:e.pageY,time:Date.now()},this.isScrolling=void 0,this.touchDelta={}},ontouchmove:function(t){this.options.stopTouchEventsPropagation&&this.stopPropagation(t);var e,i,s=(t.originalEvent||t).touches[0],n=(t.originalEvent||t).scale,o=this.index;if(!(s.length>1||n&&1!==n))if(this.options.disableScroll&&t.preventDefault(),this.touchDelta={x:s.pageX-this.touchStart.x,y:s.pageY-this.touchStart.y},e=this.touchDelta.x,void 0===this.isScrolling&&(this.isScrolling=this.isScrolling||Math.abs(e)<Math.abs(this.touchDelta.y)),this.isScrolling)this.translateY(o,this.touchDelta.y+this.positions[o],0);else for(t.preventDefault(),window.clearTimeout(this.timeout),this.options.continuous?i=[this.circle(o+1),o,this.circle(o-1)]:(this.touchDelta.x=e/=!o&&e>0||o===this.num-1&&e<0?Math.abs(e)/this.slideWidth+1:1,i=[o],o&&i.push(o-1),o<this.num-1&&i.unshift(o+1));i.length;)o=i.pop(),this.translateX(o,e+this.positions[o],0)},ontouchend:function(t){this.options.stopTouchEventsPropagation&&this.stopPropagation(t);var e,i,s,n,o,a=this.index,r=this.options.transitionSpeed,l=this.slideWidth,h=Number(Date.now()-this.touchStart.time)<250,d=h&&Math.abs(this.touchDelta.x)>20||Math.abs(this.touchDelta.x)>l/2,c=!a&&this.touchDelta.x>0||a===this.num-1&&this.touchDelta.x<0,u=!d&&this.options.closeOnSwipeUpOrDown&&(h&&Math.abs(this.touchDelta.y)>20||Math.abs(this.touchDelta.y)>this.slideHeight/2);this.options.continuous&&(c=!1),e=this.touchDelta.x<0?-1:1,this.isScrolling?u?this.close():this.translateY(a,0,r):d&&!c?(i=a+e,s=a-e,n=l*e,o=-l*e,this.options.continuous?(this.move(this.circle(i),n,0),this.move(this.circle(a-2*e),o,0)):i>=0&&i<this.num&&this.move(i,n,0),this.move(a,this.positions[a]+n,r),this.move(this.circle(s),this.positions[this.circle(s)]+n,r),a=this.circle(s),this.onslide(a)):this.options.continuous?(this.move(this.circle(a-1),-l,r),this.move(a,0,r),this.move(this.circle(a+1),l,r)):(a&&this.move(a-1,-l,r),this.move(a,0,r),a<this.num-1&&this.move(a+1,l,r))},ontouchcancel:function(t){this.touchStart&&(this.ontouchend(t),delete this.touchStart)},ontransitionend:function(t){var e=this.slides[this.index];t&&e!==t.target||(this.interval&&this.play(),this.setTimeout(this.options.onslideend,[this.index,e]))},oncomplete:function(t){var e=t.target||t.srcElement,s=e&&e.parentNode;if(e&&s){var n=this.getNodeIndex(s);i(s).removeClass(this.options.slideLoadingClass),"error"===t.type?(i(s).addClass(this.options.slideErrorClass),this.elements[n]=3):this.elements[n]=2,e.clientHeight>this.container[0].clientHeight&&(e.style.maxHeight=this.container[0].clientHeight),this.interval&&this.slides[this.index]===s&&this.play(),this.setTimeout(this.options.onslidecomplete,[n,s])}},onload:function(t){this.oncomplete(t)},onerror:function(t){this.oncomplete(t)},onkeydown:function(t){switch(t.which||t.keyCode){case 13:this.options.toggleControlsOnReturn&&(this.preventDefault(t),this.toggleControls());break;case 27:this.options.closeOnEscape&&(this.close(),t.stopImmediatePropagation());break;case 32:this.options.toggleSlideshowOnSpace&&(this.preventDefault(t),this.toggleSlideshow());break;case 37:this.options.enableKeyboardNavigation&&(this.preventDefault(t),this.prev());break;case 39:this.options.enableKeyboardNavigation&&(this.preventDefault(t),this.next())}},handleClick:function(t){var e=this.options,s=t.target||t.srcElement,n=s.parentNode;function o(t){return i(s).hasClass(t)||i(n).hasClass(t)}o(e.toggleClass)?(this.preventDefault(t),this.toggleControls()):o(e.prevClass)?(this.preventDefault(t),this.prev()):o(e.nextClass)?(this.preventDefault(t),this.next()):o(e.closeClass)?(this.preventDefault(t),this.close()):o(e.playPauseClass)?(this.preventDefault(t),this.toggleSlideshow()):n===this.slidesContainer[0]?e.closeOnSlideClick?(this.preventDefault(t),this.close()):e.toggleControlsOnSlideClick&&(this.preventDefault(t),this.toggleControls()):n.parentNode&&n.parentNode===this.slidesContainer[0]&&e.toggleControlsOnSlideClick&&(this.preventDefault(t),this.toggleControls())},onclick:function(t){if(!(this.options.emulateTouchEvents&&this.touchDelta&&(Math.abs(this.touchDelta.x)>20||Math.abs(this.touchDelta.y)>20)))return this.handleClick(t);delete this.touchDelta},updateEdgeClasses:function(t){t?this.container.removeClass(this.options.leftEdgeClass):this.container.addClass(this.options.leftEdgeClass),t===this.num-1?this.container.addClass(this.options.rightEdgeClass):this.container.removeClass(this.options.rightEdgeClass)},handleSlide:function(t){this.options.continuous||this.updateEdgeClasses(t),this.loadElements(t),this.options.unloadElements&&this.unloadElements(t),this.setTitle(t)},onslide:function(t){this.index=t,this.handleSlide(t),this.setTimeout(this.options.onslide,[t,this.slides[t]])},setTitle:function(t){var e=this.slides[t].firstChild,i=e.title||e.alt,s=this.titleElement;s.length&&(this.titleElement.empty(),i&&s[0].appendChild(document.createTextNode(i)))},setTimeout:function(t,e,i){var s=this;return t&&window.setTimeout(function(){t.apply(s,e||[])},i||0)},imageFactory:function(t,e){var s,n,o,a=this,r=this.imagePrototype.cloneNode(!1),l=t,h=this.options.stretchImages;return"string"!=typeof l&&(l=this.getItemProperty(t,this.options.urlProperty),o=this.getItemProperty(t,this.options.titleProperty)),!0===h&&(h="contain"),(h=this.support.backgroundSize&&this.support.backgroundSize[h]&&h)?n=this.elementPrototype.cloneNode(!1):(n=r,r.draggable=!1),o&&(n.title=o),i(r).on("load error",function t(o){if(!s){if(o={type:o.type,target:n},!n.parentNode)return a.setTimeout(t,[o]);s=!0,i(r).off("load error",t),h&&"load"===o.type&&(n.style.background='url("'+l+'") center no-repeat',n.style.backgroundSize=h),e(o)}}),r.src=l,n},createElement:function(t,e){var s=t&&this.getItemProperty(t,this.options.typeProperty),n=s&&this[s.split("/")[0]+"Factory"]||this.imageFactory,o=t&&n.call(this,t,e),a=this.getItemProperty(t,this.options.srcsetProperty);return o||(o=this.elementPrototype.cloneNode(!1),this.setTimeout(e,[{type:"error",target:o}])),a&&o.setAttribute("srcset",a),i(o).addClass(this.options.slideContentClass),o},loadElement:function(t){this.elements[t]||(this.slides[t].firstChild?this.elements[t]=i(this.slides[t]).hasClass(this.options.slideErrorClass)?3:2:(this.elements[t]=1,i(this.slides[t]).addClass(this.options.slideLoadingClass),this.slides[t].appendChild(this.createElement(this.list[t],this.proxyListener))))},loadElements:function(t){var e,i=Math.min(this.num,2*this.options.preloadRange+1),s=t;for(e=0;e<i;e+=1)s+=e*(e%2==0?-1:1),s=this.circle(s),this.loadElement(s)},unloadElements:function(t){var e,i;for(e in this.elements)this.elements.hasOwnProperty(e)&&(i=Math.abs(t-e))>this.options.preloadRange&&i+this.options.preloadRange<this.num&&(this.unloadSlide(e),delete this.elements[e])},addSlide:function(t){var e=this.slidePrototype.cloneNode(!1);e.setAttribute("data-index",t),this.slidesContainer[0].appendChild(e),this.slides.push(e)},positionSlide:function(t){var e=this.slides[t];e.style.width=this.slideWidth+"px",this.support.transform&&(e.style.left=t*-this.slideWidth+"px",this.move(t,this.index>t?-this.slideWidth:this.index<t?this.slideWidth:0,0))},initSlides:function(t){var e,s;for(t||(this.positions=[],this.positions.length=this.num,this.elements={},this.imagePrototype=document.createElement("img"),this.elementPrototype=document.createElement("div"),this.slidePrototype=document.createElement("div"),i(this.slidePrototype).addClass(this.options.slideClass),this.slides=this.slidesContainer[0].children,e=this.options.clearSlides||this.slides.length!==this.num),this.slideWidth=this.container[0].offsetWidth,this.slideHeight=this.container[0].offsetHeight,this.slidesContainer[0].style.width=this.num*this.slideWidth+"px",e&&this.resetSlides(),s=0;s<this.num;s+=1)e&&this.addSlide(s),this.positionSlide(s);this.options.continuous&&this.support.transform&&(this.move(this.circle(this.index-1),-this.slideWidth,0),this.move(this.circle(this.index+1),this.slideWidth,0)),this.support.transform||(this.slidesContainer[0].style.left=this.index*-this.slideWidth+"px")},unloadSlide:function(t){var e,i;null!==(i=(e=this.slides[t]).firstChild)&&e.removeChild(i)},unloadAllSlides:function(){var t,e;for(t=0,e=this.slides.length;t<e;t++)this.unloadSlide(t)},toggleControls:function(){var t=this.options.controlsClass;this.container.hasClass(t)?this.container.removeClass(t):this.container.addClass(t)},toggleSlideshow:function(){this.interval?this.pause():this.play()},getNodeIndex:function(t){return parseInt(t.getAttribute("data-index"),10)},getNestedProperty:function(t,e){return e.replace(/\[(?:'([^']+)'|"([^"]+)"|(\d+))\]|(?:(?:^|\.)([^\.\[]+))/g,function(e,i,s,n,o){var a=o||i||s||n&&parseInt(n,10);e&&t&&(t=t[a])}),t},getDataProperty:function(t,e){var s,n;if(t.dataset?(s=e.replace(/-([a-z])/g,function(t,e){return e.toUpperCase()}),n=t.dataset[s]):t.getAttribute&&(n=t.getAttribute("data-"+e.replace(/([A-Z])/g,"-$1").toLowerCase())),"string"==typeof n){if(/^(true|false|null|-?\d+(\.\d+)?|\{[\s\S]*\}|\[[\s\S]*\])$/.test(n))try{return i.parseJSON(n)}catch(t){}return n}},getItemProperty:function(t,e){var i=this.getDataProperty(t,e);return void 0===i&&(i=t[e]),void 0===i&&(i=this.getNestedProperty(t,e)),i},initStartIndex:function(){var t=this.options.index,e=this.options.urlProperty;if(t&&"number"!=typeof t)for(var i=0;i<this.num;i+=1)if(this.list[i]===t||this.getItemProperty(this.list[i],e)===this.getItemProperty(t,e)){t=i;break}this.index=this.circle(parseInt(t,10)||0)},initEventListeners:function(){var t=this,e=this.slidesContainer;function s(e){var i=t.support.transition&&t.support.transition.end===e.type?"transitionend":e.type;t["on"+i](e)}i(window).on("resize",s),i(document.body).on("keydown",s),this.container.on("click",s),this.support.touch?e.on("touchstart touchmove touchend touchcancel",s):this.options.emulateTouchEvents&&this.support.transition&&e.on("mousedown mousemove mouseup mouseout",s),this.support.transition&&e.on(this.support.transition.end,s),this.proxyListener=s},destroyEventListeners:function(){var t=this.slidesContainer,e=this.proxyListener;i(window).off("resize",e),i(document.body).off("keydown",e),this.container.off("click",e),this.support.touch?t.off("touchstart touchmove touchend touchcancel",e):this.options.emulateTouchEvents&&this.support.transition&&t.off("mousedown mousemove mouseup mouseout",e),this.support.transition&&t.off(this.support.transition.end,e)},handleOpen:function(){this.options.onopened&&this.options.onopened.call(this)},initWidget:function(){var t=this;return this.container=i(this.options.container),this.container.length?(this.slidesContainer=this.container.find(this.options.slidesContainer).first(),this.slidesContainer.length?(this.titleElement=this.container.find(this.options.titleElement).first(),1===this.num&&this.container.addClass(this.options.singleClass),this.options.onopen&&this.options.onopen.call(this),this.support.transition&&this.options.displayTransition?this.container.on(this.support.transition.end,function e(i){i.target===t.container[0]&&(t.container.off(t.support.transition.end,e),t.handleOpen())}):this.handleOpen(),this.options.hidePageScrollbars&&(this.bodyOverflowStyle=document.body.style.overflow,document.body.style.overflow="hidden"),this.container[0].style.display="block",this.initSlides(),void this.container.addClass(this.options.displayClass)):(this.console.log("blueimp Gallery: Slides container not found.",this.options.slidesContainer),!1)):(this.console.log("blueimp Gallery: Widget container not found.",this.options.container),!1)},initOptions:function(t){this.options=i.extend({},this.options),(t&&t.carousel||this.options.carousel&&(!t||!1!==t.carousel))&&i.extend(this.options,this.carouselOptions),i.extend(this.options,t),this.num<3&&(this.options.continuous=!!this.options.continuous&&null),this.support.transition||(this.options.emulateTouchEvents=!1),this.options.event&&this.preventDefault(this.options.event)}}),i.extend(s.prototype.options,{fullScreen:!1});var n=s.prototype.initialize,o=s.prototype.close;i.extend(s.prototype,{getFullScreenElement:function(){return document.fullscreenElement||document.webkitFullscreenElement||document.mozFullScreenElement||document.msFullscreenElement},requestFullScreen:function(t){t.requestFullscreen?t.requestFullscreen():t.webkitRequestFullscreen?t.webkitRequestFullscreen():t.mozRequestFullScreen?t.mozRequestFullScreen():t.msRequestFullscreen&&t.msRequestFullscreen()},exitFullScreen:function(){document.exitFullscreen?document.exitFullscreen():document.webkitCancelFullScreen?document.webkitCancelFullScreen():document.mozCancelFullScreen?document.mozCancelFullScreen():document.msExitFullscreen&&document.msExitFullscreen()},initialize:function(){n.call(this),this.options.fullScreen&&!this.getFullScreenElement()&&this.requestFullScreen(this.container[0])},close:function(){this.getFullScreenElement()===this.container[0]&&this.exitFullScreen(),o.call(this)}}),i.extend(s.prototype.options,{indicatorContainer:"ol",activeIndicatorClass:"active",thumbnailProperty:"thumbnail",thumbnailIndicators:!0});var a=s.prototype.initSlides,r=s.prototype.addSlide,l=s.prototype.resetSlides,h=s.prototype.handleClick,d=s.prototype.handleSlide,c=s.prototype.handleClose;i.extend(s.prototype,{createIndicator:function(t){var e,s,n=this.indicatorPrototype.cloneNode(!1),o=this.getItemProperty(t,this.options.titleProperty),a=this.options.thumbnailProperty;return this.options.thumbnailIndicators&&(a&&(e=this.getItemProperty(t,a)),void 0===e&&(s=t.getElementsByTagName&&i(t).find("img")[0])&&(e=s.src),e&&(n.style.backgroundImage='url("'+e+'")')),o&&(n.title=o),n},addIndicator:function(t){if(this.indicatorContainer.length){var e=this.createIndicator(this.list[t]);e.setAttribute("data-index",t),this.indicatorContainer[0].appendChild(e),this.indicators.push(e)}},setActiveIndicator:function(t){this.indicators&&(this.activeIndicator&&this.activeIndicator.removeClass(this.options.activeIndicatorClass),this.activeIndicator=i(this.indicators[t]),this.activeIndicator.addClass(this.options.activeIndicatorClass))},initSlides:function(t){t||(this.indicatorContainer=this.container.find(this.options.indicatorContainer),this.indicatorContainer.length&&(this.indicatorPrototype=document.createElement("li"),this.indicators=this.indicatorContainer[0].children)),a.call(this,t)},addSlide:function(t){r.call(this,t),this.addIndicator(t)},resetSlides:function(){l.call(this),this.indicatorContainer.empty(),this.indicators=[]},handleClick:function(t){var e=t.target||t.srcElement,i=e.parentNode;if(i===this.indicatorContainer[0])this.preventDefault(t),this.slide(this.getNodeIndex(e));else{if(i.parentNode!==this.indicatorContainer[0])return h.call(this,t);this.preventDefault(t),this.slide(this.getNodeIndex(i))}},handleSlide:function(t){d.call(this,t),this.setActiveIndicator(t)},handleClose:function(){this.activeIndicator&&this.activeIndicator.removeClass(this.options.activeIndicatorClass),c.call(this)}}),i.extend(s.prototype.options,{videoContentClass:"video-content",videoLoadingClass:"video-loading",videoPlayingClass:"video-playing",videoPosterProperty:"poster",videoSourcesProperty:"sources"});var u=s.prototype.handleSlide;i.extend(s.prototype,{handleSlide:function(t){u.call(this,t),this.playingVideo&&this.playingVideo.pause()},videoFactory:function(t,e,s){var n,o,a,r,l,h=this,d=this.options,c=this.elementPrototype.cloneNode(!1),u=i(c),p=[{type:"error",target:c}],m=s||document.createElement("video"),y=this.getItemProperty(t,d.urlProperty),f=this.getItemProperty(t,d.typeProperty),g=this.getItemProperty(t,d.titleProperty),v=this.getItemProperty(t,d.videoPosterProperty),C=this.getItemProperty(t,d.videoSourcesProperty);if(u.addClass(d.videoContentClass),g&&(c.title=g),m.canPlayType)if(y&&f&&m.canPlayType(f))m.src=y;else if(C)for(;C.length;)if(o=C.shift(),y=this.getItemProperty(o,d.urlProperty),f=this.getItemProperty(o,d.typeProperty),y&&f&&m.canPlayType(f)){m.src=y;break}return v&&(m.poster=v,i(n=this.imagePrototype.cloneNode(!1)).addClass(d.toggleClass),n.src=v,n.draggable=!1,c.appendChild(n)),(a=document.createElement("a")).setAttribute("target","_blank"),s||a.setAttribute("download",g),a.href=y,m.src&&(m.controls=!0,(s||i(m)).on("error",function(){h.setTimeout(e,p)}).on("pause",function(){m.seeking||(r=!1,u.removeClass(h.options.videoLoadingClass).removeClass(h.options.videoPlayingClass),l&&h.container.addClass(h.options.controlsClass),delete h.playingVideo,h.interval&&h.play())}).on("playing",function(){r=!1,u.removeClass(h.options.videoLoadingClass).addClass(h.options.videoPlayingClass),h.container.hasClass(h.options.controlsClass)?(l=!0,h.container.removeClass(h.options.controlsClass)):l=!1}).on("play",function(){window.clearTimeout(h.timeout),r=!0,u.addClass(h.options.videoLoadingClass),h.playingVideo=m}),i(a).on("click",function(t){h.preventDefault(t),r?m.pause():m.play()}),c.appendChild(s&&s.element||m)),c.appendChild(a),this.setTimeout(e,[{type:"load",target:c}]),c}}),i.extend(s.prototype.options,{vimeoVideoIdProperty:"vimeo",vimeoPlayerUrl:"//player.vimeo.com/video/VIDEO_ID?api=1&player_id=PLAYER_ID",vimeoPlayerIdPrefix:"vimeo-player-",vimeoClickToPlay:!0});var p=s.prototype.textFactory||s.prototype.imageFactory,m=0,y=function(t,e,i,s){this.url=t,this.videoId=e,this.playerId=i,this.clickToPlay=s,this.element=document.createElement("div"),this.listeners={}};i.extend(y.prototype,{canPlayType:function(){return!0},on:function(t,e){return this.listeners[t]=e,this},loadAPI:function(){var t,e,s=this,n="//f.vimeocdn.com/js/froogaloop2.min.js",o=document.getElementsByTagName("script"),a=o.length;function r(){!e&&s.playOnReady&&s.play(),e=!0}for(;a;)if(o[a-=1].src===n){t=o[a];break}t||((t=document.createElement("script")).src=n),i(t).on("load",r),o[0].parentNode.insertBefore(t,o[0]),/loaded|complete/.test(t.readyState)&&r()},onReady:function(){var t=this;this.ready=!0,this.player.addEvent("play",function(){t.hasPlayed=!0,t.onPlaying()}),this.player.addEvent("pause",function(){t.onPause()}),this.player.addEvent("finish",function(){t.onPause()}),this.playOnReady&&this.play()},onPlaying:function(){this.playStatus<2&&(this.listeners.playing(),this.playStatus=2)},onPause:function(){this.listeners.pause(),delete this.playStatus},insertIframe:function(){var t=document.createElement("iframe");t.src=this.url.replace("VIDEO_ID",this.videoId).replace("PLAYER_ID",this.playerId),t.id=this.playerId,this.element.parentNode.replaceChild(t,this.element),this.element=t},play:function(){var t=this;this.playStatus||(this.listeners.play(),this.playStatus=1),this.ready?!this.hasPlayed&&(this.clickToPlay||window.navigator&&/iP(hone|od|ad)/.test(window.navigator.platform))?this.onPlaying():this.player.api("play"):(this.playOnReady=!0,window.$f?this.player||(this.insertIframe(),this.player=$f(this.element),this.player.addEvent("ready",function(){t.onReady()})):this.loadAPI())},pause:function(){this.ready?this.player.api("pause"):this.playStatus&&(delete this.playOnReady,this.listeners.pause(),delete this.playStatus)}}),i.extend(s.prototype,{VimeoPlayer:y,textFactory:function(t,e){var i=this.options,s=this.getItemProperty(t,i.vimeoVideoIdProperty);return s?(void 0===this.getItemProperty(t,i.urlProperty)&&(t[i.urlProperty]="//vimeo.com/"+s),m+=1,this.videoFactory(t,e,new y(i.vimeoPlayerUrl,s,i.vimeoPlayerIdPrefix+m,i.vimeoClickToPlay))):p.call(this,t,e)}}),i.extend(s.prototype.options,{youTubeVideoIdProperty:"youtube",youTubePlayerVars:{wmode:"transparent"},youTubeClickToPlay:!0});var f=s.prototype.textFactory||s.prototype.imageFactory,g=function(t,e,i){this.videoId=t,this.playerVars=e,this.clickToPlay=i,this.element=document.createElement("div"),this.listeners={}};return i.extend(g.prototype,{canPlayType:function(){return!0},on:function(t,e){return this.listeners[t]=e,this},loadAPI:function(){var t,e=this,i=window.onYouTubeIframeAPIReady,s="//www.youtube.com/iframe_api",n=document.getElementsByTagName("script"),o=n.length;for(window.onYouTubeIframeAPIReady=function(){i&&i.apply(this),e.playOnReady&&e.play()};o;)if(n[o-=1].src===s)return;(t=document.createElement("script")).src=s,n[0].parentNode.insertBefore(t,n[0])},onReady:function(){this.ready=!0,this.playOnReady&&this.play()},onPlaying:function(){this.playStatus<2&&(this.listeners.playing(),this.playStatus=2)},onPause:function(){s.prototype.setTimeout.call(this,this.checkSeek,null,2e3)},checkSeek:function(){this.stateChange!==YT.PlayerState.PAUSED&&this.stateChange!==YT.PlayerState.ENDED||(this.listeners.pause(),delete this.playStatus)},onStateChange:function(t){switch(t.data){case YT.PlayerState.PLAYING:this.hasPlayed=!0,this.onPlaying();break;case YT.PlayerState.PAUSED:case YT.PlayerState.ENDED:this.onPause()}this.stateChange=t.data},onError:function(t){this.listeners.error(t)},play:function(){var t=this;this.playStatus||(this.listeners.play(),this.playStatus=1),this.ready?!this.hasPlayed&&(this.clickToPlay||window.navigator&&/iP(hone|od|ad)/.test(window.navigator.platform))?this.onPlaying():this.player.playVideo():(this.playOnReady=!0,window.YT&&YT.Player?this.player||(this.player=new YT.Player(this.element,{videoId:this.videoId,playerVars:this.playerVars,events:{onReady:function(){t.onReady()},onStateChange:function(e){t.onStateChange(e)},onError:function(e){t.onError(e)}}})):this.loadAPI())},pause:function(){this.ready?this.player.pauseVideo():this.playStatus&&(delete this.playOnReady,this.listeners.pause(),delete this.playStatus)}}),i.extend(s.prototype,{YouTubePlayer:g,textFactory:function(t,e){var i=this.options,s=this.getItemProperty(t,i.youTubeVideoIdProperty);return s?(void 0===this.getItemProperty(t,i.urlProperty)&&(t[i.urlProperty]="//www.youtube.com/watch?v="+s),void 0===this.getItemProperty(t,i.videoPosterProperty)&&(t[i.videoPosterProperty]="//img.youtube.com/vi/"+s+"/maxresdefault.jpg"),this.videoFactory(t,e,new g(s,i.youTubePlayerVars,i.youTubeClickToPlay))):f.call(this,t,e)}}),t(document).on("click","[data-gallery]",function(e){e.preventDefault();var i=t(e.target).data("gallery"),n=t(i),o=n.length&&n||t(s.prototype.options.container),a={onopen:function(){o.data("gallery",s).trigger("open")},onopened:function(){o.trigger("opened")},onslide:function(){o.trigger("slide",arguments)},onslideend:function(){o.trigger("slideend",arguments)},onslidecomplete:function(){o.trigger("slidecomplete",arguments)},onclose:function(){o.trigger("close")},onclosed:function(){o.trigger("closed").removeData("gallery")}},r=t.extend(o.data(),{container:o[0],index:e.currentTarget,event:e},a),l=t(void 0!==i?"[data-gallery="+i+"]":"[data-gallery]");return r.filter&&(l=l.filter(r.filter)),new s(l,r)}),"undefined"!=typeof window&&(window.blueimp=window.blueimp||{},window.blueimp.Gallery=s),s});
//# sourceMappingURL=jquery.blueimp-gallery.umd.js.map