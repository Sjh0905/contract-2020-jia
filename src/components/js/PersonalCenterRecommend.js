const root = {}
root.name = 'PersonalCenterRecommend'

import logo from '../../assets/二维码logo.png'

/*------------------------------ 组件 ------------------------------*/
root.components = {
  'Loading': resolve => require(['../vue/Loading'], resolve),
  'PopupPrompt': resolve => require(['../vue/PopupPrompt'], resolve),
  'Qrcode': resolve => require(['qrcode-vue'], resolve),
}

/*------------------------------ data ------------------------------*/

root.data = function () {
  return {
    loading: true,

    uId: '',
    shareUrl: '',
    popType: 0,
    popText: '',
    promptOpen: false,

    records: [],
    selectIndex: 1,
    offset: 1, //开始页数
    limit: 10,
    maxResults: 10, //一次加载条数
    size: 0, //已推荐朋友
    totalRegister: 0,//注册奖励
    totalRebate: 0,//累计奖励
    identityAuthCount: 0,//实名认证人数
    totalYesterday: 0, //昨日奖励

    activityRate: 0,//活动奖励比率
    rewardRate: 0,//奖励比率


    loadingMore: true,
    loadingMoreIng: false,

    // 活动规则弹窗
    activityPopType: 3,
    activityPopOpen: false,

    yesterdayExRateIOSTtoBDB: 0, // IOST对BDB的汇率

    // 分享配置
    share_config_ch: {},
    share_config_en: {},

    logo: logo,
    qrsize: 124,
    bgColor: '#fff',
    fgColor: '#000',
    value: '', // 活动详情页

    platformData: 0,

    shareDataFlag: false,

    // 是否显示查看历史
    historyShow: true,
    // 是否展示海报
    showPoster: false,
    // 海报url
    poster_url: '',

    fromIndex: 0,
    toIndex: 10,

    myInvites:[]

  }
}

/*------------------------------ 生命周期 ------------------------------*/

root.created = function () {
  console.log("uuid=2222=="+this.$store.state.authMessage.uuid)
  let uuiid = ''
  if(this.$store.state.authMessage.uuid == undefined){
    uuiid = this.$store.state.authMessage.userId;
  }else{
    uuiid = this.$store.state.authMessage.uuid
  }
  let protocol = window.location.protocol;
  let sharUrl = document.location.host + '/index/register?uid=' + uuiid + '&source=share';
  this.shareUrl = protocol + '//' + sharUrl;

  if(this.$store.state.authMessage.uuid == undefined){
    this.uId = this.$store.state.authMessage.userId;
  }else{
    this.uId = this.$store.state.authMessage.uuid;
  }
  // this.uId = this.$store.state.authMessage.userId;

  this.value = this.shareUrl;
  console.log("value=2222=="+this.shareUrl)

  // this.getMyInvites();
  // 获取奖励比率
  this.getRegulationConfig()
  // 获取数据
  this.getMyInvitesForBT()
  // 获取是否显示查看历史
  // this.getMyHistory()

  this.qrsize = 124 / window.devicePixelRatio


  // 获取分享文案显示usdt数量请求
  // this.getPlatformData()


  // this.getBTFunc()

  // 获取海报
  this.GET_POSTER_URL();


  // 配置分享
  // this.shareDataFlag = true
  // this.share_config_ch = {
  //   url: this.shareUrl,
  //   source: '',
  //   title: '二零二零与网易星球达成长期深度合作，现在注册二零二零即可参与百万推广活动！更有高达70%综合收益分配的交易挖矿等你来~注册请使用链接',
  //   description: '二零二零与网易星球达成长期深度合作，现在注册二零二零即可参与百万推广活动！更有高达70%综合收益分配的交易挖矿等你来~注册请使用链接',
  //   image: 'http://logo.2020.exchange/btcdo.jpg',
  //   sites: ['qq', 'weibo', 'facebook', 'twitter']
  // }
  // this.share_config_en = {
  //   url: this.shareUrl,
  //   source: '',
  //   title: 'TwentyTwenty  and NetEase Planet achieve deep long-term cooperation.  Now register in TwentyTwenty  to enjoy millions bonus activities! Trade Mining with up to 70% dividend distribution is waiting for you~Please register with the following link',
  //   description: 'TwentyTwenty  and NetEase Planet achieve deep long-term cooperation.  Now register in TwentyTwenty  to enjoy millions bonus activities! Trade Mining with up to 70% dividend distribution is waiting for you~Please register with the following link',
  //   image: 'http://logo.2020.exchange/btcdo.jpg',
  //   sites: ['qq', 'weibo', 'facebook', 'twitter']
  // }


}

