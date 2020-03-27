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
  }
}
/*------------------------------ 生命周期 -------------------------------*/
root.created = function () {
  this.getTeamDetails()
  this.getMemberList(this.groupId)
  this.loading = true
  // this.userId()

  // this.getMemberList()
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
/*------------------------------ 观察 -------------------------------*/
root.watch = {}
/*------------------------------ 方法 -------------------------------*/
root.methods = {}

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
  this.quantData = data.quantData
  console.log("拼团展示团队详情=====",this.quantData)
  this.quantCumulative = data.data.quantData.quantCumulative,//挖矿区手续费累计
  this.commCumulative = data.data.quantData.commCumulative,//普通区交易手续费累计
  this.quantRecommission= data.data.quantData.quantRecommission,//挖矿区团长返佣累计
  this.commRecommission= data.data.quantData.commRecommission,//普通区团长返佣累计


  this.getMemberList(data.data.groupId)

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
    if (this.isMobile) {
      setTimeout(() => {
        // this.$router.push({path: '/index/newH5homePage'})
        this.$router.push({name: 'NewH5homePage'})
      }, 1000)
    }
    return;
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
    if (this.isMobile) {
      setTimeout(() => {
        this.$router.push({name: 'NewH5homePage'})
        // this.$router.push({path: '/index/newH5homePage'})
      }, 1000)
    }
    return;
  }
  // this.loading = false
}
root.methods.error_postWithdraw = function (err) {
  console.log("this.err=====",err)
}

// // 不会写  登陆用户组等级信息get (query:{})  未完成
// root.methods.getGroupLevel = function () {
//   /*TODO : 调试接口需要屏蔽 S*/
//  // var res = {
//  //    "data": {
//  //      "idType": 2,
//  //      "groupId": 2,
//  //      "isExist": true,
//  //      "account": "yx.318@qq.cn"
//  //    },
//  //    "status": "200",
//  //    "message": "success"
//  //  }
//  //  this.re_getGroupLevel(res)
//   /* TODO : 调试接口需要屏蔽 E*/
//   this.$http.send('GET_ASSEMBLE_GET', {
//     bind: this,
//     query:{
//       userId:this.uuid
//     },
//     callBack: this.re_getGroupLevel,
//     errorHandler: this.error_getGroupLevel
//   })
// }
// root.methods.re_getGroupLevel = function (data) {
//   // res = {
//   //   "data": {
//   //   "idType": 2,
//   //     "groupId": 2,
//   //     "isExist": true,
//   //     "account": "yx.318@qq.cn"
//   // },
//   //   "status": "200",
//   //   "message": "success"
//   // }
//   console.log("this.re_getGroupLevel + res=====",data)
//   typeof data === 'string' && (data = JSON.parse(data))
// }
// root.methods.error_getGroupLevel = function (err) {
//   console.log("this.err=====",err)
// }

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
