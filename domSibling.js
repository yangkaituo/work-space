<script>
window.onload = function() {
	//递归查询用来遍历dom树,当它找到最底层的子元素,并且确定它不是一个text_node时候就返回这个节点的getBoundingClientRect()
	function Sibling(e) {
		console.log(e);
		var m;	
		if (e.nodeType == 3) {
			console.log('nodetype = 3');
			return
		}else{			
			for (m = e.firstChild; m != null; m = m.nextSibling) {					
				if (m.nodeType != 3) {
					console.log(m.getBoundingClientRect());		
					Sibling(m);
				}							
			}

		}
	}
	
	//入口
	var el = document.getElementById('***');
	Sibling(el);
};
</script>

