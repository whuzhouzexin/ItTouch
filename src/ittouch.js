/*
*author zzx
*email 1065883237@qq.com
*date 2017.07.29
*/

(function (global, factory) {
    if (typeof module === 'obeject' && typeof module.exports == 'object') {
        return module.exports = factory(global);
    }
    else if (typeof define === 'fsunction') {
        return define(factory(global));
    }
    else {
        global.ItTouch = factory(global);
    }
})(window, function (global) {
    // toString func
    var _toString = Object.prototype.toString;
    // 属性描述器
    var _getDesriptor = Object.getOwnPropertyDescriptor;
    // slice
    var slice = [].slice;
    (function () {
        var lastTime = 0;
        var vendors = ['webkit', 'moz'];
        for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
            window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
            window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || // Webkit中此取消方法的名字变了
            window[vendors[x] + 'CancelRequestAnimationFrame'];
        }

        if (!window.requestAnimationFrame) {
            window.requestAnimationFrame = function (callback, element) {
                var currTime = new Date().getTime();
                var timeToCall = Math.max(0, 16.7 - (currTime - lastTime));
                var id = window.setTimeout(function () {
                    callback(currTime + timeToCall);
                }, timeToCall);
                lastTime = currTime + timeToCall;
                return id;
            };
        }

        if (!window.cancelAnimationFrame) {
            window.cancelAnimationFrame = function (id) {
                clearTimeout(id);
            };
        }

    }());
    var _ease = {
        quadratic: {
            style: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            fn: function (k) {
                return k * (2 - k);
            }
        },
        circular: {
            style: 'cubic-bezier(0.1, 0.57, 0.1, 1)', // Not properly "circular" but this looks better, it should be (0.075, 0.82, 0.165, 1)
            fn: function (k) {
                return Math.sqrt(1 - (--k * k));
            }
        },
        back: {
            style: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            fn: function (k) {
                var b = 4;
                return (k = k - 1) * k * ((b + 1) * k + b) + 1;
            }
        },
        tm: {
            style: 'cubic-bezier(0.22, 0.61, 0.35, 1)',
            fn: function () {

            }
        }
    };
    // 是不是dom元素
    function _isHtmlNode(node) {
        return node && node.nodeType === 1 && node.onclick !== undefined;
    }
    // 是不是plain对象
    function _isPlainObject(obj) {
        return (obj) !== null && _toString.call(obj) == '[object Object]';
    }
    // 是不是字符串
    function _isString(str) {
        return typeof str === 'string';
    }
    // ease
    function reverseEase(y) {
        return 1 - Math.sqrt(1 - y * y);
    }
    // 扩展方法
    function _extend(target, obj) {
        var opts = slice.call(arguments);
        var target = opts[0];
        var objs = opts.slice(1);
        if (opts.length === 1) {
            objs = opts;
            target = this;
        }

        opts = null;
        if (!_isPlainObject(target) && !_isFunction(target)) {
            target = {};
        }

        for (var i in objs) {
            if (_isPlainObject(objs[i])) {
                for (var key in objs[i]) {
                    if (objs[i].hasOwnProperty(key)) {
                        if (_isPlainObject(objs[i][key])) {
                            _extend(target[key], objs[i][key]);
                        }

                        target[key] = objs[i][key];
                    }

                }
            }

        }
        return target;
    }

    function _noop() {
    }

    var BROWSER_PREFIX = '';
    var TRANSITION_END_EVENT = '';
    (function () {
        var e = document.createElement('div');
        [
            ['WebkitTransition', 'webkitTransitionEnd', 'webkit'],
            ['transition', 'transitionend', null],
            ['MozTransition', 'transitionend', 'moz'],
            ['OTransition', 'oTransitionEnd', 'o']
        ].some(function (t) {
            if (e.style[t[0]] !== undefined) {
                TRANSITION_END_EVENT = t[1];
                BROWSER_PREFIX = t[2];
                return true;
            }

        });
    })();
    function _once(callback) {
        var isDone = false;
        return function () {
            if (!isDone) {
                isDone = true;
                callback();
            }

        };
    }
    // 判断是不是方法
    function _isFunction(func) {
        return typeof func === 'function';
    }
    // 获取时间
    function _getTime() {
        return new Date().getTime();
    }

    // 判断是否是boolean
    function _isBoolean(bool) {
        return typeof bool === 'boolean';
    }
    // 第一个字符转为大写
    function _IU(word) {
        return word.replace(/^[a-z]/, function (t) {
            return t.toUpperCase();
        });
    }
    // 绑定事件
    function _addEvent(dom, type, callback, isCancerBuble) {

        if (dom.addEventListener) {
            return dom.addEventListener(type, callback, !!isCancerBuble);
        }
        else if (dom.attachEvent) {
            return dom.attachEvent('on' + type, callback);
        }

        return dom['on' + type] = callback;
    }
    function _removeEvent(dom, type, callback, isCancerBuble) {
        if (dom.removeEventListener) {

            return dom.removeEventListener(type, callback, !!isCancerBuble);
        }
        else if (dom.detachEvent) {
            return dom.detachEvent('on' + type, callback);
        }

        return dom['on' + type] = _noop;
    }

    function _getRect(el) {
        if (el instanceof SVGElement) {
            var rect = el.getBoundingClientRect();
            return {
                top: rect.top,
                left: rect.left,
                width: rect.width,
                height: rect.height
            };
        }
        else {
            return {
                top: el.offsetTop,
                left: el.offsetLeft,
                width: el.offsetWidth,
                height: el.offsetHeight
            };
        }
    }

    function _getCubicBezier(type) {
        return (_ease[type] && _ease[type].style) || 'cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    }

    /**
     * @param {String} selector
     * @private
     */
    function _querySelector(selector) {
        if (!_isString(selector)) {
            selector = 'body';
        }

        return document.querySelector(selector);
    }

    function _getTouchEventTypes() {
        var hasTouch = !!(('ontouchstart' in global && !/Mac OS X /.test(global.navigator.userAgent)) || global.DocumentTouch && document instanceof global.DocumentTouch);
        return {
            hasTouch: hasTouch,
            startEvt: hasTouch ? 'touchstart' : 'mousedown',
            moveEvt: hasTouch ? 'touchmove' : 'mousemove',
            endEvt: hasTouch ? 'touchend' : 'mouseup',
            cancelEvt: hasTouch ? 'touchcancel' : 'mouseout',
            resizeEvt: 'onorientationchange' in global ? 'orientationchange' : 'resize'
        };
    }
    function _addDistinations(current, distance, time, wrapSize, deceleration) {
        var speed = distance / time
        var ease = 'tm'
        var destination = current + (speed * speed ) / (2 * deceleration) * (distance < 0 ? -1 : 1);

		var finalDesti = 0;
        var loginMargin = this.opts.maxScrollY
        if(distance >= 0) {
            loginMargin = this.opts.minScrollY
            if(destination > loginMargin) {
                destination = loginMargin
                ease = 'quadratic'
            }
        } else {
            if(destination < loginMargin ) {
                destination = loginMargin
                ease = 'quadratic'
            }
        }

        var size = Math.abs(destination - current)
        var ratio = size / wrapSize
        time = ratio * 450

        return {
            destination: Math.round(destination),
            duration: time,
            ease: ease
        }
    }

    function isSupportsPassive() {
        var supportsPassive = false;
        try {
            var opts = Object.defineProperty({}, 'passive', {
            get: function() {
                supportsPassive = true;
            }
            });
            window.addEventListener("test", null, opts);
        } catch (e) {

        }
        return supportsPassive
    }
    function preventDefaultException (el, exceptions) {
		for ( var i in exceptions ) {
			if ( exceptions[i].test(el[i]) ) {
				return true;
			}
		}

		return false;
	};
    function ItTouch(opts) {
        if (!(this instanceof ItTouch)) {
            return new ItTouch(opts);
        }

        this.initOptions(opts);
        this.bindEvent();
    }

    var ItTouchPro = ItTouch.prototype = {
        initOptions: function (opts) {
            var defaultOpts = {
                dom: 'body',
                touchMove: _noop,
                touchStart: _noop,
                preventDefaultException: { tagName: /^(INPUT|TEXTAREA|BUTTON|SELECT)$/ },
                touchEnd: _noop,
                minScrollY: 0,
                maxScrollY: 0,
                isScrollY: true,
                isPreventDefault: true,
                bounceTop: 30,
                bounceBottom: -30,
                deceleration: 0.001,
                isMoment: true,
                target: global,
                ease: 'quadratic'
            };
            this.opts = this.extend(defaultOpts, opts);
            this.eventTypes = _getTouchEventTypes();
            opts = null;
            if (_isHtmlNode(this.opts.dom)) {
                this.container = this.opts.dom;
            }
            else {
                this.container = _querySelector(this.opts.dom);
            }

            if (!_isHtmlNode(this.container)) {
                this.container = _querySelector('body');
            }

            this.offsetX = 0;
            this.offsetY = 0;
            this.isSrcoll = false;
            this.containerHeight = this.container.offsetHeight;
            this.containerWidth = this.container.offsetWidth;
            this.move = [];
            this.maxRegion = this.opts.maxRegion || 600;
            this.springMaxRegion = this.opts.springMaxRegion || 60;
            this.wrapperHeight = _getRect(this.container.parentNode).height;
            this.opts.maxScrollY = this.opts.maxScrollY ? this.opts.maxScrollY : (this.wrapperHeight - this.containerHeight);
        },
        startFn: function (e) {

            this.isMove = false;
            this.$touchStartTime = _getTime();
            this.isSrcoll = false;
            this.isMove = false;
            this.isStart = true;
            this.$touchStartPageY = this.$initPointY = this.eventTypes.hasTouch ? e.touches[0].pageY : e.pageY;
            this.$touchStartPageX = this.$initPointX = this.eventTypes.hasTouch ? e.touches[0].pageY : e.pageX;
            this.initPointY = this.$touchStartPageY;
            this.initPointX = this.$touchStartPageX;
            this.startX = this.offsetX;
            this.startY = this.offsetY;

            this.opts.touchStart(e, this);
        },
        moveFn: function (e) {

            if(this.isStart) {
                if (this.opts.isPreventDefault) {
                    e.preventDefault();
                    e.stopPropagation();
                }
                this.$touchMoveTime = _getTime();
                this.startMoveGapTime = this.$touchMoveTime - this.$touchStartTime;
                this.$touchMovePageY = this.eventTypes.hasTouch ? e.touches[0].pageY : e.pageY;
                this.$touchMovePageX = this.eventTypes.hasTouch ? e.touches[0].pageY : e.pageX;
                this.$moveGapY = parseInt(this.$touchMovePageY - this.$touchStartPageY, 10);
                this.$moveGapX = parseInt(this.$touchMovePageX - this.$touchStartPageX, 10);
                this.$touchStartPageY = this.$touchMovePageY;
                this.$touchStartPageX = this.$touchMovePageX;
                if (!this.isStart) {
                    return false;
                }

                this.offsetY += this.$moveGapY;
                this.offsetX += this.$moveGapX;

                if (Math.abs(this.$moveGapY) > 10 || Math.abs(this.$moveGapX) > 10) {
                    this.isSrcoll = true;
                }

                if (this.offsetY > (this.opts.minScrollY + this.opts.bounceTop)) {
                    this.offsetY = this.opts.minScrollY + this.opts.bounceTop;
                }

                if (Math.abs(this.offsetY + this.opts.bounceBottom) > Math.abs(this.opts.maxScrollY)) {
                    this.offsetY = this.opts.maxScrollY + this.opts.bounceBottom;
                }
                this.setStyle(this.container, 'transitionTimingFunction', _getCubicBezier(this.opts.ease));
                // this.translateY(this.offsetY);
                if ((this.$touchMoveTime - this.$touchStartTime) > 300) {
                    this.startY = this.offsetY;
                    this.startX = this.offsetX;
                }
                this.translateY(this.offsetY);
                this.opts.touchMove(e, this);
                this.isMove = true;
            }
        },
        endFn: function (e) {

            this.isStart = false;
            this.isMove = false;
            this.$touchEndTime = _getTime();

            var duration = this.$touchEndTime - this.$touchStartTime;
            this.$touchEndPageY = this.eventTypes.hasTouch ? e.changedTouches[0].pageY : e.pageY;
            this.$touchEndPageX = this.eventTypes.hasTouch ? e.changedTouches[0].pageY : e.pageX;
			var distance = this.$touchEndPageY - this.$initPointY

			if (this.opts.isMoment && duration < 300) {

                if (this.opts.isScrollY) {

                    var momentumY = _addDistinations.call(this, this.offsetY, distance, duration, this.wrapperHeight, this.opts.deceleration);
                    var offsetY = momentumY.destination;
                    var time = momentumY.duration;
                    var ease = momentumY.ease
                    this.setStyle(this.container, 'transitionTimingFunction', _getCubicBezier(ease));
                    this.setStyle(this.container, 'transitionDuration', time + 'ms');
                    this.offsetY = offsetY;
                    this.translateY(this.offsetY);
                }
            } else {

                var dist = 0
                if(this.offsetY >= this.opts.minScrollY) {
                    dist = this.offsetY - this.opts.minScrollY
                    this.offsetY = this.opts.minScrollY
                    this.setStyle(this.container, 'transitionTimingFunction', _getCubicBezier(this.opts.ease));
                    this.setStyle(this.container, 'transitionDuration', dist * 10 + 'ms');
                    this.translateY(this.offsetY)

                }
                if(this.offsetY < this.opts.maxScrollY) {

                    dist = this.opts.maxScrollY - this.offsetY
                    this.offsetY = this.opts.maxScrollY
                    this.setStyle(this.container, 'transitionTimingFunction', _getCubicBezier(this.opts.ease));
                    this.setStyle(this.container, 'transitionDuration', dist * 10 + 'ms');
                    this.translateY(this.offsetY)

                }
            }

            this.opts.touchEnd(e, this);
        },
        transitionEnd: function (e) {
            e.stopPropagation();
            this.isMove = false;
            this.setStyle(this.container, 'transitionDuration', '0ms');

        },
        bindEvent: function () {
            _addEvent(global, 'orientationchange', this)
            _addEvent(global, 'resize', this)
            _addEvent(this.container, this.eventTypes.startEvt, this, false);
            // 绑定touchmove
            _addEvent(this.opts.target, this.eventTypes.moveEvt, this, false);
            // 绑定touchend
            _addEvent(this.opts.target, this.eventTypes.endEvt, this, false);
            // if (!this.eventTypes.hasTouch) {
            //     _addEvent(this.container, 'mouseleave', this, false);
            // }

            _addEvent(this.container, TRANSITION_END_EVENT, this);
        },
        moveLeave: function (e) {
            this.isStart = false;
        },
        refresh: function () {
            this.containerHeight = this.container.offsetHeight;
            this.containerWidth = this.container.offsetWidth;
            this.opts.maxScrollY = this.wrapperHeight - this.containerHeight;
        },
        scrollTo: function (x, y) {
            this.translate(x, y);
        },
        addEase: function (obj) {
            extend(_ease, obj);
        },
        handleEvent: function (e) {

            switch (e.type) {
                case 'touchstart':
                case 'mousedown':
                    this.startFn(e);
                    break;
                case 'touchmove':
                case 'mousemove':
                    this.moveFn(e);
                    break;
                case 'touchend':
                case 'mouseup':
                case 'touchcancel':
                case 'mousecancel':
                    this.endFn(e);
                    break;
                case 'touchend':
                case 'leave':
                    this.mouseleave(e);
                    break;
                case TRANSITION_END_EVENT:
                    if (e.target != this.container) {
                        return false;
                    }

                    this.transitionEnd(e);
                    break;
                default:
                    break;
            }
        },
        _animate: function (destX, destY, duration, easingFn) {
            var that = this;
            var startX = this.offsetX;
            var startY = this.offsetY;
            var startTime = _getTime();
            var destTime = startTime + duration;

            function step() {
                var now = _getTime();
                var newX;
                var newY;
                var easing;

                if (now >= destTime) {
                    that.isAnimating = false;
                    that.translate(destX, destY);
                    return;
                }

                now = (now - startTime) / duration;
                easing = easingFn(now);
                newX = (destX - startX) * easing + startX;
                newY = (destY - startY) * easing + startY;
                that.translate(newX, newY);

                if (that.isAnimating) {
                    requestAnimationFrame(step);
                }
            }

            this.isAnimating = true;
            step();
        },
        destory: function () {
            BROWSER_PREFIX = undefined;
            TRANSITION_END_EVENT = undefined;
            this.removeEvent(this.container, this.eventTypes.startEvt, this);
            this.removeEvent(this.container, this.eventTypes.moveEvt, this);
            this.removeEvent(this.container, this.eventTypes.endEvt, this);
            for (var key in this) {
                try {
                    if (this.hasOwnProperty(key)) {
                        delete this[key];
                    }
                    else {
                        this[key] = undefined;
                    }
                }
                catch (e) {
                    console.log(e);
                }
            }
        }
    };
    ItTouch.extend = ItTouchPro.extend = _extend;
    ItTouchPro.querySelector = _querySelector;
    ItTouchPro.addEvent = _addEvent;
    ItTouchPro.removeEvent = _removeEvent;
    ItTouchPro.once = _once;

    /**
     * @param {String} prop
     * @param {String} value
     * @returns {String}
     * @public
     */

    ItTouchPro.styleProp = function (prop, isDP) {
        if (BROWSER_PREFIX) {
            if (!!isDP) {
                return BROWSER_PREFIX + _IU(prop);
            }
            else {
                return '-' + BROWSER_PREFIX + '-' + prop;
            }
        }
        else {
            return prop;
        }
    };

    /**
     * @param {String} prop
     * @param {HTMLElement} dom
     * @param {String} value
     * @public
     */
    ItTouchPro.setStyle = function (dom, prop, value) {
        dom.style[ItTouchPro.styleProp(prop, 1)] = value;
    };

    /**
     * @param {String} prop
     * @param {HTMLElement} dom
     * @public
     */
    ItTouchPro.getStyle = function (dom, prop) {
        return dom.style[ItTouchPro.styleProp(prop, 1)];
    };

    ItTouchPro._animateFuncs = {
        normal: (function () {
            function normal(dom, axis, offset) {
                ItTouchPro.setStyle(dom, 'transform', 'translateZ(0) translate' + axis + '(' + offset + 'px)');
            }

            normal.effect = ItTouchPro.styleProp('transform');
            return normal;
        })()
    };
    ItTouchPro.translate = function (x, y) {
        ItTouchPro.setStyle(this.container, 'transform', 'translateZ(0) translateX(' + x + 'px) ' + 'translateY(' + y + 'px');
    };
    ItTouchPro.translateY = function (offset) {
        ItTouchPro._animateFuncs.normal(this.container, 'Y', offset);
    };
    ItTouchPro.translateX = function (offset) {
        ItTouchPro._animateFuncs.normal(this.container, 'X', offset);
    };
    return ItTouch;
});
