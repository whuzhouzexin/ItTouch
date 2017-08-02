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
	var slice = [].slice;
	(function() {
	    var lastTime = 0;
	    var vendors = ['webkit', 'moz'];
	    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
	        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
	        window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] ||    // Webkit中此取消方法的名字变了
	                                      window[vendors[x] + 'CancelRequestAnimationFrame'];
	    }

	    if (!window.requestAnimationFrame) {
	        window.requestAnimationFrame = function(callback, element) {
	            var currTime = new Date().getTime();
	            var timeToCall = Math.max(0, 16.7 - (currTime - lastTime));
	            var id = window.setTimeout(function() {
	                callback(currTime + timeToCall);
	            }, timeToCall);
	            lastTime = currTime + timeToCall;
	            return id;
	        };
	    }
	    if (!window.cancelAnimationFrame) {
	        window.cancelAnimationFrame = function(id) {
	            clearTimeout(id);
	        };
	    }
	}());
	var _ease = {
		quadratic: {
			style: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
			fn: function (k) {
				return k * ( 2 - k );
			}
		},
		circular: {
			style: 'cubic-bezier(0.1, 0.57, 0.1, 1)',	// Not properly "circular" but this looks better, it should be (0.075, 0.82, 0.165, 1)
			fn: function (k) {
				return Math.sqrt( 1 - ( --k * k ) );
			}
		},
		back: {
			style: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
			fn: function (k) {
				var b = 4;
				return ( k = k - 1 ) * k * ( ( b + 1 ) * k + b ) + 1;
			}
		}
	}
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
	//ease
	function reverseEase(y) {
        return 1 - Math.sqrt(1 - y * y);
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

		if(dom.addEventListener) {
			return dom.addEventListener(type, callback, !!isCancerBuble)
		} else if(dom.attachEvent) {
			return dom.attachEvent("on" + type, callback)
		}
		return dom['on' + type] = callback
	}
	function _removeEvent(dom, type ,callback, isCancerBuble) {
		if(dom.removeEventListener) {

			return dom.removeEventListener(type, callback, !!isCancerBuble)
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



	function _getCubicBezier(type) {
		return (_ease[type] && _ease[type].style) || 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
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
	function _addDistination(current, start, time, deceleration) {
		var distance = current - start
		var	speed = Math.abs(distance) / time,
			destination,
			duration;
		var tRatio = 1;
		var deceleration = deceleration === undefined ? 0.0006 : deceleration;

		destination = current + ( speed * speed ) / ( 2 * deceleration ) * ( distance < 0 ? -1 : 1 );
		duration = Math.round(speed / self.deceleration) * tRatio;
		if (destination < this.opts.maxScrollY ) {
			if (destination < this.opts.maxScrollY - this.maxRegion) {
				tRatio = reverseEase((current - this.opts.maxScrollY + this.springMaxRegion) / (current - destination));
				destination = this.opts.maxScrollY - this.springMaxRegion;
			} else {
				tRatio = reverseEase((current - this.opts.maxScrollY + this.springMaxRegion * (this.opts.maxScrollY - destination) / this.maxRegion) / (current - destination));
				destination = this.opts.maxScrollY - this.springMaxRegion * (this.opts.maxScrollY - destination) / this.maxRegion;
			}
		} else if (destination > this.opts.minScrollY) {
			if (destination > this.opts.minScrollY + this.maxRegion) {
				tRatio = reverseEase((this.opts.minScrollY + this.springMaxRegion - current) / (destination - current));
				destination = this.opts.minScrollY + this.springMaxRegion;
			} else {
				tRatio = reverseEase((this.opts.minScrollY + this.springMaxRegion * ( destination-this.opts.minScrollY) / this.maxRegion - current) / (destination - current));
				destination = this.opts.minScrollY + this.springMaxRegion * (destination - this.opts.minScrollY) / this.maxRegion;
			}
		}
		var duration = Math.round(speed / self.deceleration) * tRatio;
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
				deceleration: 0.0006,
				isMoment: true,
				target: global,
				ease: 'quadratic'
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
			this.move = []
			this.maxRegion = this.opts.maxRegion || 600;
	        this.springMaxRegion = this.opts.springMaxRegion || 60
			this.wrapperHeight = _getRect(this.container.parentNode).height
			this.opts.maxScrollY = this.opts.maxScrollY ? this.opts.maxScrollY : (this.wrapperHeight - this.containerHeight)
		},
		startFn: function(e) {

			this.isMove = false
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
		},
		moveFn: function(e) {
			if(this.opts.isPreventDefault) {
				e.preventDefault()
				e.stopPropagation()
			}
			this.$touchMoveTime = _getTime()
			this.startMoveGapTime = this.$touchMoveTime - this.$touchStartTime
			this.$touchMovePageY = this.eventTypes.hasTouch ? e.touches[0].pageY : e.pageY
			this.$touchMovePageX = this.eventTypes.hasTouch ? e.touches[0].pageY : e.pageX
			this.$moveGapY = parseInt(this.$touchMovePageY - this.$touchStartPageY)
			this.$moveGapX = parseInt(this.$touchMovePageX - this.$touchStartPageX)
			this.$touchStartPageY = this.$touchMovePageY
			this.$touchStartPageX = this.$touchMovePageX
			if(!this.isStart) {
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
			if(!this.isMove) {
				if(this.opts.isScrollY) {
					this.setStyle(this.container,"transitionTimingFunction", _getCubicBezier(this.opts.ease))
					if(Math.abs(this.$moveGapY < 160)) {
						this.setStyle(this.container, "transitionDuration", '100ms')
					} else {
						this.setStyle(this.container, "transitionDuration", '200ms')
					}
					this.translateY(this.offsetY)
				}
			} else {
				this.move.push({offsetY: this.offsetY})
			}
			if((this.$touchMoveTime - this.$touchStartTime) > 300) {
				this.startY = this.offsetY
				this.startX = this.offsetX
			}
			this.opts.touchMove(e, this)
			this.isMove = true
		},
		endFn: function(e) {
			this.isStart = false
			this.$touchEndTime = _getTime()
			var duration = this.$touchEndTime - this.$touchStartTime
			this.$touchEndPageY = this.eventTypes.hasTouch ? e.changedTouches[0].pageY : e.pageY
			this.$touchEndPageX = this.eventTypes.hasTouch ? e.changedTouches[0].pageY : e.pageX
			if(this.opts.isMoment && duration < 300) {
				if(this.opts.isScrollY) {
					var momentumY = _addDistination.call(this, this.offsetY, this.startY, duration, this.opts.deceleration)
					var offsetY = momentumY.destination;
					var time = momentumY.duration;
					this.setStyle(this.container,"transitionTimingFunction", _getCubicBezier(this.opts.ease))
					this.setStyle(this.container, "transitionDuration", time + 'ms')
					if(Math.abs(offsetY) > Math.abs(this.opts.maxScrollY)) {
						offsetY = this.opts.maxScrollY
					}
					if(offsetY > this.opts.minScrollY && offsetY >= 0) {
						offsetY = this.opts.minScrollY
					}
					this.offsetY = offsetY
					if(this.isMove) {
						this.move.push({offsetY: this.offsetY})
					} else {
						this.translateY(this.offsetY)
					}

				}
			}
			this.opts.touchEnd(e, this)
		},
		transitionEnd: function(e) {

			this.isMove = false
			if(this.move.length) {
				var offsetY = this.move.pop().offsetY
				this.move = []
				this.setStyle(this.container,"transitionTimingFunction", _getCubicBezier(this.opts.ease))
				this.setStyle(this.container, "transitionDuration", '1000ms')
				if(offsetY > this.opts.minScrollY) {
					offsetY = this.opts.minScrollY
				}
				if(Math.abs(offsetY) > Math.abs(this.opts.maxScrollY)) {
					offsetY = this.opts.maxScrollY
				}
				this.translateY(offsetY)
		   }
		},
		bindEvent: function() {

			_addEvent(this.container, this.eventTypes.startEvt , this, false)
			//绑定touchmove
			_addEvent(this.opts.target, this.eventTypes.moveEvt, this, false)
			//绑定touchend
			_addEvent(this.opts.target, this.eventTypes.endEvt, this, false)
			if(!this.eventTypes.hasTouch) {
				_addEvent(this.container, 'mouseleave', this, false)
			}
			_addEvent(this.container, TRANSITION_END_EVENT, this)
		},
		moveLeave: function(e) {
			this.isStart = false
		},
		refresh: function() {
			this.containerHeight = this.container.offsetHeight
			this.containerWidth = this.container.offsetWidth
			this.opts.maxScrollY = this.wrapperHeight - this.containerHeight
		},
		scrollTo: function(x, y) {
			this.translate(x, y)
		},
		addEase: function(obj) {
			extend(_ease, obj)
		},
		handleEvent: function(e) {
			
			switch ( e.type ) {
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
					if(e.target != this.container) {
						return false
					}
					this.transitionEnd(e)
					break;
				default:
					break;
			}
		},
		_animate: function (destX, destY, duration, easingFn) {
			var that = this,
				startX = this.offsetX,
				startY = this.offsetY,
				startTime = _getTime(),
				destTime = startTime + duration;

			function step () {
				var now = _getTime(),
					newX, newY,
					easing;

				if ( now >= destTime ) {
					that.isAnimating = false;
					that.translate(destX, destY);
					return;
				}

				now = ( now - startTime ) / duration;
				easing = easingFn(now);
				newX = ( destX - startX ) * easing + startX;
				newY = ( destY - startY ) * easing + startY;
				that.translate(newX, newY);

				if ( that.isAnimating ) {
					requestAnimationFrame(step);
				}
			}

			this.isAnimating = true;
			step();
		},
		destory: function() {
			BROWSER_PREFIX = undefined
			TRANSITION_END_EVENT = undefined
			this.removeEvent(this.container, this.eventTypes.startEvt, this)
			this.removeEvent(this.container, this.eventTypes.moveEvt, this)
			this.removeEvent(this.container, this.eventTypes.endEvt, this)
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
		requestAnimationFrame(function() {
			ItTouchPro._animateFuncs.normal(this.container, 'Y', offset)
		}.bind(this))

	}
	ItTouchPro.translateX =  function(offset) {
		ItTouchPro._animateFuncs.normal(this.container, 'X', offset)
	}
	return ItTouch
})
