const root = {}
root.name = 'DetailsOfTheGroup'
/*------------------------------ 组件 ------------------------------*/
root.components = {
  'Loading': resolve => require(['../vue/Loading'], resolve),
  'PopupPrompt': resolve => require(['../vue/PopupPrompt'], resolve),
  'PopupWindow': resolve => require(['../vue/PopupWindow'], resolve),

}
/*------------------------------ data -------------------------------*/
root.data = function () {
  return {
    //拼团展示团队详情
    // details:[]
    loading:true,
    popWindowOpen: false, //弹窗开关

    deputyAccount:'',//副团账号
    idType:'', //团员类型  1：团长，2：副团，3：普通成员
    ModifyidType:'', //修改团员类型  1：团长，2：副团，3：普通成员
    priAccount:'',  //团长账号
    joinTime:'',  //入团时间
    quantDiscount:'',  //量化手续费折扣
    groupId:'',  //组ID
    gname:'',  //组名
    currCount:'',  //当前组人数
    createdAt:'',  //创团时间
    maxMember:'',  //距离团下次升级总人数
    commonDiscount:'',  //普通区交易手续费折扣
    glevel:'0', //团等级  0:未成团，1:微团，2：小团，3：中团，4：大团，5：超团
    account:'', //用户账户
    records: [],
    importantMembers:[],
    currPage:1,
    pageSize:5,
    showLoadingMore: true,//是否显示加载更多
    // loadingMoreIng: false, //是否正在加载更多
    loadingMoreShow:false,

    popType: 0,
    popOpen: false,
    popText: '系统繁忙',
    // popWindowClose1:true,
    quantData:{},
    quantCumulative:0,//挖矿区手续费累计
    commCumulative:0,//普通区交易手续费累计
    quantRecommission:0,//挖矿区团长返佣累计
    commRecommission:0,//普通区团长返佣累计


    surplusDiscount:'', //团长剩余折扣
    surplusDiscountAccuracy:'', //团长剩余折扣

    accountAdd:'',
    accountNumberMag:'',

    proportion:'',//输入的比例
    proportionModify:'',//输入的比例

    proportionMag:'',//输入的比例
    proportionModifyMag:'',//输入的比例
    idTypeValue:'',//输入的比例

    isApp:false,
    isIOS:false,
    organizationSetUpComponent: false,
    organizationModifyComponent: false,
    popWindowOpenDelete:false,

    optionsgender: [{
      value: '4',
      label: this.$t('教官')
    }, {
      value: '5',
      label: this.$t('副团长')
    }],
    // valuegender: this.gender === '0' ? '男' : '女',
    valuegender: '',  //输入的职称
    valuegenderMag: '',  //输入的职称


    pswPlaceholderShow: true,
    verificationCodePlaceholderShow: true,
    verificationproportionModify: true,
    id:'',

    //要降级的数据
    delItem:{},
    userId1:''
  }
}
/*------------------------------ 生命周期 -------------------------------*/
root.created = function () {
  this.getTeamDetails()

  this.loading = true
  // this.userId()

  // this.getMemberList()
  if (this.groupId!=''){
    this.getMemberList(this.groupId)
    this.getImportantMembers(this.groupId)
    this.getGroupDiscount(this.groupId)
  }
  this.isAppQuery()
  this.isIOSQuery()
}
root.mounted = function () {}
root.beforeDestroy = function () {}
/*------------------------------ 计算 -------------------------------*/
root.computed = {}

// 判断是否是手机
root.computed.isMobile = function () {
  return this.$store.state.isMobile
}

root.computed.historyOrderComputed = function () {
  return this.historyOrder
}
// 用户名
root.computed.userName = function () {
  if (this.userType === 0) {
    return this.$globalFunc.formatUserName(this.$store.state.authMessage.mobile)
  }
  if (!this.$store.state.authMessage.email) {
    return '****@****'
  }
  return this.$globalFunc.formatUserName(this.$store.state.authMessage.email)
}

// 用户名
root.computed.userNameAdd = function () {
  if (this.userType === 0) {
    return (this.$store.state.authMessage.mobile)
  }

  return (this.$store.state.authMessage.email)
}

// 用户类型，如果是手机用户，为0，如果是邮箱用户，为1
root.computed.userType = function () {
  return this.$store.state.authMessage && this.$store.state.authMessage.province === 'mobile' ? 0 : 1
}

