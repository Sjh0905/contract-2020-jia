const store = {}
/**
 * 判断是否为手机端
 */

import GlobalFunc from '../globalFunctionConfigs/GlobalFunction'


store.state = {}

// 注册方式
store.state.registerType = 1 // 0为手机注册，1为邮箱注册

// 存储cookie
store.state.save_cookie = ''

// 接口前缀
store.state.urlHead = ''

// 静态页地址
store.state.static_url = process.env.STATIC_URL || 'http://static.2020.exchange'

store.state.contract_url = process.env.CONTRACT_URL || 'http://www.2020-ex.com/'

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
 * 手机端点击当前锁仓记录
 */

store.state.mobileLockRecordData = ''

/**
 * 手机端交易大厅开关
 */

store.state.mobileTradingHallFlag = true

/**
 * 语言
 * @type {string}
 */
store.state.lang = 'CH'
store.state.langZendeskObj = {
  'CH':'zh-cn',
  'EN':'en-US',
  'CA':'en-US',
  'CHT':'zh-tw',
  // 'KOR':'ko',
  // 'JP':'ja'
}
/**
 * 存储当前币对最小交易额和深度图满条值
 */
store.state.tradingParameters = []

/**
 * 存储当前委托的数据
 */
store.state.currentOrders = []

/**
 *
 * @type {Array}
 */
store.state.KKPriceRange = []

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
//会员卡是否为VIP
store.state.flag = false
store.state.authHotVal = 0

store.state.isVIP = {
  expires: '',
  flag: ''
}

/**
 * 货币种类
 * @type {{}}
 */
store.state.currency = new Map()
store.state.currencyChange = 0 // 币种信息发送变化
store.state.appraisementChange = 0 // 币种估值发生变化

/**
 * OTC货币种类
 * @type {{}}
 */
store.state.OTCcurrency = new Map()
store.state.OTCcurrencyChange = 0 // 币种信息发送变化
store.state.OTCappraisementChange = 0 // 币种估值发生变化

/**
 * 当前计价货币
 * @type {string}
 */
store.state.baseCurrency = 'BTC'

