function __$$styleInject(css, ref) {
  if ( ref === void 0 ) ref = {};
  var insertAt = ref.insertAt;

  if (!css || typeof document === 'undefined') { return; }

  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';

  if (insertAt === 'top') {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }

  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}

import $ from 'jquery';

/*
 * blueimp helper JS
 * https://github.com/blueimp/Gallery
 *
 * Copyright 2013, Sebastian Tschan
 * https://blueimp.net
 *
 * Licensed under the MIT license:
 * https://opensource.org/licenses/MIT
 */

/* global window, document */

function extend (obj1, obj2) {
  var prop;
  for (prop in obj2) {
    if (obj2.hasOwnProperty(prop)) {
      obj1[prop] = obj2[prop];
    }
  }
  return obj1
}

function Helper (query) {
  var this$1 = this;

  if (!this || this.find !== Helper.prototype.find) {
    // Called as function instead of as constructor,
    // so we simply return a new instance:
    return new Helper(query)
  }
  this.length = 0;
  if (query) {
    if (typeof query === 'string') {
      query = this.find(query);
    }
    if (query.nodeType || query === query.window) {
      // Single HTML element
      this.length = 1;
      this[0] = query;
    } else {
      // HTML element collection
      var i = query.length;
      this.length = i;
      while (i) {
        i -= 1;
        this$1[i] = query[i];
      }
    }
  }
}

Helper.extend = extend;

Helper.contains = function (container, element) {
  do {
    element = element.parentNode;
    if (element === container) {
      return true
    }
  } while (element)
  return false
};

Helper.parseJSON = function (string) {
  return window.JSON && JSON.parse(string)
};

extend(Helper.prototype, {
  find: function (query) {
    var container = this[0] || document;
    if (typeof query === 'string') {
      if (container.querySelectorAll) {
        query = container.querySelectorAll(query);
      } else if (query.charAt(0) === '#') {
        query = container.getElementById(query.slice(1));
      } else {
        query = container.getElementsByTagName(query);
      }
    }
    return new Helper(query)
  },

  hasClass: function (className) {
    if (!this[0]) {
      return false
    }
    return new RegExp('(^|\\s+)' + className + '(\\s+|$)').test(
      this[0].className
    )
  },

  addClass: function (className) {
    var this$1 = this;

    var i = this.length;
    var element;
    while (i) {
      i -= 1;
      element = this$1[i];
      if (!element.className) {
        element.className = className;
        return this$1
      }
      if (this$1.hasClass(className)) {
        return this$1
      }
      element.className += ' ' + className;
    }
    return this
  },

  removeClass: function (className) {
    var this$1 = this;

    var regexp = new RegExp('(^|\\s+)' + className + '(\\s+|$)');
    var i = this.length;
    var element;
    while (i) {
      i -= 1;
      element = this$1[i];
      element.className = element.className.replace(regexp, ' ');
    }
    return this
  },

  on: function (eventName, handler) {
    var this$1 = this;

    var eventNames = eventName.split(/\s+/);
    var i;
    var element;
    while (eventNames.length) {
      eventName = eventNames.shift();
      i = this$1.length;
      while (i) {
        i -= 1;
        element = this$1[i];
        if (element.addEventListener) {
          element.addEventListener(eventName, handler, false);
        } else if (element.attachEvent) {
          element.attachEvent('on' + eventName, handler);
        }
      }
    }
    return this
  },

  off: function (eventName, handler) {
    var this$1 = this;

    var eventNames = eventName.split(/\s+/);
    var i;
    var element;
    while (eventNames.length) {
      eventName = eventNames.shift();
      i = this$1.length;
      while (i) {
        i -= 1;
        element = this$1[i];
        if (element.removeEventListener) {
          element.removeEventListener(eventName, handler, false);
        } else if (element.detachEvent) {
          element.detachEvent('on' + eventName, handler);
        }
      }
    }
    return this
  },

  empty: function () {
    var this$1 = this;

    var i = this.length;
    var element;
    while (i) {
      i -= 1;
      element = this$1[i];
      while (element.hasChildNodes()) {
        element.removeChild(element.lastChild);
      }
    }
    return this
  },

  first: function () {
    return new Helper(this[0])
  }
});

if (typeof window !== 'undefined') {
  window.blueimp = window.blueimp || {};
  window.blueimp.helper = Helper;
}

/*
 * blueimp Gallery JS
 * https://github.com/blueimp/Gallery
 *
 * Copyright 2013, Sebastian Tschan
 * https://blueimp.net
 *
 * Swipe implementation based on
 * https://github.com/bradbirdsall/Swipe
 *
 * Licensed under the MIT license:
 * https://opensource.org/licenses/MIT
 */

/* global window, document, DocumentTouch */

function Gallery$2 (list, options) {
  if (document.body.style.maxHeight === undefined) {
    // document.body.style.maxHeight is undefined on IE6 and lower
    return null
  }
  if (!this || this.options !== Gallery$2.prototype.options) {
    // Called as function instead of as constructor,
    // so we simply return a new instance:
    return new Gallery$2(list, options)
  }
  if (!list || !list.length) {
    this.console.log(
      'blueimp Gallery: No or empty list provided as first argument.',
      list
    );
    return
  }
  this.list = list;
  this.num = list.length;
  this.initOptions(options);
  this.initialize();
}

