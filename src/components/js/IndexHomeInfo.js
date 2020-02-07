import logo from '../../assets/二维码logo.png'
import axios from 'axios'
import store from "../../configs/storeConfigs/StoreConfigs";


const root = {}

/*------------------- 组件名称 ---------------------*/
root.name = 'IndexHomeInfo'

// ------------------------------------ 引用组件 --------------------------------------

root.components = {
  'Loading': resolve => require(['../vue/Loading'], resolve),
  'Qrcode': resolve => require(['qrcode-vue'], resolve),
}

/*------------------- props ---------------------*/
root.props = {}

//
root.huiLvData = {};


/*------------------- data ---------------------*/

root.data = function () {
  return {
    logo: logo,
    size: 124,
    bgColor: '#fff',
    fgColor: '#000',
    value: '',
    backtophui:false,
    backtopzi:false,
    appHover: false,
    dollar_usdt: '',
    showewm:false,
    showewm1:false

  }
}
/*------------------- 生命周期 ---------------------*/

root.created = function () {
    this.getUSDThl();

}

root.mounted = function () {
  // this.value = this.staticUrl + '/AppDownload'
  this.value = 'https://download.2020.exchange/'
  this.size = 124 /  window.devicePixelRatio

  window.addEventListener('scroll', this.appScroll)
  //注意：如果由于自己的vue中的样式导致监听不到，可以尝试监听body或者'#app-root'的滚动事件

  // 拖动div元素

  // var oDiv = document.getElementById('kefu2019');
  // oDiv.onmousedown = function(e){
  //
  //   e = e || window.event;
  //
  //   oDiv.setCapture && oDiv.setCapture();    // IE8 及以下 强制捕获下一次单击事件
  //
  //   oDiv.fixedX = e.clientX - (oDiv.getBoundingClientRect().left - document.documentElement.clientLeft);
  //   oDiv.fixedY = e.clientY - (oDiv.getBoundingClientRect().top - document.documentElement.clientTop);
  //
  //   document.onmousemove = function(e){
  //     e = e || window.event;
  //
  //     var x = e.clientX + (document.documentElement.scrollLeft || window.pageXOffset || document.body.scrollLeft);
  //     var y = e.clientY + (document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop);
  //
  //     oDiv.style.left = x - oDiv.fixedX + "px";    // 元素在页面中的坐标 = 鼠标在页面中的坐标 - 元素在页面中的坐标
  //     oDiv.style.top = y - oDiv.fixedY + "px";
  //   };
  //
  //   document.onmouseup = function(){
  //     document.onmousemove = null;    // 解除 鼠标移动div跟随 事件
  //     document.onmouseup = null;    // 解除鼠标松开事件
  //     oDiv.releaseCapture && oDiv.releaseCapture();    // IE8 及以下 解除强制捕获单击事件
  //   };
  //
  // }

}

//  组件销毁
// _cc 组件销毁前清除获取汇率定时器
root.beforeDestroy = function () {
  // this.exchangeRateInterval && clearInterval(this.exchangeRateInterval)
}

root.computed = {}

// 是否登录
root.computed.isLogin = function () {
  if (this.$store.state.authMessage.userId !== '') return true
  return false
}

// 显示语言
root.computed.lang = function () {
  return this.$store.state.lang
}

root.computed.staticUrl = function () {
  return this.$store.state.static_url
}

// 主题色
root.computed.themeColor = function () {
  return this.$store.state.themeColor
}

/*------------------- 方法 ---------------------*/
root.methods = {}

root.methods.marketrate = function(data){
  console.log("ratedata======"+JSON.stringify(data));
}

root.methods.marketrateerror = function(data){
  console.log("ratedataerror======"+JSON.stringify(data));
}

//点击返回顶部
root.methods.backtop = function (res) {
  this.backtophui = false;
  this.backtopzi = false;
  document.body.scrollTop = document.documentElement.scrollTop = 0;

}

//鼠标移入改变返回图片
root.methods.backtpenter = function () {
  this.showewm = true;

}

//鼠标移出改变返回图片
root.methods.backtpleave = function () {
  this.showewm = false;
}

//鼠标移入改变返回图片
root.methods.backtpenter1 = function () {
  this.showewm1 = true;

}

//鼠标移出改变返回图片
root.methods.backtpleave1 = function () {
  this.showewm1 = false;
}

//监听页面滚动事件
root.methods.appScroll = function (event) {
  var topval = $(document).scrollTop();
  if(topval>0){
    this.backtophui = true;
    this.backtopzi = false;
  }else{
    this.backtophui = false;
    this.backtopzi = false;
  }
}

//打开在线客服
root.methods.openkf = function () {
  qimoChatClick();
}


//sss===

//获取USDT汇率
root.methods.getUSDThl = function(){
  // var doollar = localStorage.getItem("exchange_rate_dollar_usdt");
  // this.$store.commit('changeExchange_rate_dollar', doollar);
  // // 循环请求
  // this.exchangeRateInterval = setInterval(() => {
  //   axios('https://otc-api.huobi.co/v1/data/market/detail',{timeout: 50000}).then(({data}) =>{
  //     if(data.success){
  //       var detaildata = data.data.detail;
  //       detaildata.forEach((item) => {
  //         if(item.coinName == 'USDT'){
  //           this.$store.commit('changeExchange_rate_dollar', item.buy);
  //           localStorage.setItem("exchange_rate_dollar_usdt",item.buy);
  //         }
  //       })
  //     }else{
  //       this.dollar_usdt = localStorage.getItem("exchange_rate_dollar_usdt");
  //       this.$store.commit('changeExchange_rate_dollar',this.dollar_usdt);
  //     }
  //   }).catch(response =>{
  //     this.dollar_usdt = localStorage.getItem("exchange_rate_dollar_usdt");
  //     this.$store.commit('changeExchange_rate_dollar',this.dollar_usdt);
  //   })
  // }, 60000)
}

export default root