// 获取userId
root.computed.userId = function () {
  return this.$store.state.authMessage.userId
}
// // uid
// root.computed.uuid = function () {
//   if(this.$store.state.authMessage.uuid == undefined){
//     return this.$store.state.authMessage.userId
//   }
//   return this.$store.state.authMessage.uuid
// }

root.computed.computedRecord = function (item,index) {
  return this.records
}

//重要成员列表
root.computed.computedImportantMembers = function () {
  return this.importantMembers
}
/*------------------------------ 观察 -------------------------------*/
root.watch = {}
/*------------------------------ 方法 -------------------------------*/
root.methods = {}

root.methods.changeIdTypeValue = function (value){
  console.info('changeidTypeCurrency==============',value)
  // this.itemInfo = val
  this.idTypeValue = value
  console.log('this.idTypeValue=======',this.idTypeValue)
}

//拼团展示团队详情get (query:{})  不知道对不对
root.methods.getTeamDetails= function () {


  this.$http.send('GET_GROUP_INFO', {
    bind: this,
    urlFragment:this.userId,
    // query:{
    //   userId:this.uuid
    // },
    callBack: this.re_getTeamDetails,
    errorHandler: this.error_getTeamDetails
  })
  this.loading = false
}
root.methods.re_getTeamDetails = function (data) {
  console.log("this.data=====",data)
  typeof data === 'string' && (data = JSON.parse(data))
  this.deputyAccount = data.data.deputyAccount
  this.idType = data.data.idType
  this.priAccount = data.data.priAccount
  this.joinTime = data.data.joinTime
  this.quantDiscount = data.data.quantDiscount
  this.groupId = data.data.groupId
  this.gname = data.data.gname
  this.currCount = data.data.currCount
  this.createdAt = data.data.createdAt
  this.maxMember = data.data.maxMember
  this.commonDiscount = data.data.commonDiscount
  this.glevel = data.data.glevel
  this.account = data.data.account
  if (this.idType == 1) {
    this.quantData = data.quantData
    console.log("拼团展示团队详情=====",this.quantData)
    this.quantCumulative = data.data.quantData.quantCumulative,//挖矿区手续费累计
    this.commCumulative = data.data.quantData.commCumulative,//普通区交易手续费累计
    this.quantRecommission= data.data.quantData.quantRecommission,//挖矿区团长返佣累计
    this.commRecommission= data.data.quantData.commRecommission//普通区团长返佣累计
  }



  this.getMemberList(data.data.groupId)
  this.getImportantMembers(data.data.groupId)
  this.getGroupDiscount(data.data.groupId)

  this.loading = false

}
root.methods.error_getTeamDetails = function (err) {
  console.log("this.err=====",err)
}