Helper.extend(Gallery$2.prototype, {
  options: {
    // The Id, element or querySelector of the gallery widget:
    container: '#blueimp-gallery',
    // The tag name, Id, element or querySelector of the slides container:
    slidesContainer: 'div',
    // The tag name, Id, element or querySelector of the title element:
    titleElement: 'h3',
    // The class to add when the gallery is visible:
    displayClass: 'blueimp-gallery-display',
    // The class to add when the gallery controls are visible:
    controlsClass: 'blueimp-gallery-controls',
    // The class to add when the gallery only displays one element:
    singleClass: 'blueimp-gallery-single',
    // The class to add when the left edge has been reached:
    leftEdgeClass: 'blueimp-gallery-left',
    // The class to add when the right edge has been reached:
    rightEdgeClass: 'blueimp-gallery-right',
    // The class to add when the automatic slideshow is active:
    playingClass: 'blueimp-gallery-playing',
    // The class for all slides:
    slideClass: 'slide',
    // The slide class for loading elements:
    slideLoadingClass: 'slide-loading',
    // The slide class for elements that failed to load:
    slideErrorClass: 'slide-error',
    // The class for the content element loaded into each slide:
    slideContentClass: 'slide-content',
    // The class for the "toggle" control:
    toggleClass: 'toggle',
    // The class for the "prev" control:
    prevClass: 'prev',
    // The class for the "next" control:
    nextClass: 'next',
    // The class for the "close" control:
    closeClass: 'close',
    // The class for the "play-pause" toggle control:
    playPauseClass: 'play-pause',
    // The list object property (or data attribute) with the object type:
    typeProperty: 'type',
    // The list object property (or data attribute) with the object title:
    titleProperty: 'title',
    // The list object property (or data attribute) with the object URL:
    urlProperty: 'href',
    // The list object property (or data attribute) with the object srcset URL(s):
    srcsetProperty: 'urlset',
    // The gallery listens for transitionend events before triggering the
    // opened and closed events, unless the following option is set to false:
    displayTransition: true,
    // Defines if the gallery slides are cleared from the gallery modal,
    // or reused for the next gallery initialization:
    clearSlides: true,
    // Defines if images should be stretched to fill the available space,
    // while maintaining their aspect ratio (will only be enabled for browsers
    // supporting background-size="contain", which excludes IE < 9).
    // Set to "cover", to make images cover all available space (requires
    // support for background-size="cover", which excludes IE < 9):
    stretchImages: false,
    // Toggle the controls on pressing the Return key:
    toggleControlsOnReturn: true,
    // Toggle the controls on slide click:
    toggleControlsOnSlideClick: true,
    // Toggle the automatic slideshow interval on pressing the Space key:
    toggleSlideshowOnSpace: true,
    // Navigate the gallery by pressing left and right on the keyboard:
    enableKeyboardNavigation: true,
    // Close the gallery on pressing the Esc key:
    closeOnEscape: true,
    // Close the gallery when clicking on an empty slide area:
    closeOnSlideClick: true,
    // Close the gallery by swiping up or down:
    closeOnSwipeUpOrDown: true,
    // Emulate touch events on mouse-pointer devices such as desktop browsers:
    emulateTouchEvents: true,
    // Stop touch events from bubbling up to ancestor elements of the Gallery:
    stopTouchEventsPropagation: false,
    // Hide the page scrollbars:
    hidePageScrollbars: true,
    // Stops any touches on the container from scrolling the page:
    disableScroll: true,
    // Carousel mode (shortcut for carousel specific options):
    carousel: false,
    // Allow continuous navigation, moving from last to first
    // and from first to last slide:
    continuous: true,
    // Remove elements outside of the preload range from the DOM:
    unloadElements: true,
    // Start with the automatic slideshow:
    startSlideshow: false,
    // Delay in milliseconds between slides for the automatic slideshow:
    slideshowInterval: 5000,
    // The starting index as integer.
    // Can also be an object of the given list,
    // or an equal object with the same url property:
    index: 0,
    // The number of elements to load around the current index:
    preloadRange: 2,
    // The transition speed between slide changes in milliseconds:
    transitionSpeed: 400,
    // The transition speed for automatic slide changes, set to an integer
    // greater 0 to override the default transition speed:
    slideshowTransitionSpeed: undefined,
    // The event object for which the default action will be canceled
    // on Gallery initialization (e.g. the click event to open the Gallery):
    event: undefined,
    // Callback function executed when the Gallery is initialized.
    // Is called with the gallery instance as "this" object:
    onopen: undefined,
    // Callback function executed when the Gallery has been initialized
    // and the initialization transition has been completed.
    // Is called with the gallery instance as "this" object:
    onopened: undefined,
    // Callback function executed on slide change.
    // Is called with the gallery instance as "this" object and the
    // current index and slide as arguments:
    onslide: undefined,
    // Callback function executed after the slide change transition.
    // Is called with the gallery instance as "this" object and the
    // current index and slide as arguments:
    onslideend: undefined,
    // Callback function executed on slide content load.
    // Is called with the gallery instance as "this" object and the
    // slide index and slide element as arguments:
    onslidecomplete: undefined,
    // Callback function executed when the Gallery is about to be closed.
    // Is called with the gallery instance as "this" object:
    onclose: undefined,
    // Callback function executed when the Gallery has been closed
    // and the closing transition has been completed.
    // Is called with the gallery instance as "this" object:
    onclosed: undefined
  },

  carouselOptions: {
    hidePageScrollbars: false,
    toggleControlsOnReturn: false,
    toggleSlideshowOnSpace: false,
    enableKeyboardNavigation: false,
    closeOnEscape: false,
    closeOnSlideClick: false,
    closeOnSwipeUpOrDown: false,
    disableScroll: false,
    startSlideshow: true
  },

  console:
    window.console && typeof window.console.log === 'function'
      ? window.console
      : { log: function () {} },

  // Detect touch, transition, transform and background-size support:
  support: (function (element) {
    var support = {
      touch:
        window.ontouchstart !== undefined ||
        (window.DocumentTouch && document instanceof DocumentTouch)
    };

    var transitions = {
      webkitTransition: {
        end: 'webkitTransitionEnd',
        prefix: '-webkit-'
      },
      MozTransition: {
        end: 'transitionend',
        prefix: '-moz-'
      },
      OTransition: {
        end: 'otransitionend',
        prefix: '-o-'
      },
      transition: {
        end: 'transitionend',
        prefix: ''
      }
    };

    for (var prop in transitions) {
      if (
        transitions.hasOwnProperty(prop) &&
        element.style[prop] !== undefined
      ) {
        support.transition = transitions[prop];
        support.transition.name = prop;
        break
      }
    }

    function elementTests () {
      var transition = support.transition;
      var prop;
      var translateZ;
      document.body.appendChild(element);
      if (transition) {
        prop = transition.name.slice(0, -9) + 'ransform';
        if (element.style[prop] !== undefined) {
          element.style[prop] = 'translateZ(0)';
          translateZ = window
            .getComputedStyle(element)
            .getPropertyValue(transition.prefix + 'transform');
          support.transform = {
            prefix: transition.prefix,
            name: prop,
            translate: true,
            translateZ: !!translateZ && translateZ !== 'none'
          };
        }
      }
      if (element.style.backgroundSize !== undefined) {
        support.backgroundSize = {};
        element.style.backgroundSize = 'contain';
        support.backgroundSize.contain =
          window
            .getComputedStyle(element)
            .getPropertyValue('background-size') === 'contain';
        element.style.backgroundSize = 'cover';
        support.backgroundSize.cover =
          window
            .getComputedStyle(element)
            .getPropertyValue('background-size') === 'cover';
      }
      document.body.removeChild(element);
    }

    if (document.body) {
      elementTests();
    } else {
      Helper(document).on('DOMContentLoaded', elementTests);
    }
    return support
    // Test element, has to be standard HTML and must not be hidden
    // for the CSS3 tests using window.getComputedStyle to be applicable:
  })(document.createElement('div')),

  requestAnimationFrame:
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame,

  cancelAnimationFrame:
    window.cancelAnimationFrame ||
    window.webkitCancelRequestAnimationFrame ||
    window.webkitCancelAnimationFrame ||
    window.mozCancelAnimationFrame,

  initialize: function () {
    this.initStartIndex();
    if (this.initWidget() === false) {
      return false
    }
    this.initEventListeners();
    // Load the slide at the given index:
    this.onslide(this.index);
    // Manually trigger the slideend event for the initial slide:
    this.ontransitionend();
    // Start the automatic slideshow if applicable:
    if (this.options.startSlideshow) {
      this.play();
    }
  },

  slide: function (to, speed) {
    var this$1 = this;

    window.clearTimeout(this.timeout);
    var index = this.index;
    var direction;
    var naturalDirection;
    var diff;
    if (index === to || this.num === 1) {
      return
    }
    if (!speed) {
      speed = this.options.transitionSpeed;
    }
    if (this.support.transform) {
      if (!this.options.continuous) {
        to = this.circle(to);
      }
      // 1: backward, -1: forward:
      direction = Math.abs(index - to) / (index - to);
      // Get the actual position of the slide:
      if (this.options.continuous) {
        naturalDirection = direction;
        direction = -this.positions[this.circle(to)] / this.slideWidth;
        // If going forward but to < index, use to = slides.length + to
        // If going backward but to > index, use to = -slides.length + to
        if (direction !== naturalDirection) {
          to = -direction * this.num + to;
        }
      }
      diff = Math.abs(index - to) - 1;
      // Move all the slides between index and to in the right direction:
      while (diff) {
        diff -= 1;
        this$1.move(
          this$1.circle((to > index ? to : index) - diff - 1),
          this$1.slideWidth * direction,
          0
        );
      }
      to = this.circle(to);
      this.move(index, this.slideWidth * direction, speed);
      this.move(to, 0, speed);
      if (this.options.continuous) {
        this.move(
          this.circle(to - direction),
          -(this.slideWidth * direction),
          0
        );
      }
    } else {
      to = this.circle(to);
      this.animate(index * -this.slideWidth, to * -this.slideWidth, speed);
    }
    this.onslide(to);
  },

  getIndex: function () {
    return this.index
  },

  getNumber: function () {
    return this.num
  },

  prev: function () {
    if (this.options.continuous || this.index) {
      this.slide(this.index - 1);
    }
  },

  next: function () {
    if (this.options.continuous || this.index < this.num - 1) {
      this.slide(this.index + 1);
    }
  },

  play: function (time) {
    var that = this;
    window.clearTimeout(this.timeout);
    this.interval = time || this.options.slideshowInterval;
    if (this.elements[this.index] > 1) {
      this.timeout = this.setTimeout(
        (!this.requestAnimationFrame && this.slide) ||
          function (to, speed) {
            that.animationFrameId = that.requestAnimationFrame.call(
              window,
              function () {
                that.slide(to, speed);
              }
            );
          },
        [this.index + 1, this.options.slideshowTransitionSpeed],
        this.interval
      );
    }
    this.container.addClass(this.options.playingClass);
  },

  pause: function () {
    window.clearTimeout(this.timeout);
    this.interval = null;
    if (this.cancelAnimationFrame) {
      this.cancelAnimationFrame.call(window, this.animationFrameId);
      this.animationFrameId = null;
    }
    this.container.removeClass(this.options.playingClass);
  },

  add: function (list) {
    var this$1 = this;

    var i;
    if (!list.concat) {
      // Make a real array out of the list to add:
      list = Array.prototype.slice.call(list);
    }
    if (!this.list.concat) {
      // Make a real array out of the Gallery list:
      this.list = Array.prototype.slice.call(this.list);
    }
    this.list = this.list.concat(list);
    this.num = this.list.length;
    if (this.num > 2 && this.options.continuous === null) {
      this.options.continuous = true;
      this.container.removeClass(this.options.leftEdgeClass);
    }
    this.container
      .removeClass(this.options.rightEdgeClass)
      .removeClass(this.options.singleClass);
    for (i = this.num - list.length; i < this.num; i += 1) {
      this$1.addSlide(i);
      this$1.positionSlide(i);
    }
    this.positions.length = this.num;
    this.initSlides(true);
  },

  resetSlides: function () {
    this.slidesContainer.empty();
    this.unloadAllSlides();
    this.slides = [];
  },

  handleClose: function () {
    var options = this.options;
    this.destroyEventListeners();
    // Cancel the slideshow:
    this.pause();
    this.container[0].style.display = 'none';
    this.container
      .removeClass(options.displayClass)
      .removeClass(options.singleClass)
      .removeClass(options.leftEdgeClass)
      .removeClass(options.rightEdgeClass);
    if (options.hidePageScrollbars) {
      document.body.style.overflow = this.bodyOverflowStyle;
    }
    if (this.options.clearSlides) {
      this.resetSlides();
    }
    if (this.options.onclosed) {
      this.options.onclosed.call(this);
    }
  },

  close: function () {
    var that = this;
    function closeHandler (event) {
      if (event.target === that.container[0]) {
        that.container.off(that.support.transition.end, closeHandler);
        that.handleClose();
      }
    }
    if (this.options.onclose) {
      this.options.onclose.call(this);
    }
    if (this.support.transition && this.options.displayTransition) {
      this.container.on(this.support.transition.end, closeHandler);
      this.container.removeClass(this.options.displayClass);
    } else {
      this.handleClose();
    }
  },

  circle: function (index) {
    // Always return a number inside of the slides index range:
    return (this.num + index % this.num) % this.num
  },

  move: function (index, dist, speed) {
    this.translateX(index, dist, speed);
    this.positions[index] = dist;
  },

  translate: function (index, x, y, speed) {
    var style = this.slides[index].style;
    var transition = this.support.transition;
    var transform = this.support.transform;
    style[transition.name + 'Duration'] = speed + 'ms';
    style[transform.name] =
      'translate(' +
      x +
      'px, ' +
      y +
      'px)' +
      (transform.translateZ ? ' translateZ(0)' : '');
  },

  translateX: function (index, x, speed) {
    this.translate(index, x, 0, speed);
  },

  translateY: function (index, y, speed) {
    this.translate(index, 0, y, speed);
  },

  animate: function (from, to, speed) {
    if (!speed) {
      this.slidesContainer[0].style.left = to + 'px';
      return
    }
    var that = this;
    var start = new Date().getTime();
    var timer = window.setInterval(function () {
      var timeElap = new Date().getTime() - start;
      if (timeElap > speed) {
        that.slidesContainer[0].style.left = to + 'px';
        that.ontransitionend();
        window.clearInterval(timer);
        return
      }
      that.slidesContainer[0].style.left =
        (to - from) * (Math.floor(timeElap / speed * 100) / 100) + from + 'px';
    }, 4);
  },

  preventDefault: function (event) {
    if (event.preventDefault) {
      event.preventDefault();
    } else {
      event.returnValue = false;
    }
  },

  stopPropagation: function (event) {
    if (event.stopPropagation) {
      event.stopPropagation();
    } else {
      event.cancelBubble = true;
    }
  },

  onresize: function () {
    this.initSlides(true);
  },

  onmousedown: function (event) {
    // Trigger on clicks of the left mouse button only
    // and exclude video elements:
    if (
      event.which &&
      event.which === 1 &&
      event.target.nodeName !== 'VIDEO'
    ) {
      // Preventing the default mousedown action is required
      // to make touch emulation work with Firefox:
      event.preventDefault()
      ;(event.originalEvent || event).touches = [
        {
          pageX: event.pageX,
          pageY: event.pageY
        }
      ];
      this.ontouchstart(event);
    }
  },

  onmousemove: function (event) {
    if (this.touchStart) {
      (event.originalEvent || event).touches = [
        {
          pageX: event.pageX,
          pageY: event.pageY
        }
      ];
      this.ontouchmove(event);
    }
  },

  onmouseup: function (event) {
    if (this.touchStart) {
      this.ontouchend(event);
      delete this.touchStart;
    }
  },

  onmouseout: function (event) {
    if (this.touchStart) {
      var target = event.target;
      var related = event.relatedTarget;
      if (!related || (related !== target && !Helper.contains(target, related))) {
        this.onmouseup(event);
      }
    }
  },

  ontouchstart: function (event) {
    if (this.options.stopTouchEventsPropagation) {
      this.stopPropagation(event);
    }
    // jQuery doesn't copy touch event properties by default,
    // so we have to access the originalEvent object:
    var touches = (event.originalEvent || event).touches[0];
    this.touchStart = {
      // Remember the initial touch coordinates:
      x: touches.pageX,
      y: touches.pageY,
      // Store the time to determine touch duration:
      time: Date.now()
    };
    // Helper variable to detect scroll movement:
    this.isScrolling = undefined;
    // Reset delta values:
    this.touchDelta = {};
  },

  ontouchmove: function (event) {
    var this$1 = this;

    if (this.options.stopTouchEventsPropagation) {
      this.stopPropagation(event);
    }
    // jQuery doesn't copy touch event properties by default,
    // so we have to access the originalEvent object:
    var touches = (event.originalEvent || event).touches[0];
    var scale = (event.originalEvent || event).scale;
    var index = this.index;
    var touchDeltaX;
    var indices;
    // Ensure this is a one touch swipe and not, e.g. a pinch:
    if (touches.length > 1 || (scale && scale !== 1)) {
      return
    }
    if (this.options.disableScroll) {
      event.preventDefault();
    }
    // Measure change in x and y coordinates:
    this.touchDelta = {
      x: touches.pageX - this.touchStart.x,
      y: touches.pageY - this.touchStart.y
    };
    touchDeltaX = this.touchDelta.x;
    // Detect if this is a vertical scroll movement (run only once per touch):
    if (this.isScrolling === undefined) {
      this.isScrolling =
        this.isScrolling ||
        Math.abs(touchDeltaX) < Math.abs(this.touchDelta.y);
    }
    if (!this.isScrolling) {
      // Always prevent horizontal scroll:
      event.preventDefault();
      // Stop the slideshow:
      window.clearTimeout(this.timeout);
      if (this.options.continuous) {
        indices = [this.circle(index + 1), index, this.circle(index - 1)];
      } else {
        // Increase resistance if first slide and sliding left
        // or last slide and sliding right:
        this.touchDelta.x = touchDeltaX =
          touchDeltaX /
          ((!index && touchDeltaX > 0) ||
          (index === this.num - 1 && touchDeltaX < 0)
            ? Math.abs(touchDeltaX) / this.slideWidth + 1
            : 1);
        indices = [index];
        if (index) {
          indices.push(index - 1);
        }
        if (index < this.num - 1) {
          indices.unshift(index + 1);
        }
      }
      while (indices.length) {
        index = indices.pop();
        this$1.translateX(index, touchDeltaX + this$1.positions[index], 0);
      }
    } else {
      this.translateY(index, this.touchDelta.y + this.positions[index], 0);
    }
  },

  ontouchend: function (event) {
    if (this.options.stopTouchEventsPropagation) {
      this.stopPropagation(event);
    }
    var index = this.index;
    var speed = this.options.transitionSpeed;
    var slideWidth = this.slideWidth;
    var isShortDuration = Number(Date.now() - this.touchStart.time) < 250;
    // Determine if slide attempt triggers next/prev slide:
    var isValidSlide =
      (isShortDuration && Math.abs(this.touchDelta.x) > 20) ||
      Math.abs(this.touchDelta.x) > slideWidth / 2;
    // Determine if slide attempt is past start or end:
    var isPastBounds =
      (!index && this.touchDelta.x > 0) ||
      (index === this.num - 1 && this.touchDelta.x < 0);
    var isValidClose =
      !isValidSlide &&
      this.options.closeOnSwipeUpOrDown &&
      ((isShortDuration && Math.abs(this.touchDelta.y) > 20) ||
        Math.abs(this.touchDelta.y) > this.slideHeight / 2);
    var direction;
    var indexForward;
    var indexBackward;
    var distanceForward;
    var distanceBackward;
    if (this.options.continuous) {
      isPastBounds = false;
    }
    // Determine direction of swipe (true: right, false: left):
    direction = this.touchDelta.x < 0 ? -1 : 1;
    if (!this.isScrolling) {
      if (isValidSlide && !isPastBounds) {
        indexForward = index + direction;
        indexBackward = index - direction;
        distanceForward = slideWidth * direction;
        distanceBackward = -slideWidth * direction;
        if (this.options.continuous) {
          this.move(this.circle(indexForward), distanceForward, 0);
          this.move(this.circle(index - 2 * direction), distanceBackward, 0);
        } else if (indexForward >= 0 && indexForward < this.num) {
          this.move(indexForward, distanceForward, 0);
        }
        this.move(index, this.positions[index] + distanceForward, speed);
        this.move(
          this.circle(indexBackward),
          this.positions[this.circle(indexBackward)] + distanceForward,
          speed
        );
        index = this.circle(indexBackward);
        this.onslide(index);
      } else {
        // Move back into position
        if (this.options.continuous) {
          this.move(this.circle(index - 1), -slideWidth, speed);
          this.move(index, 0, speed);
          this.move(this.circle(index + 1), slideWidth, speed);
        } else {
          if (index) {
            this.move(index - 1, -slideWidth, speed);
          }
          this.move(index, 0, speed);
          if (index < this.num - 1) {
            this.move(index + 1, slideWidth, speed);
          }
        }
      }
    } else {
      if (isValidClose) {
        this.close();
      } else {
        // Move back into position
        this.translateY(index, 0, speed);
      }
    }
  },

  ontouchcancel: function (event) {
    if (this.touchStart) {
      this.ontouchend(event);
      delete this.touchStart;
    }
  },

  ontransitionend: function (event) {
    var slide = this.slides[this.index];
    if (!event || slide === event.target) {
      if (this.interval) {
        this.play();
      }
      this.setTimeout(this.options.onslideend, [this.index, slide]);
    }
  },

  oncomplete: function (event) {
    var target = event.target || event.srcElement;
    var parent = target && target.parentNode;
    if (!target || !parent) {
      return
    }

    var index = this.getNodeIndex(parent);
    Helper(parent).removeClass(this.options.slideLoadingClass);
    if (event.type === 'error') {
      Helper(parent).addClass(this.options.slideErrorClass);
      this.elements[index] = 3; // Fail
    } else {
      this.elements[index] = 2; // Done
    }
    // Fix for IE7's lack of support for percentage max-height:
    if (target.clientHeight > this.container[0].clientHeight) {
      target.style.maxHeight = this.container[0].clientHeight;
    }
    if (this.interval && this.slides[this.index] === parent) {
      this.play();
    }
    this.setTimeout(this.options.onslidecomplete, [index, parent]);
  },

  onload: function (event) {
    this.oncomplete(event);
  },

  onerror: function (event) {
    this.oncomplete(event);
  },

  onkeydown: function (event) {
    switch (event.which || event.keyCode) {
      case 13: // Return
        if (this.options.toggleControlsOnReturn) {
          this.preventDefault(event);
          this.toggleControls();
        }
        break
      case 27: // Esc
        if (this.options.closeOnEscape) {
          this.close();
          // prevent Esc from closing other things
          event.stopImmediatePropagation();
        }
        break
      case 32: // Space
        if (this.options.toggleSlideshowOnSpace) {
          this.preventDefault(event);
          this.toggleSlideshow();
        }
        break
      case 37: // Left
        if (this.options.enableKeyboardNavigation) {
          this.preventDefault(event);
          this.prev();
        }
        break
      case 39: // Right
        if (this.options.enableKeyboardNavigation) {
          this.preventDefault(event);
          this.next();
        }
        break
    }
  },

  handleClick: function (event) {
    var options = this.options;
    var target = event.target || event.srcElement;
    var parent = target.parentNode;
    function isTarget (className) {
      return Helper(target).hasClass(className) || Helper(parent).hasClass(className)
    }
    if (isTarget(options.toggleClass)) {
      // Click on "toggle" control
      this.preventDefault(event);
      this.toggleControls();
    } else if (isTarget(options.prevClass)) {
      // Click on "prev" control
      this.preventDefault(event);
      this.prev();
    } else if (isTarget(options.nextClass)) {
      // Click on "next" control
      this.preventDefault(event);
      this.next();
    } else if (isTarget(options.closeClass)) {
      // Click on "close" control
      this.preventDefault(event);
      this.close();
    } else if (isTarget(options.playPauseClass)) {
      // Click on "play-pause" control
      this.preventDefault(event);
      this.toggleSlideshow();
    } else if (parent === this.slidesContainer[0]) {
      // Click on slide background
      if (options.closeOnSlideClick) {
        this.preventDefault(event);
        this.close();
      } else if (options.toggleControlsOnSlideClick) {
        this.preventDefault(event);
        this.toggleControls();
      }
    } else if (
      parent.parentNode &&
      parent.parentNode === this.slidesContainer[0]
    ) {
      // Click on displayed element
      if (options.toggleControlsOnSlideClick) {
        this.preventDefault(event);
        this.toggleControls();
      }
    }
  },

  onclick: function (event) {
    if (
      this.options.emulateTouchEvents &&
      this.touchDelta &&
      (Math.abs(this.touchDelta.x) > 20 || Math.abs(this.touchDelta.y) > 20)
    ) {
      delete this.touchDelta;
      return
    }
    return this.handleClick(event)
  },

  updateEdgeClasses: function (index) {
    if (!index) {
      this.container.addClass(this.options.leftEdgeClass);
    } else {
      this.container.removeClass(this.options.leftEdgeClass);
    }
    if (index === this.num - 1) {
      this.container.addClass(this.options.rightEdgeClass);
    } else {
      this.container.removeClass(this.options.rightEdgeClass);
    }
  },

  handleSlide: function (index) {
    if (!this.options.continuous) {
      this.updateEdgeClasses(index);
    }
    this.loadElements(index);
    if (this.options.unloadElements) {
      this.unloadElements(index);
    }
    this.setTitle(index);
  },

  onslide: function (index) {
    this.index = index;
    this.handleSlide(index);
    this.setTimeout(this.options.onslide, [index, this.slides[index]]);
  },

  setTitle: function (index) {
    var firstChild = this.slides[index].firstChild;
    var text = firstChild.title || firstChild.alt;
    var titleElement = this.titleElement;
    if (titleElement.length) {
      this.titleElement.empty();
      if (text) {
        titleElement[0].appendChild(document.createTextNode(text));
      }
    }
  },

  setTimeout: function (func, args, wait) {
    var that = this;
    return (
      func &&
      window.setTimeout(function () {
        func.apply(that, args || []);
      }, wait || 0)
    )
  },

  imageFactory: function (obj, callback) {
    var that = this;
    var img = this.imagePrototype.cloneNode(false);
    var url = obj;
    var backgroundSize = this.options.stretchImages;
    var called;
    var element;
    var title;
    function callbackWrapper (event) {
      if (!called) {
        event = {
          type: event.type,
          target: element
        };
        if (!element.parentNode) {
          // Fix for IE7 firing the load event for
          // cached images before the element could
          // be added to the DOM:
          return that.setTimeout(callbackWrapper, [event])
        }
        called = true;
        Helper(img).off('load error', callbackWrapper);
        if (backgroundSize) {
          if (event.type === 'load') {
            element.style.background = 'url("' + url + '") center no-repeat';
            element.style.backgroundSize = backgroundSize;
          }
        }
        callback(event);
      }
    }
    if (typeof url !== 'string') {
      url = this.getItemProperty(obj, this.options.urlProperty);
      title = this.getItemProperty(obj, this.options.titleProperty);
    }
    if (backgroundSize === true) {
      backgroundSize = 'contain';
    }
    backgroundSize =
      this.support.backgroundSize &&
      this.support.backgroundSize[backgroundSize] &&
      backgroundSize;
    if (backgroundSize) {
      element = this.elementPrototype.cloneNode(false);
    } else {
      element = img;
      img.draggable = false;
    }
    if (title) {
      element.title = title;
    }
    Helper(img).on('load error', callbackWrapper);
    img.src = url;
    return element
  },

  createElement: function (obj, callback) {
    var type = obj && this.getItemProperty(obj, this.options.typeProperty);
    var factory =
      (type && this[type.split('/')[0] + 'Factory']) || this.imageFactory;
    var element = obj && factory.call(this, obj, callback);
    var srcset = this.getItemProperty(obj, this.options.srcsetProperty);
    if (!element) {
      element = this.elementPrototype.cloneNode(false);
      this.setTimeout(callback, [
        {
          type: 'error',
          target: element
        }
      ]);
    }
    if (srcset) {
      element.setAttribute('srcset', srcset);
    }
    Helper(element).addClass(this.options.slideContentClass);
    return element
  },

  loadElement: function (index) {
    if (!this.elements[index]) {
      if (this.slides[index].firstChild) {
        this.elements[index] = Helper(this.slides[index]).hasClass(
          this.options.slideErrorClass
        )
          ? 3
          : 2;
      } else {
        this.elements[index] = 1; // Loading
        Helper(this.slides[index]).addClass(this.options.slideLoadingClass);
        this.slides[index].appendChild(
          this.createElement(this.list[index], this.proxyListener)
        );
      }
    }
  },

  loadElements: function (index) {
    var this$1 = this;

    var limit = Math.min(this.num, this.options.preloadRange * 2 + 1);
    var j = index;
    var i;
    for (i = 0; i < limit; i += 1) {
      // First load the current slide element (0),
      // then the next one (+1),
      // then the previous one (-2),
      // then the next after next (+2), etc.:
      j += i * (i % 2 === 0 ? -1 : 1);
      // Connect the ends of the list to load slide elements for
      // continuous navigation:
      j = this$1.circle(j);
      this$1.loadElement(j);
    }
  },

  unloadElements: function (index) {
    var this$1 = this;

    var i, diff;
    for (i in this$1.elements) {
      if (this$1.elements.hasOwnProperty(i)) {
        diff = Math.abs(index - i);
        if (
          diff > this$1.options.preloadRange &&
          diff + this$1.options.preloadRange < this$1.num
        ) {
          this$1.unloadSlide(i);
          delete this$1.elements[i];
        }
      }
    }
  },

  addSlide: function (index) {
    var slide = this.slidePrototype.cloneNode(false);
    slide.setAttribute('data-index', index);
    this.slidesContainer[0].appendChild(slide);
    this.slides.push(slide);
  },

  positionSlide: function (index) {
    var slide = this.slides[index];
    slide.style.width = this.slideWidth + 'px';
    if (this.support.transform) {
      slide.style.left = index * -this.slideWidth + 'px';
      this.move(
        index,
        this.index > index
          ? -this.slideWidth
          : this.index < index ? this.slideWidth : 0,
        0
      );
    }
  },

  initSlides: function (reload) {
    var this$1 = this;

    var clearSlides, i;
    if (!reload) {
      this.positions = [];
      this.positions.length = this.num;
      this.elements = {};
      this.imagePrototype = document.createElement('img');
      this.elementPrototype = document.createElement('div');
      this.slidePrototype = document.createElement('div');
      Helper(this.slidePrototype).addClass(this.options.slideClass);
      this.slides = this.slidesContainer[0].children;
      clearSlides =
        this.options.clearSlides || this.slides.length !== this.num;
    }
    this.slideWidth = this.container[0].offsetWidth;
    this.slideHeight = this.container[0].offsetHeight;
    this.slidesContainer[0].style.width = this.num * this.slideWidth + 'px';
    if (clearSlides) {
      this.resetSlides();
    }
    for (i = 0; i < this.num; i += 1) {
      if (clearSlides) {
        this$1.addSlide(i);
      }
      this$1.positionSlide(i);
    }
    // Reposition the slides before and after the given index:
    if (this.options.continuous && this.support.transform) {
      this.move(this.circle(this.index - 1), -this.slideWidth, 0);
      this.move(this.circle(this.index + 1), this.slideWidth, 0);
    }
    if (!this.support.transform) {
      this.slidesContainer[0].style.left =
        this.index * -this.slideWidth + 'px';
    }
  },

  unloadSlide: function (index) {
    var slide, firstChild;
    slide = this.slides[index];
    firstChild = slide.firstChild;
    if (firstChild !== null) {
      slide.removeChild(firstChild);
    }
  },

  unloadAllSlides: function () {
    var this$1 = this;

    var i, len;
    for (i = 0, len = this.slides.length; i < len; i++) {
      this$1.unloadSlide(i);
    }
  },

  toggleControls: function () {
    var controlsClass = this.options.controlsClass;
    if (this.container.hasClass(controlsClass)) {
      this.container.removeClass(controlsClass);
    } else {
      this.container.addClass(controlsClass);
    }
  },

  toggleSlideshow: function () {
    if (!this.interval) {
      this.play();
    } else {
      this.pause();
    }
  },

  getNodeIndex: function (element) {
    return parseInt(element.getAttribute('data-index'), 10)
  },

  getNestedProperty: function (obj, property) {
    property.replace(
      // Matches native JavaScript notation in a String,
      // e.g. '["doubleQuoteProp"].dotProp[2]'
      // eslint-disable-next-line no-useless-escape
      /\[(?:'([^']+)'|"([^"]+)"|(\d+))\]|(?:(?:^|\.)([^\.\[]+))/g,
      function (str, singleQuoteProp, doubleQuoteProp, arrayIndex, dotProp) {
        var prop =
          dotProp ||
          singleQuoteProp ||
          doubleQuoteProp ||
          (arrayIndex && parseInt(arrayIndex, 10));
        if (str && obj) {
          obj = obj[prop];
        }
      }
    );
    return obj
  },

  getDataProperty: function (obj, property) {
    var key, prop;
    if (obj.dataset) {
      key = property.replace(/-([a-z])/g, function (_, b) {
        return b.toUpperCase()
      });
      prop = obj.dataset[key];
    } else if (obj.getAttribute) {
      prop = obj.getAttribute(
        'data-' + property.replace(/([A-Z])/g, '-$1').toLowerCase()
      );
    }
    if (typeof prop === 'string') {
      // eslint-disable-next-line no-useless-escape
      if (
        /^(true|false|null|-?\d+(\.\d+)?|\{[\s\S]*\}|\[[\s\S]*\])$/.test(prop)
      ) {
        try {
          return Helper.parseJSON(prop)
        } catch (ignore) {}
      }
      return prop
    }
  },

  getItemProperty: function (obj, property) {
    var prop = this.getDataProperty(obj, property);
    if (prop === undefined) {
      prop = obj[property];
    }
    if (prop === undefined) {
      prop = this.getNestedProperty(obj, property);
    }
    return prop
  },

  initStartIndex: function () {
    var this$1 = this;

    var index = this.options.index;
    var urlProperty = this.options.urlProperty;
    // Check if the index is given as a list object:
    if (index && typeof index !== 'number') {
      for (var i = 0; i < this.num; i += 1) {
        if (
          this$1.list[i] === index ||
          this$1.getItemProperty(this$1.list[i], urlProperty) ===
            this$1.getItemProperty(index, urlProperty)
        ) {
          index = i;
          break
        }
      }
    }
    // Make sure the index is in the list range:
    this.index = this.circle(parseInt(index, 10) || 0);
  },

  initEventListeners: function () {
    var that = this;
    var slidesContainer = this.slidesContainer;
    function proxyListener (event) {
      var type =
        that.support.transition && that.support.transition.end === event.type
          ? 'transitionend'
          : event.type;
      that['on' + type](event);
    }
    Helper(window).on('resize', proxyListener);
    Helper(document.body).on('keydown', proxyListener);
    this.container.on('click', proxyListener);
    if (this.support.touch) {
      slidesContainer.on(
        'touchstart touchmove touchend touchcancel',
        proxyListener
      );
    } else if (this.options.emulateTouchEvents && this.support.transition) {
      slidesContainer.on(
        'mousedown mousemove mouseup mouseout',
        proxyListener
      );
    }
    if (this.support.transition) {
      slidesContainer.on(this.support.transition.end, proxyListener);
    }
    this.proxyListener = proxyListener;
  },

  destroyEventListeners: function () {
    var slidesContainer = this.slidesContainer;
    var proxyListener = this.proxyListener;
    Helper(window).off('resize', proxyListener);
    Helper(document.body).off('keydown', proxyListener);
    this.container.off('click', proxyListener);
    if (this.support.touch) {
      slidesContainer.off(
        'touchstart touchmove touchend touchcancel',
        proxyListener
      );
    } else if (this.options.emulateTouchEvents && this.support.transition) {
      slidesContainer.off(
        'mousedown mousemove mouseup mouseout',
        proxyListener
      );
    }
    if (this.support.transition) {
      slidesContainer.off(this.support.transition.end, proxyListener);
    }
  },

  handleOpen: function () {
    if (this.options.onopened) {
      this.options.onopened.call(this);
    }
  },

  initWidget: function () {
    var that = this;
    function openHandler (event) {
      if (event.target === that.container[0]) {
        that.container.off(that.support.transition.end, openHandler);
        that.handleOpen();
      }
    }
    this.container = Helper(this.options.container);
    if (!this.container.length) {
      this.console.log(
        'blueimp Gallery: Widget container not found.',
        this.options.container
      );
      return false
    }
    this.slidesContainer = this.container
      .find(this.options.slidesContainer)
      .first();
    if (!this.slidesContainer.length) {
      this.console.log(
        'blueimp Gallery: Slides container not found.',
        this.options.slidesContainer
      );
      return false
    }
    this.titleElement = this.container.find(this.options.titleElement).first();
    if (this.num === 1) {
      this.container.addClass(this.options.singleClass);
    }
    if (this.options.onopen) {
      this.options.onopen.call(this);
    }
    if (this.support.transition && this.options.displayTransition) {
      this.container.on(this.support.transition.end, openHandler);
    } else {
      this.handleOpen();
    }
    if (this.options.hidePageScrollbars) {
      // Hide the page scrollbars:
      this.bodyOverflowStyle = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
    }
    this.container[0].style.display = 'block';
    this.initSlides();
    this.container.addClass(this.options.displayClass);
  },

  initOptions: function (options) {
    // Create a copy of the prototype options:
    this.options = Helper.extend({}, this.options);
    // Check if carousel mode is enabled:
    if (
      (options && options.carousel) ||
      (this.options.carousel && (!options || options.carousel !== false))
    ) {
      Helper.extend(this.options, this.carouselOptions);
    }
    // Override any given options:
    Helper.extend(this.options, options);
    if (this.num < 3) {
      // 1 or 2 slides cannot be displayed continuous,
      // remember the original option by setting to null instead of false:
      this.options.continuous = this.options.continuous ? null : false;
    }
    if (!this.support.transition) {
      this.options.emulateTouchEvents = false;
    }
    if (this.options.event) {
      this.preventDefault(this.options.event);
    }
  }
});