/*------------------------------ 计算 ------------------------------*/
root.computed = {}

root.computed.lang = function () {
  return this.$store.state.lang;
}

root.computed.recordsLength = function () {
  return this.records.length
}
// 累计
root.computed.total = function () {
  let total = 0

  for (let i = 0; i < this.records.length; i++) {
    let state = this.registerAward(this.records[i])

    if (state === '3 BDB') total = this.accAdd(total, 3)
    if (state === '50 IOST') total = this.accAdd(total, this.accMul(50, this.yesterdayExRateIOSTtoBDB))
  }

  return this.toFixed(total, 8)
}
// 累计本月返佣
root.computed.totalThisMonthRebate = function () {
  let total = 0
  for (let i = 0; i < this.records.length; i++) {
    total = this.accAdd(total, this.toFixed(this.records[i].thisMonthRebate))
  }
  return total || 0
}
// 累计累计返佣
root.computed.totalTotalRebate = function () {
  let total = 0
  for (let i = 0; i < this.records.length; i++) {
    total = this.accAdd(total, this.toFixed(this.records[i].totalRebate))
  }
  return total || 0
}

root.computed.btReward = function () {
  return this.$store.state.btReward;
}

root.computed.btActivity = function () {
  return this.$store.state.btActivity;
}


root.watch = {};

root.watch.lang = function (newValue, oldValue) {
  if (newValue == oldValue) return;
  this.GET_POSTER_URL();
}

/*------------------------------ 方法 ------------------------------*/

root.methods = {}
// 获取海报
root.methods.GET_POSTER_URL = function () {
  this.$http.send('GET_USER_MY_INVITES_POSTER', {
    bind: this,
    params: {
      type: "invite",
      param: this.lang == 'CH' ? 'CH' : 'EN'     // 英文传EN
    },
    callBack: this.RE_GET_POSTER_URL,
    errorHandler: this.error_getPosterImage
  })

}
root.methods.RE_GET_POSTER_URL = function (res) {
  let urls = res.dataMap;
  console.log(urls)
  if (res.errorCode > 0) return;
  this.poster_url =  + urls.inviteUrl;
}
// 展示海报
root.methods.SHOW_POSTER = function () {
  this.showPoster = true;
}

// 隐藏海报
root.methods.HIDE_POSTER = function () {
  this.showPoster = false;
}

// 拷贝URL
// root.methods.getBTFunc = function () {
//   let that = this;
//   this.$globalFunc.getBTRegulationConfig(this, (data) => {
//     // 获取分享文案显示usdt数量请求
//     that.getPlatformData()
//   })
// }

// 获取分享文案显示usdt数量请求
// root.methods.getPlatformData = function () {
//   let params = {
//     offset: 0,
//     maxResults: 20,
//   }
//   this.$http.send('GET_BT_PLATFORM_DIVIDEND_FOR_HISTORY', {
//     bind: this,
//     params: params,
//     callBack: this.re_getPlatformData,
//     errorHandler: this.error_getPlatformData,
//   })
// }

