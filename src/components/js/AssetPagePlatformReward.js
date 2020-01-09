const root = {}

root.name = 'AssetPagePlatformReward'

/*-------------------------- components begin ------------------------------*/

root.components = {
  'Loading': resolve => require(['../vue/Loading'], resolve),
  'PopupPrompt': resolve => require(['../vue/PopupPrompt'], resolve),
  'BasePageBar': resolve => require(['../vue/BasePageBar'], resolve),

}


/*-------------------------- data begin ------------------------------*/

root.data = function () {
  return {
    loading: true,
    firstLoad: false,
    loadingNext: false,

    limit: 10,
    limitNum: 10,//一次加载多少条
    fromIndex: 1,
    toIndex: 10,

    records: [],


    popType: 0,
    popText: '',
    popOpen: false,

    currentPage: 1, //分页选择当前页
    page_size: 1, // 总页数

    total:100,

    currentIndex:1,
    activePage:1,
    pageSize:30,
    // 本页最后一条ID
    lastId:0,
    // grcObj:{},

    loadingMoreShow:true,
    loadingMoreShowing: false,

  }
}

/*-------------------------- 计算 begin------------------------------*/
root.computed = {}

// 计算后的记录
root.computed.computedRecord = function () {
  // this.records.sort((a, b) => {
  //   return b.createdAt - a.createdAt
  // })
  // if(!this.grcObj[this.currentPage]){
  //   this.getRecord();
  //   return []
  // }

  // console.log(this.grcObj[this.currentPage])
  // return this.grcObj[this.currentPage]
  return this.records
}


// 最大页
root.computed.maxPage = function () {
  let ans = Math.ceil(this.page_size / this.limit)
  return ans
}

// 获取语言，中文为0，外文为1
root.computed.lang = function () {
  return this.$store.state.lang == 'CH' ? 0 : 1
}

// 获取userId
root.computed.userId = function () {
  return this.$store.state.authMessage.userId
}


/*-------------------------- 生命周期 begin------------------------------*/
root.created = function () {
  this.getRecord()
}


/*-------------------------- 方法 begin------------------------------*/
root.methods = {}

// 获取平台奖励记录
root.methods.getRecord = function (limit) {
  this.$http.send('GRC_ACTIVITYREWARDS', {
    bind: this,
    params: {
      rewardId:this.lastId,
      pageSize:this.limit
    },
    callBack: this.re_getRecord,
    errorHandler: this.error_getRecord,
  })
}
// 获取平台奖励记录回调
root.methods.re_getRecord = function (data) {
  typeof data === 'string' && (data = JSON.parse(data))
  this.loading = false
  this.firstLoad = true
  this.loadingNext = false
  console.log('this is data', data)
  if (data.errorCode) return

  this.records = data.dataMap.grcActivityRewardList
  this.records.length < this.limit && (this.loadingMoreShow = false)
  this.records.length >= this.limit && (this.loadingMoreShow = true)
  this.loadingMoreShowing = false
  this.loading = false




  this.page_size = data.dataMap.size   // 总页数
  // this.lastId = this.records[this.records.length-1].id;
  // this.grcObj = {};
  // 获取当前页的数据存入一个对象
  // this.grcObj[this.currentPage] = this.records

  // let RewardList = data.dataMap.grcActivityRewardList
  // this.lastId = RewardList[RewardList.length-1].id  // 最后一条的ID
  // console.log(this.lastId,this.grcObj[this.currentPage])

  // this.records.push(...this.records)
  // for (let i = 0; i < 8; i++) {
  //   this.records.push(this.records[0])
  // }
}
// 获取平台奖励记录出错
root.methods.error_getRecord = function (err) {
  console.warn('获取平台奖励出错', err)
}

// 订单说明
root.methods.recordDescription = function (item) {
  let description = ''

  description = this.lang ? item.depiction_en : item.depiction_cn

  if (!description) {
    description = '---'
  }

  // if (type === 'EARLY_AWARD') description = this.$t('assetPagePlatformReward.description_0')
  // if (type === 'INTEST_GUESS') description = this.$t('assetPagePlatformReward.description_1')
  // if (type === 'INTEST_TOP') description = this.$t('assetPagePlatformReward.description_2')
  // if (type === 'GRANT_ICC') description = this.$t('assetPagePlatformReward.description_3')
  // if (type === 'PROJECT_RECHANGE') description = this.$t('assetPagePlatformReward.description_4')
  // if (type === 'TOP_INVITE') description = this.$t('assetPagePlatformReward.description_5')
  // if (type === 'VOLUNT_REWARD') description = this.$t('assetPagePlatformReward.description_6')
  // if (type === 'SUGGEST_AWARD') description = this.$t('assetPagePlatformReward.description_7')
  // if (type === 'SHARE_BENEFIT') description = this.$t('assetPagePlatformReward.description_8')
  // if (type === 'ELF_DEPOSIT_REWARD') description = this.$t('assetPagePlatformReward.description_9')
  // if (type === 'ELF_TRANSACATION_REWAR') description = this.$t('assetPagePlatformReward.description_10')
  // if (type === 'IOST_DEPOSIT_REWARD') description = this.$t('assetPagePlatformReward.description_11')
  // if (type === 'IOST_TRANSACATION_REWAR') description = this.$t('assetPagePlatformReward.description_12')
  // if (type === 'IOST_REGISTRATION_REWARD') description = this.$t('assetPagePlatformReward.description_13')
  // if (type === 'PLATFORM_AWARD') description = this.$t('assetPagePlatformReward.description_14')
  // if (type === 'MAR_MEMBER_BONUS') description = this.$t('assetPagePlatformReward.description_15')
  // if (type === 'MAR_REFERRAL_BONUS') description = this.$t('assetPagePlatformReward.description_16')
  // if (type === 'MAR_REFER_KYC_BON') description = this.$t('assetPagePlatformReward.description_17')
  // if (type === 'MAR_BTCDO_LOTTERY') description = this.$t('assetPagePlatformReward.description_18')


  return description
}

// 关闭弹窗
root.methods.loadingMore = function () {
  this.limit += this.limitNum
  this.loadingMoreShowing = true
  this.getRecord(this.limit)
}

// 关闭弹窗
root.methods.popClose = function () {
  this.popOpen = false
}

// 格式化时间
root.methods.formatDateUitl = function (time) {
  return this.$globalFunc.formatDateUitl(time, 'YYYY-MM-DD hh:mm:ss')
}

/*---------------------- 保留小数 begin ---------------------*/
root.methods.toFixed = function (num, acc = 8) {
  return this.$globalFunc.accFixed(num, acc)
}
/*---------------------- 保留小数 end ---------------------*/

// 点击分页
root.methods.clickChangePage = function (index) {
  this.currentPage = index
  this.fromIndex = this.limit * (index - 1) + 1
  this.toIndex = this.limit * (index)
  this.loadingNext = true
  this.getRecord()
}


root.methods.handleSizeChange = function (val) {
  console.log(`每页 ${val} 条`)
  this.activePage = 1
}

root.methods.handleCurrentChange = function (val) {
  console.log(`当前页: ${val}`);
}

export default root