/*
 * blueimp Gallery Fullscreen JS
 * https://github.com/blueimp/Gallery
 *
 * Copyright 2013, Sebastian Tschan
 * https://blueimp.net
 *
 * Licensed under the MIT license:
 * https://opensource.org/licenses/MIT
 */

/* global window, document */

Helper.extend(Gallery$2.prototype.options, {
  // Defines if the gallery should open in fullscreen mode:
  fullScreen: false
});

var initialize = Gallery$2.prototype.initialize;
var close = Gallery$2.prototype.close;

Helper.extend(Gallery$2.prototype, {
  getFullScreenElement: function () {
    return (
      document.fullscreenElement ||
      document.webkitFullscreenElement ||
      document.mozFullScreenElement ||
      document.msFullscreenElement
    )
  },

  requestFullScreen: function (element) {
    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else if (element.webkitRequestFullscreen) {
      element.webkitRequestFullscreen();
    } else if (element.mozRequestFullScreen) {
      element.mozRequestFullScreen();
    } else if (element.msRequestFullscreen) {
      element.msRequestFullscreen();
    }
  },

  exitFullScreen: function () {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitCancelFullScreen) {
      document.webkitCancelFullScreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
  },

  initialize: function () {
    initialize.call(this);
    if (this.options.fullScreen && !this.getFullScreenElement()) {
      this.requestFullScreen(this.container[0]);
    }
  },

  close: function () {
    if (this.getFullScreenElement() === this.container[0]) {
      this.exitFullScreen();
    }
    close.call(this);
  }
});