root.methods.postWithd1 = function (idType) {
  this.popWindowOpen = true
}
//退团解散团队post(params:{}) 没完成
root.methods.postWithdraw = function (idType) {
  // TODO : 加变量的非空判断 正则判断
  let params = {
    userId: this.userId,
    groupId: this.groupId,
    glevel: this.glevel,
    idType: idType
  }
  console.log("postJoinGroup + params ===== ",params)
  /* TODO : 调试接口需要屏蔽 S*/
  // this.re_postJoinGroup()
  /* TODO : 调试接口需要屏蔽 E*/
  this.$http.send('POST_LEVEA_GROUP', {
    bind: this,
    params: params,
    callBack: this.re_postWithdraw,
    errorHandler: this.error_postWithdraw
  })
}
root.methods.re_postWithdraw = function (data) {
  console.log("this.res=====",data)
  typeof data === 'string' && (data = JSON.parse(data))

  this.success = data.data.success
  console.log("re_postJoinGroup + data=====",data)

  if (data.errorCode) {
    if (
      data.errorCode == 1 && (this.popText = this.$t('not_group')) ||//成员未加入拼团
      data.errorCode == 2 && (this.popText = this.$t('member_type')) || // 成员类型错误
      data.errorCode == 3 && (this.popText = this.$t('withdrawal')) || // 退团异常
      data.errorCode == 400 && (this.popText = this.$t('parameter_error')) //参数有误
    ) {
      this.popOpen = true
      this.popType = 0
      setTimeout(() => {
        this.popOpen = true
      }, 100)
    }
  }

  if (this.success == true && this.idType == 1) {
    this.popOpen = true
    this.popType = 1
    this.popText = this.$t('coalition') //'解散拼团成功'
    setTimeout(() => {
      this.popOpen = true
    }, 1000)
    if (!this.isMobile) {
      setTimeout(() => {
        this.$router.push({name: 'assembleARegiment'})
      }, 1000)
      return;
    }
    if (this.isApp||this.isIOS) {
      setTimeout(() => {
        window.postMessage(JSON.stringify({
          method: 'toHomePage'
        }))
      }, 1000)
      return;
    }
    if (this.isMobile) {
      setTimeout(() => {
        // this.$router.push({path: '/index/newH5homePage'})
        this.$router.push({name: 'NewH5homePage'})
      }, 1000)
      return;
    }


  }

  if (this.success == true && this.idType == 3) {
    this.popOpen = true
    this.popType = 1
    this.popText = this.$t('success') //'退出拼团成功'
    setTimeout(() => {
      this.popOpen = true
    }, 1000)
    if (!this.isMobile) {
      setTimeout(() => {
        this.$router.push({name: 'assembleARegiment'})
      }, 1000)
      return;
    }
    if (this.isApp||this.isIOS) {
      setTimeout(() => {
        window.postMessage(JSON.stringify({
          method: 'toHomePage'
        }))
      }, 1000)
      return;
    }
    if (this.isMobile) {
      setTimeout(() => {
        this.$router.push({name: 'NewH5homePage'})
        // this.$router.push({path: '/index/newH5homePage'})
      }, 1000)
      return;
    }
  }
  // this.loading = false
}
root.methods.error_postWithdraw = function (err) {
  console.log("this.err=====",err)
}



//团员列表get (query:{})
root.methods.getMemberList= function (groupId) {

  // let groupId = this.$route.params.groupId
  this.$http.send('GET_MEMBER_LIST', {
    bind: this,
    urlFragment: `${groupId}/member`,
    query:{
      // groupId: this.groupId,
      //ssssssssss
      currPage: this.currPage,
      pageSize: this.pageSize
    },
    callBack: this.re_getMemberList,
    errorHandler: this.error_getMemberList
  })
}
root.methods.re_getMemberList = function (data) {
  console.log("团员列表this.data=====",data)

  typeof data === 'string' && (data = JSON.parse(data))
  // this.records = data.data.data

  this.records.push(...data.data.data)
  //
  //
  if (data.data.data.length < this.pageSize) {
    this.showLoadingMore = false
  }
  //
  //
  this.currPage = this.currPage + 1
  // this.pageSize = this.pageSize + 1
  //
  // this.loading = false
  this.loadingMoreIng = false

  // this.loading = false
}
root.methods.error_getMemberList = function (err) {
  console.log("this.err=====",err)
}

//显示重要团成员信息get (query:{})
root.methods.getImportantMembers= function (groupId) {

  // let groupId = this.$route.params.groupId
  this.$http.send('GET_GROUP_MEMBERS', {
    bind: this,
    urlFragment: groupId,
    callBack: this.re_getImportantMembers,
    errorHandler: this.error_getImportantMembers
  })
}
root.methods.re_getImportantMembers = function (data) {
  console.info("显示重要团成员信息this.data=====",data)

  typeof data === 'string' && (data = JSON.parse(data))
  // this.records = data.data.data

  this.importantMembers = data.data
}
root.methods.error_getImportantMembers = function (err) {
  console.log("this.err=====",err)
}


//获取团长剩余折扣get (query:{})
root.methods.getGroupDiscount= function (groupId) {

  // let groupId = this.$route.params.groupId
  this.$http.send('GET_GROUP_DISCOUNT', {
    bind: this,
    urlFragment: groupId,
    callBack: this.re_getGroupDiscount,
    errorHandler: this.error_getGroupDiscount
  })
}
root.methods.re_getGroupDiscount = function (data) {
  console.info("获取团长剩余折扣get.data=====",data)

  typeof data === 'string' && (data = JSON.parse(data))
  // this.records = data.data.data

  this.surplusDiscountAccuracy = data.data.surplusDiscount * 10 //团长剩余折扣
  this.surplusDiscount = this.surplusDiscountAccuracy * 10 //团长剩余折扣
}
root.methods.error_getGroupDiscount = function (err) {
  console.log("this.err=====",err)
}

