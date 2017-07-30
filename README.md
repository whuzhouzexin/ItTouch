# ItTouch
ItTouch是一个兼容移动端和pc端的滑块类库，修复了IScroller chrome滚动卡顿的问题
# 使用和方法说明
### 默认参数如下
```
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
```
- dom 为需要滚动的容器
- touchMove move时候的钩子函数
- touchStart start时候的钩子函数
- touchEnd end时候的钩子函数,
- minScrollY 向上滑动的边界支持
- maxScrollY 向下滑动的边界支持
- isPreventDefault 是否阻止默认事件
- bounceTop 到顶部之后可以扩展的上顶部的距离
- bounceBottom 到底部之后可以触发的顶部的距离
- deceleration 设置减速的比例值
- isMoment 设置快速滑动时候，滑动距离的扩大

### 使用方法说明
```
new ItTouch({
    dom: selector
})
或者
ItTouch({
    'dom': selector
    })
```
### 钩子函数参数说明
- 第一个参数为e对象
- 第二个参数为 ItTouch实例

### x方向的支持后续加上
