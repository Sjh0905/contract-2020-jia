import echarts from 'echarts/lib/echarts'
import 'echarts/lib/chart/pie'

const root = {}
root.name = 'AssetOverview'


/*-------------------------- 组件 begin ---------------------------*/

root.components = {
  'Loading': resolve => require(['../vue/Loading'], resolve),
}


/*-------------------------- data ---------------------------*/

root.data = function () {
  return {
    loading: true,
    // total: 0, //总资产

    seriesData: [],
    myChart: null,
    chartList: [],

    accounts: [], // 账户信息

    chartData: [], //图表数据
    originalData: [],//表单数据

    priceReady: false,//已经获得价格
    accountReady: false,//已经拿到用户,
    initReady: false,

    showAsset: false,

    initData: {},
  }
}


/*-------------------------- 生命周期 begin ---------------------------*/


root.created = function () {
  // 接收socket
  // 如果没有登录
  if (!this.$store.state.authMessage.userId) {
    this.loading = false
    return
  }
  this.getPrice()
  this.getCurrencyAndAccount()
  this.getInitData()
}
// 挂载后
root.mounted = function () {
  this.printChart()
}


/*-------------------------- 计算 begin ---------------------------*/

root.computed = {}
// 观测currency是否发生变化
root.computed.watchCurrency = function () {
  return this.$store.state.currencyChange
}
// 获取当前货币对
root.computed.symbol = function () {
  return this.$store.state.symbol.split('_')[0]
}
// 基础货币
root.computed.baseCurrency = function () {
  return this.$store.state.baseCurrency
}
// 获取语言
root.computed.lang = function () {
  return this.$store.state.lang
}
// 显示总资产
root.computed.showTotal = function () {
  if (!this.showAsset) {
    return this.toFixed(this.total, 8)
  }
  return `---------`
}
// 是否登录
root.computed.isLogin = function () {
  return this.$store.state.isLogin
}

// 账户总资产
root.computed.total = function () {
  let total = 0
  for (let i = 0; i < this.accounts.length; i++) {
    total = this.accAdd(total, this.accounts[i].appraisement)
  }
  return this.toFixed(total)
}


/*-------------------------- 观察 begin ---------------------------*/

root.watch = {}
// currency发生变化则更改估值！
root.watch.watchCurrency = function () {
  this.accounts = [...this.$store.state.currency.values()]
  this.changeChartData()
}
// 观察是否更改货币对
root.watch.symbol = function () {
  this.accounts = [...this.$store.state.currency.values()]
  this.changeChartData()
}
// 更改语言要变文字
root.watch.lang = function () {
  this.myChart && this.myChart.setOption({
    series: {
      name: this.$t('assetOverview.assetOverview'),
    }
  })
}

// 观察是否登录
root.watch.isLogin = function () {
  if (!this.isLogin) {
    return
  }
  this.getPrice()
  this.getCurrencyAndAccount()
  this.getInitData()
}


/*-------------------------- 方法 begin ---------------------------*/


root.methods = {}

// 获取初始data
root.methods.getInitData = function () {
  this.$http.send('MARKET_PRICES', {
    bind: this,
    callBack: this.re_getInitData,
    errorHandler: this.error_getInitData
  })
}
// 返回初始data
root.methods.re_getInitData = function (data) {
  typeof data === 'string' && (data = JSON.parse(data))
  // console.warn('获取了初始化数据', data)

  this.initData = data
  this.initReady = true
  this.loading = !(this.accountReady && this.initReady)
  this.$store.commit('CHANGE_PRICE_TO_BTC', data)
}
// 获取data出错
root.methods.error_getInitData = function (err) {
  // console.warn('获取err出错', err)
}

// 获取币种和账户
root.methods.getCurrencyAndAccount = function () {
  let currency = [...this.$store.state.currency.values()]
  if (currency.length === 0) {
    // 先获取币种
    this.getCurrency()
    return
  }
  // 再获取账户
  this.getAccounts()
}

// 获取币种
root.methods.getCurrency = function () {
  this.$http.send("GET_CURRENCY", {
    bind: this,
    callBack: this.re_getCurrency,
    errorHandler: this.error_getCurrency
  })
}

// 获取币种回调
root.methods.re_getCurrency = function (data) {
  typeof (data) === 'string' && (data = JSON.parse(data))
  if (!data.dataMap || !data.dataMap.currencys) {
    // console.warn("拿回了奇怪的东西！", data)
    return
  }
  this.$store.commit('CHANGE_CURRENCY', data.dataMap.currencys)
  // 获取账户信息
  this.getAccounts()
}
// 获取币种出错
root.methods.error_getCurrency = function (err) {
  // console.warn('获取币种列表出错！')
}

