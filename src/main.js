// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
//todo router auth
// import Router from 'vue-router'
import VueI18n from 'vue-i18n'
import Vuex from 'vuex'
import VueCookies from 'vue-cookies'


import 'babel-polyfill'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import LanguageConfig from './configs/languageConfigs/Language'
import StoreConfigs from './configs/storeConfigs/StoreConfigs'
import GlobalFunctionConfigs from './configs/globalFunctionConfigs/GlobalFunctionConfigs'
import EventConfigs from './configs/eventConfigs/EventConfigs'
import NetWorkConfigs from './configs/networkConfigs/NetworkConfigs'
import Router from 'vue-router'
import RouterConfigs from './configs/routerConfigs/RouterConfigs'
import NavigationGuards from './configs/routerConfigs/NavigationGuards'
import NetworkInterceptor from './configs/networkConfigs/NetworkInterceptors'
import PreHandler from './configs/preConfigs/PreHandler'
import SocketConfigs from './configs/socketConfigs/SocketConfigs'

import VueAwesomeSwiper from 'vue-awesome-swiper'
import 'swiper/dist/css/swiper.css'

import Share from 'vue-social-share'
import 'social-share.js/dist/css/share.min.css'

// import ECharts from 'vue-echarts/components/ECharts'
// import 'echarts/lib/chart/pie'
// import { Slider,MessageBox } from 'element-ui';


import echarts from 'echarts'
Vue.prototype.$echarts = echarts

Vue.use(VueAwesomeSwiper)
Vue.use(Share)
Vue.use(Router)
Vue.use(VueI18n)
Vue.use(Vuex)
Vue.use(GlobalFunctionConfigs)
Vue.use(EventConfigs)
Vue.use(NetWorkConfigs)
Vue.use(VueCookies)
Vue.use(SocketConfigs)
// Vue.component('vote-chart', ECharts)
// Vue.use(Slider).use(MessageBox)
Vue.use(ElementUI);


const store = new Vuex.Store(StoreConfigs)
const router = new Router(RouterConfigs)

NavigationGuards(router, Vue.$eventBus, store, Vue.$http, Vue.cookies,window.zE != undefined ? window.zE : ()=>{})
NetworkInterceptor(router, Vue.$eventBus, store, Vue.$http, Vue.cookies)


if (process.env.NODE_ENV == 'production') {
  window.console.log = () => {

  }
  window.console.warn = () => {

  }
  window.console.error = () => {

  }
  window.console.debug = () => {

  }
}

if (process.env.CLOSELOG == 'true') {
  window.console.log = () => {

  }
}


// before Create
if (Vue.cookies) {
  let lang = Vue.cookies.get('BWLanguageSet')
  lang && (store.commit('CHANGE_LANG', lang))
}

// name filter 下划线变成斜杠
Vue.filter('e', function (value) {
  return value.replace('_', '/');
})


const i18n = new VueI18n({
  locale: store.state.lang,
  fallbackLocale: 'CH',
  messages: LanguageConfig
})

Vue.config.productionTip = false


async function mountApp() {
  /* eslint-disable no-new */
  await PreHandler(Vue.$http, store, Vue.cookies, i18n)
  // console.log('Vue.$socket ======',Vue.$socket);
  // console.log('store ======',store);
  //初始化ocket,由于在PreHandler里边对默认symbol做了处理,所以在这里操作
  Vue.$socket.init(store.state.symbol);

  console.warn('开始！')

  let vm = new Vue({
    el: '#app',
    router,
    store,
    i18n,
    template: '<App/>',
    components: {App},
  })

  initLang()
  addHmt()
}



mountApp()
// 添加百度统计
const addHmt = function () {
  var _hmt = _hmt || [];
  (function() {
    //815的链接
    // var hm = document.createElement("script");
    // hm.src = "https://hm.baidu.com/hm.js?86996aa523867dcd16857b3bcedc2?1cc";
    // var s = document.getElementsByTagName("script")[0];
    // s.parentNode.insertBefore(hm, s);
    // group的链接
    var hm2 = document.createElement("script");
    hm2.src = "https://hm.baidu.com/hm.js?fe47ebd81e66cd838894145e5e199460";
    var s2 = document.getElementsByTagName("script")[1];
    s2.parentNode.insertBefore(hm2, s2);

  })();
}


//zendesk帮助插件  pc版客服
const initLang = function (){
  var state = store.state

  if(!state.isMobile){
    //引入第三方客服
    let script = document.createElement('script');
    script.id = 'ze-snippet';
    script.src = "https://static.zdassets.com/ekr/snippet.js?key=5c4c59bb-6d4c-4a02-8683-4b820de3ab15";
    document.head.appendChild(script);
    setTimeout(()=>{
      zE('webWidget', 'setLocale', state.langZendeskObj[state.lang]);
    },1000)
  }else{
    window.zESettings = {
      webWidget: {
        offset: {
          mobile: {
            horizontal: '0px',
            vertical: '150px'
          }
        }
      },
    }
    let script = document.createElement('script');
    script.id = 'ze-snippet';
    script.src = "https://static.zdassets.com/ekr/snippet.js?key=5c4c59bb-6d4c-4a02-8683-4b820de3ab15";
    document.head.appendChild(script);

    setTimeout(()=>{
      zE('webWidget', 'setLocale', 'zh-cn');
      setTimeout(()=>{
          // (to.name === 'newH5homePage') && zE('webWidget', 'show');
          // zE('webWidget', 'hide');
          NavigationGuards(router, Vue.$eventBus, store, Vue.$http, Vue.cookies,zE)
      },1000)
    },700)
  }
}

const REFRESH_KEY = 'refreshDataObj'

if(!sessionStorage.getItem(REFRESH_KEY)) {
  sessionStorage.setItem(REFRESH_KEY,JSON.stringify({count:0,time:0}));
}

window.onbeforeunload = () => {
  var data2 = sessionStorage.getItem(REFRESH_KEY);
  var dataObj2 = JSON.parse(data2);
  var count = dataObj2.count + 1
  var nowTime = new Date().getTime()
  var isOpen = dataObj2.isOpen || 'hide'
  var time = dataObj2.time || nowTime
  sessionStorage.setItem(REFRESH_KEY,JSON.stringify({count,time,nowTime,isOpen}));
  // if(this.popWindowOpen = true){
  //   this.popWindowOpen = true;
  // }
  // sessionStorage.setItem(REFRESH_KEY,parseInt(sessionStorage.getItem(REFRESH_KEY) && sessionStorage.getItem(REFRESH_KEY) || 0)+1);
};

//
// if(!localStorage.getItem('aaaaaaaaaaaaaaaa'))localStorage.setItem('aaaaaaaaaaaaaaaa',1);
// if(localStorage.getItem('aaaaaaaaaaaaaaaa')>5){
//   alert('请10秒之后再刷新')
//   setTimeout(function(){
//     localStorage.setItem('aaaaaaaaaaaaaaaa',1);
//   },10000)
// }else{
//   //这里写你的请求数据的代码
// }
//
// window.onbeforeunload = function(e) {
//   localStorage.setItem('aaaaaaaaaaaaaaaa',parseInt(localStorage.getItem('aaaaaaaaaaaaaaaa') && localStorage.getItem('aaaaaaaaaaaaaaaa') || 1)+1);
// };


