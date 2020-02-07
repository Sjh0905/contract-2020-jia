const store = {}
/**
 * 判断是否为手机端
 */

import GlobalFunc from '../globalFunctionConfigs/GlobalFunction'


store.state = {}

// 存储cookie
store.state.save_cookie = ''

// 接口前缀
store.state.urlHead = '/apis'

// 静态页地址
store.state.static_url = process.env.STATIC_URL || 'http://static.2020.exchange'

//GRC活动地址
store.state.GRC_URL = process.env.GRC_URL || 'https://build.2020.exchange/events/grc-token-mining'
// store.state.GRC_URL = 'https://build.highdefi.com/events/grc-token-mining'  // TODO:生产打版需要屏蔽掉

// 美金汇率 2018-07-17
store.state.exchange_rate_dollar = 7.02

store.state.isLogin = false

// ios的cookie
store.state.iosCookie = ''

store.state.isMobile = ''

store.state.isWeixin = ''

store.state.isAndroid = ''

store.state.price = {}

// 是否免费
store.state.reduce_fee = [];

//是否是加入我们页面
store.state.joinus = false;

// 主题颜色 深色=0  浅色=1
store.state.themeColor = 1

// 控制隐藏显示
store.state.downloadShow=true,

/**
 * 用户的id！注意，这里要非常注意
 * @type {string}
 */
store.state.idCode = ''
/**
 * 用户的姓名！注意，这里要非常注意
 * @type {string}
 */
store.state.name = ''


/**
 * 手机端顶部标题
 */

store.state.mobileHeaderTitle = ''

/**
 * 顶部小红点的参数
 */

store.state.noticeRedPoint = false

/**
 * 手机端顶部传的参数
 */

store.state.mobileHeaderPriceTitle = ''

/**
 * 手机端点击充值提现记录
 */

store.state.mobileRechargeRecordData = ''

/**
 * 手机端交易大厅开关
 */

store.state.mobileTradingHallFlag = false

/**
 * 语言
 * @type {string}
 */
store.state.lang = 'CA'
store.state.langZendeskObj = {
  'CH':'zh-cn',
  'EN':'en-US',
  'CA':'en-US',
  'CHT':'zh-tw',
  'KOR':'ko',
  'JP':'ja'
}
/**
 * 存储当前币对最小交易额和深度图满条值
 */
store.state.tradingParameters = []

/**
 *
 * @type {Array}
 */
store.state.GRCPriceRange = []

/**
 * 身份信息
 * @type {{userId: string, city: string, country: string, createdAt: string, email: string, id: string, idCode: string, name: string, province: string, street: string, updatedAt: string, version: string, zipcode: string}}
 */
store.state.authMessage = {
  userId: '',
  city: '',
  country: '',
  createdAt: '',
  email: '',
  uuid:'',
  id: '',
  idCode: '',
  name: '',
  province: '',
  street: '',
  updatedAt: '',
  version: '',
  zipcode: ''
}

/**
 * 货币种类
 * @type {{}}
 */
store.state.currency = new Map()
store.state.currencyChange = 0 // 币种信息发送变化
store.state.appraisementChange = 0 // 币种估值发生变化

/**
 * 当前计价货币
 * @type {string}
 */
store.state.baseCurrency = 'BTC'

store.state.quoteConfig = [
  {name: 'BDB_BTC', baseScale: 0, quoteScale: 8},
  {name: 'BDB_ETH', baseScale: 2, quoteScale: 6},
  {name: 'BTC_USD', baseScale: 4, quoteScale: 2},
  {name: 'ETH_BTC', baseScale: 3, quoteScale: 6},
]

/**
 * 当前展示币对
 * @type {string}
 */
store.state.filterCurrency = ['BTC_USDT','ETH_USDT','EOS_USDT']


/**
 * 汇率  lf
 */
store.state.exchange_rate = {
  btcExchangeRate : 1,
  ethExchangeRate : 1,
}

/**
 * 移动版买卖交易界面type判断  1,2,3,4
 */
store.state.buy_or_sale_type = 1


/**
 * 认证状态
 * sms: false,  手机
 * ga: false,   谷歌验证
 * identity: false, 身份认证
 * capital: false,  资金密码
 * email: false 邮箱
 * @type {null}
 */

store.state.authState = null

store.state.symbol = ''