// root.methods.re_getPlatformData = function (data) {
//   typeof data === 'string' && (data = JSON.parse(data));
//   if (data.errorCode) {
//     return
//   }
//   // this.shareDataFlag = true
//   this.platformData = data.dataMap.sum.RMB;
//   // if(this.platformData == 0){
//   //
//   //   this.share_config_ch = {
//   //     url                 : this.shareUrl, // 网址，默认使用 window.location.href
//   //     source              : 'TwentyTwenty', // 来源（QQ空间会用到）
//   //     title               : '二零二零TwentyTwenty 即将开启“交易挖矿”模式，现在注册抢占先机，挖矿开启不用等！邀请好友再享100天内好友挖矿量' + this.btActivity + '%奖励。推荐ID：' + this.$store.state.authMessage.userId,
//   //     description         : '二零二零TwentyTwenty 即将开启“交易挖矿”模式，现在注册抢占先机，挖矿开启不用等！邀请好友再享100天内好友挖矿量' + this.btActivity + '%奖励。推荐ID：' + this.$store.state.authMessage.userId,
//   //     image               : 'http://logo.2020.exchange/TwentyTwenty.jpg', // 图片, 默认取网页中第一个img标签
//   //     sites : ['qq', 'weibo', 'facebook', 'twitter']
//   //   }
//   //   this.share_config_en = {
//   //     url                 : this.shareUrl, // 网址，默认使用 window.location.href
//   //     source              : 'TwentyTwenty', // 来源（QQ空间会用到）
//   //     title               : 'TwentyTwenty  Trade Mining starts now! Register and starts BT mining. Invite a friend and get ' + this.btActivity + '% mining commission for 100 days.Referral ID：' + this.$store.state.authMessage.userId,
//   //     description         : 'TwentyTwenty  Trade Mining starts now! Register and starts BT mining. Invite a friend and get ' + this.btActivity + '% mining commission for 100 days.Referral ID：' + this.$store.state.authMessage.userId,
//   //     image               : 'http://logo.2020.exchange/btcdo.jpg', // 图片, 默认取网页中第一个img标签
//   //     sites : ['qq', 'weibo', 'facebook', 'twitter']
//   //   }
//   // } else {
//   //   this.share_config_ch = {
//   //     url                 : this.shareUrl, // 网址，默认使用 window.location.href
//   //     source              : 'TwentyTwenty', // 来源（QQ空间会用到）
//   //     title               : '二零二零TwentyTwenty “交易挖矿”模式火热进行中，累计收益分配已达' + this.platformData + 'USDT，现在注册每天都能领高额分配收益！邀请好友更享100天内好友挖矿BT量' + this.btActivity + '%奖励。推荐ID：' + this.$store.state.authMessage.userId,
//   //     description         : '二零二零TwentyTwenty “交易挖矿”模式火热进行中，累计收益分配已达' + this.platformData + 'USDT，现在注册每天都能领高额分配收益！邀请好友更享100天内好友挖矿BT量' + this.btActivity + '%奖励。推荐ID：' + this.$store.state.authMessage.userId,
//   //     image               : 'http://logo.2020.exchange/btcdo.jpg', // 图片, 默认取网页中第一个img标签
//   //     sites : ['qq', 'weibo', 'facebook', 'twitter']
//   //
//   //   }
//   //   this.share_config_en = {
//   //     url                 : this.shareUrl, // 网址，默认使用 window.location.href
//   //     source              : 'TwentyTwenty', // 来源（QQ空间会用到）
//   //     title               : 'TwentyTwenty  Trade Mining! ' + this.platformData + ' USDT worth has been distributed! Join us and start mining! Invite a friend and enjoy ' + this.btActivity + '% mining commission for 100 days.Referral ID：' + this.$store.state.authMessage.userId,
//   //     description         : 'TwentyTwenty  Trade Mining! ' + this.platformData + ' USDT worth has been distributed! Join us and start mining! Invite a friend and enjoy ' + this.btActivity + '% mining commission for 100 days.Referral ID：' + this.$store.state.authMessage.userId,
//   //     image               : 'http://logo.2020.exchange/btcdo.jpg', // 图片, 默认取网页中第一个img标签
//   //     sites : ['qq', 'weibo', 'facebook', 'twitter']
//   //   }
//   // }
//   this.getUserRewardForInvitesFlag = true;
//   this.loading = false;
// }

// root.methods.error_getPlatformData = function (err) {
//   this.shareDataFlag = true
//   this.loading = false;
// }

root.methods.copyUrl = function () {
  let copy_url = this.$refs.getUrl;
  copy_url.select();
  document.execCommand("copy");
  this.popType = 1;
  this.popText = this.$t('personalCenterRecommend.popText')
  this.promptOpen = true;
}
// 关闭弹窗
root.methods.closePrompt = function () {
  this.promptOpen = false;
}


// 获取奖励比率
root.methods.getRegulationConfig = function () {
  this.$http.send('GET_BT_REGULATION_CONFIG', {
    bind: this,
    callBack: this.re_getRegulationConfig,
    errorHandler: this.error_getRegulationConfig,
  })
}

root.methods.re_getRegulationConfig = function (data) {
  typeof data === 'string' && (data = JSON.parse(data))
  console.warn('获取奖励比率', data)
  if (data.errorCode) {
    return
  }
  this.activityRate = data.activity || 0
  this.rewardRate = data.reward || 0

}
root.methods.error_getRegulationConfig = function (err) {
  console.warn('获取奖励比率', err)
}

