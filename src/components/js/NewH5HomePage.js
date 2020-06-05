const root = {}
root.name = 'NewH5HomePage'

// ------------------------------------ 数据 --------------------------------------

root.data = function () {
  return {
    // todo 自动解开
    loading: false, // 加载中


    // 顶部swiper 所有属性---------------------------------- start
    // swiper img 属性
    swiperImgOption: {
      pagination: ('.swiper-pagination'),
      // notNextTick: true,
      loop: true,
      // initialSlide:0,
      autoplay: 3000,
      // speed: 500,
      direction: 'horizontal',
      // grabCursor : true,
      // observeParents:true,
      autoplayDisableOnInteraction: false,
      // mousewheelControl: true,
      // observer: true,
      // observeParents: true,

      // disableOnInteraction: false,
      // autoplayDisableOnInteraction:false,

    },
    // swiper text 属性
    swiperTextOption: {
      initialSlide: 0,
      autoplay: 3000,
      speed: 500,
      direction: 'vertical',
      loop: true,
      autoplayDisableOnInteraction: false,
      disableOnInteraction: false,
      observer: true,//修改swiper自己或子元素时，自动初始化swiper
      observeParents: true//修改swiper的父元素时，自动初始化swiper
    },
    // 存储img对象
    imgData: [],
    imgDataTemp: [{}],
    imgDataReady: false,
    textDataReady: false,
    // imgData:[
    //   {imageUrl:'http://img.zcool.cn/community/0142135541fe180000019ae9b8cf86.jpg@1280w_1l_2o_100sh.png'},
    //   {imageUrl:'http://img.zcool.cn/community/0142135541fe180000019ae9b8cf86.jpg@1280w_1l_2o_100sh.png'},
    //   {imageUrl:'http://img.zcool.cn/community/0142135541fe180000019ae9b8cf86.jpg@1280w_1l_2o_100sh.png'}
    // ],
    // 存储text对象
    textData: {},
    // 顶部swiper 所有属性---------------------------------- end

    // bt轮询请求 所有属性---------------------------------- start
    // 设setInterval
    setIntervalTimer: '',

    // bt活动中今日待分红折合多少usdt
    btNum: 0,


    // bt轮询请求 所有属性---------------------------------- end


    // 币对信息 ---------------------------------- start

    // 选中分区 主板区/超级为蜜区
    selectEdition: 0,

    // selectMarket: [], // 市场 'ETH', 'USDT'
    selectMarket: ['USDT', 'USDT'], // 市场

    selectMarketChange: false, // 作用是使computed反应迅速

    clickTab: false, // 是否切换了市场

    // 主板区显示币对列表
    motherBoardList: ['ACT_USDT','BDB_ETH','BT_ETH','BTC_USDT','EOS_ETH','ETH_USDT','ETH_BTC','ICC_ETH','IOST_ETH','KEY_ETH'],

    // 切换币对市场 0=btc, 1=eth
    currencyType: 2,

    // 货币对列表
    currency_list: {},
    createMarket:['WB_USDT'], // 创新区币对

    // bdb和eth汇率
    bdb_rate: 0,

    // socket推送信息
    socket_price: {},

    //首页公告下边的横向展示币对
    homePageSymbols:[],

    // 币对信息 ---------------------------------- end

    downloadShow: true,

    // 关闭国内服务弹框提示
    popWindowOpen: false,

    popType: 3,
    popOpen: false,
    popText: '系统繁忙',

    goGroupLevelss:false,
    idType: '',
    groupId: '',
    isExist: true,
    account: '',

  }
}

// ------------------------------------ 生命周期 --------------------------------------

root.created = function () {
  // 获取顶部banner
  this.getBanner()
  // 获取顶部信息
  this.getNotice()
  // 获取市场信息
  this.getMarkets()

  // 轮询请求bt数值
  // let that = this;
  // 轮询平台今日分配折合
  // that.getFeeDivident();

  // 是否获取弹框
  this.isShowToast()

  // this.changeMarket()

  // this.setIntervalTimer = setInterval(() => {
  //   that.getFeeDivident();
  // }, 300000)

  // console.log(this.textData.title)

  this.getKKPriceRange();
  this.$eventBus.listen(this, 'GET_GRC_PRICE_RANGE', this.getKKPriceRange);

}


root.destroyed = function () {
  let that = this
  clearInterval(that.setIntervalTimer);
}

