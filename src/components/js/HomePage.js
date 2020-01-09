// require('../../../static/js/canvas-particle')
//
// import CanvasParticle from '../../../static/js/canvas-particle'


const root = {}

root.name = 'HomePage'

import {swiper, swiperSlide} from 'vue-awesome-swiper'

import 'swiper/dist/css/swiper.css'

root.components = {
  'Market': resolve => require(['../vue/HomePageMarket'], resolve),
  'MobileMarket': resolve => require(['../mobileVue/MobileHomePageMarket'], resolve),
  'Swiper': swiper,
  'SwiperSlide': swiperSlide,
  'IndexFooter': resolve => require(['../vue/IndexFooter'], resolve),
}


root.data = function () {
  return {
    swiperOption: {
      autoplay: {
        disableOnInteraction: false,
      },

      speed: 500,
      pagination: {
        el: '.swiper-pagination'
      },
    },

    // 参数
    currencyType: 0,  // 货币类型
  }
}

root.created = function () {
  if (!this.$store.state.isMobile) {
    this.$router.push('home')
  }

  // var CanvasParticle = (function(){
  // 	function getElementByTag(name){
  // 		return document.getElementsByTagName(name);
  // 	}
  // 	function getELementById(id){
  // 		return document.getElementById(id);
  // 	}
  // 	// 根据传入的config初始化画布
  // 	function canvasInit(canvasConfig){
  // 		canvasConfig = canvasConfig || {};
  // 		var html = getElementByTag("html")[0];
  // 		// 获取body作为背景
  // 		// var body = getElementByTag("body")[0];
  //
  // 		// 获取特定div作为背景
  // 		// mydiv是你想要将其作为背景的div的ID
  // 		var body = document.getElementById("register_div");
  // 		var canvasObj = document.createElement("canvas");
  //
  // 		var canvas = {
  // 			element: canvasObj,
  // 			points : [],
  // 			// 默认配置
  // 			config: {
  // 				vx: canvasConfig.vx || 4,
  // 				vy:  canvasConfig.vy || 4,
  // 				height: canvasConfig.height || 2,
  // 				width: canvasConfig.width || 2,
  // 				count: canvasConfig.count || 100,
  // 				color: canvasConfig.color || "121, 162, 185",
  // 				stroke: canvasConfig.stroke || "130,255,255",
  // 				dist: canvasConfig.dist || 6000,
  // 				e_dist: canvasConfig.e_dist || 20000,
  // 				max_conn: 10
  // 			}
  // 		};
  //
  // 		// 获取context
  // 		if(canvas.element.getContext("2d")){
  // 			canvas.context = canvas.element.getContext("2d");
  // 		}else{
  // 			return null;
  // 		}
  //
  // 		body.style.padding = "0";
  // 		body.style.margin = "0";
  // 		// body.replaceChild(canvas.element, canvasDiv);
  // 		body.appendChild(canvas.element);
  //
  // 		canvas.element.style = "top: 0; left: 0; z-index: -1;";
  // 		canvasSize(canvas.element);
  // 		window.onresize = function(){
  // 			canvasSize(canvas.element);
  // 		}
  // 		body.onmousemove = function(e){
  // 			var event = e || window.event;
  // 			canvas.mouse = {
  // 				x: event.clientX,
  // 				y: event.clientY
  // 			}
  // 		}
  // 		document.onmouseleave = function(){
  // 			canvas.mouse = undefined;
  // 		}
  // 		setInterval(function(){
  // 			drawPoint(canvas);
  // 		}, 40);
  // 	}
  //
  // 	// 设置canvas大小
  // 	function canvasSize(canvas){
  // 		// 获取窗口的宽高
  // 		// canvas.width = window.innerWeight || document.documentElement.clientWidth || document.body.clientWidth;
  // 		// canvas.height = window.innerWeight || document.documentElement.clientHeight || document.body.clientHeight;
  //
  // 		// 获取特定div的宽高
  // 		var width = document.getElementById("register_div").style.width;
  // 		var height = document.getElementById("register_div").style.height;
  // 		//alert(width+"-----"+height);
  // 		width = parseInt(width);
  // 		height = parseInt(height);
  // 		canvas.width = width || window.innerWeight || document.documentElement.clientWidth || document.body.clientWidth;
  // 		canvas.height = height || window.innerWeight || document.documentElement.clientHeight || document.body.clientHeight;
  // 	}
  //
  // 	// 画点
  // 	function drawPoint(canvas){
  // 		var context = canvas.context,
  // 			point,
  // 			dist;
  // 		context.clearRect(0, 0, canvas.element.width, canvas.element.height);
  // 		context.beginPath();
  // 		context.fillStyle = "rgb("+ canvas.config.color +")";
  // 		for(var i = 0, len = canvas.config.count; i < len; i++){
  // 			if(canvas.points.length != canvas.config.count){
  // 				// 初始化所有点
  // 				point = {
  // 					x: Math.floor(Math.random() * canvas.element.width),
  // 					y: Math.floor(Math.random() * canvas.element.height),
  // 					vx: canvas.config.vx / 2 - Math.random() * canvas.config.vx,
  // 					vy: canvas.config.vy / 2 - Math.random() * canvas.config.vy
  // 				}
  // 			}else{
  // 				// 处理球的速度和位置，并且做边界处理
  // 				point =	borderPoint(canvas.points[i], canvas);
  // 			}
  // 			context.fillRect(point.x - canvas.config.width / 2, point.y - canvas.config.height / 2, canvas.config.width, canvas.config.height);
  //
  // 			canvas.points[i] = point;
  // 		}
  // 		drawLine(context, canvas, canvas.mouse);
  // 		context.closePath();
  // 	}
  //
  // 	// 边界处理
  // 	function borderPoint(point, canvas){
  // 		var p = point;
  // 		if(point.x <= 0 || point.x >= canvas.element.width){
  // 			p.vx = -p.vx;
  // 			p.x += p.vx;
  // 		}else if(point.y <= 0 || point.y >= canvas.element.height){
  // 			p.vy = -p.vy;
  // 			p.y += p.vy;
  // 		}else{
  // 			p = {
  // 				x: p.x + p.vx,
  // 				y: p.y + p.vy,
  // 				vx: p.vx,
  // 				vy: p.vy
  // 			}
  // 		}
  // 		return p;
  // 	}
  //
  // 	// 画线
  // 	var dist
  // 	function drawLine(context, canvas, mouse){
  // 		context = context || canvas.context;
  // 		for(var i = 0, len = canvas.config.count; i < len; i++){
  // 			// 初始化最大连接数
  // 			canvas.points[i].max_conn = 0;
  // 			// point to point
  // 			for(var j = 0; j < len; j++){
  // 				if(i != j){
  // 					dist = Math.round(canvas.points[i].x - canvas.points[j].x) * Math.round(canvas.points[i].x - canvas.points[j].x) +
  // 						Math.round(canvas.points[i].y - canvas.points[j].y) * Math.round(canvas.points[i].y - canvas.points[j].y);
  // 					// 两点距离小于吸附距离，而且小于最大连接数，则画线
  // 					if(dist <= canvas.config.dist && canvas.points[i].max_conn <canvas.config.max_conn){
  // 						canvas.points[i].max_conn++;
  // 						// 距离越远，线条越细，而且越透明
  // 						context.lineWidth = 0.5 - dist / canvas.config.dist;
  // 						context.strokeStyle = "rgba("+ canvas.config.stroke + ","+ (1 - dist / canvas.config.dist) +")"
  // 						context.beginPath();
  // 						context.moveTo(canvas.points[i].x, canvas.points[i].y);
  // 						context.lineTo(canvas.points[j].x, canvas.points[j].y);
  // 						context.stroke();
  //
  // 					}
  // 				}
  // 			}
  // 			// 如果鼠标进入画布
  // 			// point to mouse
  // 			if(mouse){
  // 				dist = Math.round(canvas.points[i].x - mouse.x) * Math.round(canvas.points[i].x - mouse.x) +
  // 					Math.round(canvas.points[i].y - mouse.y) * Math.round(canvas.points[i].y - mouse.y);
  // 				// 遇到鼠标吸附距离时加速，直接改变point的x，y值达到加速效果
  // 				if(dist > canvas.config.dist && dist <= canvas.config.e_dist){
  // 					canvas.points[i].x = canvas.points[i].x + (mouse.x - canvas.points[i].x) / 20;
  // 					canvas.points[i].y = canvas.points[i].y + (mouse.y - canvas.points[i].y) / 20;
  // 				}
  // 				if(dist <= canvas.config.e_dist){
  // 					context.lineWidth = 1;
  // 					context.strokeStyle = "rgba("+ canvas.config.stroke + ","+ (1 - dist / canvas.config.e_dist) +")";
  // 					context.beginPath();
  // 					context.moveTo(canvas.points[i].x, canvas.points[i].y);
  // 					context.lineTo(mouse.x, mouse.y);
  // 					context.stroke();
  // 				}
  // 			}
  // 		}
  // 	}
  // 	return canvasInit;
  // })();


  $(function () {
    // //配置
    // var config = {
    // 	vx: 3,	//小球x轴速度,正为右，负为左
    // 	vy: 3,	//小球y轴速度
    // 	height: 2,	//小球高宽，其实为正方形，所以不宜太大
    // 	width: 2,
    // 	count: 200,		//点个数
    // 	color: "255, 174, 0", 	//点颜色
    // 	stroke: "0,172,183", 		//线条颜色
    // 	dist: 5000, 	//点吸附距离
    // 	e_dist: 29000, 	//鼠标吸附加速距离
    // 	max_conn: 100 	//点到点最大连接数
    // }
    //
    // //调用
    // CanvasParticle(config);

  })


  let that = this;


}

root.methods = {}


// 切换币对市场
root.methods.changeCurrencyMarket = function (type) {
  this.currencyType = type;
  this.$eventBus.notify({key: 'currencyType'}, type)
}

root.computed = {}
root.computed.isMobile = function () {
  return this.$store.state.isMobile
}


export default root
