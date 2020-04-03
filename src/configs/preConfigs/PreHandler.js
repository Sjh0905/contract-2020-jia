export default async function ($http, $store, $cookie, $i18n) {


  // function sleep(time) {
  //   return new Promise(function (resolve, reject) {
  //     setTimeout(resolve, time)
  //   })
  // }

  let isMobileFn = () => { //判断是否是手机的函数
    let ww = document.body.clientWidth
    if (ww <= 768) return true
    return false
  }


  let isAndroidFn = () => {  // 判断是否是安卓的函数
    if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) return false  //判断iPhone|iPad|iPod|iOS
    return true   // 非IOS
  }


  let isWeixin = () => { //判断是否是微信的函数
    let ua = navigator.userAgent.toLowerCase();
    if (ua.match(/MicroMessenger/i) == "micromessenger") return true  //判断是否为微信
    return false // 非微信
  }

  // 判断是否是手机
  let isMobile = isMobileFn()

  if (isMobile) {
    $store.commit('CHANGE_LANG', 'CH')
    $i18n.locale = 'CH'
  }
  $store.commit('changeIsMobile', isMobile)   // 是否是手机
  $store.commit('changeIsWeixin', isWeixin())  //是否是微信
  $store.commit('changeIsAndroid', isAndroidFn()) //是否是安卓


  // 请求是否登录
  function checkLogin() {
    return $http.send('CHECKLOGININ', {
      callBack: function (data) {
        typeof data === 'string' && (data = JSON.parse(data))
        if (data.result === 'FAIL' || data.errorCode) {
          let user_symbol = $cookie.get('unlogin_user_symbol_cookie') || 'ETH_USDT'
          $store.commit('SET_SYMBOL', user_symbol)     // 如果没有用户登录选择币对，则为ETH_USDT币对
          // $store.commit('SET_SYMBOL', 'GRC_USDT')     // 如果没有用户登录选择币对，则为GRC_USDT币对
          return
        }
        $store.commit('SET_AUTH_MESSAGE', data.dataMap.userProfile)
        // 判断用户登录后最后选择的币对
        let user_symbol = $cookie.get('user_symbol_cookie'), user_id = data.dataMap.userProfile.userId
        if (!!user_id && !!user_symbol && user_symbol.split('-')[0] == user_id) {
          $store.commit('SET_SYMBOL', user_symbol.split('-')[1])
          return
        }
        $store.commit('SET_SYMBOL', 'ETH_USDT')  // 如果没有用户登录选择币对，则为ETH_USDT币对
        // $store.commit('SET_SYMBOL', 'GRC_USDT')  // 如果没有用户登录选择币对，则为GRC_USDT币对
      },
      errorHandler: function (err) {
        let user_symbol = $cookie.get('unlogin_user_symbol_cookie') || 'ETH_USDT'
        // console.warn('出错', err)
        $store.commit('SET_SYMBOL', user_symbol)  // 如果没有用户登录选择币对，则为ETH_USDT币对
        // $store.commit('SET_SYMBOL', 'GRC_USDT')  // 如果没有用户登录选择币对，则为GRC_USDT币对
      }
    })
  }

  // 请求动态获取symbols
  function getCommonSymbols() {
    return $http.send('COMMON_SYMBOLS', {
      callBack: function (data) {
        console.warn('this is data', data)
        let quoteConfig = [], tradingParameters = [], reduce_fee = [], specialSymbol = [new Set()],
          marketList = [[], []];
        data.symbols.map(v => {
          quoteConfig.push({name: v.name, baseScale: v.baseScale, quoteScale: v.quoteScale});
          tradingParameters.push({
            name: v.name,
            maxAmount: v.maxAmount,
            sellAmount: v.sellAmount,
            miniVolume: v.miniVolume
          });
          reduce_fee.push({name: v.name, feeDiscount: v.feeDiscount});
          // 超级为蜜区
          let type = 0, marketName = v.name.split('_')[1]
          if (v.meta && v.meta.honeyArea == 'true') {
            specialSymbol[0].add(v.name)
            type = 1
          }
          // 设立市场专区
          !marketList[type] && (marketList[type] = [])
          if (marketList[type].indexOf(marketName) == -1) {
            marketList[type].push(marketName)
          }
        })

        $store.commit('SET_QUOTECONFIG', quoteConfig) // 精度
        $store.commit('SET_TRADING_PARAMETERS', tradingParameters) // 存储当前比对最小交易额和深度满值
        $store.commit('SET_REDUCE_FEE', reduce_fee);
        $store.commit('SAVE_SPECIAL_SYMBOL', specialSymbol)
        $store.commit('SET_MARKET_LIST', marketList)
      }
    })
  }

  // 获取服务器时间
  function getServerTime() {
    return $http.send('GET_SEVER_TIME', {
      callBack: function (data) {
        typeof data === 'string' && (data = JSON.parse(data))
        $store.commit('SET_SERVER_TIME', data)
      }
    })
  }


  await Promise.all([checkLogin(), getCommonSymbols(), getServerTime()]).then(res => {
    // console.warn('')
  }) // 请求同时发送 统一拦截


}


