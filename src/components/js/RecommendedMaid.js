const root = {};

root.name = 'RecommendedMaid'

/*------------------------------ 组件 ------------------------------*/
root.components = {
  'Loading': resolve => require(['../vue/Loading'], resolve),
  'PopupPrompt': resolve => require(['../vue/PopupPrompt'], resolve),
  'PageBar': resolve => require(['../vue/BasePageBar'], resolve),
}

/*---------------------- data ------------------------*/
root.data = function () {
  return {
    shareUrl: '', //分享链接

    limit: 10,

    // 获取的列表
    records: [],
    // 已推荐的朋友
    size: 0,
    // 已获得的交易返佣
    totalRebate: 0,


    // 分页
    selectIndex: 1,


    // 弹窗
    popType: 0,
    popText: '',
    popOpen: false,
  }
}


/*---------------------- 生命周期 ------------------------*/
root.created = function () {
  this.shareUrl = document.location.host + '/index/register?uid=' + this.$store.state.authMessage.userId + '&source=share';
  !this.userId && (this.shareUrl = '---')
  this.userId && this.getRecommend(1)
}

/*---------------------- 计算 ------------------------*/
root.computed = {}
root.computed.userId = function () {
  return this.$store.state.authMessage.userId ? this.$store.state.authMessage.userId : 0
}

root.computed.maxPage = function () {
  return Math.ceil(this.size / this.limit)
}


/*---------------------- 方法 ------------------------*/
root.methods = {}

// 获取列表
root.methods.getRecommend = function (index) {
  this.selectIndex = index
  let fromIndex = (index - 1) * this.limit + 1
  let toIndex = (index) * this.limit

  this.$http.send('POST_RECOMMEND', {
    bind: this,
    params: {
      fromIndex: fromIndex,
      toIndex: toIndex,
    },
    callBack: this.re_getRecommend,
    errorHandler: this.error_getRecommend,
  })
}

// 获取列表回复
root.methods.re_getRecommend = function (data) {
  typeof data === 'string' && (data = JSON.parse(data))
  console.warn('this is data', data)
  this.records = data.dataMap.myInvites
  this.size = data.dataMap.size
  this.totalRebate = data.dataMap.totalRebate

}
// 获取列表出错
root.methods.error_getRecommend = function (err) {
  console.warn('获取出错！', err)
}


// 用户名修改
root.methods.handleName = function (name) {
  return this.$globalFunc.listFormatUserName(name)
}

// 拷贝url
root.methods.copyUrl = function () {
  let copy_url = this.$refs.getUrl;
  copy_url.select();
  document.execCommand("copy");
  this.popType = 1;
  this.popText = this.$t('personalCenterRecommend.popText')
  this.popOpen = true;
}


// 关闭弹窗
root.methods.closePop = function () {
  this.popOpen = false
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


export default root;
