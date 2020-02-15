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
root.created = function () {}
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
  // console.log('jjjjjjjjjjj',item,'kkkkkkkk',index,'pppppp',this.records)
  return this.records
}
/*------------------------------ 观察 -------------------------------*/
root.watch = {}
/*------------------------------ 方法 -------------------------------*/
root.methods = {}

//拼团展示团队详情get (query:{})  不知道对不对
root.methods.get_team_details= function () {
  this.$http.send('GET_QUERYSHOWGROUPINFO', {
    bind: this,
    query:{
      userId:this.uuid
    },
    callBack: this.re_get_team_details,
    errorHandler: this.error_get_team_details
  })
}
root.methods.re_get_team_details = function (data) {

  console.log("this.data=====",data)
  typeof data === 'string' && (data = JSON.parse(data))
  this.deputyAccount = data.deputyAccount
  this.idType = data.idType
  this.priAccount = data.priAccount
  this.joinTime = data.joinTime
  this.quantDiscount = data.quantDiscount
  this.groupId = data.groupId
  this.gname = data.gname
  this.currCount = data.currCount
  this.createdAt = data.createdAt
  this.maxMember = data.maxMember
  this.commonDiscount = data.commonDiscount
  this.glevel = data.glevel
  this.account = data.account



}
root.methods.error_get_team_details = function (err) {
  console.log("this.err=====",err)
}


//退团解散团队post(params:{}) 没看懂
root.methods.post_withdraw = function () {
  this.$http.send('POST_ASSEMBLE_LEVEAGROUP', {
    bind: this,
    params:{},
    callBack: this.re_post_withdraw,
    errorHandler: this.error_post_withdraw
  })
}
root.methods.re_post_withdraw = function (res) {
  console.log("this.res=====",res)
}
root.methods.error_post_withdraw = function (err) {
  console.log("this.err=====",err)
}

//登陆用户组等级信息get (query:{})  未完成
root.methods.get_group_level = function () {
  this.$http.send('GET_ASSEMBLE_GETMEM', {
    bind: this,
    query:{
      userId:this.uuid
    },
    callBack: this.re_get_group_level,
    errorHandler: this.error_get_group_level
  })
}
root.methods.re_get_group_level = function (res) {
  console.log("this.res=====",res)
}
root.methods.error_get_group_level = function (err) {
  console.log("this.err=====",err)
}

//团员列表get (query:{}) 不知道对不对
root.methods.get_member_list= function () {
  this.$http.send('GET_QUERYMEMBERLIST', {
    bind: this,
    query:{
      groupId: this.groupId,
      //ssssssssss
      currPage: this.currPage,
      pageSize: this.pageSize
    },
    callBack: this.re_get_member_list,
    errorHandler: this.error_get_member_list
  })
}
root.methods.re_get_member_list = function (data) {
  console.log("团员列表this.data=====",data)

  typeof data === 'string' && (data = JSON.parse(data))
  this.records = data.data
}
root.methods.error_get_member_list = function (err) {
  console.log("this.err=====",err)
}



export default root
