const root = {}
root.name = 'MobileBottleOpenerList'
/*------------------------------ 组件 ------------------------------*/
root.components = {
 // 'Loading': resolve => require(['../Loading/Loading.vue'], resolve),

}
/*------------------------------ data -------------------------------*/
root.data = function () {
  return {
    openerRecords:[],
  }
}
/*------------------------------ 生命周期 -------------------------------*/
root.created = function () {
  this.getRecords()
}
root.mounted = function () {}

root.beforeDestroy = function () {}
/*------------------------------ 计算 -------------------------------*/
root.computed = {}
// 检验是否是APP
root.computed.isApp = function () {
  return this.$route.query.isApp ? true : false
}
// 计算当前symbol
root.computed.symbol = function () {
  // console.warn('symbol',this.$store.state.symbol);
  return this.$store.state.symbol;
}
//不加下划线币对
root.computed.capitalSymbol = function () {
  return this.$globalFunc.toOnlyCapitalLetters(this.symbol);
}
/*------------------------------ 观察 -------------------------------*/
root.watch = {}
/*------------------------------ 方法 -------------------------------*/
root.methods = {}
// 返回
root.methods.jumpToTradingHallDetail = function () {
  this.$router.go(-1)
}

// 获取开平器列表
root.methods.getRecords = function () {
  this.$http.send('GET_ORDERS_GETRECORD', {
    bind: this,
    query: {
      symbol:this.capitalSymbol
    },
    callBack: this.re_getRecords,
    errorHandler: this.error_getRecords,
  })
}
root.methods.re_getRecords = function (data) {
  typeof(data) == 'string' && (data = JSON.parse(data));
  if(!data || !data.data) return
  this.openerRecords = data.data || []
}
// 获取订单出错
root.methods.error_getRecords = function (err) {
  console.warn("获取订单出错！")
}

/* -------------------- 开平器记录列表 begin-------------------- */
// 止盈计划
root.methods.stopProfit = function (item) {
  let stopProfitLong = item.stopProfitLong,
    stopProfitStepLong = item.stopProfitStepLong,
    profitIntervalLong = item.profitIntervalLong,

    stopProfitShort = item.stopProfitShort,
    stopProfitStepShort = item.stopProfitStepShort,
    profitIntervalShort = item.profitIntervalShort,

    openType = item.openType

  if(stopProfitLong) {
    if(openType=='LONG') {
      if(stopProfitStepLong){
        return '分步（' + stopProfitStepLong +'步/'+ profitIntervalLong+'点）'
      }
      return '全部'
    }
    if(openType=='SHORT') {
      return '--'
    }
    if(openType=='DUAL') {
      if(stopProfitStepLong){
        return '分步（' + stopProfitStepLong +'步/'+ profitIntervalLong+'点）'
      }
      return '全部'
    }
    if(openType=='STOP_MARKET') {
      if(stopProfitStepLong){
        return '分步（' +stopProfitStepLong +'步/'+ profitIntervalLong+'点）'
      }
      return '全部'
    }
  }

  if(stopProfitShort) {
    if(openType=='LONG') {
      return '--'
    }
    if(openType=='SHORT') {
      if(stopProfitStepShort) {
        return '分步（' + stopProfitStepShort + '步/' + profitIntervalShort + '点）'
      }
      return '全部'
    }
    if(openType=='DUAL') {
      if(stopProfitStepShort) {
        return '分步（' + stopProfitStepShort + '步/' + profitIntervalShort + '点）'
      }
      return '全部'
    }
    if(openType=='STOP_MARKET') {
      if(stopProfitStepShort) {
        return '分步（' + stopProfitStepShort + '步/' + profitIntervalShort + '点）'
      }
      return '全部'
    }
  }

  return '--'
}

// 止盈点数
root.methods.stopProfitPointe = function (item) {
  let stopProfitLong = item.stopProfitLong,

    stopProfitShort = item.stopProfitShort,

    openType = item.openType

  if(stopProfitLong) {
    if(openType=='LONG') {
      return stopProfitLong
    }
    if(openType=='SHORT') {
      return '--'
    }
    if(openType=='DUAL') {
      return stopProfitLong
    }
    if(openType=='STOP_MARKET') {
      return stopProfitLong
    }
  }

  if(stopProfitShort) {
    if(openType=='LONG') {
      return '--'
    }
    if(openType=='SHORT') {
      return stopProfitShort
    }
    if(openType=='DUAL') {
      return stopProfitShort
    }
    if(openType=='STOP_MARKET') {
      return stopProfitShort
    }
  }
  return '--'
}