/**
 * 服务器时间
 * @type {string}
 */
store.state.serverTime = 0
store.state.serverTimeInterval = null
store.state.serverTimeCallBack = null


/**
 * 手机端右侧弹窗开关
 */
store.state.mobilePopOpen = false

// 手机端顶部注册是否显示 true为显示
store.state.mobileLoginShow = true

// 货币对信息
store.state.currencyList = []

// 当前委托单价list
store.state.openOrder = []

// 深度图时价，默认填写到买卖价格中
store.state.depth_price = '';

// 交易大厅 or 币对
store.state.hall_symbol = true;

// 20180626 bt百分比接口显示
// 对应15%
store.state.btReward = '';
// 对应30%
store.state.btActivity = '';

// 是否显示浮层
store.state.show_layer = '';

// 特殊专区币种，0为超级为蜜区
store.state.specialSymbol = []

// 市场专区
store.state.marketList = new Set()

// 时价初始化标识数组
store.state.initPriceSymbol = []

//手机区域number
store.state.areaCode = '0086'

/**
 * 同步修改state
 * @type {{}}
 */
store.mutations = {}

// 时价初始化标识数组SET_INIT_PRICE_SYMBOL
store.mutations.SET_INIT_PRICE_SYMBOL = (state, data) => {
  state.initPriceSymbol.push(data);
}

// 是否显示浮层
store.mutations.SET_LAYER = (state, data) => {
  state.show_layer = data;
}
// 改变状态值
store.mutations.SET_LAYER_STATE = (state, data) => {
  state.show_layer = data;
}

store.mutations.changeIOSCookie = (state, data) => {
  state.iosCookie = data
}

/**
 * 屏幕响应式
 */
store.mutations.changeIsMobile = (state, data) => {
  state.isMobile = data
}

store.mutations.changeIsWeixin = (state, data) => {
  state.isWeixin = data
}

store.mutations.changeMobileLoginShow = (state, data) => {
  state.mobileLoginShow = data
}

store.mutations.changeIsAndroid = (state, data) => {
  state.isAndroid = data
}

store.mutations.closeIsloadshow=(state,data)=>{
  state.downloadShow=data

}
// 修改header的小红点显示
store.mutations.changeNoticeRedPoint = (state, data) => {
  state.noticeRedPoint = data
}


// 修改是否是加入我们页面
store.mutations.changeJoinus = (state, data) => {
  state.joinus = data
}

/**
 * 修改汇率
 * @param state
 * @param data
 */

store.mutations.changeExchange_rate_dollar = (state, data) => {
  console.log(data)
  if(!data) return
  state.exchange_rate_dollar = data
}
/**
 * 修改顶部title
 * @param state
 * @param data
 */

store.mutations.changeMobileHeaderTitle = (state, data) => {
  state.mobileHeaderTitle = data
}

/**
 * 修改顶部title前的文字
 * @param state
 * @param data
 */

store.mutations.changeMobileHeaderPriceTitle = (state, data) => {
  state.mobileHeaderPriceTitle = data
}

/**
 * 获取充值记录详情和提现记录获取数据显示
 * @param state
 * @param data
 */

store.mutations.changeMobileRechargeRecordData = (state, data) => {
  state.mobileRechargeRecordData = data
}


store.mutations.changeMobileTradingHallFlag = (state, data) => {
  state.mobileTradingHallFlag = data
}

store.mutations.changeMobileSymbolType = (state, data) => {
  console.log(data)
  state.symbol = data;
}

/**
 * 重新计算精度
 */
store.mutations.SET_QUOTECONFIG = (state, data) => {
  state.quoteConfig = data;
}

/**
 * 存储当前币对最小交易额和深度图满条
 */
store.mutations.SET_TRADING_PARAMETERS = (state, data) => {
  state.tradingParameters = data;
}

/**
 * GRC价格区间
 * @param state
 * @param info
 * @constructor
 */
store.mutations.SET_GRC_PRICE_RANGE = (state, info) => {
  state.GRCPriceRange = info
}
/**
 * 修改语言
 * @param state
 * @param lang
 */
store.mutations.CHANGE_LANG = (state, lang) => {
  state.lang = lang
}

/**
 * 更改当前的计价货币
 * @param state
 * @param currency
 */
store.mutations.CHANGE_BASE_CURRENCY = (state, currency) => {
  state.baseCurrency = currency
}

