const root = {}
root.name = 'mobileFundDetails'
/*------------------------------ 组件 ------------------------------*/
root.components = {
 'Loading': resolve => require(['../../vue/Loading.vue'], resolve),
}
/*------------------------------ data -------------------------------*/
root.data = function () {
  return {
    drawNumbers:[],
    prices:0,
    loading:true,
    // nonce1:'',
    nonce:'',
  }
}
/*------------------------------ 生命周期 -------------------------------*/
root.created = function () {
  if(this.$route.query.isApp) {
    window.postMessage(JSON.stringify({
        method: 'setTitle',
        parameters: '详情'
      })
    );
    window.postMessage(JSON.stringify({
      method: 'setH5Back',
      parameters: {
        canGoH5Back:true
      }
    }))
  }

  this.viewDetails()
}
root.mounted = function () {}
root.beforeDestroy = function () {}
/*------------------------------ 计算 -------------------------------*/
root.computed = {}
// 检验是否是APP
root.computed.isApp = function () {
  return this.$route.query.isApp ? true : false
}

root.computed.fundPeriods = function () {
  let item = JSON.parse(this.$route.query.item)
  return item || {}
}

/*------------------------------ 观察 -------------------------------*/
root.watch = {}
/*------------------------------ 方法 -------------------------------*/
root.methods = {}

// 查看详情接口
root.methods.viewDetails = function () {
  let item = JSON.parse(this.$route.query.item)
  this.$http.send('TKF_PREDICT_RECORD_DETAIL',{
    bind:this,
    params:{
      participateTime: item.purchaseTime,
      periodNumber: item.period,
      projectId: item.projectId,
      ticketStatus: item.status
    },
    callBack:this.re_viewDetails,
    errorHandler:this.error_viewDetails,
  })
}
root.methods.re_viewDetails = function (data) {
  typeof(data)=='string'&& (data=JSON.parse(data))
  if(!data)return
  this.drawNumbers = data.dataMap.presaleNo
  this.prices = data.dataMap.prices
  this.loading = false

  if(this.$route.query.selectedType != 1 && data.dataMap.nonce) {
    this.nonce = data.dataMap.nonce.substring(data.dataMap.nonce.length-3)
  }else {
    this.nonce = '未开奖'
  }
  // let disLength = this.nonce.length;
  // this.nonce1 = this.nonce.substring(disLength-3);
  // console.info('nonce1======',this.nonce1)
}
root.methods.error_viewDetails = function (err) {
  console.info(err)
}

// 返回基金资产页面
root.methods.returnMobileFundAssets  =function () {
  this.$router.push({name:'mobileFundAssets'})
}

// 跳转本期购买
root.methods.gotoFundCurrent  =function () {
  this.$router.push({name:'mobileFundCurrent',query:{selectedType:this.$route.query.selectedType,item:this.$route.query.item}})
}

// 格式化时间
root.methods.formatDateUitl = function (time) {
  return this.$globalFunc.formatDateUitl(time, 'YYYY-MM-DD hh:mm:ss')
}

export default root
