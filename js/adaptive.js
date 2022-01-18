// 设计稿宽度 750px
const DESIGN_WIDTH = 1680;

let doc = window.document;
let docEl = doc.documentElement;
let screenWidth = docEl.getBoundingClientRect().width;
let fontSize = screenWidth / DESIGN_WIDTH * 100;

function adaptive() {
	fontSize = docEl.getBoundingClientRect().width / DESIGN_WIDTH * 100;
  docEl.setAttribute('style', 'font-size: ' + fontSize + 'px !important');
}

adaptive();

window.addEventListener('resize', adaptive, false);
