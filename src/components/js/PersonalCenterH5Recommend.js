import GlobalFunction from "../../configs/globalFunctionConfigs/GlobalFunction";

const root = {}
root.name = 'PersonalCenterH5Recommend'

import logo from '../../assets/download-icon.png'

import Clipboard from "clipboard";


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

    // 分享链接
    shareUrl: '',

    qrCodeFlag: false,

    shareFlag: false,

    // 获取我的推荐列表
    records: [],
    selectIndex: 1,
    offset: 1,
    limit: 10,
    maxResults: 10,

    // 已推荐注册人数
    size: 0,
    realNums: 0,//实名认证人数
    exNums: 0,//注册奖励000
    totalRebate: 0,//累计奖励
    totalChangeStr: 0,//注册奖励
    totalRegister: 0,//注册奖励

    // 已获得返利
    totalPrice: 0,

    // 已获得利润

    // 选择哪个注册奖励
    tabItemNum: 1,

    // 弹窗
    popOpen: false,
    popType: 0,
    popText: '系统繁忙',

    logo: logo,
    qrsize: 180,
    bgColor: '#fff',
    fgColor: '#000',
    value: '', // 活动详情页

    shareConfig: {},

    // 顶部显示百分数
    headerRate: 0.3,

    // 平台累计收益分配
    platformData: 0,

    // 发送请求是否loading
    getUserRewardForInvitesFlag: false,
    getHeaderRateFlag: false,
    getPlatformDataFlag: false,

    // 是否展示海报
    showPoster: false,
    // 海报url
    poster_url: '',

    activityRate: 0,//活动奖励比率

    fromIndex: 0,
    toIndex: 10,

    loadingMore: true,
    loadingMoreIng: false,


    myInvites:[]
  }
}

/*------------------------------ 生命周期 ------------------------------*/

root.created = function () {
  this.$store.commit('changeMobileHeaderTitle', '我的推荐');

  let uuiid = this.$store.state.authMessage.userId;
  let protocol = window.location.protocol;
  let sharUrl = document.location.host + '/index/register?uid=' + uuiid + '&source=share';
  this.shareUrl = protocol + '//' + sharUrl;

  this.value = this.shareUrl;
  // let protocol = window.location.protocol;
  // this.shareUrl = protocol + '//' + document.location.host + '/index/register?uid=' + this.$store.state.authMessage.userId + '&source=share';

  // this.shareConfig = {
  //   url: this.shareUrl, // 网址，默认使用 window.location.href
  //   source: '', // 来源（QQ空间会用到）
  //   title: '二零二零', // 标题，默认读取 document.title 或者 <meta name="title" content="share.js" />
  //   description: '二零二零', // 描述, 默认读取head标签：<meta name="description" content="PHP弱类型的实现原理分析" />
  //   image: 'http://logo.2020.exchange/website.jpg', // 图片, 默认取网页中第一个img标签
  //   origin: window.location.origin,
  // }

  this.getMyInvitesForBT()


  // 获取邀请人数和获得奖励的请求
  // this.getUserRewardForInvites()

  // // 获取顶部百分比数据请求
  // this.getHeaderRate()

  // 获取bt数值
  this.getBTFunc()

  // 获取平台数据
  // this.getPlatformData()


  this.GET_POSTER_URL()

}
/*------------------------------ 计算 ------------------------------*/
root.computed = {}

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

// 邀请记录长度
root.computed.recordsLength = function () {
  return this.records.length
}

root.computed.uId = function () {
  return this.$store.state.authMessage.userId;
}

root.mounted = function () {
  this.qrsize = 160 / window.devicePixelRatio
}

root.computed.btReward = function () {
  return this.$store.state.btReward;
}

root.computed.btActivity = function () {
  return this.$store.state.btActivity;
}

/*------------------------------ 方法 ------------------------------*/

root.methods = {}

// 新增部分  begin

// 返回首页
root.methods.gotoNewH5homePage = function () {
  this.$router.push({name:'NewH5homePage'})
}
// 获取海报
root.methods.GET_POSTER_URL = function () {
  this.$http.send('GET_USER_INVITE_POSTER', {
    bind: this,
    params: {
      type: "invite",
      param: 'CH'     // 暂时传中文
      // type: this.lang == 'CH' ? 'CH' : 'EN'     // 英文传EN
    },
    callBack: this.RE_GET_POSTER_URL,
    errorHandler: this.error_getPosterImage
  })
}
root.methods.RE_GET_POSTER_URL = function (res) {
  let urls = res.dataMap;
  console.log(urls)
  if (res.errorCode > 0) return;
  this.poster_url = urls.inviteUrl;
}
//sss 屏蔽结束 3.11
// 复制UID
root.methods.copyUid = function () {
  let copy_url = this.$refs.getUid;
  copy_url.select();
  document.execCommand("copy");
  this.popType = 1;
  this.popText = '复制成功'
  this.popOpen = true;
}