// ------------------------------------ 引用组件 --------------------------------------

root.components = {
  'Loading': resolve => require(['../vue/Loading'], resolve),
  'PopupPrompt': resolve => require(['../vue/PopupPrompt'], resolve),
  'DetailsOfTheGroup': resolve => require(['../vue/DetailsOfTheGroup'], resolve),
}

// ------------------------------------ 计算 --------------------------------------

root.computed = {}

// 是否绑定了手机
root.computed.authHotVal = function () {
  return this.$store.state.authHotVal
}

root.computed.marketList = function () {
  // // 如果是自选区，不能从store里选取!
  // if (this.selectEdition === 2) {
  //   let ans = new Set()
  //   this.collectionMarket.forEach(v => {
  //     ans.add(v.split('_')[1])
  //   })
  //   if (!this.selectMarket[this.selectEdition] && [...ans].length > 0) {
  //     this.selectMarket[this.selectEdition] = [...ans][0]
  //   }
  //   return [...ans]
  // }
  //
  // if (!this.$store.state.marketList[this.selectEdition]) return []
  // let storeMarketList = this.$store.state.marketList[this.selectEdition] && this.$store.state.marketList[this.selectEdition] || []
  // let ans = []
  // // console.log(this.storeMarketList)
  // this.marketOrder.forEach(v => {
  //   let i = storeMarketList.indexOf(v)
  //   if (i === -1) {
  //     return
  //   }
  //
  //   ans.push(v)
  //   storeMarketList.splice(i, 1)
  // })
  // ans.push(...storeMarketList)

  // TODO:暂时先写死，后期修改专区再改吧
  // cc 自选区和创新区添加在这里
  // return [this.$t('Favorites'),'USDT','ENX',this.$t('Innovation')]
  return ['自选区','USDT','ENX','创新区']
}

// 特殊专区 0为超级为蜜
root.computed.specialSymbol = function () {
  return this.$store.state.specialSymbol && this.$store.state.specialSymbol || []
}

// 判断是否是手机
root.computed.isMobile = function () {
  return this.$store.state.isMobile
}

root.computed.isAndroid = function () {
  return this.$store.state.isAndroid
}
root.computed.staticUrl = function () {
  return this.$store.state.static_url
}

root.computed.btc_eth_rate = function () {
  return this.$store.state.exchange_rate
}

// // ajax获取的数据
// root.computed.currencylist = function () {
//   // 把对象按字母排序
//   let currencyList = this.$globalFunc.mergeObj(this.socket_price, this.currency_list);
//   let o = [[], []];
//   Object.keys(currencyList).sort().forEach(symbol => {
//     let currency = symbol.split('_')[1];
//     if (!currency) return;
//     // console.log('symbol',symbol)
//     let initData = {};
//     initData.name = symbol;
//     [initData.time, initData.open, initData.high, initData.low, initData.close, initData.volume] = [...currencyList[symbol]]
//     // 如果是超级为蜜区
//     if (this.specialSymbol[0] && this.specialSymbol[0].has(symbol)) {
//       // !o[1][currency] && (o[1][currency] = [])
//       // o[1][currency].push(initData)
//       !o[1] && (o[1] = [])
//       o[1].push(initData)
//       return
//     }
//     // 如果不是
//     // !o[0][currency] && (o[0][currency] = []);
//     // o[0][currency].push(initData);
//     !o[0] && (o[0] = []);
//     if (this.motherBoardList.indexOf(symbol)!= -1){
//       o[0].push(initData);
//     }
//
//   })
//   return o
// }

// ajax获取的数据
root.computed.currencylist = function () {
  // 把对象按字母排序
  let currencyList = this.$globalFunc.mergeObj(this.socket_price, this.currency_list);
  // let collectionMarketSet = new Set(this.collectionMarket)
  // console.log(currencyList)
  let o = [{}, {}, {}];
  Object.keys(currencyList).sort().forEach(symbol => {
    let currency = symbol.split('_')[1];
    if (!currency) return;
    // initData 为整行的数据对象
    let initData = {};
    initData.name = symbol;
    [initData.time, initData.open, initData.high, initData.low, initData.close, initData.volume] = [...currencyList[symbol]]

    // !o[0].optionalArea && (o[0].optionalArea = [])
    !o[0].createArea && (o[0].createArea = [])
    // 如果是自选区
    // if (collectionMarketSet.has(symbol)) {
    //   console.log(initData)
    //   initData.isCollection = true
    //   // !o[2][currency] && (o[2][currency] = [])
    //   // o[2][currency].push(initData)
    //   o[0].optionalArea.push(initData)
    // }
    // 如果是创新区
    if (this.createMarket.includes(symbol)) {
      initData.isCreate = true

      o[0].createArea.push(initData);
      return;
    }

    // 如果是超级为蜜区
    // if (this.specialSymbol[0] && this.specialSymbol[0].has(symbol)) {
    //   !o[1][currency] && (o[1][currency] = [])
    //   o[1][currency].push(initData)
    //   return
    // }
    // 如果不是
    !o[0][currency] && (o[0][currency] = []);
    o[0][currency].push(initData);
  })
  return o
}


