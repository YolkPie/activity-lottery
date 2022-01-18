"use strict";

(function () {
  var choosed = JSON.parse(localStorage.getItem('choosed') || '{}') || {};

  var speed = function speed() {
    return [0.1 * Math.random() + 0.01, -(0.1 * Math.random() + 0.01)];
  };

  var getKey = function getKey(item) {
    return item.name + ' - ' + item.erp;
  };

  var createHTML = function createHTML() {
    var html = ['<ul>'];
    member.forEach(function (item, index) {
      item.index = index;
      var key = getKey(item);
      var color = choosed[key] ? 'yellow' : 'white';
      html.push('<li><a href="#" style="color: ' + color + ';">' + item.name + '</a></li>');
    });
    html.push('</ul>');
    return html.join('');
  };

  var lottery = function lottery(count) {
    var list = canvas.getElementsByTagName('a');
    var color = 'yellow';
    var ret = member.filter(function (m, index) {
      // 去掉已经中奖的
      m.index = index;
      return !choosed[getKey(m)];
    }).map(function (m) {
      // 给每个人加个权重
      return Object.assign({
        score: Math.random()
      }, m);
    }).sort(function (a, b) {
      // 按照从小到大的顺序排列
      return a.score - b.score;
    }).slice(0, count) // 取前count个
    .map(function (m) {
      choosed[getKey(m)] = 1;
      list[m.index].style.color = color;
      return m.name + ' - ' + m.erp;
    });
    localStorage.setItem('choosed', JSON.stringify(choosed));
    return ret;
  };

  var canvas = document.createElement('canvas');
  canvas.id = 'myCanvas';
  canvas.width = document.body.offsetWidth;
  canvas.height = document.body.offsetHeight - 10;
  document.getElementById('main').appendChild(canvas);
  new Vue({
    el: '#operateBox',
    data: {
      selected: 1,
      running: false,
      btns: [6, 5, 4, 3, 2, 1]
    },
    mounted: function mounted() {
      canvas.innerHTML = createHTML();
      console.log(screenWidth, 'screenWidth');
      TagCanvas.Start('myCanvas', '', {
        textColour: null,
        initial: speed(),
        dragControl: 1,
        textHeight: screenWidth / DESIGN_WIDTH * 12 // 设置字体的大小

      });
    },
    methods: {
      reset: function reset() {
        if (confirm('确定要重置么？所有之前的抽奖历史将被清除！')) {
          localStorage.clear();
          location.reload(true);
        }
      },
      onClick: function onClick(num) {
        $('#result').css('display', 'none');
        $('#main').removeClass('mask');
        this.selected = num;
      },
      toggle: function toggle() {
        if (this.running) {
          TagCanvas.SetSpeed('myCanvas', speed());
          var ret = lottery(this.selected);

          if (ret.length === 0) {
            $('#result').css('display', 'block');
            $('#pannelContent').html('<p>已抽完</p>');
            $('#main').addClass('mask');
            return;
          }

          $('#result').css('display', 'block');
          $('#pannelContent').html('<p>' + ret.join('</p><p>') + '</p>');
          TagCanvas.Reload('myCanvas'); // setTimeout(function () {
          // 	localStorage.setItem(new Date().toString(), JSON.stringify(ret))
          // 	$('#main').addClass('mask')
          // }, 300)

          $('#main').addClass('mask');
        } else {
          $('#result').css('display', 'none');
          $('#main').removeClass('mask');
          TagCanvas.SetSpeed('myCanvas', [5, 1]);
        }

        this.running = !this.running;
      },
      closeResultPannel: function closeResultPannel() {
        $('#result').css('display', 'none');
        $('#main').removeClass('mask');
      }
    }
  });
})();