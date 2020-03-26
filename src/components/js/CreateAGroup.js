const root = {}
root.name = 'CreateAGroup'
/*------------------------------ 组件 ------------------------------*/
root.components = {
 // 'Loading': resolve => require(['../Loading/Loading.vue'], resolve),
  'PopupPrompt': resolve => require(['../vue/PopupPrompt'], resolve),
  'PopupWindow': resolve => require(['../vue/PopupWindow'], resolve),
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

    popWindowTitle: '', //弹出提示标题
    popWindowPrompt: '',//弹出样式提示

    popWindowPrompt1: '',//弹出样式提示
    popWindowStyle: 0,//跳转 0表示实名认证，1表示手机或谷歌，2只有确定
    popWindowOpen: false, //弹窗开关

  }
}
/*------------------------------ 生命周期 -------------------------------*/
root.created = function () {
  console.log('created======',this,this.$route.name)
  // this.$router.back()
  // if (this.success == true) {
  //   this.$router.push({name: '/index/home'});
  // }
  // if (this.$route.name == 'detailsOfTheGroup') {
  //   // this.$router.push({name:'index/home'})
  //   this.$router.go(-2)
  //   // this.$router.back()
  // }

}

root.beforeRouteEnter = function (to, from, next) {
  console.log('beforeRouteEnter第一个参数to',to);
  console.log('beforeRouteEnter第二个参数from',from);
  console.log('beforeRouteEnter第三个参数next',next);
  next(vm => {
    if(from.name === 'detailsOfTheGroup'){
      // vm.$router.push({name:'index/indexHomeMarket'})
      // vm.$router.back()
      vm.$router.go(-2)
    }
  });
}
root.mounted = function () {}
// root.beforeDestroy = function (to, from, next) {
//   console.log('beforeRouteEnter第一个参数to',to);
//   console.log('beforeRouteEnter第二个参数from',from);
//   console.log('beforeRouteEnter第三个参数next',next);
//
// }
/*------------------------------ 计算 -------------------------------*/
root.computed = {}
// 是否实名认证
root.computed.bindIdentify = function () {
  return this.$store.state.authState.identity
}

// 是否绑定手机
root.computed.bindMobile = function () {
  return this.$store.state.authState.sms
}
// 是否绑定谷歌验证码
root.computed.bindGA = function () {
  return this.$store.state.authState.ga
}
// 是否绑定邮箱
root.computed.bindEmail = function () {
  return this.$store.state.authState.email
}


// // uid
// root.computed.uuid = function () {
//   if(this.$store.state.authMessage.uuid == undefined){
//     return this.$store.state.authMessage.userId
//   }
//   return this.$store.state.authMessage.uuid
// }

// 获取userId
root.computed.userId = function () {
  return this.$store.state.authMessage.userId
}

// 用户名
root.computed.userName = function () {
  if (this.userType === 0) {
    return (this.$store.state.authMessage.mobile)
  }
  if (!this.$store.state.authMessage.email) {
    return '****@****'
  }
  return (this.$store.state.authMessage.email)
}

// 用户类型，如果是手机用户，为0，如果是邮箱用户，为1
root.computed.userType = function () {
  return this.$store.state.authMessage && this.$store.state.authMessage.province === 'mobile' ? 0 : 1
}

/*------------------------------ 观察 -------------------------------*/
root.watch = {}
/*------------------------------ 方法 -------------------------------*/
root.methods = {}

// 弹框跳安全中心
root.methods.goToSecurityCenter = function () {
  this.popWindowOpen = false
  this.$router.push({name: 'securityCenter'})
}

// 弹出绑定身份，跳转到实名认证界面
root.methods.goToBindIdentity = function () {
  this.popWindowOpen = false
  this.$router.push({name: 'authenticate'})
}
// // 去绑定谷歌验证
// root.methods.goToBindGA = function () {
//   this.popWindowOpen = false
//   this.$router.push({name: 'bindGoogleAuthenticator'})
// }
// // 去绑定手机号
// root.methods.goToBindMobile = function () {
//   this.popWindowOpen = false
//   this.$router.push({name: 'bindMobile'})
// }
// // 去绑定邮箱
// root.methods.goToBindEmail = function () {
//   this.popWindowOpen = false
//   this.$router.push({name: 'bindEmail'})
// }


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

  // 如果没有实名认证不允许打开创建拼团
    if (!this.bindIdentify) {
      this.popWindowTitle = this.$t('popWindowTitleTransfer1')
      this.popWindowPrompt = this.$t('popWindowPromptWithdrawals')
      this.popWindowStyle = '0'
      this.popWindowOpen = true
      return
    }

    // 如果没有绑定邮箱，不允许创建拼团
    if (!this.bindEmail) {
      this.popWindowTitle = this.$t('bind_email_pop_title')
      this.popWindowPrompt = this.$t('bind_email_pop_article')
      this.popWindowStyle = '3'
      this.popWindowOpen = true
      return
    }

    // 如果没有绑定谷歌或手机，不允许创建拼团
    if (!this.bindGA && !this.bindMobile) {
      this.popWindowTitle = this.$t('popWindowTitleTransfer1')
      this.popWindowPrompt = this.$t('popWindowTitleBindGaWithdrawals')
      this.popWindowStyle = '1'
      this.popWindowOpen = true
      return
    }


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
    userId:this.userId,
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
  this.$http.send('POST_CREATE_GROUP', {
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
  // this.status = data.status


  if(data.errorCode) {
    if (
      data.errorCode == 1 && (this.popText = this.$t('colonel')) || //团长账号已存在
      data.errorCode == 2 && (this.popText = this.$t('not_registered1')) || // 副团账号未注册
      data.errorCode == 3 && (this.popText = this.$t('sub_group')) ||  // 副团账号已存在
      data.errorCode == 4 && (this.popText = this.$t('already')) ||  // 拼团名称已存在
      data.errorCode == 5 && (this.popText = this.$t('nameMsgColonel')) ||  //团长账号与副团账号不能一样
      data.errorCode == 6 && (this.popText = this.$t('nameMsg')) ||  //团队名称长度不能超过10
      data.errorCode == 7 && (this.popText = this.$t('account_wrong')) ||  // 团长账户格式错误
      data.errorCode == 8 && (this.popText = this.$t('sub_group_wrong')) ||  // 副团账户格式错误
      data.errorCode == 9 && (this.popText = this.$t('not_registered')) ||  // 团长账号未注册
      data.errorCode == 10 && (this.popText = this.$t('userId_wrong')) ||  // 团长userId有误
      data.errorCode == 11 && (this.popText = this.$t('inserted')) ||  // 拼团团员已存在，不能重复插入
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
    this.popText = this.$t('successful') //'创建拼团成功'
    setTimeout(() => {
      this.popOpen = true
    }, 1000)
    setTimeout(() => {
      this.$router.push({name: 'detailsOfTheGroup',params: {groupId:this.groupId}})
    }, 1000)
  }

}

root.methods.error_postCreateAGroup = function (err) {
  console.log("this.err=====",err)
}

//检查团名是否可用get (query:{})
root.methods.getNameAvailable = function () {
  this.$http.send('GET_ISEXIST_GNAME', {
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

  if (this.available == false) {
    this.name_0 = this.$t('already')
  }
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

// 弹窗关闭
root.methods.popWindowClose = function () {
  this.popWindowOpen = false
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

  // this.re_getNameAvailable()
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
