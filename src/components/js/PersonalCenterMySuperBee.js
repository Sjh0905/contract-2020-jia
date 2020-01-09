const root = {}
root.name = 'PersonalCenterMySuperBee'


/*------------------------ 组件 ------------------------*/
root.components = {
  'PopupWindow': resolve => require(['../vue/BasePopupWindow'], resolve),
  'Loading': resolve => require(['../vue/Loading'], resolve),
  'PageBar': resolve => require(['../vue/BasePageBar'], resolve),
}
/*------------------------------ data -------------------------------*/

root.data = function () {
  return {
    superStateLoading: true, //是否正在加载为蜜状态
    tag: 1,
    myBeeListLoading: true,
    myBeeList: [], // 我的为蜜记录
    myBeeOffset: 1, // 我的为蜜开始查询条数
    myBeeLimit: 10, // 我的为蜜查几条
    myBeeMaxPage: 1, // 我的为蜜最大页数
    myBeeSelectIndex: 1,// 我的为蜜选择页数

    myRecordListLoading: true,
    myRecordList: [], // 我的收益记录
    myRecordOffset: 1, // 我的收益开始查询条数
    myRecordLimit: 10, // 我的收益查几条
    myRecordMaxPage: 1, // 我的收益最大页数
    myRecordSelectIndex: 1, // 我的收益选择页数

    releasePopupWindow: false, // 申请解锁
    releaseId: '', // 解锁ID
    releaseIng: false, // 正在解锁
    releaseName: '', // 正在解锁的为蜜名称

  }
}

/*------------------------------ 计算 -------------------------------*/
root.computed = {}

// 我的为蜜长度
root.computed.myBeeListLength = function () {
  return this.myBeeList.length || 0
}
// 我的收益记录长度
root.computed.myRecordListLength = function () {
  return this.myRecordList.length || 0
}


/*------------------------------ 观察 -------------------------------*/
root.watch = {}

/*------------------------------ 生命周期 -------------------------------*/
root.created = function () {
  // 是否显示超级为蜜
  this.getSuperBeeInfo()
  // 获取我的为蜜列表
  this.getMySuperBeeList()
  // 获取收益记录列表
  this.getMyRecordList()
}

/*------------------------------ 方法 ---------------------------------*/
root.methods = {}

// 获取是否是超级为蜜
root.methods.getSuperBeeInfo = function () {
  this.$http.send('GET_SUPER_BEE_STATE', {
    bind: this
  }).then(({data}) => {
    typeof data === 'string' && (data = JSON.parse(data))
    if (data.dataMap && !data.dataMap.isSuperBee) {
      this.$router.replace({name: 'authentication'})
      return
    }
    this.superStateLoading = false
  }).catch(e => {
    // console.warn('获取为蜜状态失败', e)
  })
}
// 切换tag 0为我的为蜜 1为收益记录
root.methods.changeTag = function (n) {
  if (parseInt(n) === this.tag) return
  this.tag = parseInt(n)
}

// 获取我的为蜜数据
root.methods.getMySuperBeeList = function () {
  let params = {
    offset: this.myBeeOffset,
    limit: this.myBeeLimit
  }
  this.$http.send('POST_SUPER_BEE_PERSONAL_RECOED', {
    bind: this,
    params: params
  })
    .then(({data}) => {
      typeof data === 'string' && (data = JSON.parse(data))
      console.warn('获取为蜜数据列表', data)
      this.myBeeListLoading = false
      this.myBeeList = data.dataMap && data.dataMap.list || []
      this.myBeeMaxPage = data.dataMap && data.dataMap.size && Math.ceil(data.dataMap.size / this.myBeeLimit) || 0
    })
    .catch(e => {
      console.warn('获取为蜜列表失败', e)
    })
}