// 公告下方过滤数据
root.computed.currencyliststaic = function () {
  // 把对象按字母排序
  let currencyList = this.$globalFunc.mergeObj(this.socket_price, this.currency_list);
  let o = [];
  Object.keys(currencyList).sort().forEach(symbol => {
    let currency = symbol.split('_')[1];
    if (!currency) return;
    // console.log('symbol',symbol)
    // console.log(currencyList[symbol])
    let initData = {};
    initData.name = symbol;
    [initData.time, initData.open, initData.high, initData.low, initData.close, initData.volume] = [...currencyList[symbol]]
    o.push(initData);
  })
  return o.sort((a,b)=>!b.open && b.open - a.open)
}

root.computed.btc = function () {
  let btc_list = !!this.currencylist.BTC ? this.currencylist.BTC : this.currencylist.BTX;
  return btc_list;
}
root.computed.eth = function () {
  let eth_list = !!this.currencylist.ETH ? this.currencylist.ETH : this.currencylist.ETX;
  return eth_list;
}
root.computed.bdb = function () {
  let bdb_list = this.currencylist.BDB;
  return bdb_list;
}
root.computed.usdt = function () {
  let usdt_list = this.currencylist.USDT;
  return usdt_list;
}
// 循环出来的items
/*root.computed.item_list = function () {
  // let item_list = []
  // if (this.currencyType === 1) {
  //   return this.btc
  // }
  // if (this.currencyType === 2) {
  //   return this.eth
  // }
  // if (this.currencyType === 3) {
  //   return this.bdb
  // }
  // if (this.currencyType === 0) {
  //   return this.usdt
  // }
  let ans = this.selectMarketChange
  // console.log('item_list',this.currencylist[this.selectEdition])
  return this.currencylist[this.selectEdition] || []
}*/



// 选中的市场数据
root.computed.computedMarketList = function () {
  // console.log(this.currencylist[this.selectEdition][this.selectMarket[this.selectEdition]])
  let ans = this.selectMarketChange
  // if(this.selectMarket[this.selectEdition] == this.$t('Favorites'))return (this.currencylist[this.selectEdition].optionalArea)
  if(this.selectMarket[this.selectEdition] == '创新区')return (this.currencylist[this.selectEdition].createArea)

  // if(this.$route.query.isIOS){
    return (this.currencylist[this.selectEdition] && this.currencylist[this.selectEdition][this.selectMarket[this.selectEdition]] || []).sort((b,a)=>!b.open && a.open - b.open)
  // }
  //   else{
  //   return (this.currencylist[this.selectEdition] && this.currencylist[this.selectEdition][this.selectMarket[this.selectEdition]] || []).sort((a,b)=>!b.open && b.open - a.open)
  // }
}

root.computed.computedCreate = function () {
  let createMarket = this.currencylist[this.selectEdition][this.selectMarket[this.selectEdition]]
  createMarket.slice()
}



// 循环出来的items
root.computed.item_list = function () {
  // let ans = this.selectMarketChange
  if(!(this.homePageSymbols instanceof Array) || !(this.currencylist instanceof Array))return []

  let temp = [];
  this.homePageSymbols.length > 3 && (this.homePageSymbols.length = 3)
  // console.log(this.currencyliststaic)
  this.homePageSymbols.forEach(symbol=>{
    let item = this.currencyliststaic.find(v => v && v.name == symbol)
    item && temp.push(item);
  })
  // console.log('temp===============',temp)

  return temp || []
}

