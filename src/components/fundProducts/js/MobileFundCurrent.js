const root = {}
root.name = 'mobileFundCurrent'
/*------------------------------ 组件 ------------------------------*/
root.components = {
 'Loading': resolve => require(['../../vue/Loading.vue'], resolve),
}
/*------------------------------ data -------------------------------*/
root.data = function () {
  return {
    currentBuyList:[],
    limit:30,
    lastId:0,
    loading:true,
    ajaxWithdrawFlag:false,
    isShowGetMoreRecord:false
  }
}
/*------------------------------ 生命周期 -------------------------------*/
root.created = function () {
  if(this.$route.query.isApp) {
    window.postMessage(JSON.stringify({
        method: 'setTitle',
        parameters: '本期申购'
      })
    );
    window.postMessage(JSON.stringify({
      method: 'setH5Back',
      parameters: {
        canGoH5Back:true
      }
    }))
  }
  console.info('item=================',JSON.parse(this.$route.query.item))
  this.getTkfTickets()
}
root.mounted = function () {}
root.beforeDestroy = function () {

}
/*------------------------------ 计算 -------------------------------*/
root.computed = {}
// 检验是否是APP
root.computed.isApp = function () {
  return this.$route.query.isApp ? true : false
}
/*------------------------------ 观察 -------------------------------*/
root.watch = {}
/*------------------------------ 方法 -------------------------------*/
root.methods = {}
// 跳转上一级页面
root.methods.returnFundDetails = function () {
  history.go(-1)
}
root.methods.getTkfTickets = function () {
  if(this.ajaxWithdrawFlag===true)return
  let item =JSON.parse(this.$route.query.item)
  this.$http.send('GET_TKF_TICKETS',{
    bind:this,
    query:{
      projectId: item.projectId,
      period: item.period,
      currency:'USDT',
      limit:this.limit,
      id:this.lastId
    },
    callBack:this.re_getTkfTickets,
    errorHandler:this.error_getTkfTickets
  })
}
root.methods.re_getTkfTickets = function (data) {
  typeof (data)=='string'&& (data = JSON.parse(data))
  this.ajaxWithdrawFlag = false
  if (!data || data.dataMap.list.length === 0) {
    this.loading=false
    this.ajaxWithdrawFlag = true
    return
  }
  if (data.dataMap.list.length < this.limit){
    this.isShowGetMoreRecord = false
  } else {
    this.limit += 10;
  }
  console.info(data)
  this.currentBuyList = data.dataMap.list
  // this.ajaxWithdrawFlag = false
}
root.methods.error_getTkfTickets = function (err) {
}

// 格式化时间
root.methods.formatDateUitl = function (time) {
  return this.$globalFunc.formatDateUitl(time, 'MM-DD hh:mm:ss')
}
export default root