/*
 * blueimp Gallery Indicator JS
 * https://github.com/blueimp/Gallery
 *
 * Copyright 2013, Sebastian Tschan
 * https://blueimp.net
 *
 * Licensed under the MIT license:
 * https://opensource.org/licenses/MIT
 */

/* global window, document */

Helper.extend(Gallery$2.prototype.options, {
  // The tag name, Id, element or querySelector of the indicator container:
  indicatorContainer: 'ol',
  // The class for the active indicator:
  activeIndicatorClass: 'active',
  // The list object property (or data attribute) with the thumbnail URL,
  // used as alternative to a thumbnail child element:
  thumbnailProperty: 'thumbnail',
  // Defines if the gallery indicators should display a thumbnail:
  thumbnailIndicators: true
});

var initSlides = Gallery$2.prototype.initSlides;
var addSlide = Gallery$2.prototype.addSlide;
var resetSlides = Gallery$2.prototype.resetSlides;
var handleClick = Gallery$2.prototype.handleClick;
var handleSlide = Gallery$2.prototype.handleSlide;
var handleClose = Gallery$2.prototype.handleClose;

Helper.extend(Gallery$2.prototype, {
  createIndicator: function (obj) {
    var indicator = this.indicatorPrototype.cloneNode(false);
    var title = this.getItemProperty(obj, this.options.titleProperty);
    var thumbnailProperty = this.options.thumbnailProperty;
    var thumbnailUrl;
    var thumbnail;
    if (this.options.thumbnailIndicators) {
      if (thumbnailProperty) {
        thumbnailUrl = this.getItemProperty(obj, thumbnailProperty);
      }
      if (thumbnailUrl === undefined) {
        thumbnail = obj.getElementsByTagName && Helper(obj).find('img')[0];
        if (thumbnail) {
          thumbnailUrl = thumbnail.src;
        }
      }
      if (thumbnailUrl) {
        indicator.style.backgroundImage = 'url("' + thumbnailUrl + '")';
      }
    }
    if (title) {
      indicator.title = title;
    }
    return indicator
  },

  addIndicator: function (index) {
    if (this.indicatorContainer.length) {
      var indicator = this.createIndicator(this.list[index]);
      indicator.setAttribute('data-index', index);
      this.indicatorContainer[0].appendChild(indicator);
      this.indicators.push(indicator);
    }
  },

  setActiveIndicator: function (index) {
    if (this.indicators) {
      if (this.activeIndicator) {
        this.activeIndicator.removeClass(this.options.activeIndicatorClass);
      }
      this.activeIndicator = Helper(this.indicators[index]);
      this.activeIndicator.addClass(this.options.activeIndicatorClass);
    }
  },

  initSlides: function (reload) {
    if (!reload) {
      this.indicatorContainer = this.container.find(
        this.options.indicatorContainer
      );
      if (this.indicatorContainer.length) {
        this.indicatorPrototype = document.createElement('li');
        this.indicators = this.indicatorContainer[0].children;
      }
    }
    initSlides.call(this, reload);
  },

  addSlide: function (index) {
    addSlide.call(this, index);
    this.addIndicator(index);
  },

  resetSlides: function () {
    resetSlides.call(this);
    this.indicatorContainer.empty();
    this.indicators = [];
  },

  handleClick: function (event) {
    var target = event.target || event.srcElement;
    var parent = target.parentNode;
    if (parent === this.indicatorContainer[0]) {
      // Click on indicator element
      this.preventDefault(event);
      this.slide(this.getNodeIndex(target));
    } else if (parent.parentNode === this.indicatorContainer[0]) {
      // Click on indicator child element
      this.preventDefault(event);
      this.slide(this.getNodeIndex(parent));
    } else {
      return handleClick.call(this, event)
    }
  },

  handleSlide: function (index) {
    handleSlide.call(this, index);
    this.setActiveIndicator(index);
  },

  handleClose: function () {
    if (this.activeIndicator) {
      this.activeIndicator.removeClass(this.options.activeIndicatorClass);
    }
    handleClose.call(this);
  }
});