// 获取账户信息
root.methods.getAccounts = function () {
  // 请求各项估值
  this.$http.send('RECHARGE_AND_WITHDRAWALS_RECORD', {
    bind: this,
    callBack: this.re_getAccount,
    errorHandler: this.error_getAccount
  })
}

// 获取账户信息回调
root.methods.re_getAccount = function (data) {
  typeof (data) === 'string' && (data = JSON.parse(data))
  if (!data || !data.accounts) {
    // console.warn("拿回了奇怪的东西！", data)
    return
  }
  this.$store.commit('CHANGE_ACCOUNT', data.accounts)
  this.accountReady = true
  this.loading = !(this.accountReady && this.initReady)
}

// 获取账户信息出错
root.methods.error_getAccount = function (err) {
  // console.warn('获取账户信息出错')
}


// 通过socket获取价格
root.methods.getPrice = function () {
  this.$socket.on({
    key: 'topic_prices',
    bind: this,
    callBack: this.re_getPrice
  })
}

// 通过socket获取价格的回调
root.methods.re_getPrice = function (data) {
  typeof (data) === 'string' && (data = JSON.parse(data))
  if (!data) return
  this.priceReady = true
  this.$store.commit('CHANGE_PRICE_TO_BTC', data)
}


// 更改表单数据！
root.methods.changeChartData = function () {
  // 如果没有数据或者price没有
  if (this.loading || !this.isLogin) return

  let currency = [...this.$store.state.currency.values()]

  if (currency.length === 0) {

    // 显示一张灰饼
    this.myChart && this.myChart.setOption({
      series: [{
        data: [
          {
            value: 0,
            name: '',
            itemStyle: {
              normal:
                {
                  color: '#cccccc',
                  labelLine: {
                    show: false
                  }
                }
            }
          }
        ],
      }],

    })
    // 返回
    return
  }

  let data = []

  for (let i = 0; i < this.accounts.length; i++) {
    data.push({
      name: this.accounts[i].currency,
      value: this.accounts[i].appraisement,
      itemStyle: {
        normal:
          {color: this.accounts[i].currency !== this.symbol ? '#cccccc' : '#C43E4E'}
      }
    })
  }


  data.sort((a, b) => {
    return b.value - a.value
  })

  let targetObj = null
  let other = {
    name: this.$t('assetOverview.other'),
    value: 0,
    itemStyle: {
      normal: {
        color: '#cccccc'
      }
    }
  }

  for (let i = data.length - 1; i >= 4; i--) {
    if (data[i].name === this.symbol) {
      targetObj = data[i]
      continue
    }
    other.value += data[i].value
  }

  let currencyLength = data.length
  data = data.slice(0, 4)
  targetObj && data.push(targetObj)
  !(targetObj && currencyLength === 5) && data.push(other)

  this.chartData = data
  this.myChart && this.myChart.setOption({
    series: [
      {
        data: data,
        itemStyle: {
          normal: {
            borderWidth: 1,
            borderColor: '#ffffff',
            labelLine: {
              show: true
            }
          }
        },
      }]
  })
}


root.methods.printChart = function () {

  this.myChart = echarts.init(this.$refs.echarts_container)

  this.myChart && this.myChart.setOption(
    {
      title: {
        text: '',
        subtext: '',
        x: 'center'
      },
      left: 'center',
      top: 0,
      tooltip: {},
      legend: {},
      toolbox: {
        show: false,
        feature: {
          mark: {show: true},
          dataView: {show: true, readOnly: false},
          magicType: {
            show: true,
            type: ['pie', 'funnel'],
            option: {
              funnel: {
                x: '25%',
                width: '50%',
                funnelAlign: 'left',
                max: 1548
              }
            }
          },
          restore: {show: false},
          saveAsImage: {show: false}
        }
      },
      calculable: false,
      series: [
        {
          name: this.$t('assetOverview.assetOverview'),
          type: 'pie',
          radius: '60%',
          center: ['50%', '50%'],
          data: [
            {
              value: 0,
              name: '',
              itemStyle: {
                normal:
                  {
                    color: '#cccccc',
                    labelLine: {
                      show: false
                    },
                    borderWidth: 0,

                  }
              }
            }],
          itemStyle: {
            normal: {
              // borderWidth: 1,
              borderColor: '#ffffff',
              labelLine: {
                show: false
              }
            }
          }

        }
      ],
    }
  )
}

// 打开资产显示
root.methods.openAssets = function () {
  this.showAsset = !this.showAsset
}

