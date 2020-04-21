const root = {}
root.name = 'JoinAGroup'
/*------------------------------ 组件 ------------------------------*/
root.components = {
  'Loading': resolve => require(['../vue/Loading'], resolve),
  'PopupPrompt': resolve => require(['../vue/PopupPrompt'], resolve),
  'PopupWindow': resolve => require(['../vue/PopupWindow'], resolve),
}
/*------------------------------ data -------------------------------*/
root.data = function () {
  return {
    loading:false,
    //副团长账号
    deputyAccount:'',
    nameMsg_0:'',
    //团长账号
    priAccount:'',
    priAccount1:'',
    //组ID
    // groupId:'',
    //组等级
    glevel:'0',
    groupId:'0',
    //普通区手续费折扣
    commonDiscount:'',
    //挖矿区手续费折扣
    quantDiscount:'',
    //组名
    gname:'',
    concat_gname:'',

    popType: 0,
    popOpen: false,
    popText: '系统繁忙',


    // 搜索内容
    searchCities:'',

    // 城市列表
    cityList:[],
    searchResult:'',

    // 绑定的城市
    cities: [],

    canJoin:false,
    pswPlaceholderShow: true,
    pswConfirmPlaceholderShow: true,
    popWindowStyle1:false,
    popWindowTitle: '', //弹出提示标题
    popWindowPrompt: '',//弹出样式提示

    popWindowPrompt1: '',//弹出样式提示
    popWindowStyle: 0,//跳转 0表示实名认证，1表示手机或谷歌，2只有确定
    popWindowOpen: false, //弹窗开关

    popIdenOpen: false,

    // bindGA: false,
    // bindMobile: false,
    // bindEmail: false
    isApp:false,
    isIOS:false
  }
}
/*------------------------------ 生命周期 -------------------------------*/
root.created = function () {
  this.GET_AUTH_STATE()
  this.getFuzzyQuery()
  this.isAppQuery()
  this.isIOSQuery()
  console.log("this.$route.query.path========",this.$route.query.path,this.$route.fullPath)
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
root.beforeDestroy = function () {}
/*------------------------------ 计算 -------------------------------*/
root.computed = {}

// 判断是否是手机
root.computed.isMobile = function () {
  return this.$store.state.isMobile
}

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
// // 是否绑定邮箱
// root.computed.bindEmail = function () {
//   return this.$store.state.authState.email
// }

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
/*------------------------------ 观察 -------------------------------*/
root.watch = {}

root.watch.searchResult = function (newVal, oldVal){
  if(newVal == oldVal)return
  let groupId = this.citiesMap[newVal];
  this.getCheckGroupDetails(groupId);
  console.log("searchResult + newVal, oldVal",newVal, oldVal,groupId)
}

root.watch.searchCities = function(v){
  console.log(v)
  this.cityList = []
  //不是数字的时候搜索nameCn nameEn
  if(isNaN(this.searchCities)){
    this.cityList = this.cities.filter(v=>v.concat_gname.includes(this.searchCities)
      || v.concat_gname.includes(this.searchCities)
      || v.concat_gname.includes(this.searchCities.toUpperCase())
    )
  }

  //是数字的时候搜索areaCode
  if(!isNaN(this.searchCities)){
    this.cityList = this.cities.filter(v=>v.concat_gname.includes(this.searchCities))
  }

  this.cityList.length == 0 && (this.cityList = [{
    "groupId": "-1",
    "gname": "暂无数据"
  }])
  return this.cityList;

}

/*------------------------------ 方法 -------------------------------*/
root.methods = {}



// 认证状态
root.methods.GET_AUTH_STATE = function () {
  this.$http.send("GET_AUTH_STATE", {
    bind: this,
    callBack: this.RE_GET_AUTH_STATE,
    errorHandler: this.error_getCurrency
  })
}
root.methods.RE_GET_AUTH_STATE = function (res) {
  typeof res === 'string' && (res = JSON.parse(res));
  if (!res) return
  this.$store.commit('SET_AUTH_STATE', res.dataMap)
  // let data = res.dataMap;
  // this.identity_type = data;
  // if (res.result == 'SUCCESS' && (data.sms || data.ga)) {
  //   this.bindIdentify = data.identity;
  // }
  // 两者都验证了
  // this.bindGA = data.ga;
  // this.bindMobile = data.sms;
  // this.bindEmail = data.email;
  // this.bindMobile && (this.picked = 'bindMobile');
  // this.bindGA && (this.picked = 'bindGA');
  // if (this.bindGA && this.bindMobile) {
  //   this.showPicker = true;
  // }
  //
  // this.loading = false
}


// 弹出绑定身份，跳转到实名认证界面
root.methods.goToBindIdentity = function () {
  this.popWindowOpen = false
  this.$router.push({name: 'authenticate'})
}
// 弹框跳安全中心
root.methods.goToSecurityCenter = function () {
  this.popWindowOpen = false
  this.$router.push({name: 'securityCenter'})
}
// 去绑定谷歌验证
// root.methods.goToBindGA = function () {
//   this.popWindowOpen = false
//   this.$router.push({name: 'bindGoogleAuthenticator'})
// }
// // 去绑定手机号
// root.methods.goToBindMobile = function () {
//   this.popWindowOpen = false
//   this.$router.push({name: 'bindMobile'})
// }
// 去绑定邮箱
// root.methods.goToBindEmail = function () {
//   this.popWindowOpen = false
//   this.$router.push({name: 'bindEmail'})
// }



//模糊查询可加入小组get (query:{})
root.methods.getFuzzyQuery= function () {
  // /* TODO : 调试接口需要屏蔽 E*/
  this.$http.send('GET_GROUP_LIST', {
    bind: this,
    urlFragment: this.gname,
    // query:{
    //   gname: this.gname
    // },
    callBack: this.re_getFuzzyQuery,
    errorHandler: this.error_getFuzzyQuery
  })
}

root.methods.re_getFuzzyQuery = function (data) {
  //检测data数据是JSON字符串转换JS字符串
  typeof data === 'string' && (data = JSON.parse(data))
  console.log("模糊查询可加入小组=====",data)
  this.cities = data.data
  this.citiesMap = {}
  this.cities.map(v=>this.citiesMap[v.gname] = v.groupId)
  this.cities.map(v=>this.citiesMap[v.concat_gname] = v.groupId)
  console.log('this.getFuzzyQuery',this.getFuzzyQuery)
  // this.getCheckGroupDetails()
}

root.methods.error_getFuzzyQuery = function (err) {
  console.log("this.err=====",err)
}


//查询组详情get (query:{})
root.methods.getCheckGroupDetails= function (groupId) {

  this.$http.send('GET_QUERY_GROUP_INFO', {
    bind: this,
    urlFragment:groupId,
    // query:{
    //   groupId:groupId
    // },
    callBack: this.re_getCheckGroupDetails,
    errorHandler: this.error_getCheckGroupDetails
  })
}
root.methods.re_getCheckGroupDetails = function (data) {
  //检测data数据是JSON字符串转换JS字符串
  typeof data === 'string' && (data = JSON.parse(data))

  console.log("this.res000000=====",data)

  this.deputyAccount = data.data.deputyAccount
  this.priAccount = data.data.priAccount
  this.groupId = data.data.groupId
  this.glevel = data.data.glevel
  this.commonDiscount = data.data.commonDiscount
  this.quantDiscount = data.data.quantDiscount
  this.gname = data.data.gname

  if (this.priAccount1 === '') {
    this.nameMsg_0 = this.$t('enter')
    return false
  }

  if (this.priAccount1 !== this.priAccount) {
    this.nameMsg_0 = this.$t('invalid')
    return false
  }

}
root.methods.error_getCheckGroupDetails = function (err) {
  console.log("this.err=====",err)
}

//加入拼团post(params:{})
root.methods.postJoinGroup = function () {

  // 如果没有实名认证不允许加入拼团
  if (!this.bindIdentify && !this.isMobile) {
    this.popWindowTitle = this.$t('popWindowTitleTransfer')
    this.popWindowPrompt = this.$t('popWindowPromptWithdrawals')
    this.popWindowStyle = '0'
    this.popWindowOpen = true
    return
  }

  // // 如果没有绑定邮箱，不允许加入拼团
  // if (!this.bindEmail) {
  //   this.popWindowTitle = this.$t('bind_email_pop_title')
  //   this.popWindowPrompt = this.$t('bind_email_pop_article')
  //   this.popWindowStyle = '3'
  //   this.popWindowOpen = true
  //   return
  // }

  // 如果没有绑定谷歌或手机，不允许加入拼团
  if (!this.bindGA && !this.bindMobile && !this.isMobile) {
    this.popWindowTitle = this.$t('popWindowTitleTransfer')
    this.popWindowPrompt = this.$t('popWindowTitleBindGaWithdrawals')
    this.popWindowStyle = '1'
    this.popWindowOpen = true
    return
  }

  if (this.isMobile && !this.bindIdentify) {
    this.popIdenOpen = true
    return
  }

  // H5判断是否绑定谷歌或手机，如果都没绑定
  if (this.isMobile && !this.bindGA && !this.bindMobile) {
    // this.$eventBus.notify({key: 'BIND_AUTH_POP'})
    this.popText = '请绑定谷歌或手机';
    this.popType = 0;
    this.popOpen = true;
    return
  }

  // TODO : 加变量的非空判断 正则判断 S
  // if (this.sending) return
  // let canSend = true
  // canSend = this.testpriAccount1() && canSend
  //
  // if (this.priAccount1 === '') {
  //   this.nameMsg_0 = this.$t('enter')
  //   canSend = false
  // }
  // if (!canSend) {
  //   // console.log("不能发送！")
  //   return
  // }

  // if (this.priAccount1 !== this.priAccount) {
  //   this.nameMsg_0 = this.$t('invalid')
  //   return false
  // }



  // if (this.cityList.gname == '') {
  //   this.nameMsg_0 = this.$t('enter')
  // }

  if (this.priAccount == '') {
    return;
  }

  // this.canJoin = true

  let params = {
    userId: this.userId,
    groupId: this.groupId,
    glevel: this.glevel,
    account: this.userName
  }
  console.log("postJoinGroup + params ===== ",params)

  this.$http.send('POST_JOIN_GROUP', {
    bind: this,
    params:params,
    callBack: this.re_postJoinGroup,
    errorHandler: this.error_postJoinGroup
  })
}
root.methods.re_postJoinGroup = function (data) {
  typeof data === 'string' && (data = JSON.parse(data))

  this.success = data.data.success
  console.log("re_postJoinGroup + data=====", data)
  if (this.success == true) {

    this.popOpen = true
    this.popType = 1
    this.popText = this.$t('successfully') //'加入拼团成功'
    setTimeout(() => {
      this.popOpen = true
    }, 1000)
    setTimeout(() => {
      this.$router.push({name: 'detailsOfTheGroup', params: {groupId: this.groupId}})
    }, 1000)
    // this.$router.push({name: 'detailsOfTheGroup',query:{groupId:this.groupId , gname: this.gname}} )
    // this.$router.push({name: 'detailsOfTheGroup', params: {groupId: this.groupId}})
  }

  if (data.errorCode) {
    if (
      data.errorCode == 1 && (this.popText = this.$t('incorrect')) || //团员账户有误
      data.errorCode == 2 && (this.popText = this.$t('account_not_registered')) || // 团员账户未注册
      data.errorCode == 3 && (this.popText = this.$t('colonel_userId')) || // 团长userId有误
      data.errorCode == 4 && (this.popText = this.$t('inserted')) || // 拼团团员已存在，不能重复插入
      data.errorCode == 5 && (this.popText = this.$t('prompt2')) || // 拼团已达最大人数限制，请加入其它拼团
      data.errorCode == 6 && (this.popText = this.$t('parameter_error')) || // groupId为0,参数错误~~~~
      data.errorCode == 400 && (this.popText = this.$t('parameter_error')) //参数有误
    ) {
      this.popOpen = true
      this.popType = 0
      setTimeout(() => {
        this.popOpen = true
      }, 100)
    }
  }
}
root.methods.error_postJoinGroup = function (err) {
  console.log("this.err=====",err)
}


// root.methods.createGroupType = function () {
//   this.postJoinGroup()
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

// 关闭弹窗
root.methods.popIdenClose = function () {
  this.popIdenOpen = false
}
// 获取焦点后关闭placheholder
root.methods.closePlaceholder = function (type) {
  // alert(type);

  if(type == 'gname'){
    this.pswPlaceholderShow = false;
  }

  if(type == 'priAccount1'){
    this.verificationCodePlaceholderShow = false;
  }


  if(type == 'pswConfirm'){
    this.pswConfirmPlaceholderShow = false;
  }

  if(type == 'referee'){
    this.refereePlaceholderShow = false;
  }

}

// 副团长账号输入
// root.methods.testpriAccount1 = function () {
//   this.pswConfirmPlaceholderShow = true
//
//   if (this.priAccount1 === '') {
//     this.nameMsg_0 = this.$t('enter')
//     return false
//   }
//
//   //如果既不是邮箱格式也不是手机格式
//   if (!this.$globalFunc.emailOrMobile(this.priAccount1)) {
//     this.nameMsg_0 = this.$t('register.userNameWA_0')
//     return false
//   }
//
//
//   this.nameMsg_0 = ''
//   return true
// }

// 判断路由是否为app
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