// 添加账号输入
root.methods.advanceAccountNumber = function () {
  this.pswPlaceholderShow = true

  if (this.accountAdd === '') {
    this.accountNumberMag = this.$t('账号不可为空 ')
    return false
  }

  // if (this.accountAdd == (this.$store.state.authMessage.email)) {
  //   this.accountNumberMag = this.$t('不可输入团长账号')
  //   return false
  // }
  if (this.accountAdd == (this.userNameAdd)) {
    this.accountNumberMag = this.$t('不可输入团长账号')
    return false
  }

  //如果既不是邮箱格式也不是手机格式
  if (!this.$globalFunc.emailOrMobile(this.accountAdd)) {
    this.accountNumberMag = this.$t('register.userNameWA_0')
    return false
  }

  this.accountNumberMag = ''
  return true
}


// 比例输入
root.methods.advanceProportion = function () {
  this.verificationCodePlaceholderShow = true

  if (this.proportion === '') {
    this.proportionMag = this.$t('分佣比例不可为空')
    return false
  }

  this.proportionMag = ''
  return true
}

// 修改比例输入
root.methods.advanceModifyProportion = function () {
  this.verificationproportionModify = true

  if (this.proportionModify === '') {
    this.proportionModifyMag = this.$t('分佣比例不可为空')
    return false
  }

  this.proportionModifyMag = ''
  return true
}


// 获取焦点后关闭placheholder
root.methods.closePlaceholder = function (type) {
  // alert(type);

  if(type == 'account'){
    this.pswPlaceholderShow = false;
  }

  if(type == 'proportion'){
    this.verificationCodePlaceholderShow = false;
  }
  if(type == 'proportionModify'){
    this.verificationproportionModify = false;
  }


}

//添加组织成员折扣(params:{})
root.methods.postSetMember = function () {

  let canSend = true
  // 判断用户名
  // canSend = this.testName_0() && canSend
  canSend = this.advanceAccountNumber() && canSend
  canSend = this.advanceProportion() && canSend
  // canSend = this.testPswConfirm() && canSend
  // canSend = this.testPsw() && canSend
  // canSend = this.testReferee() && canSend
  // 请输入拼团名称
  if (this.accountAdd === '') {
    this.accountNumberMag = this.$t('账号不可为空')
    canSend = false
  }

  if (this.valuegender === '') {
    this.valuegenderMag = this.$t('职位不可为空')
    canSend = false
  }
  if (this.proportion == '') {
    this.proportionMag = this.$t('比例不可为空')
  }
  if (!canSend) {
    // console.log("不能发送！")
    return
  }

  // TODO : 加变量的非空判断 正则判断
  let params = {
    account: this.accountAdd,
    groupId: this.groupId,
    disCount: this.proportion / 100,
    idType: this.idTypeValue
  }
  console.log("postJoinGroup + params ===== ",params)
  /* TODO : 调试接口需要屏蔽 S*/
  // this.re_postJoinGroup()
  /* TODO : 调试接口需要屏蔽 E*/
  this.$http.send('POST_SET_MEMBER', {
    bind: this,
    params: params,
    callBack: this.re_postSetMember,
    errorHandler: this.error_postSetMember
  })
}
root.methods.re_postSetMember = function (data) {
  console.log("this.res=====",data)
  typeof data === 'string' && (data = JSON.parse(data))

  this.success = data.data.success
  console.log("re_postJoinGroup + data=====",data)

  if (data.errorCode) {
    if (
      data.errorCode == 1 && (this.popText = this.$t('账户不存在')) ||//账户不存在
      data.errorCode == 2 && (this.popText = this.$t('设置折扣值大于团长剩余折扣')) || // 设置折扣值大于团长剩余折扣
      data.errorCode == 3 && (this.popText = this.$t('团长职位不能修改')) || // 团长职位不能修改
      data.errorCode == 4 && (this.popText = this.$t('成员类型有误')) || // 成员类型有误
      data.errorCode == 5 && (this.popText = this.$t('联席团长职位不可更换')) || // 联席团长职位不可更换
      data.errorCode == 6 && (this.popText = this.$t('设置比例折扣不能为0')) || // 设置比例折扣不能为0
      data.errorCode == 400 && (this.popText = this.$t('parameter_error')) //参数有误
    ) {
      this.popOpen = true
      this.popType = 0
      setTimeout(() => {
        this.popOpen = true
      }, 100)
    }
  }

  if (this.success == true) {
    this.popOpen = true
    this.popType = 1
    this.popText = this.$t('添加成功') //'添加成功'
    setTimeout(() => {
      this.popOpen = true
      this.getGroupDiscount(this.groupId)
      this.getImportantMembers(this.groupId)
      this.getMemberList(this.groupId)
      this.organizationSetUpComponent=false
    }, 1000)
    return;
  }

}
root.methods.error_postSetMember = function (err) {
  console.log("this.err=====",err)
}