// 费率计算
root.computed.rate = function () {
  let self = this;
  for (let key in this.socket_price) {
    if (key == 'BDB_ETH') {
      self.bdb_rate = this.socket_price[key][4];
    }
  }
  // let type = this.item.name;
  // let symbol = type.split('_')[1];
  // currencyType
  if (this.currencyType == 1) {
    return this.$store.state.exchange_rate.btcExchangeRate
  }
  if (this.currencyType == 2) {
    return this.$store.state.exchange_rate.ethExchangeRate
  }
  if (this.currencyType == 3) {
    return this.$store.state.exchange_rate.ethExchangeRate * this.bdb_rate
  }
  if (this.currencyType == 0) {
    return 1
  }
}

// 所有币对精度信息
root.computed.quoteScale_list = function () {
  let quoteScale_obj = {};
  let quoteScale_list = this.$store.state.quoteConfig;
  quoteScale_list.forEach(v => {
    quoteScale_obj[v.name] = {quoteScale: v.quoteScale, baseScale: v.baseScale};
  })
  return quoteScale_obj;
}

// 是否登录
root.computed.isLogin = function () {
  if (this.$store.state.authMessage.userId !== '') return true
  return false
}

// 判断是否是手机
root.computed.isMobile = function () {
  return this.$store.state.isMobile
}


// 用户类型，如果是手机用户，为0，如果是邮箱用户，为1
root.computed.userType = function () {
  return this.$store.state.authMessage && this.$store.state.authMessage.province === 'mobile' ? 0 : 1
}

// 邮箱
root.computed.userName = function () {
  if (this.userType === 0) {
    return this.$globalFunc.formatUserName(this.$store.state.authMessage.mobile)
  }
  if (!this.$store.state.authMessage.email) {
    return '****@****'
  }
  return this.$globalFunc.formatUserName(this.$store.state.authMessage.email)
}


// uid
root.computed.useruid = function (){
  return this.$store.state.authMessage.userId
}

// 获取userId
root.computed.userId = function () {
  return this.$store.state.authMessage.userId
}

// 20180828 是否免费
// root.computed.reduce_list = function () {
//   let symbol_list = this.$store.state.reduce_fee;
//   let reduce_list = [];
//   for (let i = 0; i < symbol_list.length; i++) {
//     let item = symbol_list[i];
//     if (!!item.feeDiscount) {
//       let symbol = item.name.split('_')[1];
//       if (reduce_list.indexOf(symbol) == '-1'){
//         reduce_list.push(symbol);
//       }
//     }
//   }
//   return reduce_list;
// }


// --------------------------------------------------------------------------- 底部市场页面计算 start ------------------------------------------------------------


// ----------------------------------------------------------------------- 底部市场页面计算 end -----------------------------------------------------------------------


// ------------------------------------ 监视 --------------------------------------

root.watch = {}


// ------------------------------------ 方法 --------------------------------------

root.methods = {}

// --------------- 初始化页面 start ---------------


root.methods.goToNotice = function () {
  this.$router.push('/index/mobileNotice')
}
// 点击切换版块
// root.methods.changeEdition = function (type) {
//   if (parseInt(type) === this.selectEdition) return
//   this.selectEdition = parseInt(type)
//   this.clickTab = true
// }

// root.methods.goTojiaoyi = function () {
//
//   this.$router.push({name: 'officialQuantitativeDetails'})
//
// }

//量化查询报名记录get
root.methods.getRegistrationRecord = function () {

  this.$http.send('GET_GETREG_DATA', {
    bind: this,
    urlFragment:this.userId,
    // query:{
    //   userId:this.uuid
    // },
    callBack: this.re_getRegistrationRecord,
    errorHandler: this.error_getRegistrationRecord
  })
}
root.methods.re_getRegistrationRecord = function (data) {

  typeof data === 'string' && (data = JSON.parse(data))
  if (!data) {return}
  console.log("this.re_getRegistrationRecord查询报名记录get=====",data)
  this.records = data.data

  if (this.records == 0) {
    this.$router.push({name: 'officialQuantitativeRegistration'})
    return;
  }

  let E2 = this.records[0]
  this.fstatus = E2.fstatus

  if (this.fstatus !== '已报名') {
    // this.goGroupLevel()
    console.log("this.re_getRegistrationRecord查询报名记录get=====",this.records.fstatus)
    this.$router.push({name: 'officialQuantitativeRegistration'})
    return;
  }
  if (this.fstatus == '已报名') {
    this.$router.push({name: 'officialQuantitativeDetails'})
    return;
  }

}
root.methods.error_getRegistrationRecord = function (err) {
  console.log("this.err=====",err)
}



