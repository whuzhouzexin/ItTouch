/*
*author zzx
*email 1065883237@qq.com
*date 2017.07.29
*/

(function(global, factory) {
	if(typeof module === 'obeject' && typeof module.exports == 'object') {
		return module.exports = factory(global)
	} else if(typeof define === 'fsunction') {
		return define(factory(global))
	} else {
		global.ItTouch = factory(global)
	}
})(window, function(global) {
	//toString func
	var _toString = Object.prototype.toString
	// 属性描述器
	var _getDesriptor = Object.getOwnPropertyDescriptor
	//slice
	var slice = [].slice
	//是不是dom元素
	function _isHtmlNode(node) {
		return node && node.nodeType === 1 && node.onclick !== undefined
	}
	//是不是plain对象
	function _isPlainObject(obj) {
		return (obj) !== null && _toString.call(obj) == '[object Object]'
	}
	//是不是字符串
	function _isString(str) {
		return typeof str === 'string'
	}
	//扩展方法
	function _extend(target, obj) {
		var opts = slice.call(arguments)
		var target = opts[0]
		var objs = opts.slice(1)
		if(opts.length === 1) {
			objs = opts
			target = this
		}
		opts = null
		if(!_isPlainObject(target) && !_isFunction(target)) {
			target = {}
		}
		for(var i in objs) {
			if(_isPlainObject(objs[i])) {
				for(var key in objs[i]) {
					if(objs[i].hasOwnProperty(key)) {
						if(_isPlainObject(objs[i][key])) {
							_extend(target[key], objs[i][key])
						}
						target[key] = objs[i][key]
					}
				}
			}
		}
		return target
	}

	function _noop() {

	}

	var BROWSER_PREFIX = ''
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
    	var isDone = false
    	return function() {
    		if(!isDone) {
    			isDone = true
    			callback()
    		}
    	}
    }
    function _bindTransitionEnd(dom, callback) {
    	if(!_isHtmlNode(dom)) {
    		dom = querySelector('body')
    	}
		var fn = _once(callback)
    	_addEvent(dom, TRANSITION_END_EVENT, function(e) {

    		fn(e)
    	}, false)
    }
	//判断是不是方法
	function _isFunction(func) {
		return typeof func === 'function'
	}
	//获取时间
	function _getTime() {
		return new Date().getTime()
	}

	//判断是否是boolean
	function _isBoolean(bool) {
		return typeof bool === 'boolean'
	}
	//第一个字符转为大写
	function _IU(word) {
        return word.replace(/^[a-z]/, function (t) {
            return t.toUpperCase();
        });
    }
	//绑定事件
	function _addEvent(dom, type ,callback, isCancerBuble) {
		if(!_isHtmlNode(dom)) {
			return false
		}
		if(!_isString(type)) {
			return false
		}
		if(!_isFunction(callback)) {
			callback = _noop
		}
		if(!_isBoolean(isCancerBuble)) {
			isCancerBuble = false
		}
		if(dom.addEventListener) {
			return dom.addEventListener(type, callback, isCancerBuble)
		} else if(dom.attachEvent) {
			return dom.attachEvent("on" + type, callback)
		}
		return dom['on' + type] = callback
	}
	function _removeEvent(dom, type ,callback, isCancerBuble) {
		if(!_isHtmlNode(dom)) {
			return false
		}
		if(!_isString(type)) {
			return false
		}
		if(!_isFunction(callback)) {
			callback = _noop
		}
		if(!_isBoolean(isCancerBuble)) {
			isCancerBuble = false
		}
		if(dom.removeEventListener) {

			return dom.removeEventListener(type, callback, isCancerBuble)
		} else if(dom.detachEvent) {
			return dom.detachEvent("on" + type, callback)
		}
		return dom['on' + type] = _noop
	}



	function _getRect(el) {
		if (el instanceof SVGElement) {
			var rect = el.getBoundingClientRect();
			return {
				top : rect.top,
				left : rect.left,
				width : rect.width,
				height : rect.height
			};
		} else {
			return {
				top : el.offsetTop,
				left : el.offsetLeft,
				width : el.offsetWidth,
				height : el.offsetHeight
			};
		}
	}



	function _getCubicBezier() {

		return 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
	}

	/**
     * @param {String} selector
     * @private
     */
	function _querySelector(selector) {
		if(!_isString(selector)) {
			selector = 'body'
		}
		return document.querySelector(selector)
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
	function _addDistination(current, start, distance, time, lowerMargin, wrapperSize, deceleration) {

	    distance = distance

		var	speed = Math.abs(distance) / time,
			destination,
			duration;

		deceleration = deceleration === undefined ? 0.0006 : deceleration;

		destination = current + ( speed * speed ) / ( 2 * deceleration ) * ( distance < 0 ? -1 : 1 );
		duration = speed / deceleration;

		if ( destination < lowerMargin ) {
			destination = wrapperSize ? lowerMargin - ( wrapperSize / 2.5 * ( speed / 8 ) ) : lowerMargin;
			distance = Math.abs(destination - current);
			duration = distance / speed;
		} else if ( destination > 0 ) {
			destination = wrapperSize ? wrapperSize / 2.5 * ( speed / 8 ) : 0;
			distance = Math.abs(current) + destination;
			duration = distance / speed;
		}

		return {
			destination: Math.round(destination),
			duration: duration
		};

	}
	function ItTouch(opts) {
		if(!(this instanceof ItTouch)) {
			return new ItTouch(opts)
		}
		this.initOptions(opts)
		this.bindEvent()
	}

	var ItTouchPro = ItTouch.prototype = {
		initOptions: function(opts) {
			var defaultOpts = {
				dom: 'body',
				touchMove: _noop,
				touchStart: _noop,
				touchEnd: _noop,
				minScrollY: 0,
				maxScrollY: 0,
				isScrollY: true,
				isPreventDefault: true,
				bounceTop: 30,
				bounceBottom: -30,
				deceleration: 0.0016,
				isMoment: true
			}
			this.opts = this.extend(defaultOpts, opts)
			this.eventTypes = _getTouchEventTypes()
			opts = null
			if(_isHtmlNode(this.opts.dom)) {
				this.container = this.opts.dom
			} else {
				this.container = _querySelector(this.opts.dom)
			}

			if(!_isHtmlNode(this.container)) {
				this.container = _querySelector('body')
			}
			this.offsetX = 0
			this.offsetY = 0
			this.isSrcoll = false
			this.containerHeight = this.container.offsetHeight
			this.containerWidth = this.container.offsetWidth
			_bindTransitionEnd(this.container, function() {
				this.isMove = false
				this.setStyle(this.container, "transitionDuration", '0ms')
			}.bind(this))
			this.wrapperHeight = _getRect(this.container.parentNode).height
			this.opts.maxScrollY = this.opts.maxScrollY ? this.opts.maxScrollY : (this.wrapperHeight - this.containerHeight)
		},
		bindEvent: function() {
			//绑定touchstart事件
			this.touchStartCallback = function(e) {
				if(this.opts.isPreventDefault) {
					e.preventDefault()
				}

				this.$touchStartTime = _getTime()
				this.isSrcoll = false
				this.isMove = false
				this.isStart = true
				this.$touchStartPageY = this.$initPointY = this.eventTypes.hasTouch ? e.touches[0].pageY : e.pageY
				this.$touchStartPageX = this.$initPointX = this.eventTypes.hasTouch ? e.touches[0].pageY : e.pageX
				this.initPointY = this.$touchStartPageY
				this.initPointX = this.$touchStartPageX
				this.startX = this.offsetX
				this.startY = this.offsetY
				this.opts.touchStart(e, this)
			}.bind(this)

			_addEvent(this.container, this.eventTypes.startEvt , this.touchStartCallback, false)
			//绑定touchmove
			this.touchMoveCallback = function(e) {

				this.$touchMoveTime = _getTime()
				this.startMoveGapTime = this.$touchMoveTime - this.$touchStartTime
				this.$touchMovePageY = this.eventTypes.hasTouch ? e.touches[0].pageY : e.pageY
				this.$touchMovePageX = this.eventTypes.hasTouch ? e.touches[0].pageY : e.pageX
				this.$moveGapY = parseInt(this.$touchMovePageY - this.$touchStartPageY)
				this.$moveGapX = parseInt(this.$touchMovePageX - this.$touchStartPageX)
				this.$touchStartPageY = this.$touchMovePageY
				this.$touchStartPageX = this.$touchMovePageX
				if(isNaN(this.$moveGapY) || isNaN(this.$moveGapX) || !this.isStart) {
					return false
				}
				this.offsetY += this.$moveGapY
				this.offsetX += this.$moveGapX

				if(Math.abs(this.$moveGapY) > 10 || Math.abs(this.$moveGapX) > 10) {
					this.isSrcoll = true
				}
				if(this.offsetY > (this.opts.minScrollY + this.opts.bounceTop)) {
					this.offsetY = this.opts.minScrollY + this.opts.bounceTop
				}
				if(Math.abs(this.offsetY + this.opts.bounceBottom) > Math.abs(this.opts.maxScrollY)) {
					this.offsetY = this.opts.maxScrollY + this.opts.bounceBottom
				}
				if(this.opts.isScrollY) {
					this.setStyle(this.container,"transitionTimingFunction", 'linear')
					this.setStyle(this.container, "transitionDuration", '0ms')
					this.translateY(this.offsetY)
				}
				this.opts.touchMove(e, this)
				if((this.$touchMoveTime - this.$touchStartTime) > 300) {
					this.startY = this.offsetY
					this.startX = this.offsetX
				}
				this.isMove = true
			}.bind(this)
			_addEvent(this.container, this.eventTypes.moveEvt, this.touchMoveCallback, false)
			//绑定touchend
			this.touchEndCallback = function(e) {

				this.isStart = false
				this.$touchEndTime = _getTime()
				var duration = this.$touchEndTime - this.$touchStartTime
				this.$touchEndPageY = this.eventTypes.hasTouch ? e.changedTouches[0].pageY : e.pageY
				this.$touchEndPageX = this.eventTypes.hasTouch ? e.changedTouches[0].pageY : e.pageX
				this.$endGapY = this.$touchEndPageY - this.$touchMovePageY
				this.$endGapX = this.$touchEndPageX - this.$touchMovePageX
				this.offsetY += this.$endGapY
				this.offsetX += this.$endGapX
				if(this.offsetY > this.opts.minScrollY) {
					this.offsetY = this.opts.minScrollY
				}
				if(Math.abs(this.offsetY) > Math.abs(this.opts.maxScrollY)) {
					this.offsetY = this.opts.maxScrollY
				}
				if(this.opts.isScrollY) {
					this.setStyle(this.container,"transitionTimingFunction", _getCubicBezier())
					this.setStyle(this.container, "transitionDuration", Math.abs(this.$moveGapY) + 'ms')
					this.translateY(this.offsetY)
				}
				if(this.opts.isMoment && duration < 300) {
					if(this.opts.isScrollY) {
						var momentumY = _addDistination(this.offsetY, this.startY,(this.$touchEndPageY - this.initPointY), duration, this.opts.maxScrollY, this.wrapperHeight, this.opts.deceleration)
						var offsetY = momentumY.destination;
						var time = momentumY.duration;
						this.setStyle(this.container,"transitionTimingFunction", _getCubicBezier())
						this.setStyle(this.container, "transitionDuration", time + 'ms')
						if(Math.abs(offsetY) > Math.abs(this.opts.maxScrollY)) {
							offsetY = this.opts.maxScrollY

						}
						if(offsetY > this.opts.minScrollY && offsetY >= 0) {
							offsetY = this.opts.minScrollY
						}

						this.offsetY = offsetY
						this.translateY(this.offsetY)
					}
				}
				this.opts.touchEnd(e, this)
			}.bind(this)
			_addEvent(this.container, this.eventTypes.endEvt, this.touchEndCallback, false)
			if(!this.eventTypes.hasTouch) {
				_addEvent(this.container, 'mouseleave', function(e) {
					this.isStart = false
				}.bind(this), false)
			}
		},
		refresh: function() {
			this.containerHeight = this.container.offsetHeight
			this.containerWidth = this.container.offsetWidth
			this.opts.maxScrollY = this.wrapperHeight - this.containerHeight
		},
		scrollTo: function(x, y) {
			this.translate(x, y)
		},
		destory: function() {
			BROWSER_PREFIX = undefined
			TRANSITION_END_EVENT = undefined
			this.removeEvent(this.container, this.eventTypes.startEvt, this.touchStartCallback)
			this.removeEvent(this.container, this.eventTypes.moveEvt, this.touchMoveCallback)
			this.removeEvent(this.container, this.eventTypes.endEvt, this.touchEndCallback)
			for(var key in this) {
				try {
					if(this.hasOwnProperty(key)) {
						delete this[key]
					} else {
						this[key] = undefined
					}
				} catch(e) {
					console.log(e);
				}
			}
		}
	}
	ItTouch.extend = ItTouchPro.extend = _extend
	ItTouchPro.querySelector = _querySelector
	ItTouchPro.addEvent = _addEvent
	ItTouchPro.removeEvent = _removeEvent
	ItTouchPro.once = _once
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
            } else {
                return '-' + BROWSER_PREFIX + '-' + prop;
            }
        } else {
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
	ItTouchPro.translate = function(x, y) {
		ItTouchPro.setStyle(this.container, 'transform', 'translateZ(0) translateX(' + x + 'px) ' + 'translateY(' + y + 'px');
	}
	ItTouchPro.translateY = function(offset) {
		ItTouchPro._animateFuncs.normal(this.container, 'Y', offset)
	}
	ItTouchPro.translateX =  function(offset) {
		ItTouchPro._animateFuncs.normal(this.container, 'X', offset)
	}
	return ItTouch
})