/*
 * blueimp Gallery Video Factory JS
 * https://github.com/blueimp/Gallery
 *
 * Copyright 2013, Sebastian Tschan
 * https://blueimp.net
 *
 * Licensed under the MIT license:
 * https://opensource.org/licenses/MIT
 */

/* global window, document */

Helper.extend(Gallery$2.prototype.options, {
  // The class for video content elements:
  videoContentClass: 'video-content',
  // The class for video when it is loading:
  videoLoadingClass: 'video-loading',
  // The class for video when it is playing:
  videoPlayingClass: 'video-playing',
  // The list object property (or data attribute) for the video poster URL:
  videoPosterProperty: 'poster',
  // The list object property (or data attribute) for the video sources array:
  videoSourcesProperty: 'sources'
});

var handleSlide$1 = Gallery$2.prototype.handleSlide;

Helper.extend(Gallery$2.prototype, {
  handleSlide: function (index) {
    handleSlide$1.call(this, index);
    if (this.playingVideo) {
      this.playingVideo.pause();
    }
  },

  videoFactory: function (obj, callback, videoInterface) {
    var this$1 = this;

    var that = this;
    var options = this.options;
    var videoContainerNode = this.elementPrototype.cloneNode(false);
    var videoContainer = Helper(videoContainerNode);
    var errorArgs = [
      {
        type: 'error',
        target: videoContainerNode
      }
    ];
    var video = videoInterface || document.createElement('video');
    var url = this.getItemProperty(obj, options.urlProperty);
    var type = this.getItemProperty(obj, options.typeProperty);
    var title = this.getItemProperty(obj, options.titleProperty);
    var posterUrl = this.getItemProperty(obj, options.videoPosterProperty);
    var posterImage;
    var sources = this.getItemProperty(obj, options.videoSourcesProperty);
    var source;
    var playMediaControl;
    var isLoading;
    var hasControls;
    videoContainer.addClass(options.videoContentClass);
    if (title) {
      videoContainerNode.title = title;
    }
    if (video.canPlayType) {
      if (url && type && video.canPlayType(type)) {
        video.src = url;
      } else if (sources) {
        while (sources.length) {
          source = sources.shift();
          url = this$1.getItemProperty(source, options.urlProperty);
          type = this$1.getItemProperty(source, options.typeProperty);
          if (url && type && video.canPlayType(type)) {
            video.src = url;
            break
          }
        }
      }
    }
    if (posterUrl) {
      video.poster = posterUrl;
      posterImage = this.imagePrototype.cloneNode(false);
      Helper(posterImage).addClass(options.toggleClass);
      posterImage.src = posterUrl;
      posterImage.draggable = false;
      videoContainerNode.appendChild(posterImage);
    }
    playMediaControl = document.createElement('a');
    playMediaControl.setAttribute('target', '_blank');
    if (!videoInterface) {
      playMediaControl.setAttribute('download', title);
    }
    playMediaControl.href = url;
    if (video.src) {
      video.controls = true
      ;(videoInterface || Helper(video))
        .on('error', function () {
          that.setTimeout(callback, errorArgs);
        })
        .on('pause', function () {
          if (video.seeking) { return }
          isLoading = false;
          videoContainer
            .removeClass(that.options.videoLoadingClass)
            .removeClass(that.options.videoPlayingClass);
          if (hasControls) {
            that.container.addClass(that.options.controlsClass);
          }
          delete that.playingVideo;
          if (that.interval) {
            that.play();
          }
        })
        .on('playing', function () {
          isLoading = false;
          videoContainer
            .removeClass(that.options.videoLoadingClass)
            .addClass(that.options.videoPlayingClass);
          if (that.container.hasClass(that.options.controlsClass)) {
            hasControls = true;
            that.container.removeClass(that.options.controlsClass);
          } else {
            hasControls = false;
          }
        })
        .on('play', function () {
          window.clearTimeout(that.timeout);
          isLoading = true;
          videoContainer.addClass(that.options.videoLoadingClass);
          that.playingVideo = video;
        });
      Helper(playMediaControl).on('click', function (event) {
        that.preventDefault(event);
        if (isLoading) {
          video.pause();
        } else {
          video.play();
        }
      });
      videoContainerNode.appendChild(
        (videoInterface && videoInterface.element) || video
      );
    }
    videoContainerNode.appendChild(playMediaControl);
    this.setTimeout(callback, [
      {
        type: 'load',
        target: videoContainerNode
      }
    ]);
    return videoContainerNode
  }
});