/**
 * 扩充交易币种
 * @param state
 * @param currencyArr
 * @constructor
 *
 * currency是一个ap，键名为币种名称，键值为一个对象，里包含：
 * currency: String || 币种名称
 * fullName: String || 币种全称
 * description: String || 币种描述(可以作为币种全称)
 * addressAliasTo: String || 币种协议
 * total: Number || 总值（等于可用available+冻结frozen）
 * available: Number || 可用
 * frozen: Number || 冻结
 * appraisement: Number || 估值（等于总值total*汇率rate）
 * rate: Number || 对BTC的汇率
 * depositEnabled:Boolean || 是否可充，false为不可充，true为可充，此属性USDT、USDT2专用
 * withdrawEnabled:Boolean || 是否可提，false为不可提，true为可提，此属性USDT、USDT2专用
 * withdrawDisabled:Boolean || 是否可提，false为可提，true为不可提
 */
store.mutations.CHANGE_CURRENCY = (state, currencyArr) => {
  // 如果currency没有或者不是数组
  if (!currencyArr || currencyArr instanceof Array === false) return
  // 扩充currency
  for (let i = 0; i < currencyArr.length; i++) {
    // 如果没有name这个属性，跳过即可
    if (!currencyArr[i].name) {
      continue
    }
    // 获取Map币种的对应的对象
    let target = state.currency.get(currencyArr[i].name)
    // 如果不存在，新建一个对象，插入进Map
    if (!target) {
      state.currency.set(currencyArr[i].name, {
        currency: currencyArr[i].name || '',
        isUSDT2: currencyArr[i].name == 'USDT2' || '',//是否是USDT2
        fullName: currencyArr[i].fullName || '',
        description: currencyArr[i].description || '',
        addressAliasTo: currencyArr[i].addressAliasTo || '',
        total: currencyArr[i].total || 0,
        available: currencyArr[i].available || 0,
        frozen: currencyArr[i].frozen || 0,
        appraisement: currencyArr[i].appraisement || 0,
        rate: currencyArr[i].rate || 0,
        depositEnabled: currencyArr[i].depositEnabled || false,
        withdrawEnabled: currencyArr[i].withdrawEnabled || false,
        withdrawDisabled: currencyArr[i].withdrawDisabled || false,
        rechargeOpenTime: currencyArr[i].rechargeOpenTime || 0,
        withdrawOpenTime: currencyArr[i].withdrawOpenTime || 0,
        displayTime: currencyArr[i].displayTime || 0,
        memo: currencyArr[i].memo || 'no',
      })
    }
    // 如果已存在，更新内容
    if (target) {
      target.currency = currencyArr[i].name || target.currency || ''
      target.isUSDT2 = currencyArr[i].name == 'USDT2' || target.currency == 'USDT2' || ''
      target.fullName = currencyArr[i].fullName || target.fullName || ''
      target.description = currencyArr[i].description || target.description || ''
      target.addressAliasTo = currencyArr[i].addressAliasTo || target.addressAliasTo || ''
      target.total = currencyArr[i].total || target.total || 0
      target.available = currencyArr[i].available || target.available || 0
      target.frozen = currencyArr[i].frozen || target.frozen || 0
      target.appraisement = currencyArr[i].appraisement || target.appraisement || 0
      target.rate = currencyArr[i].rate || target.rate || 0
      target.depositEnabled = currencyArr[i].depositEnabled || target.depositEnabled || false
      target.withdrawEnabled = currencyArr[i].withdrawEnabled || target.withdrawEnabled || false
      target.withdrawDisabled = currencyArr[i].withdrawDisabled || target.withdrawDisabled || false
      target.rechargeOpenTime = currencyArr[i].rechargeOpenTime || target.rechargeOpenTime || 0
      target.withdrawOpenTime = currencyArr[i].withdrawOpenTime || target.withdrawOpenTime || 0
      target.displayTime = currencyArr[i].displayTime || target.displayTime || 0
      target.memo = currencyArr[i].memo || target.memo || 'no'
    }

    if(target && target.isUSDT2){
      target.displayTime = new Date('2119-12-31').getTime()/1000;//由于不能显示USDT2币种，需要displayTime足够大，在前端入口处统一配置
    }
  }
  // 因为Map对象并不会触发vuex和watch的检测，所以使用另外的属性进行检测，每次变动，对currencyChange进行修改，观测currencyChange即可
  state.currencyChange++
  if (state.currencyChange > 100) state.currencyChange = 0
}