// 登陆用户组等级信息get (query:{})
root.methods.getGroupLevel = function () {

  if (!this.isLogin) {
    this.$router.push('/index/sign/login')
    return;
  }
  this.$http.send('GET_ASSEMBLE_GET', {
    bind: this,
    urlFragment:this.userId,
    // query:{
    //   userId:this.uuid
    // },
    callBack: this.re_getGroupLevel,
    errorHandler: this.error_getGroupLevel
  })
}
root.methods.re_getGroupLevel = function (data) {

  console.log("this.re_getGroupLevel登陆用户组等级信息 + data=====",data)
  typeof data === 'string' && (data = JSON.parse(data))
  this.idType = data.data.idType
  this.groupId = data.data.groupId
  this.isExist = data.data.isExist
  this.account = data.data.account

  if (this.isExist == false) {
    // this.goGroupLevel()
    this.$router.push({name: 'assembleARegiment'})
  }


  if (this.isExist == true) {
    // this.goGroupLevelss=true
    this.$router.push({name: 'detailsOfTheGroup'})
  }

}
root.methods.error_getGroupLevel = function (err) {
  console.log("this.err=====",err)
}


// 点击切换版块下的市场
root.methods.changeMarket = function (market) {
  this.selectMarket[this.selectEdition] = market
  this.clickTab = true
  this.selectMarketChange = !this.selectMarketChange
}

// 选中的市场
root.methods.selectedMarket = function (item) {
  return this.selectMarket[this.selectEdition] === item
}

// // // 点击切换版块下的市场
// root.methods.changeMarket = function (market) {
//   this.selectMarket[this.selectEdition] = market
//   // this.selectMarketChange = !this.selectMarketChange
//   this.clickTab = true
// }





root.methods.initPage = function () {
  this.$store.commit('changeMobileHeaderTitle', '');
}


root.methods.computedToCNY = function (item) {

  // if (!this.btc_eth_rate.dataMap) {
  //
  //   return 0;
  // }

  let rate = 0
  let type = item.name.split('_')[1];
  let rate_obj = this.btc_eth_rate;

  switch (type) {
    case 'BTC':
      rate = rate_obj.btcExchangeRate;
      break;
    case 'ETH':
      rate = rate_obj.ethExchangeRate;
      break;
    case 'BDB':
      rate = rate_obj.ethExchangeRate * this.bdb_rate;
      break;
    case 'USDT':
      rate = 1;
      break;
    default:
      rate = 0;
  }

  return this.$globalFunc.accFixedCny(item.close * rate * this.$store.state.exchange_rate_dollar, 2)
}

// ----------- 初始化页面 end -----------

// ----------- 跳到C2C页面 start-----------
root.methods.GO_OTC = function () {
  let paras = this.$store.state.save_cookie;
  if (!paras) return;
  if(!this.isLogin){
    this.$router.push('/index/sign/login?toUrl=c2c_url')
    return;
  }
  let c2c_url = process.env.DOMAIN;
  // console.log(c2c_url)
  window.open(c2c_url);
}
// ----------- 跳到C2C页面 end-----------

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

// ----------- 获取grc交易价格区间 start -----------
root.methods.getKKPriceRange = function () {
  this.$http.send('KK_PRICE_RANGE',
    {
      bind: this,
      callBack: this.re_getKKPriceRange,
      errorHandler: this.error_getKKPriceRange
    })
}
// 获取grc交易价格区间成功
root.methods.re_getKKPriceRange = function (data) {
  // console.log('获取grc交易价格区间成功',data);
  if(!data || !data.kkPriceRange)return
  this.KKPriceRange = data.kkPriceRange;

  this.$store.commit('SET_KK_PRICE_RANGE',data.kkPriceRange)
}
// 获取grc交易价格区间报错
root.methods.error_getKKPriceRange = function () {
  console.log('获取grc交易价格区间报错');
}
// ----------- 获取价格区间 end -----------


// --------------- 切换币种 start ---------------

root.methods.changeCurrencyMarket = function (type) {
  if (parseInt(type) === this.selectEdition) return
  this.selectEdition = parseInt(type)
}

// ----------- 切换币种 end -----------


// --------------- 关闭底部下载弹窗 start ---------------

root.methods.closeDownload = function () {
  this.downloadShow = false;
}