/*
 * blueimp Gallery Vimeo Video Factory JS
 * https://github.com/blueimp/Gallery
 *
 * Copyright 2013, Sebastian Tschan
 * https://blueimp.net
 *
 * Licensed under the MIT license:
 * https://opensource.org/licenses/MIT
 */

/* global window, document, $f */

Helper.extend(Gallery$2.prototype.options, {
  // The list object property (or data attribute) with the Vimeo video id:
  vimeoVideoIdProperty: 'vimeo',
  // The URL for the Vimeo video player, can be extended with custom parameters:
  // https://developer.vimeo.com/player/embedding
  vimeoPlayerUrl:
    '//player.vimeo.com/video/VIDEO_ID?api=1&player_id=PLAYER_ID',
  // The prefix for the Vimeo video player ID:
  vimeoPlayerIdPrefix: 'vimeo-player-',
  // Require a click on the native Vimeo player for the initial playback:
  vimeoClickToPlay: true
});

var textFactory = Gallery$2.prototype.textFactory || Gallery$2.prototype.imageFactory;
var counter = 0;

var VimeoPlayer = function (url, videoId, playerId, clickToPlay) {
  this.url = url;
  this.videoId = videoId;
  this.playerId = playerId;
  this.clickToPlay = clickToPlay;
  this.element = document.createElement('div');
  this.listeners = {};
};

Helper.extend(VimeoPlayer.prototype, {
  canPlayType: function () {
    return true
  },

  on: function (type, func) {
    this.listeners[type] = func;
    return this
  },

  loadAPI: function () {
    var that = this;
    var apiUrl = '//f.vimeocdn.com/js/froogaloop2.min.js';
    var scriptTags = document.getElementsByTagName('script');
    var i = scriptTags.length;
    var scriptTag;
    var called;
    function callback () {
      if (!called && that.playOnReady) {
        that.play();
      }
      called = true;
    }
    while (i) {
      i -= 1;
      if (scriptTags[i].src === apiUrl) {
        scriptTag = scriptTags[i];
        break
      }
    }
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.src = apiUrl;
    }
    Helper(scriptTag).on('load', callback);
    scriptTags[0].parentNode.insertBefore(scriptTag, scriptTags[0]);
    // Fix for cached scripts on IE 8:
    if (/loaded|complete/.test(scriptTag.readyState)) {
      callback();
    }
  },

  onReady: function () {
    var that = this;
    this.ready = true;
    this.player.addEvent('play', function () {
      that.hasPlayed = true;
      that.onPlaying();
    });
    this.player.addEvent('pause', function () {
      that.onPause();
    });
    this.player.addEvent('finish', function () {
      that.onPause();
    });
    if (this.playOnReady) {
      this.play();
    }
  },

  onPlaying: function () {
    if (this.playStatus < 2) {
      this.listeners.playing();
      this.playStatus = 2;
    }
  },

  onPause: function () {
    this.listeners.pause();
    delete this.playStatus;
  },

  insertIframe: function () {
    var iframe = document.createElement('iframe');
    iframe.src = this.url
      .replace('VIDEO_ID', this.videoId)
      .replace('PLAYER_ID', this.playerId);
    iframe.id = this.playerId;
    this.element.parentNode.replaceChild(iframe, this.element);
    this.element = iframe;
  },

  play: function () {
    var that = this;
    if (!this.playStatus) {
      this.listeners.play();
      this.playStatus = 1;
    }
    if (this.ready) {
      if (
        !this.hasPlayed &&
        (this.clickToPlay ||
          (window.navigator &&
            /iP(hone|od|ad)/.test(window.navigator.platform)))
      ) {
        // Manually trigger the playing callback if clickToPlay
        // is enabled and to workaround a limitation in iOS,
        // which requires synchronous user interaction to start
        // the video playback:
        this.onPlaying();
      } else {
        this.player.api('play');
      }
    } else {
      this.playOnReady = true;
      if (!window.$f) {
        this.loadAPI();
      } else if (!this.player) {
        this.insertIframe();
        this.player = $f(this.element);
        this.player.addEvent('ready', function () {
          that.onReady();
        });
      }
    }
  },

  pause: function () {
    if (this.ready) {
      this.player.api('pause');
    } else if (this.playStatus) {
      delete this.playOnReady;
      this.listeners.pause();
      delete this.playStatus;
    }
  }
});

Helper.extend(Gallery$2.prototype, {
  VimeoPlayer: VimeoPlayer,

  textFactory: function (obj, callback) {
    var options = this.options;
    var videoId = this.getItemProperty(obj, options.vimeoVideoIdProperty);
    if (videoId) {
      if (this.getItemProperty(obj, options.urlProperty) === undefined) {
        obj[options.urlProperty] = '//vimeo.com/' + videoId;
      }
      counter += 1;
      return this.videoFactory(
        obj,
        callback,
        new VimeoPlayer(
          options.vimeoPlayerUrl,
          videoId,
          options.vimeoPlayerIdPrefix + counter,
          options.vimeoClickToPlay
        )
      )
    }
    return textFactory.call(this, obj, callback)
  }
});

/*
 * blueimp Gallery YouTube Video Factory JS
 * https://github.com/blueimp/Gallery
 *
 * Copyright 2013, Sebastian Tschan
 * https://blueimp.net
 *
 * Licensed under the MIT license:
 * https://opensource.org/licenses/MIT
 */

/* global window, document, YT */

Helper.extend(Gallery$2.prototype.options, {
  // The list object property (or data attribute) with the YouTube video id:
  youTubeVideoIdProperty: 'youtube',
  // Optional object with parameters passed to the YouTube video player:
  // https://developers.google.com/youtube/player_parameters
  youTubePlayerVars: {
    wmode: 'transparent'
  },
  // Require a click on the native YouTube player for the initial playback:
  youTubeClickToPlay: true
});

var textFactory$1 = Gallery$2.prototype.textFactory || Gallery$2.prototype.imageFactory;

var YouTubePlayer = function (videoId, playerVars, clickToPlay) {
  this.videoId = videoId;
  this.playerVars = playerVars;
  this.clickToPlay = clickToPlay;
  this.element = document.createElement('div');
  this.listeners = {};
};

Helper.extend(YouTubePlayer.prototype, {
  canPlayType: function () {
    return true
  },

  on: function (type, func) {
    this.listeners[type] = func;
    return this
  },

  loadAPI: function () {
    var that = this;
    var onYouTubeIframeAPIReady = window.onYouTubeIframeAPIReady;
    var apiUrl = '//www.youtube.com/iframe_api';
    var scriptTags = document.getElementsByTagName('script');
    var i = scriptTags.length;
    var scriptTag;
    window.onYouTubeIframeAPIReady = function () {
      if (onYouTubeIframeAPIReady) {
        onYouTubeIframeAPIReady.apply(this);
      }
      if (that.playOnReady) {
        that.play();
      }
    };
    while (i) {
      i -= 1;
      if (scriptTags[i].src === apiUrl) {
        return
      }
    }
    scriptTag = document.createElement('script');
    scriptTag.src = apiUrl;
    scriptTags[0].parentNode.insertBefore(scriptTag, scriptTags[0]);
  },

  onReady: function () {
    this.ready = true;
    if (this.playOnReady) {
      this.play();
    }
  },

  onPlaying: function () {
    if (this.playStatus < 2) {
      this.listeners.playing();
      this.playStatus = 2;
    }
  },

  onPause: function () {
    Gallery$2.prototype.setTimeout.call(this, this.checkSeek, null, 2000);
  },

  checkSeek: function () {
    if (
      this.stateChange === YT.PlayerState.PAUSED ||
      this.stateChange === YT.PlayerState.ENDED
    ) {
      // check if current state change is actually paused
      this.listeners.pause();
      delete this.playStatus;
    }
  },

  onStateChange: function (event) {
    switch (event.data) {
      case YT.PlayerState.PLAYING:
        this.hasPlayed = true;
        this.onPlaying();
        break
      case YT.PlayerState.PAUSED:
      case YT.PlayerState.ENDED:
        this.onPause();
        break
    }
    // Save most recent state change to this.stateChange
    this.stateChange = event.data;
  },

  onError: function (event) {
    this.listeners.error(event);
  },

  play: function () {
    var that = this;
    if (!this.playStatus) {
      this.listeners.play();
      this.playStatus = 1;
    }
    if (this.ready) {
      if (
        !this.hasPlayed &&
        (this.clickToPlay ||
          (window.navigator &&
            /iP(hone|od|ad)/.test(window.navigator.platform)))
      ) {
        // Manually trigger the playing callback if clickToPlay
        // is enabled and to workaround a limitation in iOS,
        // which requires synchronous user interaction to start
        // the video playback:
        this.onPlaying();
      } else {
        this.player.playVideo();
      }
    } else {
      this.playOnReady = true;
      if (!(window.YT && YT.Player)) {
        this.loadAPI();
      } else if (!this.player) {
        this.player = new YT.Player(this.element, {
          videoId: this.videoId,
          playerVars: this.playerVars,
          events: {
            onReady: function () {
              that.onReady();
            },
            onStateChange: function (event) {
              that.onStateChange(event);
            },
            onError: function (event) {
              that.onError(event);
            }
          }
        });
      }
    }
  },

  pause: function () {
    if (this.ready) {
      this.player.pauseVideo();
    } else if (this.playStatus) {
      delete this.playOnReady;
      this.listeners.pause();
      delete this.playStatus;
    }
  }
});