/**
 * 扩充交易金额，获取account后，对此表进行修改，使用big.js进行精度的处理
 * @param state
 * @param accounts
 * @constructor
 */
store.mutations.CHANGE_ACCOUNT = (state, accounts) => {
  // 如果获取到的信息没有或者不是数组，直接退出即可
  if (!accounts || accounts instanceof Array === false) return
  // 扩充account
  for (let i = 0; i < accounts.length; i++) {
    // 如果没有currency这个属性，跳过即可
    if (!accounts[i].currency) {
      continue
    }
    // 获取Map币种对应的对象
    let target = state.currency.get(accounts[i].currency)


    // 如果不存在这个属性，新建一个
    if (!target) {
      state.currency.set(accounts[i].currency, target = {
        currency: accounts[i].currency,
        fullName: accounts[i].fullName || '',
        description: accounts[i].description || '',
        addressAliasTo: accounts[i].addressAliasTo || '',
        total: accounts[i].total || 0,
        available: accounts[i].available || 0,
        frozen: accounts[i].frozen || 0,
        appraisement: accounts[i].appraisement || 0,
        rate: accounts[i].rate || 0,
        withdrawDisabled: accounts[i].withdrawDisabled || false,
        rechargeOpenTime: accounts[i].rechargeOpenTime || 0,
        withdrawOpenTime: accounts[i].withdrawOpenTime || 0,
        displayTime: accounts[i].displayTime || 0,
      })
    }

    // 扩充此属性
    // 扩充可用
    if (accounts[i].type === 'SPOT_AVAILABLE') {
      // target.available = GlobalFunc.accFixed(accounts[i].balance, 8)
      target.available = GlobalFunc.newFixed(accounts[i].balance, 8)
      // target.total = parseFloat(GlobalFunc.accAdd(target.available, target.frozen))
    }
    // 扩充冻结
    if (accounts[i].type === 'SPOT_FROZEN') {
      // target.frozen = GlobalFunc.accFixed(accounts[i].balance, 8)
      target.frozen = GlobalFunc.newFixed(accounts[i].balance, 8)
      // target.total = parseFloat(GlobalFunc.accAdd(target.available, target.frozen))
    }

    // 修改总值
    target.total = parseFloat(GlobalFunc.accAdd(target.available, target.frozen))
    // 修改估值
    target.appraisement = parseFloat(GlobalFunc.accMul(target.total, target.rate))


  }

  // 因为Map对象并不会触发vuex和watch的检测，所以使用另外的属性进行检测，每次变动，对currencyChange进行修改，观测currencyChange即可
  state.currencyChange++
  if (state.currencyChange > 100) state.currencyChange = 0

}

/**
 * 修改估值
 * @param state
 * @param price
 * @constructor
 */
store.mutations.CHANGE_APPRAISEMENT = (state, price) => {
  // 如果价格不存在
  if (!price) return
  // 循环寻找币对
  for (let key in price) {

    let targetName = key.split('_')[0], baseName = key.split('_')[1]
    if (baseName !== state.baseCurrency) continue
    let targetObj = state.currency.get(targetName)
    if (!targetObj) continue
    targetObj.rate = price[key][4]
    GlobalFunc.accMul(targetObj.total, price[key][4])
  }
  // 记录下估值变化
  state.appraisementChange++
  if (state.appraisementChange > 100) state.appraisementChange = 0
}


/**
 * 修改对BTC的估值，获取最新市场信息后，直接调用，对currency的Map对象里的rate做出修改
 * @param state
 * @param price
 * @constructor
 */