// 获取列表
root.methods.getMyInvitesForBT = function () {
  this.loadingMoreIng = true
  this.offset = (this.selectIndex - 1) * this.maxResults
  this.$http.send('GET_USER_REWARD_FOR_INVITES', {
    params: {
      fromIndex: this.fromIndex,
      toIndex: this.toIndex
    },
    bind: this,
    callBack: this.re_getMyInvitesForBT,
    errorHandler: this.error_getMyInvitesForBT,
  })
}
root.methods.re_getMyInvitesForBT = function (data) {
  // console.log("data========"+JSON.stringify(data));
  typeof data === 'string' && (data = JSON.parse(data))
  // console.warn('获取推荐返佣的数据', data)
  this.loading = false;
  this.loadingMoreIng = false
  if (data.errorCode) {
    return
  }
  let res = data.dataMap
  this.size = res.size

  this.totalRegister = res.totalRegister
  for(var i = 0;i<res.myInvites.length;i++){
    //实名认证
    if(res.myInvites[i].identityAuthStatus == 2){
      this.identityAuthCount++;
    }
  }
  this.records.push(...res.myInvites)
  // this.records = this.myInvites;
  if (res.myInvites.length < this.maxResults) {
    this.loadingMore = false
  }

  this.fromIndex = this.fromIndex+this.maxResults;
  this.toIndex = this.toIndex+this.maxResults;
}
root.methods.error_getMyInvitesForBT = function (err) {
  console.warn('获取列表出错', err)
}

// 点击加载更多
root.methods.clickToLoadMore = function () {
  this.selectIndex++
  this.getMyInvitesForBT()

}


// 获取查看历史是否显示
// root.methods.getMyHistory = function () {
//   this.$http.send('GET_MY_INVITES_HISTORY_SHOW', {
//     bind: this,
//     callBack: this.re_getMyHistory,
//     errorHandler: this.error_getMyHistory,
//   })
// }
// // 推荐返回
// root.methods.re_getMyHistory = function (data) {
//   typeof data === 'string' && (data = JSON.parse(data))
//   console.warn('获取我的推荐是否展示查看历史', data)
//   this.historyShow = data.historyInviteFlag;
//   this.loading = false;
//
// }
//
// root.methods.error_getMyHistory = function (err) {
//   console.warn('获取出错')
//   // this.loadingMoreIng = false
//   this.loading = false
// }


//
// // 获取我的推荐
// root.methods.getMyInvites = function () {
//   this.loadingMoreIng = true
//
//   this.$http.send('POST_NEW_INVITES', {
//     bind: this,
//     params: {
//       // maxResults: this.maxResults,
//       fromIndex: 1,
//       toIndex: this.maxResults + this.limit
//     },
//     callBack: this.re_getMyInvites,
//     errorHandler: this.error_getMyInvites,
//   })
//   this.maxResults += this.limit;
//
// }
// // 推荐返回
// root.methods.re_getMyInvites = function (data) {
//   typeof data === 'string' && (data = JSON.parse(data))
//
//   console.warn('this is data', data)
//   let res = data.dataMap;
//   this.size = res.size;
//   this.totalRebate = res.totalRebate;
//   this.totalRegister = res.totalRegister;
//   this.records = res.myInvites;
//   this.yesterdayExRateIOSTtoBDB = res.yesterdayExRateIOSTtoBDB;
//
//   this.loading = false
//
//
//   if (this.recordsLength < this.maxResults) {
//     this.loadingMore = false
//   }
//
//   this.loadingMoreIng = false
//
// }
//
// root.methods.error_getMyInvites = function (err) {
//   console.warn('获取出错')
//   this.loadingMoreIng = false
//   this.loading = false
// }

// 用户名修改
root.methods.handleName = function (name) {
  // let nameArr = name.split('@')
  // return `${nameArr[0][0]}****${nameArr[0].length === 0 ? '' : nameArr[0].charAt(nameArr[0].length - 1)}@${nameArr[1]}`
  return this.$globalFunc.listFormatUserName(name)
}

// 活动规则弹窗关闭
root.methods.activityPopClose = function () {
  this.activityPopOpen = false
}
// 活动规则弹窗打开
root.methods.clickActivityPopOpen = function () {
  this.activityPopOpen = true
}

// 注册奖励，根据活动不同显示送不同的币，刚开始是BDB，之后是IOST
root.methods.registerAward = function (item) {
  if (item.identityAuthStatus != 2) return '---'
  // 2018年3月1日之前的实名认证的奖励3 BDB
  if (parseFloat(item.createdAt) < 1519833600000) return '3 BDB'
  // 2018年3月13日14:00-3月15日17:00实名认证的奖励50 IOST
  if (parseFloat(item.createdAt) > 1520920800000 && parseFloat(item.createdAt) < 1521104400000) return '50 IOST'
  return '---'
}


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


export default root