Helper.extend(Gallery$2.prototype, {
  YouTubePlayer: YouTubePlayer,

  textFactory: function (obj, callback) {
    var options = this.options;
    var videoId = this.getItemProperty(obj, options.youTubeVideoIdProperty);
    if (videoId) {
      if (this.getItemProperty(obj, options.urlProperty) === undefined) {
        obj[options.urlProperty] = '//www.youtube.com/watch?v=' + videoId;
      }
      if (
        this.getItemProperty(obj, options.videoPosterProperty) === undefined
      ) {
        obj[options.videoPosterProperty] =
          '//img.youtube.com/vi/' + videoId + '/maxresdefault.jpg';
      }
      return this.videoFactory(
        obj,
        callback,
        new YouTubePlayer(
          videoId,
          options.youTubePlayerVars,
          options.youTubeClickToPlay
        )
      )
    }
    return textFactory$1.call(this, obj, callback)
  }
});

/*
 * blueimp Gallery jQuery plugin
 * https://github.com/blueimp/Gallery
 *
 * Copyright 2013, Sebastian Tschan
 * https://blueimp.net
 *
 * Licensed under the MIT license:
 * https://opensource.org/licenses/MIT
 */

/* global window, document */

// Global click handler to open links with data-gallery attribute
// in the Gallery lightbox:

$(document).on('click', '[data-gallery]', function (event) {
  event.preventDefault();

  // Get the container id from the data-gallery attribute:
  var id = $(event.target).data('gallery');
  var widget = $(id);
  var container = (widget.length && widget) || $(Gallery$2.prototype.options.container);

  var callbacks = {
    onopen: function () {
      container.data('gallery', Gallery$2).trigger('open');
    },
    onopened: function () {
      container.trigger('opened');
    },
    onslide: function () {
      container.trigger('slide', arguments);
    },
    onslideend: function () {
      container.trigger('slideend', arguments);
    },
    onslidecomplete: function () {
      container.trigger('slidecomplete', arguments);
    },
    onclose: function () {
      container.trigger('close');
    },
    onclosed: function () {
      container.trigger('closed').removeData('gallery');
    }
  };

  var options = $.extend(
    // Retrieve custom options from data-attributes
    // on the Gallery widget:
    container.data(),
    { container: container[0], index: event.currentTarget, event: event },
    callbacks
  );

  // Select all links with the same data-gallery attribute:
  var links = (id !== undefined) ? $(("[data-gallery=" + id + "]")) : $('[data-gallery]');
  if (options.filter) { links = links.filter(options.filter); }

  return new Gallery$2(links, options)
});

var css = "@charset \"UTF-8\";\n/*\n * blueimp Gallery CSS\n * https://github.com/blueimp/Gallery\n *\n * Copyright 2013, Sebastian Tschan\n * https://blueimp.net\n *\n * Licensed under the MIT license:\n * https://opensource.org/licenses/MIT\n */\n\n.blueimp-gallery,\n.blueimp-gallery > .slides > .slide > .slide-content {\n  position: absolute;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  /* Prevent artifacts */\n  -webkit-backface-visibility: hidden;\n     -moz-backface-visibility: hidden;\n          backface-visibility: hidden;\n}\n.blueimp-gallery > .slides > .slide > .slide-content {\n  margin: auto;\n  width: auto;\n  height: auto;\n  max-width: 100%;\n  max-height: 100%;\n  opacity: 1;\n}\n.blueimp-gallery {\n  position: fixed;\n  z-index: 999999;\n  overflow: hidden;\n  background: #000;\n  background: rgba(0, 0, 0, 0.9);\n  opacity: 0;\n  display: none;\n  direction: ltr;\n  touch-action: none;\n}\n.blueimp-gallery-carousel {\n  position: relative;\n  z-index: auto;\n  margin: 1em auto;\n  /* Set the carousel width/height ratio to 16/9: */\n  padding-bottom: 56.25%;\n  -webkit-box-shadow: 0 0 10px #000;\n          box-shadow: 0 0 10px #000;\n  touch-action: pan-y;\n}\n.blueimp-gallery-display {\n  display: block;\n  opacity: 1;\n}\n.blueimp-gallery > .slides {\n  position: relative;\n  height: 100%;\n  overflow: hidden;\n}\n.blueimp-gallery-carousel > .slides {\n  position: absolute;\n}\n.blueimp-gallery > .slides > .slide {\n  position: relative;\n  float: left;\n  height: 100%;\n  text-align: center;\n  -webkit-transition-timing-function: cubic-bezier(0.645, 0.045, 0.355, 1.000);\n     -moz-transition-timing-function: cubic-bezier(0.645, 0.045, 0.355, 1.000);\n       -o-transition-timing-function: cubic-bezier(0.645, 0.045, 0.355, 1.000);\n          transition-timing-function: cubic-bezier(0.645, 0.045, 0.355, 1.000);\n}\n.blueimp-gallery,\n.blueimp-gallery > .slides > .slide > .slide-content {\n  -webkit-transition: opacity 0.2s linear;\n  -o-transition: opacity 0.2s linear;\n  -moz-transition: opacity 0.2s linear;\n  transition: opacity 0.2s linear;\n}\n.blueimp-gallery > .slides > .slide-loading {\n  background: url('data:image/gif;base64,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') center no-repeat;\n  -o-background-size: 64px 64px;\n     background-size: 64px 64px;\n}\n.blueimp-gallery > .slides > .slide-loading > .slide-content {\n  opacity: 0;\n}\n.blueimp-gallery > .slides > .slide-error {\n  background: url('data:image/png;base64,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') center no-repeat;\n}\n.blueimp-gallery > .slides > .slide-error > .slide-content {\n  display: none;\n}\n.blueimp-gallery > .prev,\n.blueimp-gallery > .next {\n  position: absolute;\n  top: 50%;\n  left: 15px;\n  width: 40px;\n  height: 40px;\n  margin-top: -23px;\n  font-family: \"Helvetica Neue\", Helvetica, Arial, sans-serif;\n  font-size: 60px;\n  font-weight: 100;\n  line-height: 30px;\n  color: #fff;\n  text-decoration: none;\n  text-shadow: 0 0 2px #000;\n  text-align: center;\n  background: #222;\n  background: rgba(0, 0, 0, 0.5);\n  -webkit-box-sizing: content-box;\n     -moz-box-sizing: content-box;\n          box-sizing: content-box;\n  border: 3px solid #fff;\n  -webkit-border-radius: 23px;\n          border-radius: 23px;\n  opacity: 0.5;\n  cursor: pointer;\n  display: none;\n}\n.blueimp-gallery > .next {\n  left: auto;\n  right: 15px;\n}\n.blueimp-gallery > .close,\n.blueimp-gallery > .title {\n  position: absolute;\n  top: 15px;\n  left: 15px;\n  margin: 0 40px 0 0;\n  font-size: 20px;\n  line-height: 30px;\n  color: #fff;\n  text-shadow: 0 0 2px #000;\n  opacity: 0.8;\n  display: none;\n}\n.blueimp-gallery > .close {\n  padding: 15px;\n  right: 15px;\n  left: auto;\n  margin: -15px;\n  font-size: 30px;\n  text-decoration: none;\n  cursor: pointer;\n}\n.blueimp-gallery > .play-pause {\n  position: absolute;\n  right: 15px;\n  bottom: 15px;\n  width: 15px;\n  height: 15px;\n  background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAPCAYAAAGEvU8KAAAABmJLR0QA/wD/AP+gvaeTAAACE0lEQVQ4y7VTPajaUBT+IhE13jQ86GBx6dapo+CWDKVQOtSlUBcDneTRrSAUqfcOTqWLk6uznbtKCt3sVFAKHaxF6uRfoi9qbU+XxBd/+rT2vQ8uudzznfPdnPNdYB9WqxUBEJxz2o0SEQEIe1GxPozFYlOPIzjn5BNkAFBVdeC67m2/imVZG1Uf4W/gnJPjOARAC+iDiCgEAIwxMMb624nycDiEJEmSfyCE2PiiVCpRIpFwANzfoyw456TrOgGAruvrPwoBgCRJ6Pf7jIg+ExE1m03SNO1bUM0wDACAYRhr1VBQolAo/IpGo+epVEqaTCZ3cSQe4ERkT00MAbhXr9d/M8Y+7iMEG7TdPAAQ5KFYLLqRSOTt9pC9wQqf69tvo2Hlcjk6n89fptPpKYDHx1x7A5VKhdrt9hsA7w8ly/5msVjg7OzswnVdBoCObRiy2ewiHo8/cV03vp1oWdalFT3DBJ9F7tRR+YYXsiy/VhSladv2CwCf/qGG4a2NC3vrqtjlwyEiWi6XVK1Wf2qaNmOM1QHcOSC8zg1YQByK7Uw5HA4jn8/L4/FYcRznaa/X+2Ga5lRRlIksy68ARHANCB0iJJNJ1Gq1eKfTuZXJZEqqqn4H8PB/heWrgq1WC7lc7qLb7X4ZDAbPAHzFNWFHuNFowDRNdzabfRiNRs8B9HEDWLtakqSSqqrvbNs+BzC4aVf/AaEAFTjRreu2AAAAAElFTkSuQmCC') 0 0 no-repeat;\n  cursor: pointer;\n  opacity: 0.5;\n  display: none;\n}\n.blueimp-gallery-playing > .play-pause {\n  background-position: -15px 0;\n}\n.blueimp-gallery > .prev:hover,\n.blueimp-gallery > .next:hover,\n.blueimp-gallery > .close:hover,\n.blueimp-gallery > .title:hover,\n.blueimp-gallery > .play-pause:hover {\n  color: #fff;\n  opacity: 1;\n}\n.blueimp-gallery-controls > .prev,\n.blueimp-gallery-controls > .next,\n.blueimp-gallery-controls > .close,\n.blueimp-gallery-controls > .title,\n.blueimp-gallery-controls > .play-pause {\n  display: block;\n  /* Fix z-index issues (controls behind slide element) on Android: */\n  -webkit-transform: translateZ(0);\n     -moz-transform: translateZ(0);\n          transform: translateZ(0);\n}\n.blueimp-gallery-single > .prev,\n.blueimp-gallery-left > .prev,\n.blueimp-gallery-single > .next,\n.blueimp-gallery-right > .next,\n.blueimp-gallery-single > .play-pause {\n  display: none;\n}\n.blueimp-gallery > .slides > .slide > .slide-content,\n.blueimp-gallery > .prev,\n.blueimp-gallery > .next,\n.blueimp-gallery > .close,\n.blueimp-gallery > .play-pause {\n  -webkit-user-select: none;\n     -moz-user-select: none;\n      -ms-user-select: none;\n          user-select: none;\n}\n\n/* Replace PNGs with SVGs for capable browsers (excluding IE<9) */\nbody:last-child .blueimp-gallery > .slides > .slide-error {\n  background-image: url('data:image/svg+xml;charset=utf-8,%3C%3Fxml%20version%3D%221.0%22%20encoding%3D%22UTF-8%22%3F%3E%0A%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20version%3D%221.1%22%20width%3D%2264%22%20height%3D%2264%22%3E%0A%09%3Ccircle%20cx%3D%2232%22%20cy%3D%2232%22%20r%3D%2225%22%20stroke%3D%22red%22%20stroke-width%3D%227%22%20fill%3D%22black%22%20fill-opacity%3D%220.2%22%2F%3E%0A%09%3Crect%20x%3D%2228%22%20y%3D%227%22%20width%3D%228%22%20height%3D%2250%22%20fill%3D%22red%22%20transform%3D%22rotate(45%2C%2032%2C%2032)%22%2F%3E%0A%3C%2Fsvg%3E');\n}\nbody:last-child .blueimp-gallery > .play-pause {\n  width: 20px;\n  height: 20px;\n  -o-background-size: 40px 20px;\n     background-size: 40px 20px;\n  background-image: url('data:image/svg+xml;charset=utf-8,%3C%3Fxml%20version%3D%221.0%22%20encoding%3D%22UTF-8%22%3F%3E%0A%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20version%3D%221.1%22%20width%3D%2230%22%20height%3D%2215%22%3E%0A%09%3Cpolygon%20points%3D%222%2C1%202%2C14%2013%2C7%22%20stroke%3D%22black%22%20stroke-width%3D%221%22%20fill%3D%22white%22%2F%3E%0A%09%3Crect%20x%3D%2217%22%20y%3D%222%22%20width%3D%224%22%20height%3D%2211%22%20stroke%3D%22black%22%20stroke-width%3D%221%22%20fill%3D%22white%22%2F%3E%0A%09%3Crect%20x%3D%2224%22%20y%3D%222%22%20width%3D%224%22%20height%3D%2211%22%20stroke%3D%22black%22%20stroke-width%3D%221%22%20fill%3D%22white%22%2F%3E%0A%3C%2Fsvg%3E');\n}\nbody:last-child .blueimp-gallery-playing > .play-pause {\n  background-position: -20px 0;\n}\n\n/* IE7 fixes */\n*+html .blueimp-gallery > .slides > .slide {\n  min-height: 300px;\n}\n*+html .blueimp-gallery > .slides > .slide > .slide-content {\n  position: relative;\n}\n";
__$$styleInject(css);