// 展示海报
root.methods.SHOW_POSTER = function () {
  this.showPoster = true;
}

// 隐藏海报
root.methods.HIDE_POSTER = function () {
  this.showPoster = false;
}

// 复制链接
root.methods.copyUrl = function () {
  let copy_url = this.$refs.getUrl;
  copy_url.select();
  document.execCommand("copy");
  this.popType = 1;
  this.popText = this.$t('personalCenterRecommend.popText')
  this.popOpen = true;
}


// 新增部分  end


root.methods.getBTFunc = function () {
  this.$globalFunc.getBTRegulationConfig(this, (data) => {
    // 获取分享文案显示usdt数量请求
  })
}

// // 获取分享文案显示usdt数量请求
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
//
// root.methods.re_getPlatformData = function (data) {
//   typeof data === 'string' && (data = JSON.parse(data));
//   if (data.errorCode) {
//     return
//   }
//   this.platformData = data.dataMap.sum.RMB;
//   // if (this.platformData == 0) {
//   //   this.shareConfig = {
//   //     url: this.shareUrl, // 网址，默认使用 window.location.href
//   //     source: '', // 来源（QQ空间会用到）
//   //     title: '二零二零TwentyTwenty 即将开启“交易挖矿”模式，现在注册抢占先机，挖矿开启不用等！邀请好友再享100天内好友挖矿量' + this.btActivity + '%奖励。注册链接：' + document.location.host + '/index/register?uid=' + this.$store.state.authMessage.userId, // 标题，默认读取 document.title 或者 <meta name="title" content="share.js" />
//   //     description: '二零二零TwentyTwenty 即将开启“交易挖矿”模式，现在注册抢占先机，挖矿开启不用等！邀请好友再享100天内好友挖矿量' + this.btActivity + '%奖励。注册链接：' + document.location.host + '/index/register?uid=' + this.$store.state.authMessage.userId, // 描述, 默认读取head标签：<meta name="description" content="PHP弱类型的实现原理分析" />
//   //     image: 'http://logo.2020.exchange/website.jpg', // 图片, 默认取网页中第一个img标签
//   //     origin: window.location.origin,
//   //   }
//   // } else {
//   //   this.shareConfig = {
//   //     url: this.shareUrl, // 网址，默认使用 window.location.href
//   //     source: '', // 来源（QQ空间会用到）
//   //     title: '二零二零TwentyTwenty “交易挖矿”模式火热进行中，累计收益分配已达' + this.platformData + 'USDT，现在注册每天都能领高额分配收益！邀请好友更享100天内好友挖矿BT量' + this.btActivity + '%奖励。注册链接：' + document.location.host + '/index/register?uid=' + this.$store.state.authMessage.userId, // 标题，默认读取 document.title 或者 <meta name="title" content="share.js" />
//   //     description: '二零二零TwentyTwenty “交易挖矿”模式火热进行中，累计收益分配已达' + this.platformData + 'USDT，现在注册每天都能领高额分配收益！邀请好友更享100天内好友挖矿BT量' + this.btActivity + '%奖励。注册链接：' + document.location.host + '/index/register?uid=' + this.$store.state.authMessage.userId, // 描述, 默认读取head标签：<meta name="description" content="PHP弱类型的实现原理分析" />
//   //     image: 'http://logo.2020.exchange/website.jpg', // 图片, 默认取网页中第一个img标签
//   //     origin: window.location.origin,
//   //
//   //   }
//   // }
//   this.getUserRewardForInvitesFlag = true;
//   // TODO 待会儿打开
//   this.loading = !(this.getUserRewardForInvitesFlag && this.getHeaderRateFlag && this.getPlatformData);
// }
//
// root.methods.error_getPlatformData = function (err) {
//   console.log(err)
// }


// root.methods.getHeaderRate = function () {
//   this.$http.send('GET_BT_REGULATION_CONFIG', {
//     bind: this,
//     callBack: this.re_getHeaderRate,
//     errorHandler: this.error_getHeaderRate,
//   })
// }
//
// root.methods.re_getHeaderRate = function (data) {
//   typeof data === 'string' && (data = JSON.parse(data));
//   this.headerRate = data.activity;
//
//
//   this.getHeaderRateFlag = true;
//   // TODO 待会儿打开
//   this.loading = !(this.getUserRewardForInvitesFlag && this.getHeaderRateFlag && this.getPlatformData);
//   // console.log('获取百分比data',data)
// }
//
// root.methods.error_getHeaderRate = function (err) {
//   console.log('获取百分比err', err)
// }