store.mutations.CHANGE_PRICE_TO_BTC = (state, price) => {

  state.price = Object.assign(state.price, price)
  price = state.price

  state.exchange_rate = {
    btcExchangeRate : price['BTC_USDT'] && price['BTC_USDT'][4] || 1,
    ethExchangeRate : price['ETH_USDT'] && price['ETH_USDT'][4] || 1,
  }

  let baseSymbol = 'BTC', middleSymbol = ['ETH', 'USDT']

  // 循环遍历币种资料
  for (let keys of state.currency.keys()) {
    // 获取币种对应的对象
    let target = state.currency.get(keys)

    // 如果没有
    if (!target) {
      continue
    }

    // 如果对应的是基础货币
    if (keys == baseSymbol) {
      target.rate = 1
      target.appraisement = target.total
      continue
    }

    // 获取对应的keys_BTC
    let priceObj = price[keys + '_' + baseSymbol]

    // 如果不存在初始值
    if (!priceObj) {
      // 拿一个翻转货币
      let reversalPriceObj = price[baseSymbol + '_' + keys]

      // 如果有翻转的货币
      if (reversalPriceObj) {
        priceObj = [
          reversalPriceObj[0],
          reversalPriceObj[1] != 0 ? GlobalFunc.accDiv(1, reversalPriceObj[1]) : 0,
          reversalPriceObj[2] != 0 ? GlobalFunc.accDiv(1, reversalPriceObj[2]) : 0,
          reversalPriceObj[3] != 0 ? GlobalFunc.accDiv(1, reversalPriceObj[3]) : 0,
          reversalPriceObj[4] != 0 ? GlobalFunc.accDiv(1, reversalPriceObj[4]) : 0,
          reversalPriceObj[5]
        ]
      }

      // 如果没有翻转的，从中转货币里转
      if (!reversalPriceObj) {

        let priceObjToMiddleSymbol = null, i = 0, middlePrice = null

        do {
          priceObjToMiddleSymbol = price[keys + '_' + middleSymbol[i]]

          if (price[middleSymbol[i] + '_' + baseSymbol]) {
            middlePrice = price[middleSymbol[i] + '_' + baseSymbol];
          } else {
            middlePrice = price[baseSymbol + '_' + middleSymbol[i]];
            middlePrice && (middlePrice = [
              middlePrice[0],
              middlePrice[1] != 0 ? GlobalFunc.accDiv(1, middlePrice[1]) : 0,
              middlePrice[2] != 0 ? GlobalFunc.accDiv(1, middlePrice[2]) : 0,
              middlePrice[3] != 0 ? GlobalFunc.accDiv(1, middlePrice[3]) : 0,
              middlePrice[4] != 0 ? GlobalFunc.accDiv(1, middlePrice[4]) : 0,
              middlePrice[5]
            ])
          }
          i++
        } while (!priceObjToMiddleSymbol && i < middleSymbol.length)

        // 如果连对中转币对的值都没有，那就没有估值了
        if (!priceObjToMiddleSymbol || !middlePrice) continue

        // 如果拿到了对中转货币priceObjToEth的估值，并且拿到了中转货币对目标货币的估值，两者相乘即为对目标货币的估值
        priceObj = [
          priceObjToMiddleSymbol[0],
          GlobalFunc.accMul(priceObjToMiddleSymbol[1], middlePrice[1]),
          GlobalFunc.accMul(priceObjToMiddleSymbol[2], middlePrice[2]),
          GlobalFunc.accMul(priceObjToMiddleSymbol[3], middlePrice[3]),
          GlobalFunc.accMul(priceObjToMiddleSymbol[4], middlePrice[4]),
          priceObjToMiddleSymbol[5]
        ]
      }
    }

    // 修改目标的比率
    target.rate = priceObj[4]

    // 修改估值
    target.appraisement = GlobalFunc.accMul(target.rate, target.total)

  }

  // 因为Map对象并不会触发vuex和watch的检测，所以使用另外的属性进行检测，每次变动，对currencyChange进行修改，观测currencyChange即可
  state.currencyChange++
  if (state.currencyChange > 100) state.currencyChange = 0


}


/**
 * 重置currency
 * @param state
 * @param info
 * @constructor
 */
store.mutations.RESET_CURRENCY = (state, info) => {
  state.currency.clear()
  state.currencyChange++
  if (state.currencyChange > 100) state.currencyChange = 0
}

/**
 * 更改用户信息
 * @param state
 * @param info
 * capital:资金密码
 * sms:手机
 * ga:谷歌验证
 * identity:身份验证
 * @constructor
 */
store.mutations.SET_AUTH_MESSAGE = (state, info) => {
  state.authMessage = info
  state.isLogin = info.userId ? true : false
}

/**
 * 设置用户id和name
 * @param state
 * @param info
 * @constructor
 */
store.mutations.SET_AUTH_ID_CODE = (state, info) => {
  state.idCode = info.idCode || ''
  state.name = info.name || ''
}


