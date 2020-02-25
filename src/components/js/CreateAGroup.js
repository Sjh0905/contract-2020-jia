const root = {}
root.name = 'CreateAGroup'
/*------------------------------ 组件 ------------------------------*/
root.components = {
 // 'Loading': resolve => require(['../Loading/Loading.vue'], resolve),
  'PopupPrompt': resolve => require(['../vue/PopupPrompt'], resolve),
}
/*------------------------------ data -------------------------------*/
root.data = function () {
  return {
    //副团长账号
    deputyAccount:'',
    nameMsg_0: '',
    //团名称
    gname:'',
    pswPlaceholderShow: true,
    pswConfirmPlaceholderShow: true,
    name_0:'',
    //检测团名 false:可用，true：不可用
    available:true,
    popType: 0,
    popOpen: false,
    popText: '系统繁忙',

    registerType: 1, // 0为手机注册，1为邮箱注册
  }
}
/*------------------------------ 生命周期 -------------------------------*/
root.created = function () {}
root.mounted = function () {}
root.beforeDestroy = function () {}
/*------------------------------ 计算 -------------------------------*/
root.computed = {}

// uid
root.computed.uuid = function () {
  if(this.$store.state.authMessage.uuid == undefined){
    return this.$store.state.authMessage.userId
  }
  return this.$store.state.authMessage.uuid
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

/*------------------------------ 观察 -------------------------------*/
root.watch = {}
/*------------------------------ 方法 -------------------------------*/
root.methods = {}


// // 判断名字0
// root.methods.testName_0 = function () {
//   this.nameWA_0 = '0'
//   if (this.deputyAccount === '') {
//     this.nameMsg_0 = ''
//     return false
//   }
//   if (this.$globalFunc.testSpecial(this.deputyAccount)) {
//     this.nameMsg_0 = this.$t('nameMsg_1')
//     return false
//   }
//   this.nameMsg_0 = ''
//   return true
// }

//创建拼团post(params:{})
root.methods.postCreateAGroup = function () {
  // TODO : 加变量的非空判断 正则判断 S
  if (this.sending) return
  let canSend = true
  // 判断用户名
  canSend = this.testName_0() && canSend
  canSend = this.testdeputyAccount() && canSend
  // canSend = this.testPswConfirm() && canSend
  // canSend = this.testPsw() && canSend
  // canSend = this.testReferee() && canSend
  // 请输入拼团名称
  if (this.gname === '') {
    this.name_0 = this.$t('nameMsg_01')
    canSend = false
  }

  if (this.deputyAccount === '') {
    this.nameMsg_0 = this.$t('nameMsg_0')
    canSend = false
  }
  if (!canSend) {
    // console.log("不能发送！")
    return
  }

  // TODO : 加变量的非空判断 正则判断 E
  let params = {
    userId:this.uuid,
    priAccount: this.userName,
    deputyAccount: this.deputyAccount,
    gname: this.gname
  }
  console.log("postJoinGroup + params ===== ",params)
  // /* TODO : 调试接口需要屏蔽 S*/
  // this.re_postCreateAGroup({
  //   "data": {
  //     "success": true
  //   },
  //   "status": "200",
  //   "message": "success"
  // })
  // /* TODO : 调试接口需要屏蔽 E*/
  this.$http.send('POST_ASSEMBLE_CREATEGROUP', {
    bind: this,
    params:params,
    callBack: this.re_postCreateAGroup,
    errorHandler: this.error_postCreateAGroup
  })
}
root.methods.re_postCreateAGroup = function (data) {
  typeof data === 'string' && (data = JSON.parse(data))
  console.log("this.re_postCreateAGroup=====",data)
  this.success = data.data.success
  this.groupId = data.data.groupId
  this.status = data.status


  if (this.success == true) {
    this.$router.push({name: 'detailsOfTheGroup',params: {groupId:this.groupId}})
  }

  if (this.success == false) {
    this.popOpen = true
    this.popType = 0
    this.popText = this.$t('popText3')
    setTimeout(() => {
      this.popOpen = true
    }, 100)
}
  if (this.status != 200) {
    this.popOpen = true
    this.popType = 0
    this.popText = this.$t('popText3')
    setTimeout(() => {
      this.popOpen = true
    }, 100)
  }
}
root.methods.error_postCreateAGroup = function (err) {
  console.log("this.err=====",err)
}

//检查团名是否可用get (query:{})
root.methods.getNameAvailable = function () {
  this.$http.send('GET_ASSEMBLE_ISEXISTGNAME', {
    bind: this,
    urlFragment: this.gname,
    // query:{
    //   gname: this.this.gname
    // },
    callBack: this.re_getNameAvailable,
    errorHandler: this.error_getNameAvailable
  })
}
root.methods.re_getNameAvailable = function (data) {
  typeof data === 'string' && (data = JSON.parse(data))
  console.log("this.re_getNameAvailable=====",data)
  this.available = data.data.success
}
root.methods.error_getNameAvailable = function (err) {
  console.log("this.err=====",err)
}


// //跳创建好拼团的页面
// root.methods.createGroupType = function () {
//   // if(this.available == false ) {
//   //   this.$router.push({name: 'detailsOfTheGroup'})
//   // }
//   this.$router.push({name: 'detailsOfTheGroup'})
// }
// 弹窗
root.methods.popClose = function () {
  this.popOpen = false
}

// 获取焦点后关闭placheholder
root.methods.closePlaceholder = function (type) {
  // alert(type);

  if(type == 'gname'){
    this.pswPlaceholderShow = false;
  }

  if(type == 'deputyAccount'){
    this.verificationCodePlaceholderShow = false;
  }

  if(type == 'pswConfirm'){
    this.pswConfirmPlaceholderShow = false;
  }

  if(type == 'referee'){
    this.refereePlaceholderShow = false;
  }

}

// 输入拼团名称中
root.methods.testInputIngPsw = function () {
  if (this.gname.length > 10) {
    this.name_0 = this.$t('nameMsg')
  }
  this.gname = this.gname.slice(0, 10)
}

// 拼团名称输入
root.methods.testName_0 = function () {
  this.pswPlaceholderShow = true
  if (this.gname === '') {
    this.name_0 = ''
    return false
  }

  // 只可以中，英，数字
  if (!this.$globalFunc.testSpecials(this.gname)) {
    this.name_0 = this.$t('nameMsgRegiment')
    return false
  }

  this.name_0 = ''
  return true
}

// 副团长账号输入
root.methods.testdeputyAccount = function () {
  this.pswConfirmPlaceholderShow = true

  if (this.deputyAccount === '') {
    this.nameMsg_0 = ''
    return false
  }

  //如果既不是邮箱格式也不是手机格式
  if (!this.$globalFunc.emailOrMobile(this.deputyAccount)) {
    this.nameMsg_0 = this.$t('register.userNameWA_0')
    return false
  }

  this.nameMsg_0 = ''
  return true
}


export default root