// 获取收益记录
root.methods.getMyRecordList = function () {
  let params = {
    offset: this.myRecordOffset,
    limit: this.myRecordLimit
  }
  this.$http.send('POST_SUPER_BEE_REVENUE_RECORD', {
    bind: this,
    params: params
  })
    .then(({data}) => {
      typeof data === 'string' && (data = JSON.parse(data))
      console.warn('获取收益记录列表', data)
      this.myRecordListLoading = false
      this.myRecordList = data.dataMap && data.dataMap.list || []
      this.myRecordMaxPage = data.dataMap && data.dataMap.size && Math.ceil(data.dataMap.size / this.myRecordLimit) || 0
    })
    .catch(e => {
      console.warn('获取收益记录列表失败', e)
    })
}

// 点击切换我的为蜜分页
root.methods.clickChangeMyBeePage = function (index) {
  this.myBeeSelectIndex = index
  this.myBeeOffset = (index - 1) * this.myBeeLimit + 1
  this.myBeeListLoading = true
  this.getMySuperBeeList()
}

// 点击切换收益记录分页
root.methods.clickChangeMyRecordPage = function (index) {
  this.myRecordSelectIndex = index
  this.myRecordOffset = (index - 1) * this.myRecordLimit + 1
  this.myRecordListLoading = true
  this.getMyRecordList()
}

// 格式化时间
root.methods.formatDateUtils = function (time, method = 'YYYYMMDD') {
  return this.$globalFunc.formatDateUitl(time, method)
}

// 关闭解锁的弹窗
root.methods.closeReleasePopupWindow = function () {
  this.releasePopupWindow = false
}

// 打开解锁的弹窗
root.methods.openReleasePopupWindow = function (item) {
  this.releaseId = item.id
  this.releaseName = item.name
  this.releaseIng = false
  this.releasePopupWindow = true
}

// 确认解锁
root.methods.confirmReleaseBee = function () {
  if (this.releaseIng) return
  this.releaseIng = true
  let params = {id: this.releaseId}
  this.$http.send('POST_SUPER_BEE_PERCONAL_UN_LOCK', {
    bind: this,
    params: params
  })
    .then(({data}) => {
      typeof data === 'string' && (data = JSON.parse(data))
      console.warn('解锁', data)
      this.releaseIng = false
      this.closeReleasePopupWindow()
      this.getMySuperBeeList()
    })
    .catch(e => {

    })
}

// 申请为蜜方式
root.methods.beBeeMethod = function (type) {
  let message = ''
  switch (type) {
    case 0:
      message = this.$t('lock_type_1')
      break;
    case 1:
      message = this.$t('lock_type_2')
      break;
    case 2:
      message = this.$t('lock_type_3')
      break;
    case 3:
      message = this.$t('lock_type_4')
      break;
    case 4:
      message = this.$t('lock_type_5')
      break;
    case 5:
      message = this.$t('lock_type_6')
      break;
    case 6:
      message = this.$t('lock_type_7')
      break;
    case 7:
      message = this.$t('lock_type_8')
      break;
    case 8:
      message = this.$t('lock_type_9')
      break;
    case 9:
      message = this.$t('lock_type_10')
      break;
    case 10:
      message = this.$t('lock_type_11')
      break;
    case 11:
      message = this.$t('lock_type_12')
      break;
    case 12:
      message = this.$t('lock_type_13')
      break;
    case 13:
      message = this.$t('lock_type_14')
      break;
    case 14:
      message = this.$t('lock_type_15')
      break;
    case 15:
      message = this.$t('lock_type_16')
      break;
    default:
      message = '--'
  }
  return message
}

// 判断为蜜状态
root.methods.beeState = function (status) {
  let message = ''
  switch (status) {
    case 0:
      message = this.$t('normal')
      break;
    case 1:
      message = this.$t('unlocked')
      break;
    default:
      message = this.$t('normal')
  }
  return message
}

// 判断交易对状态
root.methods.symbolState = function (status) {
  let message = ''
  switch (status) {
    case true:
      message = this.$t('normal_1')
      break;
    case false:
      message = this.$t('off')
      break;
    default:
      message = '--'
  }
  return message
}

/*---------------------- 保留小数 begin ---------------------*/
root.methods.toFixed = function (num, acc = 8) {
  return this.$globalFunc.accFixed(num, acc)
}

export default root