//修改成员折扣(params:{})
root.methods.postModifyMember = function () {

  let canSend = true

  canSend = this.advanceModifyProportion() && canSend
  // 请输入拼团名称

  if (this.proportionModify == '') {
    this.proportionMag = this.$t('比例不可为空')
  }
  if (!canSend) {
    // console.log("不能发送！")
    return
  }

  // TODO : 加变量的非空判断 正则判断
  let params = {
    account: this.account,
    groupId: this.groupId,
    disCount: this.proportionModify / 100,
    idType: this.idType
  }
  console.log("postJoinGroup + params ===== ",params)
  /* TODO : 调试接口需要屏蔽 S*/
  // this.re_postJoinGroup()
  /* TODO : 调试接口需要屏蔽 E*/
  this.$http.send('POST_SET_MEMBER', {
    bind: this,
    params: params,
    callBack: this.re_postModifyMember,
    errorHandler: this.error_postModifyMember
  })
}
root.methods.re_postModifyMember = function (data) {
  console.log("this.res=====",data)
  typeof data === 'string' && (data = JSON.parse(data))

  this.success = data.data.success
  console.log("re_postJoinGroup + data=====",data)

  if (data.errorCode) {
    if (
      data.errorCode == 1 && (this.popText = this.$t('账户不存在')) ||//账户不存在
      data.errorCode == 2 && (this.popText = this.$t('设置折扣值大于团长剩余折扣')) || // 设置折扣值大于团长剩余折扣
      data.errorCode == 3 && (this.popText = this.$t('团长职位不能修改')) || // 团长职位不能修改
      data.errorCode == 4 && (this.popText = this.$t('成员类型有误')) || // 成员类型有误
      data.errorCode == 5 && (this.popText = this.$t('联席团长职位不可更换')) || // 联席团长职位不可更换
      data.errorCode == 6 && (this.popText = this.$t('设置比例折扣不能为0')) || // 设置比例折扣不能为0
      data.errorCode == 400 && (this.popText = this.$t('parameter_error')) //参数有误
    ) {
      this.popOpen = true
      this.popType = 0
      setTimeout(() => {
        this.popOpen = true
      }, 100)
    }
  }

  if (this.success == true) {
    this.popOpen = true
    this.popType = 1
    this.popText = this.$t('修改成功') //'修改成功'
    setTimeout(() => {
      this.popOpen = true

      this.getGroupDiscount(this.groupId)
      this.getImportantMembers(this.groupId)
      this.getMemberList(this.groupId)

      this.organizationModifyComponent=false
    }, 1000)
    return;
  }

}
root.methods.error_postModifyMember = function (err) {
  console.log("this.err=====",err)
}