/*---------------------- 保留小数 begin ---------------------*/
root.methods.toFixed = function (num, acc = 8) {
  return this.$globalFunc.accFixed(num, acc)
}
/*---------------------- 保留小数 end ---------------------*/

/*---------------------- 加法运算 begin ---------------------*/
root.methods.accAdd = function (num1, num2) {
  return this.$globalFunc.accAdd(num1, num2)
}
/*---------------------- 加法运算 end ---------------------*/

/*---------------------- 减法运算 begin ---------------------*/
root.methods.accMinus = function (num1, num2) {
  return this.$globalFunc.accMinus(num1, num2)
}
/*---------------------- 减法运算 end ---------------------*/

/*---------------------- 乘法运算 begin ---------------------*/
root.methods.accMul = function (num1, num2) {
  return this.$globalFunc.accMul(num1, num2)
}
/*---------------------- 乘法运算 end ---------------------*/

/*---------------------- 除法运算 begin ---------------------*/
root.methods.accDiv = function (num1, num2) {
  return this.$globalFunc.accDiv(num1, num2)
}
/*---------------------- 除法运算 end ---------------------*/


// root.methods.RE_ACCOUNTS = function (data) {
//   console.warn("why")
//   console.log('RE_ACCOUNTS ======', data.accounts)
//
//   var arr = data.accounts;
//   var arr2 = [];
//   var arr3 = [];
//
//   arr.map(v => arr3.indexOf(v.currency) === -1 && arr2.push({currency: v.currency || ""}) && arr3.push(v.currency));
//   console.log(arr2, arr3)
//   var [newArr, tmpArr] = [[], []];
//   newArr = arr2.map((v) => {
//     tmpArr = [];
//     tmpArr = arr.filter(va => va.currency === v.currency)
//     tmpArr.map((va) => {
//       v.balance = v.balance + va.balance || va.balance || 0
//     });
//     return v;
//   });
//
//
//   console.log(newArr);
//
//   newArr.sort((v, v1) => v1.balance - v.balance)
//
//
//   newArr.forEach(
//     (v, index) => {
//       index && (v.itemStyle = {normal: {color: '#cccccc'}}) || (v.itemStyle = {normal: {color: '#C43E4E'}})
//       v.name = v.currency
//       v.value = v.balance
//       delete (v.currency)
//       delete (v.balance)
//     }
//   )
//
//   if (newArr.length > 4) {
//     newArr[4].name = '其他'
//
//     for (let i = newArr.length - 1; i > 4; i--) {
//       newArr[4].value += newArr[i].value
//     }
//
//     var newArr_ = newArr.slice(0, 5)
//
//   }
//
//   console.log(newArr_, 'newArr====')
//
//
//   this.seriesData = newArr_
//
//
//   // this.seriesData = [{value: 335, name: 'BDB', itemStyle: {normal: {color: '#C43E4E'}}},
//   // 	{value: 310, name: 'BTC', itemStyle: {normal: {color: '#cccccc'}}},
//   // 	{value: 234, name: 'BTCE', itemStyle: {normal: {color: '#cccccc'}}},
//   // 	{value: 135, name: 'BTC', itemStyle: {normal: {color: '#cccccc'}}},
//   // 	{value: 1548, name: '其他', itemStyle: {normal: {color: '#cccccc'}}}]
//
//   this.myChart = echarts.init(this.$refs.echarts_container)
//
//   this.myChart.setOption(
//     {
//       title: {
//         text: '',
//         subtext: '',
//         x: 'center'
//       },
//       left: 'center',
//       top: 0,
//       tooltip: {},
//       legend: {
//         // orient: 'horizontal',
//         // x: 'left',
//         // data: [this.$t("assetOverview.other"), this.$t("assetOverview.BDB"), 'BTC', 'BTCE', 'BTC']
//       },
//       toolbox: {
//         show: false,
//         feature: {
//           mark: {show: true},
//           dataView: {show: true, readOnly: false},
//           magicType: {
//             show: true,
//             type: ['pie', 'funnel'],
//             option: {
//               funnel: {
//                 x: '25%',
//                 width: '50%',
//                 funnelAlign: 'left',
//                 max: 1548
//               }
//             }
//           },
//           restore: {show: false},
//           saveAsImage: {show: false}
//         }
//       },
//       calculable: false,
//       series: [
//         {
//           name: this.$t('assetOverview.assetOverview'),
//           type: 'pie',
//           radius: '60%',
//           center: ['50%', '50%'],
//           data: [...this.seriesData],
//           itemStyle: {
//             normal: {
//               borderWidth: 1,
//               borderColor: '#ffffff',
//             }
//           }
//         }
//       ]
//     }
//   )
//
//
// }


export default root
