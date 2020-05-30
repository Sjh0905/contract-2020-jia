const root = {}
root.name = 'mobileFundProducts'
/*------------------------------ 组件 ------------------------------*/
root.components = {
  'Loading': resolve => require(['../../vue/Loading'], resolve),
}
/*------------------------------ data -------------------------------*/
root.data = function () {
  return {
    loading:true,
    recordType: 0,// 0是拔头筹 1是群雄起 2是步步高 3是天下同
    firstList:{},  // 拔头筹
    periodList:[],  //  拔头筹
    periodList1:{},  //  拔头筹
    secondList:{},  // 群雄起
    periodListQ:[],  // 群雄起
    periodListQ1:{},  // 群雄起
    thirdList:{},  //  步步高
    thirdListB:[],  //  步步高
    thirdListB1:{},  //  步步高
    fourthList:{},  // 天下同
    fourthListT:[],  // 天下同
    fourthListT1:{},  // 天下同


    copies1:1,

  }
}
/*------------------------------ 生命周期 -------------------------------*/
root.created = function () {
  this.getProductList()
  // console.info('this.this.$route.query.item=====',this.$route.query.item)

}
root.mounted = function () {}
root.beforeDestroy = function () {}
/*------------------------------ 计算 -------------------------------*/
root.computed = {}
root.computed.isLogin = function () {
  return this.$store.state.isLogin;
}

root.computed.userId = function () {
  return this.$store.state.authMessage.userId ? this.$store.state.authMessage.userId : 0
}

// 检验是否是ios
root.computed.iosQuery = function () {
  return this.$route.query.isIOS
}

// 检验ios是否登录
root.computed.iosLogin = function () {
  return this.$route.query.iosLogin
}

// 获取屏幕宽度
root.computed.windowWidth = function () {
  return window.innerWidth
}

//拔头筹
root.computed.computedFirstList = function () {
  return this.FirstList
}
root.computed.computedPeriodList = function () {
  return this.periodList
}




// 群雄起
root.computed.computedSecondList = function (item,index) {
  return this.secondList
}
root.computed.computedPeriodListQ = function () {
  return this.periodListQ
}


// 步步高
root.computed.computedThirdList = function (item,index) {
  return this.thirdList
}
root.computed.computedThirdListB = function (item,index) {
  return this.thirdListB
}
// 天下同
root.computed.computedFourthList = function (item,index) {
  return this.fourthList
}

root.computed.computedFourthList = function (item,index) {
  return this.fourthListT
}
/*------------------------------ 观察 -------------------------------*/
root.watch = {}
/*------------------------------ 方法 -------------------------------*/
root.methods = {}

// 点击切换页签
root.methods.changeTag = function (n) {
  if (parseInt(n) === this.recordType) return
  this.recordType = parseInt(n)
}
root.methods.goToPurchase = function(id,currency,item) {
  this.$router.push({'path':'/index/mobileFundBuy',query:{id:id, currency:currency,item:item}})
}

root.methods.goToPurchase1 = function(id,currency,item) {
  // this.$router.push({'path':'/index/mobileFundBuy',query:{firstList:fourthList,item:item}})
  this.$router.push({'path':'/index/mobileFundBuy',query:{id:id, currency:currency, item:item}})
}

root.methods.goToPurchase2 = function(id,currency,item) {
  this.$router.push({'path':'/index/mobileFundBuy',query:{id:id, currency:currency,item:item}})
}

root.methods.goToPurchase3 = function(id,currency,item) {
  this.$router.push({'path':'/index/mobileFundBuy',query:{id:id, currency:currency,item:item}})
}

// 产品列表get
root.methods.getProductList = function () {
  this.$http.send('GET_PROJECT_LIST', {
    bind: this,
    callBack: this.re_getProductList,
    errorHandler: this.error_getProductList
  })
}
// 产品列表get返回
root.methods.re_getProductList = function (data) {
  typeof data === 'string' && (data = JSON.parse(data))

  this.loading = false
  this.firstList = data.dataMap.firstList  //拔头筹
  this.periodList = data.dataMap.firstList.periodList  //拔头筹份额
  this.periodList1 = JSON.parse(data.dataMap.firstList.periodList[0].extra);


  this.secondList = data.dataMap.secondList//群雄起
  this.periodListQ = data.dataMap.secondList.periodList  //群雄起
  this.periodListQ1 = JSON.parse(data.dataMap.secondList.periodList[0].extra)//群雄起


  this.thirdList = data.dataMap.thirdList    // 步步高
  this.thirdListB = data.dataMap.thirdList.periodList   // 步步高
  this.thirdListB1 = JSON.parse(data.dataMap.thirdList.periodList[0].extra)   // 步步高


  this.fourthList = data.dataMap.fourthList//天下同
  this.fourthListT = data.dataMap.fourthList.periodList//天下同
  this.fourthListT1 = JSON.parse(data.dataMap.fourthList.periodList[0].extra)//天下同

}
// 产品列表get出错
root.methods.error_getProductList = function (err) {
  // console.warn('获取err出错', err)
}



export default root
