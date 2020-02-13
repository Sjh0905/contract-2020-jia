const root = {}

/*------------------- 组件名称 ---------------------*/
root.name = 'IndexHomeCarousel'

// ------------------------------------ 引用组件 --------------------------------------

root.components = {
  'Loading': resolve => require(['../vue/Loading'], resolve),

}

/*------------------- props ---------------------*/
root.props = {}


/*------------------- data ---------------------*/

root.data = function () {
  return {
    loading: true,

    swiperImgOption: {
      pagination: ('.pc-swiper-pagination'),
      loop: true,
      autoplay: 3000,
      direction: 'horizontal',
      autoplayDisableOnInteraction: false,
      paginationClickable: true,
      paginationType: 'bullets',
      bannerurl:'https://TwentyTwenty .zendesk.com/hc/zh-cn/articles/360030785411'

    },

    // 存储img对象
    imgDataTemp: [],
    imgData: [],
    imgDataReady: false,

    // 存储底部公告列表
    noticeList: [],
    offset: 0,//从第几个开始
    maxResults: 3, //请求个数
    banner_url: 'https://www.2020.exchange'
  }
}


/*------------------- 生命周期 ---------------------*/

root.created = function () {
  this.GET_BANNER()
  this.$eventBus.listen(this,'LANGCHANGED',this.GET_BANNER)
  // this.GET_NOTICE()
  // console.log(this.imgDataTemp,'hahahah')
}


root.computed = {}

// 显示语言
root.computed.lang = function () {
  return this.$store.state.lang
}

root.computed.hideNotice = function () {
  // if (this.lang === 'KOR') return true;
  return false;
}

// 主题色
root.computed.themeColor = function () {
  return this.$store.state.themeColor
}

root.computed.staticUrl = function () {
  // return 'https://staging.2020.exchange:33333/'
  return this.$store.state.static_url
}
// 是否登录
root.computed.isLogin = function () {
  if (this.$store.state.authMessage.userId !== '') return true
  return false
}

root.watch = {}

root.watch.lang = function (newValue, oldValue) {
  if (newValue == oldValue) return;
  // this.GET_NOTICE();
  // this.GET_BANNER()
}

/*------------------- 方法 ---------------------*/
root.methods = {}

// 语言选项
root.methods.languageId = function (langName) {
  if (langName === 'CH') return 1
  if (langName === 'EN') return 2
  if (langName === 'CA') return 3
  if (langName === 'KOR') return 3
  if (langName === 'JP') return 3
  return 1
}

// --------------- 获取对象长度 start ---------------

root.methods.getLength = function (obj) {
  let objType = typeof obj;
  if (objType === 'string') {
    return obj.length;
  } else if (objType === 'object') {
    let objLength = 0;
    for (let i in obj) {
      objLength++;
    }
    return objLength;
  }
}

// ----------- 获取对象长度 end -----------

// 获取banner
root.methods.GET_BANNER = function (langName) {
  this.$http.send('GET_HOME_BANNER', {
    bind: this,
    callBack: this.RE_GET_HOME_BANNER,
    query:{
      languageId:this.languageId(langName)
    }
  });
}
root.methods.RE_GET_HOME_BANNER = function (res) {
  // console.log(res,'aaaaaaaa')
  // console.log(this.languageId)
  this.imgDataTemp = res;

  this.imgDataReady = true
  this.loading = false
}

// // 获取banner
// root.methods.GET_BANNER = function () {
//   this.$http.send('GET_HOME_BANNER', {
//     bind: this,
//     callBack: this.RE_GET_HOME_BANNER
//   });
// }
// root.methods.RE_GET_HOME_BANNER = function (res) {
//   console.log(res,'ceshi')
//   this.imgDataTemp = res;
//   this.imgDataReady = true;
//   this.loading = false;
// }



// // 获取通告信息
// root.methods.GET_NOTICE = function () {
//   this.$http.send('POST_NOTICE_LIST', {
//     bind: this,
//     params: {
//       offset: this.offset,
//       maxResults: this.maxResults,
//       languageId: this.languageId,
//     },
//     callBack: this.RE_GET_NOTICE
//   });
// }
// // 渲染通告列表
// root.methods.RE_GET_NOTICE = function (res) {
//   console.log('公告44444', res)
//   this.noticeList = res;
//   console.log("-------------'公告'",this.noticeList);
// }

root.methods.goBannerDetail = function (item) {
  console.log('this is banner item',item);

  if(item.url.indexOf('events/grc-token-mining') > -1){
    // alert('123123123');
    // window.open();
    this.GO_GRC();
    return;
  }
  window.open(item.url);
}
// 跳到GRC页面
root.methods.GO_GRC = function () {
  if(!this.isLogin){
    this.$router.push('/index/sign/login?toUrl=GRC')
    return;
  }
  let paras = this.$store.state.save_cookie;
  typeof paras == 'string' && (paras = JSON.parse(paras))
  let _bitsession_ =paras.cookies && paras.cookies.value || '';
  let isApp = false;
  let userId = this.$store.state.authMessage.userId;
  let lang = this.$store.state.lang;
  let GRC_URL = this.$store.state.GRC_URL+'?'+'isApp='+isApp+'&_bitsession_='+_bitsession_+'&userId='+userId+'&lang='+lang;
  window.open(GRC_URL);
}
root.methods.changePagination = function (index) {
//   // console.log('点击index', index)
}

export default root