//修改组织成员折扣(params:{}) 没完成
root.methods.postModifyDiscount = function () {


  // TODO : 加变量的非空判断 正则判断
  let params = {
    groupId: this.groupId,
    account: this.delItem.account,
    userId: this.delItem.userId,
    // userId: this.delItem.id,
  }
  console.log("postJoinGroup + params ===== ",params)
  /* TODO : 调试接口需要屏蔽 S*/
  // this.re_postJoinGroup()
  /* TODO : 调试接口需要屏蔽 E*/
  this.$http.send('POST_MODIFY_DISCOUNT', {
    bind: this,
    params: params,
    callBack: this.re_postModifyDiscount,
    errorHandler: this.error_postModifyDiscount
  })
}
root.methods.re_postModifyDiscount = function (data) {
  console.log("this.res=====",data)
  typeof data === 'string' && (data = JSON.parse(data))

  this.success = data.data.success
  console.log("re_postJoinGroup + data=====",data)

  if (data.errorCode) {
    if (
      data.errorCode == 1 && (this.popText = this.$t('该账户不存在于本团')) ||//账户不存在
      data.errorCode == 2 && (this.popText = this.$t('团长职位不可删除')) ||//团长职位不可删除
      data.errorCode == 3 && (this.popText = this.$t('联席团长职位不可删除')) ||//联席团长职位不可删除
      data.errorCode == 400 && (this.popText = this.$t('账户不能为空')) //参数有误
    ) {
      this.popOpen = true
      this.popType = 0
      setTimeout(() => {
        this.popOpen = true
      }, 100)
    }
  }

  if (this.success == true) {
    this.popOpen = true
    this.popType = 1
    this.popText = this.$t('降级成功') //'降级成功'
    setTimeout(() => {
      this.popOpen = true
      this.getGroupDiscount(this.groupId)
      this.getImportantMembers(this.groupId)
      this.getMemberList(this.groupId)
      this.popWindowOpenDelete=false
    }, 1000)
    return;
  }

}
root.methods.error_postModifyDiscount = function (err) {
  console.log("this.err=====",err)
}



//获取编辑组织成员信息get (query:{})
root.methods.getEditMember= function (id) {

  // let groupId = this.$route.params.groupId
  this.$http.send('GET_EDIT_MEMBER', {
    bind: this,
    urlFragment: id,
    callBack: this.re_getEditMember,
    errorHandler: this.error_getEditMember
  })
  this.organizationModifyComponent = true
}
root.methods.re_getEditMember = function (data) {
  console.info("获取团长剩余折扣get.data=====",data)

  typeof data === 'string' && (data = JSON.parse(data))
  // this.records = data.data.data

  this.ModifyidType = data.data.idType
  this.discount = data.data.discount
  this.id = data.data.id
  // this.userId1 = data.data.userId
  this.account = data.data.account
}
root.methods.error_getEditMember = function (err) {
  console.log("this.err=====",err)
}


// 点击加载更多
root.methods.clickLoadingMore = function () {
  this.loadingMoreIng = true
  this.getMemberList(this.groupId)
}

// 点击加载更多
root.methods.toOrderHistory = function () {
  this.$router.push({name:'detailsOfTheGroup'})
}

// 弹窗
root.methods.popClose = function () {
  this.popOpen = false
}

// 弹窗关闭
root.methods.popWindowClose = function () {
  this.popWindowOpen = false
}
// 组织成员添加组件
root.methods.organizationSetUpComponentClose = function () {
  this.organizationSetUpComponent = false
}

//组织成员添加
root.methods.organizationDeletion = function () {
  this.organizationSetUpComponent = true
}

//组织成员修改组件
root.methods.organizationModifyComponentClose = function () {
  this.organizationModifyComponent = false
}

//组织成员修改
root.methods.organizationModify = function () {

}

root.methods.popWindowOpenDeleteClose = function () {
  this.popWindowOpenDelete = false
}

root.methods.organizationDelete = function (item) {
  this.delItem = item;
  this.popWindowOpenDelete = true
}


root.methods.isAppQuery = function (query) {
  if(this.$route.query.isApp) {
    this.isApp = true
  } else {
    this.isApp = false
  }
}

// 判断是否是ios打开
root.methods.isIOSQuery = function () {
  if(this.$route.query.isIOS) {
    this.isIOS = true
  } else {
    this.isIOS = false
  }
}

// 格式化时间
root.methods.formatDateUitl = function (time) {
  return this.$globalFunc.formatDateUitl(Number(time), 'YYYY-MM-DD')
}

/*---------------------- 乘法运算 begin ---------------------*/
root.methods.accMul = function (num1, num2) {
  return this.$globalFunc.accMul(num1, num2)
}
/*---------------------- 乘法运算 end ---------------------*/

/*---------------------- 保留小数位 begin ---------------------*/
root.methods.toFixed = function (num, acc) {
  return this.$globalFunc.accFixed(num, acc)
}
/*---------------------- 保留小数位 end ---------------------*/

export default root