// ----------- 关闭底部下载弹窗 end -----------


// --------------------------------------------------------------------------- 顶部轮播逻辑 start ------------------------------------------------------------

root.methods.goToTreasureChest = function () {
  this.$router.push({name:'treasureBox'})
}
//跳转到热度
root.methods.gotoHeatList = function () {
  this.$router.push({name:'mobileHeatList'})
}
// 获取通告信息
root.methods.getNotice = function () {
  this.$http.send('POST_NOTICE_LIST', {
    bind: this,
    params: {
      offset: 0,
      maxResults: 3,
      languageId: 1,
    },
    callBack: this.re_getNotice
  });
}
// 渲染通告列表
root.methods.re_getNotice = function (res) {
  // console.log('获取的res',res)
  this.textData = res;
  this.textDataReady = true;
  // console.log(this.textData)
}
// 通告跳转
root.methods.goNotice = function (item,isApp) {
  // window.location.href=res;
  // 判断是否为app的公告
  // if (!isApp){
    this.$router.push({path: '/index/mobileNoticeDetail', query: {id:item.id}})
  // }
  // this.$router.push({path: '/index/mobileNoticeDetail', query: {id:res, isApp:true}})

}

// 获取顶部banner图
root.methods.getBanner = function () {
  this.$http.send('GET_HOME_BANNERM', {
    bind: this,
    callBack: this.re_getBanner
  });
}

root.methods.re_getBanner = function (res) {
  // console.log('获取的res', res)
  this.imgData = res;
  this.imgDataReady = true
}

