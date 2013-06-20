work-space
==========

1、waterfall 暂停更新 请异步这里https://github.com/yangkaituo/jquery-waterfall-plugin

2、radio.html 用```html <ul><li><li>...</ul>```组合实现一个radio的效果。
   有没有想过radio tabs switchable 都有相似的地方，如果抽象出来。。。。有机会写写
   
3、getScrollOffsets.js 是以一个对象的X和Y属性的方式返回滚动条的偏移量，兼容各个浏览器版本

4、domSibling.js 递归查询用来遍历dom树,当它找到最底层的子元素,并且确定它不是一个text_node时候就返回这个节点
	- getBoundingClientRect() 返回的是视口坐标，如果要计算文档坐标还需要偏移量
	- elementFromPoint() 方法是传递X和Y坐标，返回指定位置的元素