// 止盈计划
root.methods.stopLoss = function (item) {
  let stopLossLong = item.stopLossLong,
    stopLossStepLong = item.stopLossStepLong,
    lossIntervalLong = item.lossIntervalLong,

    stopLossShort = item.stopLossShort,
    stopLossStepShort = item.stopLossStepShort,
    lossIntervalShort = item.lossIntervalShort,

    openType = item.openType

  if(stopLossLong) {
    if(openType=='LONG') {
      if(stopLossStepLong){
        return '分步（' + stopLossStepLong +'步/'+ lossIntervalLong+'点）'
      }
      return '全部'
    }
    if(openType=='SHORT') {
      return '--'
    }
    if(openType=='DUAL') {
      if(stopLossStepLong){
        return '分步（' + stopLossStepLong +'步/'+ lossIntervalLong+'点）'
      }
      return '全部'
    }
    if(openType=='STOP_MARKET') {
      if(stopLossStepLong){
        return '分步（' +stopLossStepLong +'步/'+ lossIntervalLong+'点）'
      }
      return '全部'
    }
  }

  if(stopLossShort) {
    if(openType=='LONG') {
      return '--'
    }
    if(openType=='SHORT') {
      if(stopLossStepShort) {
        return '分步（' + stopLossStepShort + '步/' + lossIntervalShort + '点）'
      }
      return '全部'
    }
    if(openType=='DUAL') {
      if(stopLossStepShort) {
        return '分步（' + stopLossStepShort + '步/' + lossIntervalShort + '点）'
      }
      return '全部'
    }
    if(openType=='STOP_MARKET') {
      if(stopLossStepShort) {
        return '分步（' + stopLossStepShort + '步/' + lossIntervalShort + '点）'
      }
      return '全部'
    }
  }

  return '--'
}

// 止损点数
root.methods.stopLossPoint = function (item) {
  let stopLossLong = item.stopLossLong,

    stopLossShort = item.stopLossShort,

    openType = item.openType

  if(stopLossLong) {
    if(openType=='LONG') {
      return stopLossLong
    }
    if(openType=='SHORT') {
      return '--'
    }
    if(openType=='DUAL') {
      return stopLossLong
    }
    if(openType=='STOP_MARKET') {
      return stopLossLong
      return '全部'
    }
  }

  if(stopLossShort) {
    if(openType=='LONG') {
      return '--'
    }
    if(openType=='SHORT') {
      return stopLossShort
    }
    if(openType=='DUAL') {
      return stopLossShort
    }
    if(openType=='STOP_MARKET') {
      return stopLossShort
    }
  }

  return '--'
}

// 止盈计划 双仓空仓
root.methods.stopProfitShort = function (item) {
  let stopProfitShort = item.stopProfitShort,
    stopProfitStepShort = item.stopProfitStepShort,
    profitIntervalShort = item.profitIntervalShort,

    openType = item.openType

  if(stopProfitShort) {
    if(openType=='DUAL') {
      if(stopProfitStepShort) {
        return '分步（' + stopProfitStepShort + '步/' + profitIntervalShort + '点）'
      }
      return '全部'
    }
    if(openType=='STOP_MARKET') {
      if(stopProfitStepShort) {
        return '分步（' + stopProfitStepShort + '步/' + profitIntervalShort + '点）'
      }
      return '全部'
    }
  }

  return '--'
}

// 止盈点数 双仓空仓
root.methods.stopProfitPointeShort = function (item) {
  let stopProfitLong = item.stopProfitLong,

    stopProfitShort = item.stopProfitShort,

    openType = item.openType

  if(stopProfitShort && (openType=='DUAL' || openType=='STOP_MARKET')) {
    return stopProfitShort
  }
  return '--'
}

// 止损计划 双仓空仓
root.methods.stopLossShort = function (item) {
  let stopLossShort = item.stopLossShort,
    stopLossStepShort = item.stopLossStepShort,
    lossIntervalShort = item.lossIntervalShort,

    openType = item.openType

  if(stopLossShort) {
    if(openType=='DUAL' || openType=='STOP_MARKET') {
      if(stopLossStepShort) {
        return '分步（' + stopLossStepShort + '步/' + lossIntervalShort + '点）'
      }
      return '全部'
    }
  }
    // if(openType=='STOP_MARKET') {
    //   if(stopLossStepShort) {
    //     return '分步（' + stopLossStepShort + '步/' + lossIntervalShort + '点）'
    //   }
    //   return '全部'
    // }
  return '--'
}