var css$2 = "@charset \"UTF-8\";\n/*\n * blueimp Gallery Indicator CSS\n * https://github.com/blueimp/Gallery\n *\n * Copyright 2013, Sebastian Tschan\n * https://blueimp.net\n *\n * Licensed under the MIT license:\n * https://opensource.org/licenses/MIT\n */\n\n.blueimp-gallery > .indicator {\n  position: absolute;\n  top: auto;\n  right: 15px;\n  bottom: 15px;\n  left: 15px;\n  margin: 0 40px;\n  padding: 0;\n  list-style: none;\n  text-align: center;\n  line-height: 10px;\n  display: none;\n}\n.blueimp-gallery > .indicator > li {\n  display: inline-block;\n  width: 9px;\n  height: 9px;\n  margin: 6px 3px 0 3px;\n  -webkit-box-sizing: content-box;\n     -moz-box-sizing: content-box;\n          box-sizing: content-box;\n  border: 1px solid transparent;\n  background: #ccc;\n  background: rgba(255, 255, 255, 0.25) center no-repeat;\n  -webkit-border-radius: 5px;\n          border-radius: 5px;\n  -webkit-box-shadow: 0 0 2px #000;\n          box-shadow: 0 0 2px #000;\n  opacity: 0.5;\n  cursor: pointer;\n}\n.blueimp-gallery > .indicator > li:hover,\n.blueimp-gallery > .indicator > .active {\n  background-color: #fff;\n  border-color: #fff;\n  opacity: 1;\n}\n\n\n.blueimp-gallery > .indicator > li:after {\n  opacity: 0;\n  display: block;\n  position: absolute;\n  content: '';\n  top: -5em;\n  width: 75px;\n  height: 75px;\n  -webkit-transition: opacity 400ms ease-out, -webkit-transform 600ms ease-out;\n  transition: opacity 400ms ease-out, -webkit-transform 600ms ease-out;\n  -o-transition: opacity 400ms ease-out, -o-transform 600ms ease-out;\n  -moz-transition: transform 600ms ease-out, opacity 400ms ease-out, -moz-transform 600ms ease-out;\n  transition: transform 600ms ease-out, opacity 400ms ease-out;\n  transition: transform 600ms ease-out, opacity 400ms ease-out, -webkit-transform 600ms ease-out, -moz-transform 600ms ease-out, -o-transform 600ms ease-out;\n  -webkit-transform: translateX(-50%) translateY(0) translateZ(0px);\n     -moz-transform: translateX(-50%) translateY(0) translateZ(0px);\n          transform: translateX(-50%) translateY(0) translateZ(0px);\n  pointer-events:none;\n}\n\n.blueimp-gallery > .indicator > li:hover:after {\n  opacity: 1;\n  -webkit-border-radius: 50%;\n          border-radius: 50%;\n  background: inherit;\n  -webkit-transform: translateX(-50%) translateY(-5px) translateZ(0px);\n     -moz-transform: translateX(-50%) translateY(-5px) translateZ(0px);\n          transform: translateX(-50%) translateY(-5px) translateZ(0px);\n}\n\n.blueimp-gallery > .indicator > .active:after {\n  display: none;\n}\n\n.blueimp-gallery-controls > .indicator {\n  display: block;\n  /* Fix z-index issues (controls behind slide element) on Android: */\n  -webkit-transform: translateZ(0);\n     -moz-transform: translateZ(0);\n          transform: translateZ(0);\n}\n.blueimp-gallery-single > .indicator {\n  display: none;\n}\n.blueimp-gallery > .indicator {\n  -webkit-user-select: none;\n     -moz-user-select: none;\n      -ms-user-select: none;\n          user-select: none;\n}\n\n/* IE7 fixes */\n*+html .blueimp-gallery > .indicator > li {\n  display: inline;\n}\n";
__$$styleInject(css$2);

var css$4 = "@charset \"UTF-8\";\n/*\n * blueimp Gallery Video Factory CSS\n * https://github.com/blueimp/Gallery\n *\n * Copyright 2013, Sebastian Tschan\n * https://blueimp.net\n *\n * Licensed under the MIT license:\n * https://opensource.org/licenses/MIT\n */\n\n.blueimp-gallery > .slides > .slide > .video-content > img {\n  position: absolute;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  margin: auto;\n  width: auto;\n  height: auto;\n  max-width: 100%;\n  max-height: 100%;\n  /* Prevent artifacts: */\n  -webkit-backface-visibility: hidden;\n     -moz-backface-visibility: hidden;\n          backface-visibility: hidden;\n}\n.blueimp-gallery > .slides > .slide > .video-content > video {\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n}\n.blueimp-gallery > .slides > .slide > .video-content > iframe {\n  position: absolute;\n  top: 100%;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  border: none;\n}\n.blueimp-gallery > .slides > .slide > .video-playing > iframe {\n  top: 0;\n}\n.blueimp-gallery > .slides > .slide > .video-content > a {\n  position: absolute;\n  top: 50%;\n  right: 0;\n  left: 0;\n  margin: -64px auto 0;\n  width: 128px;\n  height: 128px;\n  background: url('data:image/png;base64,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') center no-repeat;\n  opacity: 0.8;\n  cursor: pointer;\n}\n.blueimp-gallery > .slides > .slide > .video-content > a:hover {\n  opacity: 1;\n}\n.blueimp-gallery > .slides > .slide > .video-playing > a,\n.blueimp-gallery > .slides > .slide > .video-playing > img {\n  display: none;\n}\n.blueimp-gallery > .slides > .slide > .video-content > video {\n  display: none;\n}\n.blueimp-gallery > .slides > .slide > .video-playing > video {\n  display: block;\n}\n.blueimp-gallery > .slides > .slide > .video-loading > a {\n  background: url('data:image/gif;base64,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') center no-repeat;\n  -o-background-size: 64px 64px;\n     background-size: 64px 64px;\n}\n\n/* Replace PNGs with SVGs for capable browsers (excluding IE<9) */\nbody:last-child .blueimp-gallery > .slides > .slide > .video-content:not(.video-loading) > a {\n  background-image: url('data:image/svg+xml;charset=utf-8,%3C%3Fxml%20version%3D%221.0%22%20encoding%3D%22UTF-8%22%3F%3E%0A%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20version%3D%221.1%22%20width%3D%2264%22%20height%3D%2264%22%3E%0A%09%3Ccircle%20cx%3D%2232%22%20cy%3D%2232%22%20r%3D%2225%22%20stroke%3D%22white%22%20stroke-width%3D%227%22%20fill%3D%22black%22%20fill-opacity%3D%220.2%22%2F%3E%0A%09%3Cpolygon%20points%3D%2226%2C22%2026%2C42%2043%2C32%22%20fill%3D%22white%22%2F%3E%0A%3C%2Fsvg%3E');\n}\n\n/* IE7 fixes */\n*+html .blueimp-gallery > .slides > .slide > .video-content {\n  height: 100%;\n}\n*+html .blueimp-gallery > .slides > .slide > .video-content > a {\n  left: 50%;\n  margin-left: -64px;\n}\n";
__$$styleInject(css$4);

if (typeof window !== 'undefined') {
  window.blueimp = window.blueimp || {};
  window.blueimp.Gallery = Gallery$2;
}

export default Gallery$2;
//# sourceMappingURL=jquery.blueimp-gallery.esm.js.map