//
// // 修改手机的认证状态
// store.mutations.SET_AUTH_STATE_PHONE = (state, info) => {
//   state.authState.sms = info
// }
// // 修改谷歌的认证状态
// store.mutations.SET_AUTH_STATE_GOOGLE = (state, info) => {
//   state.authState.ga = info
// }
// // 修改身份的认证状态
// store.mutations.SET_AUTH_STATE_AUTHENTICATION = (state, info) => {
//   state.authState.identity = info
// }
// // 修改资金密码的认证状态
// store.mutations.SET_AUTH_STATE_AUTHENTICATION = (state, info) => {
//   state.authState.capital = info
// }
/**
 * 修改认证状态
 * @param state
 * @param info
 * @constructor
 */
store.mutations.SET_AUTH_STATE = (state, info) => {
  state.authState = info
}


/**
 * 登出
 * @param state
 * @param info
 * @constructor
 */
store.mutations.LOGIN_OUT = (state, info) => {
  //移除充值地址变更的提醒
  window.$cookies.remove('rechargeAddressChanged')

  state.authMessage = {
    userId: '',
    city: '',
    country: '',
    createdAt: '',
    email: '',
    id: '',
    idCode: '',
    name: '',
    province: '',
    street: '',
    updatedAt: '',
    version: '',
    zipcode: ''
  }
  state.isLogin = false
}

store.mutations.SET_SYMBOL = (state, info) => {
  state.symbol = info
}

store.mutations.changeMobilePopOpen = (state, info) => {
  state.mobilePopOpen = info
}
store.mutations.SET_QUOTE_CONFIG = (state, info) => {
  state.quoteConfig = info
}

store.mutations.getCurrencyList = (state, info) => {
  state.currencyList = info
}

store.mutations.SET_EXCHANGE_RATE = (state, info) => {
  state.exchange_rate = info
}

store.mutations.BUY_OR_SALE_TYPE = (state, type) => {
  state.buy_or_sale_type = type
}

store.mutations.GET_OPEN_ORDER = (state, list) => {
  state.openOrder = list;
}

store.mutations.SET_DEPTH_PRICE = (state, price) => {
  state.depth_price = price //|| 0
}

store.mutations.SET_SERVER_TIME = (state, time) => {
  state.serverTime = time
  state.serverTimeInterval && clearInterval(state.serverTimeInterval)
  let thatTime = new Date()

  state.serverTimeInterval = setInterval(() => {
    let now = new Date()
    state.serverTime += now - thatTime
    thatTime = now
    // state.serverTime += 1000

    state.serverTimeCallBack && state.serverTimeCallBack(state.serverTime)
  }, 1000)

}

store.mutations.SET_SERVER_TIME_CALL_BACK = (state, callback) => {
  console.log('this is serverTimeCallBack',callback);
  state.serverTimeCallBack = callback
}

store.mutations.SET_HALL_SYMBOL = (state, info) => {
  state.hall_symbol = info
}

store.mutations.SET_BT_REWARD = (state, info) => {
  state.btReward = info
}

store.mutations.SET_BT_ACTIVITY = (state, info) => {
  state.btActivity = info
}

// 是否免费
store.mutations.SET_REDUCE_FEE = (state, reduce_fee) => {
  state.reduce_fee = reduce_fee;
}

// 存储cookie
store.mutations.SAVE_COOKIE = (state, info) => {
  state.save_cookie = info;
}

// 超级为蜜区
store.mutations.SAVE_SPECIAL_SYMBOL = (state, info) => {
  state.specialSymbol = info
}

// 市场列表
store.mutations.SET_MARKET_LIST = (state, info) => {
  state.marketList = info
}

// 修改主题色
store.mutations.SET_THEME_COLOR = (state, info) => {
  state.themeColor = info
}
// 手机号区域
store.mutations.SET_AREA_CODE = (state, info) => {
  state.areaCode = info
}

// 国籍
store.mutations.SET_AREA_NAME = (state, info) => {
  state.nameCn = info
}


store.mutations.SET_COUNRTY = (state, info) => {
  state.country = info
}

/**
 * 异步修改state
 * @type {{}}
 */
store.actions = {}
store.actions.changeLang = ({commit}) => {
  commit('changeLang')
}

store.getters = {}


export default store
