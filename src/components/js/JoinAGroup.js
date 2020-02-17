const root = {}
root.name = 'JoinAGroup'
/*------------------------------ 组件 ------------------------------*/
//root.components = {
//  'Loading': resolve => require(['../Loading/Loading.vue'], resolve),
//}
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
/*------------------------------ 观察 -------------------------------*/
root.watch = {}
root.watch.searchCities = function(v){
  console.log(v)
  // console.log(this.changeInputValue)
  // console.log(this.computedMarketList.name )
  // console.log('this.searchList====111',this.searchList)
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
    "gname": "zanwushuju"
  }])
  return this.cityList;
}

/*------------------------------ 方法 -------------------------------*/
root.methods = {}

//查询组详情get (query:{})
root.methods.getCheckGroupDetails= function () {
  this.$http.send('GET_QUERYGROUPINFO', {
    bind: this,
    query:{
      groupId:this.groupId
    },
    callBack: this.re_getCheckGroupDetails,
    errorHandler: this.error_getCheckGroupDetails
  })
}
root.methods.re_getCheckGroupDetails = function (data) {

  //检测data数据是JSON字符串转换JS字符串
  // typeof data === 'string' && (data = JSON.parse(data))

  data = {
    "data": {
      "deputyAccount": "yx.318@qq.cn",
      "priAccount": "1835807299@qq.com",
      "groupId": "2",
      "glevel": "1",
      "commonDiscount": "0.001",
      "quantDiscount": "0.001",
      "gname": "战狼2"
    },
    "status": "200",
    "message": "success"
  }
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
  this.$http.send('POST_ASSEMBLE_JOINGROUP', {
    bind: this,
    params:{},
    callBack: this.re_postJoinGroup,
    errorHandler: this.error_postJoinGroup
  })
}
root.methods.re_postJoinGroup = function (res) {
  console.log("this.res=====",res)
}
root.methods.error_postJoinGroup = function (err) {
  console.log("this.err=====",err)
}

//模糊查询可加入小组get (query:{})
root.methods.getFuzzyQuery= function () {
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
  // typeof data === 'string' && (data = JSON.parse(data))

  data = {
    "data": [
    {
      "groupId": "1",
      "gname": "战狼"
    },
    {
      "groupId": "2",
      "gname": "战狼2"
    }
  ],
    "status": "200",
    "message": "success"
  }
  console.log("this.res=====",data)
  this.cities = data.data
  console.log('this.getFuzzyQuery',this.getFuzzyQuery)
}

root.methods.error_getFuzzyQuery = function (err) {
  console.log("this.err=====",err)
}

//返回后端的数据
root.methods.clickItem = function(id){
  console.log("clickItem id",id)
  this.$store.commit('GET_QUERYGROUPLIST',id);
  // this.groupId = id

  window.history.go(-1)
}

root.methods.createGroupType = function () {
  this.$router.push({name: 'detailsOfTheGroup'})
}


export default root