// 止损点数 双仓空仓
root.methods.stopLossPointShort = function (item) {
  let stopLossShort = item.stopLossShort,
    openType = item.openType

  if(stopLossShort || (openType=='DUAL' || openType=='STOP_MARKET')) {
    return stopLossShort
  }
  return '--'
}
/* -------------------- 开平器记录列表 end -------------------- */


// // 单仓止盈
// root.methods.stepOrallTakeProfit = function (item) {
//   if(item.openType=='LONG' && item.stopProfitLong){
//     if(!item.stopProfitStepLong){
//       return '全部'
//     }
//     if(item.stopProfitStepLong){
//       return '分步（' +item.stopProfitStepLong +'步/'+ item.profitIntervalLong+'点）'
//     }
//   }
//   if(item.openType=='SHORT' && item.stopProfitShort){
//     if(!item.stopProfitStepShort){
//       return '全部'
//     }
//     if(item.stopProfitStepShort) {
//       return '分步（' + item.stopProfitStepShort + '步/' + item.profitIntervalShort + '点）'
//     }
//   }
//   return '--'
// }
// // 单仓止损
// root.methods.stepOrallLoss = function (item) {
//   if(item.openType =='LONG' && item.stopLossLong){
//     if(!item.stopLossStepLong){
//       return '全部'
//     }
//     if(item.stopLossStepLong) {
//       return '分步（' + item.stopLossStepLong + '步/' + item.lossIntervalLong + '点）'
//     }
//   }
//   if(item.openType=='SHORT' && item.stopLossShort){
//     if(!item.stopLossStepShort){
//       return '全部'
//     }
//     if(item.stopLossStepShort) {
//       return '分步（' + item.stopLossStepShort + '步/' + item.lossIntervalShort + '点）'
//     }
//   }
//   return '--'
// }
// // 双仓多仓止盈计划
// root.methods.profitLong = function (item) {
//   if(item.openType=='DUAL' && item.stopProfitLong){
//     if(!item.stopProfitStepLong){
//       return '全部'
//     }
//     if(item.stopProfitStepLong) {
//       return '分步（' + item.stopProfitStepLong + '步/' + item.profitIntervalLong + '点）'
//     }
//   }
//   return '--'
// }
// // 双仓多仓止损计划
// root.methods.lossLong = function (item) {
//   if(item.openType=='DUAL' && item.stopLossLong){
//     if(!item.stopLossStepLong){
//       return '全部'
//     }
//     if(item.stopLossStepLong){
//       return '分步（' +item.stopLossStepLong+'步/'+ item.lossIntervalLong+'点）'
//     }
//   }
//   return '--'
// }
// // 双仓空仓止盈计划
// root.methods.profitEmptyShort = function (item) {
//   if(item.openType=='DUAL' && item.stopProfitShort){
//     if(!item.stopProfitStepShort){
//       return '全部'
//     }
//     if(item.stopProfitShort && item.stopProfitStepShort) {
//       return '分步（' + item.stopProfitStepShort + '步/' + item.profitIntervalShort + '点）'
//     }
//   }
//   return '--'
// }
// 双仓kong仓止损计划
// root.methods.lossEmptyShort = function (item) {
//   if(item.openType=='DUAL' && item.stopLossShort){
//     if(item.stopLossShort && !item.stopLossStepShort){
//       return '全部'
//     }
//     if(item.stopLossShort && item.stopLossStepShort){
//       return '分步（' +item.stopLossStepShort+'步/'+ item.lossIntervalShort+'点）'
//     }
//   }
//   return '--'
// }

/*---------------------- 格式化时间 begin ---------------------*/
// 年月日
root.methods.formatDateUitl = function (time) {
  return this.$globalFunc.formatDateUitl(time, 'YYYY-MM-DD')
}
// // 时分秒
root.methods.formatDateUitlHms = function (time) {
  return this.$globalFunc.formatDateUitl(time, 'hh:mm:ss')
}
/*---------------------- 格式化时间 end ---------------------*/

export default root
