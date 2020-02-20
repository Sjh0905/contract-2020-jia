const root = {}
root.name = 'JoinAGroup'
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
    //团长账号
    priAccount:'',
    //组ID
    // groupId:'',
    //组等级
    glevel:'0',
    //量化区手续费折扣
    commonDiscount:'',
    //普通区手续费折扣
    quantDiscount:'',
    //组名
    gname:'',

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
  }
}
/*------------------------------ 生命周期 -------------------------------*/
root.created = function () {
  this.getCheckGroupDetails()
  this.getFuzzyQuery()
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
    this.cityList = this.cities.filter(v=>v.gname.includes(this.searchCities)
      || v.gname.includes(this.searchCities)
      || v.gname.includes(this.searchCities.toUpperCase())
    )
  }

  //是数字的时候搜索areaCode
  if(!isNaN(this.searchCities)){
    this.cityList = this.cities.filter(v=>v.gname.includes(this.searchCities))
  }

  this.cityList.length == 0 && (this.cityList = [{
    "groupId": "-1",
    "gname": "暂无数据"
  }])
  return this.cityList;
}

/*------------------------------ 方法 -------------------------------*/
root.methods = {}

//查询组详情get (query:{})
root.methods.getCheckGroupDetails= function (groupId) {

  /*TODO : 调试接口需要屏蔽 S*/
  var data = {
    "data": {
      "deputyAccount": "yx.318@qq.cn",
      "priAccount": "1835807299@qq.com",
      "groupId": "1",
      "glevel": "1",
      "commonDiscount": "0.001",
      "quantDiscount": "0.001",
      "gname": "战狼1"
    },
    "status": "200",
    "message": "success"
  }
  var data2 = {
    "data": {
      "deputyAccount": "yx.318@qq.cn",
      "priAccount": "122222@qq.com",
      "groupId": "2",
      "glevel": "2",
      "commonDiscount": "0.002",
      "quantDiscount": "0.002",
      "gname": "战狼2"
    },
    "status": "200",
    "message": "success"
  }
  var data3 = {
    "data": {
      "deputyAccount": "yx.318@qq.cn",
      "priAccount": "1000000000@qq.com",
      "groupId": "3",
      "glevel": "3",
      "commonDiscount": "0.003",
      "quantDiscount": "0.003",
      "gname": "jiajia"
    },
    "status": "200",
    "message": "success"
  }
  if(data.data.groupId == groupId ){
    this.re_getCheckGroupDetails(data);
  }
  if(data2.data.groupId == groupId){
    this.re_getCheckGroupDetails(data2);
  }
  if(data3.data.groupId == groupId){
    this.re_getCheckGroupDetails(data3);
  }
  /*TODO : 调试接口需要屏蔽 E*/

  this.$http.send('GET_QUERYGROUPINFO', {
    bind: this,
    query:{
      groupId:groupId
    },
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

}
root.methods.error_getCheckGroupDetails = function (err) {
  console.log("this.err=====",err)
}

//加入拼团post(params:{})
root.methods.postJoinGroup = function () {
  // TODO : 加变量的非空判断 正则判断
  let params = {
    userId: this.uuid,
    groupId: this.groupId,
    glevel: this.glevel,
    account: this.userName
  }
  console.log("postJoinGroup + params ===== ",params)
  /* TODO : 调试接口需要屏蔽 S*/
  this.re_postJoinGroup({
      "data": {
        "success": true
      },
      "status": "200",
      "message": "success"
    })
  /* TODO : 调试接口需要屏蔽 E*/
  this.$http.send('POST_ASSEMBLE_JOINGROUP', {
    bind: this,
    params:params,
    callBack: this.re_postJoinGroup,
    errorHandler: this.error_postJoinGroup
  })
}
root.methods.re_postJoinGroup = function (data) {
  typeof data === 'string' && (data = JSON.parse(data))
  this.success = data.data.success
  console.log("re_postJoinGroup + data=====",data)
  if (this.success == true) {
    // this.$router.push({name: 'detailsOfTheGroup',query:{groupId:this.groupId , gname: this.gname}} )
    this.$router.push({name: 'detailsOfTheGroup'} )

  }
  if (this.success == false) {
    this.popOpen = true
    this.popType = 0
    this.popText = this.$t('popText')
    setTimeout(() => {
      this.popOpen = true
    }, 100)}
}
root.methods.error_postJoinGroup = function (err) {
  console.log("this.err=====",err)
}

//模糊查询可加入小组get (query:{})
root.methods.getFuzzyQuery= function () {
  /* TODO : 调试接口需要屏蔽 S*/
  var data = {
    "data": [
      {
        "groupId": "1",
        "gname": "战狼1"
      },
      {
        "groupId": "2",
        "gname": "战狼2"
      },
      {
        "groupId": "3",
        "gname": "jiajia"
      }
    ],
    "status": "200",
    "message": "success"
  }

  this.re_getFuzzyQuery(data)

  /* TODO : 调试接口需要屏蔽 E*/
  this.$http.send('GET_QUERYGROUPLIST', {
    bind: this,
    query:{
      gname: this.gname
    },
    callBack: this.re_getFuzzyQuery,
    errorHandler: this.error_getFuzzyQuery
  })
}

root.methods.re_getFuzzyQuery = function (data) {
  //检测data数据是JSON字符串转换JS字符串
  typeof data === 'string' && (data = JSON.parse(data))

  // data = {
  //   "data": [
  //   {
  //     "groupId": "1",
  //     "gname": "战狼"
  //   },
  //   {
  //     "groupId": "2",
  //     "gname": "战狼2"
  //   },
  //     {
  //       "groupId": "3",
  //       "gname": "佳佳"
  //     }
  // ],
  //   "status": "200",
  //   "message": "success"
  // }
  console.log("this.res=====",data)
  this.cities = data.data
  this.citiesMap = {}
  this.cities.map(v=>this.citiesMap[v.gname] = v.groupId)
  console.log('this.getFuzzyQuery',this.getFuzzyQuery)
}

root.methods.error_getFuzzyQuery = function (err) {
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

export default root