store.state.quoteConfig = [
  {name: 'BTC_USDT', baseScale: 3, quoteScale: 2},
  {name: 'BTCUSDT', baseScale: 3, quoteScale: 2},
  {name: 'ETH_USDT', baseScale: 3, quoteScale: 2},
  {name: 'ETHUSDT', baseScale: 3, quoteScale: 2},
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
store.state.buy_or_sale_type = 0


/**
 * 认证状态
 * sms: false,  手机
 * ga: false,   谷歌验证
 * identity: false, 身份认证
 * capital: false,  资金密码
 * email: false 邮箱
 * @type {null}
 */

store.state.authState = {
  audits:'',
  email:'',
  gaAuth:'',
  idType:'',
  memeber:'',
  mobile:'',
  name:'',
  number:'',
  payInfo:'',
  registerType:'',
  transferPassWord:'',
  userId:'',
  uuid:'',
}

store.state.symbol = ''
store.state.subscribeSymbol = ''

//不加下划线币对名集合
store.state.sNameList = []
//加下划线币对名集合
store.state.sLineNameList = []
//币对名映射，格式 BTCUSDT:BTC_USDT
store.state.sNameMap = []



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

//买、卖盘中数量总和的最大值，缺省值是数量精度单位，避免过大不被赋值
store.state.depthMaxTotalAmount = 0.001;

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
 * 资产对象合集  assets
 * @type {Number}
 */
store.state.assets = {
  asset: "",
  availableBalance: 0,
  crossUnPnl: 0,
  crossWalletBalance: 0,
  initialMargin: 0,
  maintMargin: 0,
  marginBalance: 0,
  maxWithdrawAmount: 0,
  openOrderInitialMargin: 0,
  positionInitialMargin: 0,
  unrealizedProfit: 0,
  walletBalance: 0,
}

/**
 * 双仓可平数量  CloseAmount
 * @type {Number}
 */
store.state.closeAmount = {
  positionAmtLong:0,
  positionAmtShort:0
}

/**
 * 双仓可开数量  openAmount
 * @type {Number}
 */
store.state.openAmount = {
  openAmtLong:0,
  openAmtShort:0
}
/**
 * 单仓可开数量  openAmountSingle
 * @type {Number}
 */
store.state.openAmountSingle = {
  openAmtBuy:0,
  openAmtSell:0
}
// /**
//  * 除去逐仓仓位保证金的钱包余额  crossWalletBalance
//  * @type {Number}
//  */
// store.state.crossWalletBalance = 0

/**
 * 杠杆倍数  leverage
 * @type {Number}
 */
store.state.leverage = 20

/**
 * 深度列表  orderBookTicker
 * @type {Number}
 */
store.state.orderBookTicker = {
  bidPrice: 0,
  askPrice: 0,
}

/**
 * 查询杠杆分层标准，用于计算维持保证金
 * @type {Array}
 */
store.state.leverageBracket = []
store.state.bracketList = {}

/**
 * 杠杆、保证金 信息存储
 * @type {Object}
 */
store.state.currencyInfo = {
  BTCUSDT:{
    leverage:20,
    marginType:'cross'
  },
  ETHUSDT:{
    leverage:20,
    marginType:'cross'
  },
}

/**
 * socket ListenKey
 * @type {string}
 */
store.state.listenKey = ''

/**
 * ORDER_TRADE_UPDATE 当前委托订单
 * @type {Object}
 */
store.state.orderTradeUpdate = {}

/**
 * ENTER_CONTRACT 是否第一次进入合约账户
 * @type {Boolean}
 */
store.state.requireOpen = false


/**
 * 同步修改state
 * @type {{}}
 */
store.mutations = {}

/**
 * ORDER_TRADE_UPDATE 当前委托订单
 * @type {string}
 */
store.mutations.CHANGE_CURRENT_ORDER = (state, info) => {
  if (!info || JSON.stringify(info) === '{}') return
  // // 扩充currency
  // for (let i = 0; i < info.length; i++) {
  //   // 如果没有name这个属性，跳过即可
  //   if (!info[i].name) {
  //     continue
  //   }
  //
  //   if(target && (target.isUSDT2 || target.isUSDT3)){
  //     target.displayTime = new Date('2119-12-31').getTime()/1000;//由于不能显示USDT2币种，需要displayTime足够大，在前端入口处统一配置
  //   }
  // }
  // // 因为Map对象并不会触发vuex和watch的检测，所以使用另外的属性进行检测，每次变动，对currencyChange进行修改，观测currencyChange即可
  // state.currencyChange++
  // if (state.currencyChange > 100) state.currencyChange = 0

  state.orderTradeUpdate = info;
}

/**
 * 资产对象合集
 * @type {Number}
 */
store.mutations.CHANGE_ASSETS = (state, info) => {
  state.assets = Object.assign(state.assets,info);
  // console.log('state.assets=',state.assets);
}

/**
 * 双仓可平数量  CloseAmount
 * @type {Number}
 */
store.mutations.CHANGE_CLOSE_AMOUNT = (state, info) => {
  state.closeAmount = Object.assign(state.closeAmount,info);
  // console.log('state.assets=',state.assets);
}


/**
 * 双仓可开数量  openAmount
 * @type {Number}
 */
store.mutations.CHANGE_OPEN_AMOUNT = (state, info) => {
  state.openAmount = Object.assign(state.openAmount,info);
  // console.log('state.assets=',state.assets);
}
/**
 * 单仓可开数量  openAmountSingle
 * @type {Number}
 */
store.mutations.CHANGE_OPEN_AMOUNT_SINGLE = (state, info) => {
  state.openAmountSingle = Object.assign(state.openAmountSingle,info);
  // console.log('state.assets=',state.assets);
}


// /**
//  * 除去逐仓仓位保证金的钱包余额
//  * @type {Number}
//  */
// store.mutations.CHANGE_CROSS_WALLET_BALANCE = (state, info) => {
//   state.crossWalletBalance = info;
// }

/**
 * 合约相关内容
 * @type {Number}
 */
// 改变 杠杆倍数
store.mutations.CHANGE_LEVERAGE = (state, info) => {
  state.leverage = info;
}

// 改变 买深度列表
store.mutations.CHANGE_ORDER_BOOK_TICKER = (state, info) => {
  state.orderBookTicker = info;
}

// 改变 杠杆分层标准
store.mutations.CHANGE_LEVERAGE_BRACKET = (state, info) => {
  state.leverageBracket = info;
}

// 改变 杠杆分层标准列表
store.mutations.CHANGE_BRACKET_LIST = (state, info) => {
  state.bracketList = info;
}

/**
 * 改变杠杆、保证金 信息存储
 * @type {Object}
 */
store.mutations.CHANGE_CURRENCY_INFO = (state, info) => {
  state.currencyInfo = info;
  // 兼容单币对杠杆倍数存储方式 需要重新转换 state.leverage 为当前选中币对的杠杆倍数值
  state.leverage = info[GlobalFunc.toOnlyCapitalLetters(state.symbol)].leverage
  // state.currencyInfo[GlobalFunc.toOnlyCapitalLetters(state.symbol)].marginType = Object.assign(info);
}

// 改变 listenKey
store.mutations.CHANGE_LISTENKEY = (state, info) => {
  state.listenKey = info;
}

// 注册类型
store.mutations.REGISTER_TYPE = (state, info) => {
  state.registerType = info;
}

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

/**
 * 获取当前锁仓和历史锁仓获取数据显示
 * @param state
 * @param data
 */

store.mutations.changemobileLockRecordData = (state, data) => {
  state.mobileLockRecordData = data
}



store.mutations.changeMobileTradingHallFlag = (state, data) => {
  state.mobileTradingHallFlag = data
}

store.mutations.changeMobileSymbolType = (state, data) => {
  console.log(data)
  state.symbol = data;
  state.subscribeSymbol = GlobalFunc.toOnlyCapitalLetters(state.symbol);
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
  state.tradingtradingParametersParameters = data;
}

/**
 * 存储当前币对最小交易额和深度图满条
 */
store.mutations.SET_CURRENT_ORDERS = (state, data) => {
  state.currentOrders = data;
}

/**
 * GRC价格区间
 * @param state
 * @param info
 * @constructor
 */
store.mutations.SET_KK_PRICE_RANGE = (state, info) => {
  state.KKPriceRange = info
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
        isUSDT3: currencyArr[i].name == 'USDT3' || '',//是否是USDT3
        fullName: currencyArr[i].fullName || '',
        description: currencyArr[i].description || '',
        addressAliasTo: currencyArr[i].addressAliasTo || '',
        total: currencyArr[i].total || 0,
        available: currencyArr[i].available || 0,
        frozen: currencyArr[i].frozen || 0,
        locked: currencyArr[i].locked || 0,
        appraisement: currencyArr[i].appraisement || 0,
        otcTotal: currencyArr[i].otcTotal || 0,
        otcAvailable: currencyArr[i].otcAvailable || 0,
        otcFrozen: currencyArr[i].otcFrozen || 0,
        otcAppraisement: currencyArr[i].otcAppraisement || 0,
        mainTotal: currencyArr[i].mainTotal || 0,
        mainAvailable: currencyArr[i].mainAvailable || 0,
        mainFrozen: currencyArr[i].mainFrozen || 0,
        mainAppraisement: currencyArr[i].mainAppraisement || 0,
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
      target.isUSDT3 = currencyArr[i].name == 'USDT3' || target.currency == 'USDT3' || ''
      target.fullName = currencyArr[i].fullName || target.fullName || ''
      target.description = currencyArr[i].description || target.description || ''
      target.addressAliasTo = currencyArr[i].addressAliasTo || target.addressAliasTo || ''
      target.total = currencyArr[i].total || target.total || 0
      target.available = currencyArr[i].available || target.available || 0
      target.frozen = currencyArr[i].frozen || target.frozen || 0
      target.locked = currencyArr[i].locked || target.locked || 0
      target.appraisement = currencyArr[i].appraisement || target.appraisement || 0
      target.otcTotal = currencyArr[i].otcTotal || target.otcTotal || 0,
      target.otcAvailable = currencyArr[i].otcAvailable || target.otcAvailable || 0,
      target.otcFrozen = currencyArr[i].otcFrozen || target.otcFrozen || 0,
      target.otcAppraisement = currencyArr[i].otcAppraisement || target.otcAppraisement || 0
      target.mainTotal = currencyArr[i].mainTotal || target.mainTotal || 0,  //主流账户总资产
      target.mainAvailable = currencyArr[i].mainAvailable || target.mainAvailable || 0,
      target.mainFrozen = currencyArr[i].mainFrozen || target.mainFrozen || 0,
      target.mainAppraisement = currencyArr[i].mainAppraisement || target.mainAppraisement || 0,
      target.rate = currencyArr[i].rate || target.rate || 0
      target.depositEnabled = currencyArr[i].depositEnabled || target.depositEnabled || false
      target.withdrawEnabled = currencyArr[i].withdrawEnabled || target.withdrawEnabled || false
      target.withdrawDisabled = currencyArr[i].withdrawDisabled || target.withdrawDisabled || false
      target.rechargeOpenTime = currencyArr[i].rechargeOpenTime || target.rechargeOpenTime || 0
      target.withdrawOpenTime = currencyArr[i].withdrawOpenTime || target.withdrawOpenTime || 0
      target.displayTime = currencyArr[i].displayTime || target.displayTime || 0
      target.memo = currencyArr[i].memo || target.memo || 'no'
    }

    if(target && (target.isUSDT2 || target.isUSDT3)){
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
        locked: accounts[i].locked || 0,
        appraisement: accounts[i].appraisement || 0,
        otcTotal: accounts[i].otcTotal || 0,
        otcAvailable: accounts[i].otcAvailable || 0,
        otcFrozen: accounts[i].otcFrozen || 0,
        otcAppraisement: accounts[i].otcAppraisement || 0,
        mainTotal: accounts[i].mainTotal || 0,
        mainAvailable: accounts[i].mainAvailable || 0,
        mainFrozen: accounts[i].mainFrozen || 0,
        mainAppraisement: accounts[i].mainAppraisement || 0,
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
    // 扩充锁仓
    if (accounts[i].type === 'SPOT_LOCKED') {
      // target.frozen = GlobalFunc.accFixed(accounts[i].balance, 8)
      target.locked = GlobalFunc.newFixed(accounts[i].balance, 8)
      // target.total = parseFloat(GlobalFunc.accAdd(target.available, target.frozen))
    }
    // 扩充OTC可用
    if (accounts[i].type === 'OTC_AVAILABLE') {
      target.otcAvailable = GlobalFunc.newFixed(accounts[i].balance, 8)
    }
    // 扩充OTC冻结
    if (accounts[i].type === 'OTC_FROZEN') {
      target.otcFrozen = GlobalFunc.newFixed(accounts[i].balance, 8)
    }

    // 扩充主流账号可用
    if (accounts[i].type === 'BINANCE_SPOT_AVAILABLE') {
      target.mainAvailable = GlobalFunc.newFixed(accounts[i].balance, 8)
    }
    // 扩充主流账户冻结
    if (accounts[i].type === 'BINANCE_SPOT_FROZEN') {
      target.mainFrozen = GlobalFunc.newFixed(accounts[i].balance, 8)
    }

    // 修改总值
    target.total = parseFloat(GlobalFunc.accAdd(target.available, target.frozen))
    target.total = parseFloat(GlobalFunc.accAdd(target.total, target.locked))
    // 修改估值
    target.appraisement = parseFloat(GlobalFunc.accMul(target.total, target.rate))

    // 修改OTC总值
    target.otcTotal = parseFloat(GlobalFunc.accAdd(target.otcAvailable, target.otcFrozen))
    // 修改OTC估值
    target.otcAppraisement = parseFloat(GlobalFunc.accMul(target.otcTotal, target.rate))

    // 修改主流币种总值
    target.mainTotal = parseFloat(GlobalFunc.accAdd(target.mainAvailable, target.mainFrozen))
    // 修改主流币种估值
    target.mainAppraisement = parseFloat(GlobalFunc.accMul(target.mainTotal, target.rate))
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

  //以下代码解决了汇率接口调取出问题时汇率无值的BUG，现在默认汇率接口没问题，又为了保证资产和APP数值相同，暂时屏蔽
  // state.exchange_rate = {
  //   btcExchangeRate : price['BTC_USDT'] && price['BTC_USDT'][4] || 1,
  //   ethExchangeRate : price['ETH_USDT'] && price['ETH_USDT'][4] || 1,
  // }

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
store.mutations.SET_AUTH_HOTVAL = (state, info) => {
  state.authHotVal = info
}

store.mutations.SET_IOS_LOGIN = (state, info) => {
  state.isLogin =  info
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
    zipcode: '',
  }
  // state.idCode = ''
  // state.name = ''
  state.isLogin = false
}


store.mutations.IS_VIP = (state, info) => {
  state.isVIP = info
}

store.mutations.ENTER_CONTRACT = (state, info) => {
  state.requireOpen = info
}


store.mutations.SET_SYMBOL = (state, info) => {
  state.symbol = info
  // 兼容单币对杠杆倍数存储方式 需要重新转换 state.leverage 为当前选中币对的杠杆倍数值
  state.leverage = state.currencyInfo[GlobalFunc.toOnlyCapitalLetters(state.symbol)].leverage
  state.subscribeSymbol = GlobalFunc.toOnlyCapitalLetters(state.symbol);
}

store.mutations.SET_S_NAME_LIST = (state, info) => {
  state.sNameList = info
}

store.mutations.SET_S_LINE_NAME_LIST = (state, info) => {
  state.sLineNameList = info
}

store.mutations.SET_S_NAME_MAP = (state, info) => {
  state.sNameMap = info
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

store.mutations.SET_DEPTH_MAX_TOTAL_AMOUNT = (state, val) => {
  // state.depthMaxTotalAmount = val
  if(val > 0){
    state.depthMaxTotalAmount = Math.max(state.depthMaxTotalAmount,val)
  }
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
  // console.log('this is serverTimeCallBack',callback);
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
