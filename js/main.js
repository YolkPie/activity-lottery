(function () {
	let title = localStorage.getItem('act_title') || ''
	let $title = document.getElementById('title')
	if(!title){
		$title.style.display = 'none'
	} else {
		$title.style.display = 'block'
		$title.innerText = title
	}

	let member = JSON.parse(localStorage.getItem('act_pondList') || '[]')
	if(!member.length){
		for(let i = 1; i < 500; i++){
			member.push({ erp: 'erp', name: 'Tester_'+ i})
		}
	}

	var choosed = JSON.parse(localStorage.getItem('act_choosed') || '{}') || {}
	var speed = function () {
		return [0.1 * Math.random() + 0.01, -(0.1 * Math.random() + 0.01)]
	}
	var getKey = function (item) {
		return item.name + ' - ' + item.erp
	}
	var createHTML = function () {
		var html = []
		member.forEach(function (item, index) {
			item.index = index
			var key = getKey(item)
			var color = choosed[key] ? 'yellow' : 'white'
			html.push('<a href="#" style="color: ' + color + ';">' + item.name + '</a>')
		})
		html.push()
		return html.join('')
	}
	var lottery = function (count) {
		var list = canvas.getElementsByTagName('a')
		var color = 'yellow'
		var ret = member
				.filter(function (m, index) { // 去掉已经中奖的
					m.index = index
					return !choosed[getKey(m)]
				})
				.map(function (m) { // 给每个人加个权重
					return Object.assign({
						score: Math.random()
					}, m)
				})
				.sort(function (a, b) { // 按照从小到大的顺序排列
					return a.score - b.score
				})
				.slice(0, count) // 取前count个
				.map(function (m) {
					choosed[getKey(m)] = 1
					list[m.index].style.color = color
					return m.name + ' - ' + m.erp
				})
				localStorage.setItem('act_choosed', JSON.stringify(choosed))
		return ret
	}
	var canvas = document.createElement('canvas')
	canvas.id = 'myCanvas'
	canvas.width = document.body.offsetWidth
	canvas.height = document.body.offsetHeight - 10
	document.getElementById('main').appendChild(canvas)
	new Vue({
		el: '#operateBox',
		data: {
			selected: 1,
			running: false,
			btns: [
				10, 5, 3, 2, 1
			]
		},
		mounted() {
			let numList = JSON.parse(localStorage.getItem('act_nums') || '[]')
			if(numList.length){
				this.btns = numList.reverse()
			}
			canvas.innerHTML = createHTML()
			TagCanvas.Start('myCanvas', '', {
				textColour: null,
				initial: speed(),
				dragControl: false,
				wheelZoom: false,
				frontSelect: true,
				textHeight: screenWidth / DESIGN_WIDTH * 12 // 设置字体的大小
			})
		},
		methods: {
			reset: function () {
				if (confirm('确定要重置么？所有之前的抽奖历史将被清除！')) {
					localStorage.removeItem('act_choosed')
					choosed = {}
					var list = canvas.getElementsByTagName('a')
					for(let i = 0; i < list.length; i++){
						list[i].style.color = 'white'
					}
					TagCanvas.Reload('myCanvas')
				}
			},
			onClick: function (num) {
				$('#result').css('display', 'none')
				$('#main').removeClass('mask')
				this.selected = num
			},
			toggle: function () {
				if (this.running) {
					TagCanvas.SetSpeed('myCanvas', speed())
					var ret = lottery(this.selected)
					if (ret.length === 0) {
						$('#result').css('display', 'block')
						$('#pannelContent').html('<p>已抽完</p>')
						$('#main').addClass('mask')
						return
					}
					$('#result').css('display', 'block')
					$('#pannelContent').html('<p>' + ret.join('</p><p>') + '</p>')
					TagCanvas.SetSpeed('myCanvas', [0, 0])
					$('#main').addClass('mask')
					setTimeout(() => {
						TagCanvas.Reload('myCanvas')
					}, 1500);
				} else {
					$('#result').css('display', 'none')
					$('#main').removeClass('mask')
					TagCanvas.SetSpeed('myCanvas', [5, 1])
				}
				this.running = !this.running
			},
			closeResultPannel: function () {
				$('#result').css('display', 'none')
				$('#main').removeClass('mask')
				TagCanvas.SetSpeed('myCanvas', speed())
			}
		}
	})

	// 空格键控制
	document.onkeydown = function(e){
		e = e || window.event
		if(e.keyCode != 32){
			return
		}

		let $resultPanel = document.getElementById('result')
		let $main = document.getElementById('main')
		if($resultPanel.style.display === 'block'){
			$resultPanel.style.display = 'none'
			$main.className = $main.className.replace('mask', '')
			TagCanvas.SetSpeed('myCanvas', speed())
			return
		}
		let $btnStart = document.getElementsByClassName('btn-start')[0]
		$btnStart.click()
	}
})()