root.methods.changeTabItem = function (num) {
  this.tabItemNum = num
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
  console.log('res=======', res)
  this.size = res.size
  this.totalRegister = res.totalRegister
  this.totalChangeStr = res.totalChangeStr
  this.exNums = res.exNums
  for(var i = 0;i < res.myInvites.length;i++){
    //实名认证
    if(res.myInvites[i].identityAuthStatus == 2){
      this.realNums++;
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

// 20180616 添加获取bt奖励数量接口

// 获取平台信息2
// root.methods.getUserRewardForInvites = function () {
//   this.$http.send('GET_USER_REWARD_FOR_INVITES', {
//     bind: this,
//     params: {
//       "offset": 0,
//       "maxResults": 10,
//     },
//     callBack: this.re_getUserRewardForInvites,
//     errorHandler: this.error_getUserRewardForInvites
//   })
// }
// root.methods.re_getUserRewardForInvites = function (data) {
//   typeof data === 'string' && (data = JSON.parse(data));
//   if (data.errorCode) {
//     return
//   }
//   this.totalPrice = data.dataMap.totalRebateBT;
//   this.size = data.dataMap.size;
//   this.getPlatformData = true;
//   // TODO 待会儿打开
//   // this.loading = !(this.getUserRewardForInvitesFlag && this.getHeaderRateFlag && this.getPlatformData);
// }
// root.methods.error_getUserRewardForInvites = function (err) {
//   console.log(err)
// }


// 邮箱修改
root.methods.handleName = function (name) {
  return this.listFormatUserNameTwo(name)
}

root.methods.registerAward = function (type) {
  if (type.identityAuthStatus != 2) {
    return '---'
  }
  if (type.createdAt < 1519833600000) {
    return '3 BDB'
  }
  if (type.createdAt < 1521104400000 && type.createdAt > 1520920800000) {
    return '50 IOST'
  }
  return '---'
}


// 点击复制我的推荐id复制
root.methods.copyUserId = function () {
  // 此处是定义拷贝按钮，需要html也做响应处理
  let copyBtn = new Clipboard('.container-recommend-link-id-btn');
  let that = this
  copyBtn.on('success', function (e) {
    e.clearSelection();
    that.popOpen = true
    that.popType = 1
    that.popText = '复制成功'
    copyBtn.destroy()
  })
  copyBtn.on('error', function (e) {
    that.popOpen = true
    that.popType = 0
    that.popText = '复制失败'
    copyBtn.destroy()
  })
}

// 点击弹窗复制链接按钮
root.methods.copyUserAddress = function () {
  // 此处是定义拷贝按钮，需要html也做响应处理
  let copyBtn = new Clipboard('.prompt-share-box-icon-item-copy');
  let that = this
  copyBtn.on('success', function (e) {
    e.clearSelection();
    that.popOpen = true
    that.popType = 1
    that.popText = '复制成功'
    copyBtn.destroy()
  })
  copyBtn.on('error', function (e) {
    that.popOpen = true
    that.popType = 0
    that.popText = '复制失败'
    copyBtn.destroy()
  })
}

// 点击推荐二维码，弹出开关
root.methods.openQrCodeFlag = function () {
  this.qrCodeFlag = true
}

// 点击推荐二维码弹窗关闭，关闭弹窗
root.methods.closeQrCodeFlag = function () {
  this.qrCodeFlag = false
}

// 点击推荐链接图片，弹出开关
root.methods.openShareFlag = function () {
  this.shareFlag = true
  // $('.social-share').share(this.shareConfig)
}

// 点击分享取消按钮，关闭弹框
root.methods.closeShareFlag = function () {
  this.shareFlag = false
}


// 点击复制按钮
root.methods.copyValue = function () {
  // 此处是定义拷贝按钮，需要html也做响应处理
  let copyBtn = new Clipboard('.container-box-copy-btn');
  let that = this
  copyBtn.on('success', function (e) {
    e.clearSelection();
    that.popOpen = true
    that.popType = 1
    that.popText = '复制成功'
    copyBtn.destroy()
  })
  copyBtn.on('error', function (e) {
    that.popOpen = true
    that.popType = 0
    that.popText = '复制失败'
    copyBtn.destroy()
  })
}

root.methods.jumpToPoster = function () {
  this.$router.push({name: 'H5PosterInvitation'})
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


// 关闭pop提示
root.methods.popClose = function () {
  this.popOpen = false
}

// 格式化用户名（保留两位**）
root.methods.listFormatUserNameTwo = function (src) {
  let userNameType = GlobalFunction.emailOrMobile(src)
  if (userNameType === 1) {
    return `${src.slice(0, 3)}**${src.slice(7, 11)}`
  }
  let nameArr = src.split('@')
  return `${nameArr[0][0]}**${nameArr[0].length === 0 ? '' : nameArr[0].charAt(nameArr[0].length - 1)}@${nameArr[1]}`
}

export default root