root.methods.goBannerDetail = function (item) {
  console.log('this is banner item',item);

  // if (item.title == '会员') {
  //   this.$router.push('/index/personal/securityCenter/membershipCard')
  //   return;
  // }
  // if (item.title == '挖矿新时代PC') {
  //   this.$router.push('/index/officialQuantitativeRegistration')
  //   return;
  // }
  // if (item.title == '注册有礼H5') {
  //   this.$router.push('/index/register')
  //   return;
  // }

  if(item.url.indexOf('events/grc-token-mining') > -1){
    this.GO_GRC();
    return;
  }
  let reg = new RegExp("amp;","")
  let bannerUrl = item.url.replace(reg,"");
  window.open(bannerUrl);
  // window.open(item.url);
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


// ----------------------------------------------------------------------- 顶部轮播逻辑 end -----------------------------------------------------------------------
root.methods.goGroupLevel = function () {

  if (!this.isLogin) {
    this.$router.push('/index/sign/login')
    return;
  }
  this.popText = "敬请期待"
  this.popOpen = true
  this.popType = 3
  return;

}
// 弹窗
root.methods.popClose = function () {
  this.popOpen = false
}
root.methods.jumpToBtActivity = function () {
  this.$router.push({name: 'MobileBTActivityHomePage'});
  return false;
}

// 获取bt信息 轮询
root.methods.getFeeDivident = function (data) {
  // this.$http.send('GET_BT_FEE_DIVIDENT', {
  //   bind: this,
  //   callBack: this.re_getFeeDivident,
  //   errorHandler: this.error_getFeeDivident
  // })
}

root.methods.re_getFeeDivident = function (data) {
  // typeof data === 'string' && (data = JSON.parse(data));
  // if (data.errorCode) {
  //   return
  // }
  // // console.log('获取平台信息1', data)
  // this.btNum = data.dataMap.dividend
  // // this.userProfitsData.items = data.dataMap;

}

root.methods.error_getFeeDivident = function (err) {
  // console.log(err)
}


// --------------------------------------------------------------------------- 底部市场页面逻辑 start ------------------------------------------------------------

// 初始化获取市场
root.methods.getMarkets = function () {
  // 初始化数据请求----cc 请求币对信息
  this.initGetMarketDatas();
  // 初始化socket
  this.initSocket();
  // 获取rate值
  this.getExchangeRate();
  // 获取首页币对信息
  this.getBiDuiInfo()
}

root.methods.changeSelectEdition = function (num) {
  this.selectEdition = num
}


// 请求币对信息
root.methods.initGetMarketDatas = function () {
  this.$http.send('COMMON_SYMBOLS', {
    bind: this,
    callBack: this.re_getCurrencyList,
    errorHandler: this.error_getCurrencyList
  });
}

root.methods.re_getCurrencyList = function (data) {
  // console.log('这里data是正常的>>>>>>>>>>>>>>>>>>>', data)
  this.getPrices();
  typeof(data) == 'string' && (data = JSON.parse(data));
  let objs = this.symbolList_priceList(data);
  this.currency_list = objs;
}

root.methods.error_getCurrencyList = function (err) {
  console.error('请求失败', err);
}


// 获取首页币对信息
root.methods.getBiDuiInfo = function () {
  this.$http.send('GET_HOMEPAGE_SYMBOLS', {
    bind: this,
    urlFragment:'H5',
    callBack: this.re_getBiDuiInfoList,
    errorHandler: this.error_getBiDuiInfoList
  });
}

root.methods.re_getBiDuiInfoList = function (data) {
  typeof(data) == 'string' && (data = JSON.parse(data));
  // console.log(data)
  data && (this.homePageSymbols = data)
}

root.methods.error_getBiDuiInfoList = function (err) {
  console.error('请求失败', err);
}


// 请求price
root.methods.getPrices = function () {
  this.$http.send('MARKET_PRICES', {
    bind: this,
    callBack: this.re_getCurrencyLists,
    errorHandler: this.error_getCurrencyLists
  })
}

// price接口数据返回
root.methods.re_getCurrencyLists = function (data) {
  typeof(data) == 'string' && (data = JSON.parse(data));
  // console.log('price接口数据是这样的>>>>>>>>>>>>>>>>>>',data)
  this.currency_list = this.$globalFunc.mergeObj(data, this.currency_list);
  // console.log('price接口数据是这样的>>>>>>>>>>>>>>>>>>',this.currency_list)
}

root.methods.error_getCurrencyLists = function (err) {
  console.error('请求失败', err);
}

// 获取汇率
root.methods.getExchangeRate = function () {
  this.$http.send('GET_EXCHANGE__RAGE', {
    bind: this,
    callBack: this.setExchangeRateRate
  })
}
// store存储rate对象
root.methods.setExchangeRateRate = function (data) {
  typeof (data) === 'string' && (data = JSON.parse(data));
  let rateObj = data.dataMap.exchangeRate;
  this.$store.commit('SET_EXCHANGE_RATE', rateObj);
}

root.methods.symbolList_priceList = function (symbol_list) {
  let obj = {};
  let objs = symbol_list.symbols;
  objs.forEach((v, i) => {
    obj[v.name] = [0, 0, 0, 0, 0, 0];
  })
  return obj;
}

// 初始化socket
root.methods.initSocket = function () {
  // 订阅某个币对的信息
  this.$socket.emit('unsubscribe', {symbol: this.$store.state.symbol});
  this.$socket.emit('subscribe', {symbol: this.$store.state.symbol});

  // 接收所有币对实时价格
  this.$socket.on({
    key: 'topic_prices', bind: this, callBack: (message) => {
      this.socket_price = message;
    }
  })
}

root.methods.diff24 = function (openvalue, nowvalue) {
  if (openvalue == 0) {
    return '0.00';
  } else {
    let diff = ((nowvalue - openvalue) / openvalue * 100).toFixed(2);
    return diff;
  }
}

// 实时价格cny
root.methods.cny_price = function (closevalue) {
  let close = Number(closevalue) || 0;
  // if(!this.rate) return '￥0.00'
  let rate = this.rate || 0
  return ('￥' + this.$globalFunc.accFixedCny(this.$store.state.exchange_rate_dollar * (close * rate), 2));
}

// 点击每行跳转到市场
root.methods.clickToTradingHall = function (name) {
  // 把当前选中的币对写入cookie
  let user_id = this.$store.state.authMessage.userId;
  let user_id_symbol = user_id + '-' + name;
  !user_id && this.$cookies.set('unlogin_user_symbol_cookie', name, 60 * 60 * 24 * 30,"/");
  !!user_id && this.$cookies.set('user_symbol_cookie', user_id_symbol, 60 * 60 * 24 * 30,"/");
  this.$store.commit('SET_SYMBOL', name);

  this.$store.commit('changeMobileTradingHallFlag', true);
  this.$store.commit('changeMobileSymbolType', name);
  this.$store.commit('SET_HALL_SYMBOL', false);
  this.$router.push({name: 'mobileTradingHall'})
}

// 点击跳转更多到市场
root.methods.getMoreMarket = function (list, currencyType) {
  let symbols = list[0].name;
  this.$store.commit('SET_SYMBOL', symbols);
  this.$router.push({name: 'mobileTradingHall', query: {symbol: currencyType}});
}

// 滑动的时候开始改变位置
root.methods.scrollMethod = function (e) {
  console.warn('this is e', e)
}

// 修改下载页面的位置
root.methods.changeDownloadViewPosition = function () {
  this.$refs.downloadView && console.warn('this is downloadView', this.$refs.downloadView)
}


// 关闭弹框 2018-8-29
root.methods.isShowToast = function () {
  let time = this.$cookies.get('CLOSE_WEB')
  if ((time && this.$globalFunc.formatDateUitl(parseFloat(time), 'YYYY-MM-DD') === this.$globalFunc.formatDateUitl(new Date().getTime(), 'YYYY-MM-DD'))) {
    return
  }
  this.openToast()
}

// 2018-8-25 打开弹框
root.methods.openToast = function () {
  this.popWindowOpen = true
}

root.methods.closeToast = function () {
  this.$cookies.set('CLOSE_WEB', new Date().getTime())
  this.popWindowOpen = false;
}


// ----------------------------------------------------------------------- 底部市场页面逻辑 end -----------------------------------------------------------------------


/*---------------------- 保留小数 begin ---------------------*/
root.methods.toFixed = function (num, acc = 8) {
  return this.$globalFunc.accFixed(num, acc)
}
/*---------------------- 保留小数 end ---------------------*/

/*---------------------- 加法运算 begin ---------------------*/
root.methods.accAdd = function (num1, num2) {
  return this.$globalFunc.accAdd(num1, num2)
}
/*---------------------- 加法运算 end ---------------------*/

/*---------------------- 减法运算 begin ---------------------*/
root.methods.accMinus = function (num1, num2) {
  return this.$globalFunc.accMinus(num1, num2)
}
/*---------------------- 减法运算 end ---------------------*/

/*---------------------- 乘法运算 begin ---------------------*/
root.methods.accMul = function (num1, num2) {
  return this.$globalFunc.accMul(num1, num2)
}
/*---------------------- 乘法运算 end ---------------------*/

/*---------------------- 除法运算 begin ---------------------*/
root.methods.accDiv = function (num1, num2) {
  return this.$globalFunc.accDiv(num1, num2)
}
/*---------------------- 除法运算 end ---------------------*/

// 登出
root.methods.loginOff = function () {
  this.$http.send('LOGIN_OFF',
    {
      bind: this,
      params: {},
      callBack: this.re_login_off_callback
    }
  )
}
// 登出回调
root.methods.re_login_off_callback = function (data) {
  // 清除cookie
  this.$cookies.remove("popShow");
  this.$store.commit('LOGIN_OUT');
  window.location.reload();
}

/*---------------------- 跳入到市场页面 ---------------------*/
root.methods.gotoShichang = function () {
  this.$router.push({name: 'mobileTradingHall'});
}

/*---------------------- 跳入到资产页面 ---------------------*/
root.methods.gotoZichan = function () {
  this.$router.push({name: 'MobileAssetRechargeAndWithdrawals'});
}

/*---------------------- 跳入到会员卡页面 ---------------------*/
// root.methods.gotoVIP = function () {
//   this.$router.push({name: 'membershipCard'});
// }

/*---------------------- 跳入到交易页面 ---------------------*/
root.methods.gotoJiaoyi = function () {
  this.$router.push({name: 'mobileTradingHallDetail'});
}

root.methods.gotoRecommend = function () {
  this.$router.push({name: 'H5Recommend'});
}


/*---------------------- cc sort在ios中不兼容的问题 ---------------------*/
;(function(w){
  if(/msie|applewebkit.+safari/i.test(w.navigator.userAgent)){
    var _sort = Array.prototype.sort;
    Array.prototype.sort = function(fn){
      if(!!fn && typeof fn === 'function'){
        if(this.length < 2) return this;
        var i = 0, j = i + 1, l = this.length, tmp, r = false, t = 0;
        for(; i < l; i++){
          for(j = i + 1; j < l; j++){
            t = fn.call(this, this[i], this[j]);
            r = (typeof t === 'number' ? t : !!t ? 1 : 0) > 0 ? true : false;
            if(r){
              tmp = this[i];
              this[i] = this[j];
              this[j] = tmp;
            }
          }
        }
        return this;
      } else {
        return _sort.call(this);
      }
    };
  }
})(window);

export default root
