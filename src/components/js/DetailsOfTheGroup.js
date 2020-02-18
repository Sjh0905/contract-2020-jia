const root = {}
root.name = 'DetailsOfTheGroup'
/*------------------------------ 组件 ------------------------------*/
//root.components = {
//  'Loading': resolve => require(['../Loading/Loading.vue'], resolve),
//}
/*------------------------------ data -------------------------------*/
root.data = function () {
  return {
    //拼团展示团队详情
    // details:[]
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
    currPage: this.currPage,
    pageSize: this.pageSize
  }
}
/*------------------------------ 生命周期 -------------------------------*/
root.created = function () {
  this.getTeamDetails()
  this.getMemberList()
}
root.mounted = function () {}
root.beforeDestroy = function () {}
/*------------------------------ 计算 -------------------------------*/
root.computed = {}
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
// uid
root.computed.uuid = function () {
  if(this.$store.state.authMessage.uuid == undefined){
    return this.$store.state.authMessage.userId
  }
  return this.$store.state.authMessage.uuid
}

root.computed.computedRecord = function (item,index) {
  return this.records
}
/*------------------------------ 观察 -------------------------------*/
root.watch = {}
/*------------------------------ 方法 -------------------------------*/
root.methods = {}

//拼团展示团队详情get (query:{})  不知道对不对
root.methods.getTeamDetails= function () {
  /* TODO : 调试接口需要屏蔽 S*/
  var  data = {
    "data": {
      "deputyAccount": "yx.318@qq.cn",
      "idType": "3",
      "priAccount": "1835807299@qq.com",
      "joinTime": "2222-02-12",
      "quantDiscount": "0.006",
      "groupId": "2",
      "gname": "战狼2",
      "currCount": "20",
      "createdAt": "2222-02-12",
      "maxMember": "30",
      "commonDiscount": "0.006",
      "glevel": "4",
      "account": "yx.318@qq.cn"
    },
    "status": "200",
    "message": "success"
  }
  this.re_getTeamDetails(data)
  /* TODO : 调试接口需要屏蔽 E*/
  this.$http.send('GET_QUERYSHOWGROUPINFO', {
    bind: this,
    query:{
      userId:this.uuid
    },
    callBack: this.re_getTeamDetails,
    errorHandler: this.error_getTeamDetails
  })
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



}
root.methods.error_getTeamDetails = function (err) {
  console.log("this.err=====",err)
}


//退团解散团队post(params:{}) 没完成
root.methods.postWithdraw = function () {
  // TODO : 加变量的非空判断 正则判断
  let params = {
    userId: this.uuid,
    groupId: this.groupId,
    glevel: this.glevel,
    idType: this.idType
  }
  console.log("postJoinGroup + params ===== ",params)
  /* TODO : 调试接口需要屏蔽 S*/
  this.re_postJoinGroup()
  /* TODO : 调试接口需要屏蔽 E*/
  this.$http.send('POST_ASSEMBLE_LEVEAGROUP', {
    bind: this,
    params: params,
    callBack: this.re_postWithdraw,
    errorHandler: this.error_postWithdraw
  })
}
root.methods.re_postWithdraw = function (data) {
  console.log("this.res=====",data)
  typeof data === 'string' && (data = JSON.parse(data))
}
root.methods.error_postWithdraw = function (err) {
  console.log("this.err=====",err)
}

// 不会写  登陆用户组等级信息get (query:{})  未完成
root.methods.getGroupLevel = function () {
  /*TODO : 调试接口需要屏蔽 S*/
 var res = {
    "data": {
      "idType": 2,
      "groupId": 2,
      "isExist": true,
      "account": "yx.318@qq.cn"
    },
    "status": "200",
    "message": "success"
  }
  this.re_getGroupLevel(res)
  /* TODO : 调试接口需要屏蔽 E*/
  this.$http.send('GET_ASSEMBLE_GETMEM', {
    bind: this,
    query:{
      userId:this.uuid
    },
    callBack: this.re_getGroupLevel,
    errorHandler: this.error_getGroupLevel
  })
}
root.methods.re_getGroupLevel = function (res) {
  // res = {
  //   "data": {
  //   "idType": 2,
  //     "groupId": 2,
  //     "isExist": true,
  //     "account": "yx.318@qq.cn"
  // },
  //   "status": "200",
  //   "message": "success"
  // }
  console.log("this.re_getGroupLevel + res=====",res)
  typeof data === 'string' && (data = JSON.parse(data))
}
root.methods.error_getGroupLevel = function (err) {
  console.log("this.err=====",err)
}

//团员列表get (query:{})
root.methods.getMemberList= function () {
  /*TODO : 调试接口需要屏蔽 S*/
 var data = {
    "data": {
      "data": [
        {
          "rowNum": "1.0",
          "idType": "团长",
          "account": "1835807299@qq.com",
          "joinTime": "2020-02-12"
        },
        {
          "rowNum": "2.0",
          "idType": "副团长",
          "account": "yx.318@qq.cn",
          "joinTime": "2020-02-12"
        },
        {
          "rowNum": "3.0",
          "idType": "团员",
          "account": "123r2w@qq.com",
          "joinTime": "2020-02-13"
        }
      ],
      "nextPage": 2,
      "isNext": false
    },
    "status": "200",
    "message": "success"
  }
  this.re_getMemberList(data)
  /* TODO : 调试接口需要屏蔽 E*/

  this.$http.send('GET_QUERYMEMBERLIST', {
    bind: this,
    query:{
      groupId: this.groupId,
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
  this.records = data.data.data
}
root.methods.error_getMemberList = function (err) {
  console.log("this.err=====",err)
}



export default root
