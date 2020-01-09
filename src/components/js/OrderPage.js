import axios from "axios";

const root = {}
root.name = 'OrderPage'
root.components = {
  'Datepicker': resolve => require(['vuejs-datepicker'], resolve),
}

root.data = function () {
  return {
    startTime: new Date(),
    endTime: new Date(),



  }
}


root.created = function () {
  this.getUSDThl();
}

//  组件销毁
// _cc 组件销毁前清除获取汇率定时器
root.beforeDestroy = function () {
  // this.exchangeRateInterval && clearInterval(this.exchangeRateInterval)
}

root.methods = {}

//sss===

//获取USDT汇率
root.methods.getUSDThl = function(){
  // var doollar = localStorage.getItem("exchange_rate_dollar_usdt");
  // this.$store.commit('changeExchange_rate_dollar', doollar);
  // // 循环请求
  // this.exchangeRateInterval = setInterval(() => {
  //   axios('https://otc-api.huobi.co/v1/data/market/detail',{timeout: 50000}).then(({data}) =>{
  //     if(data.success){
  //       var detaildata = data.data.detail;
  //       detaildata.forEach((item) => {
  //         if(item.coinName == 'USDT'){
  //           this.$store.commit('changeExchange_rate_dollar', item.buy);
  //           localStorage.setItem("exchange_rate_dollar_usdt",item.buy);
  //         }
  //       })
  //     }else{
  //       this.dollar_usdt = localStorage.getItem("exchange_rate_dollar_usdt");
  //       this.$store.commit('changeExchange_rate_dollar',this.dollar_usdt);
  //     }
  //   }).catch(response =>{
  //     this.dollar_usdt = localStorage.getItem("exchange_rate_dollar_usdt");
  //     this.$store.commit('changeExchange_rate_dollar',this.dollar_usdt);
  //   })
  // }, 60000)
}


export default root
