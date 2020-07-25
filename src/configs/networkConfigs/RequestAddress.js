// /apis->/crypto
const urlHead = '/apis'
const requestAddress = {}

requestAddress.INDEXHEADER = {url: '', method: 'get', timeout: null, responseType: null} //demo

requestAddress.REGISTER = {url: urlHead+'/user/register', method: 'post'}  // 注册
requestAddress.LOGIN = {url: urlHead+'/user/signin', method: 'post'}  // 登录
requestAddress.REGISTER_BY_MOBILE = {url: urlHead+'/user/registerByMobile', method: 'post'}  // 手机注册


requestAddress.REGISTER_BY_MOBILE_INFO = {url: urlHead+'/user/AreaCode', method: 'get'}  // 手机注册获取电话信息
requestAddress.REGISTER_BY_MOBILE_INFO_ZH = {url: urlHead+'/user/AreaCodeForIdenty', method: 'get'}  // 手机注册获取电话信息

requestAddress.LOGIN_BY_MOBILE = {url: urlHead+'/user/signInByMobile', method: 'post'}  // 手机登录
requestAddress.ORDERS = {url: urlHead+'/v1/user/currency/accounts', method: 'get'} // 请求订单
requestAddress.GOOGLEVALIDATIONSECOND = {url: urlHead+'/auth/bindGA', method: 'post'} //谷歌验证
requestAddress.CHECKLOGININ = {url: urlHead+'/user/checkLogin', method: 'post'} //检查登录
requestAddress.POST_VERIFICATION_CODE = {url: urlHead+'/auth/getVerificationCode', method: 'post'} //发起各种验证码请求，如谷歌、手机等
requestAddress.LOGIN_OFF = {url: urlHead+'/user/signout', method: 'post'} //登出
requestAddress.RECHARGE_AND_WITHDRAWALS_RECORD = {url: urlHead+'/v1/user/currency/accounts', method: 'get'}//请求充值提现记录
requestAddress.RECHARGE = {url: urlHead+'/user/deposit', method: 'post'} //充值
// requestAddress.GET_CURRENCY = {url: urlHead+'/user/currencys', method: 'get'} //获取币种

requestAddress.GET_OTC_CURRENCY = {url: urlHead+'/user/otc/currency', method: 'get'} //获取法币
requestAddress.GET_AUTH_STATE = {url: urlHead+'/auth/getAuths', method: 'post'} //获取认证状态
requestAddress.FIND_BACK_PASSWORD = {url: urlHead+'/auth/commonAuth', method: 'post'} //找回密码
requestAddress.VERIFYING_LOGIN_STATE = {url: urlHead+'/auth/isFalseLogin', method: 'post'} //验证伪登录状态
requestAddress.FIND_BACK_PASSWORD_RESET = {url: urlHead+'/user/resetLoginPassword', method: 'post'}//找回密码重置
requestAddress.FIND_BACK_MOBILE_PASSWORD_RESET = {url: urlHead+'/user//resetMobileLoginPassword', method: 'post'}//找回密码重置
requestAddress.RECHARGE_LOG = {url: urlHead+'/user/depositLog', method: 'post'} //充值记录
requestAddress.WITHDRAWS_LOG = {url: urlHead+'/user/withdrawLog', method: 'post'}  //提现记录
requestAddress.GET_TRANSFER_LIST = {url: urlHead+'/user/inner/transfer/list', method: 'get'}  //内部转账记录
requestAddress.PROHIBIT_ALL_CURRENCY = {url: urlHead+'/user/transfer/prohibitAllCurrency', method: 'get'}  //内部转账记录
requestAddress.GET_TRANSFER_SPOT_LIST = {url: urlHead+'/user/transfer/spot/list', method: 'get'}  //划转记录
requestAddress.POST_TRANSFER_SPOT = {url: urlHead+'/user/transferBetweenAccount', method: 'post'}  //划转
requestAddress.GET_IDENTITY_AUTH_STATUS = {url: urlHead+'/auth/getIdentityAuthStatus', method: 'get'} //获取身份认证状态
requestAddress.FIND_FEE_BDB_INFO = {url: urlHead+'/user/findfeebdbinfo', method: 'get'} //查询BDB是否抵扣
requestAddress.FIND_FEE_DEDUCTION_INFO = {url: urlHead+'/user/findFeeDeductionInfo', method: 'get'} //查询BDB是否抵扣



requestAddress.POST_WITHDRAW_ADDRESS = {url: urlHead+'/user/withdrawAddressesByCurrency', method: 'post'}//提现地址列表
requestAddress.POST_DELETE_ADDRESS = {url: urlHead+'/user/delWithdrawAddresses', method: 'post'} //删除提现地址
requestAddress.POST_WITHDRAW_FEE_INFO = {url: urlHead+'/user/getwithdrawFeeInfo', method: 'post'} //获取提现费率
requestAddress.POST_ADD_WITHDRAW_ADDRESS = {url: urlHead+'/user/addWithdrawAddresses', method: 'post'}//添加提现地址{currency,address,description}
requestAddress.POST_WITHDRAW = {url: urlHead+'/user/putWithdrawRequest', method: 'post'} //提现

requestAddress.GET_USER_PROFILE = {url: urlHead+'/user/getUserProfile', method: 'post'} //获取用户详细的信息！只能在身份认证这里用！

requestAddress.FEECHANGE = {url: urlHead+'/user/feechange', method: 'post'} //查询TT是否抵扣
requestAddress.CHANGE_FEE_BDB = {url: urlHead+'/user/feebdbchange', method: 'post'} //修改BDB抵扣策略
requestAddress.SEND_IDENTITY = {url: urlHead+'/auth/sendIdentity', method: 'post'} //提交身份认证
requestAddress.GET_IDENTITY_INFO = {url: urlHead+'/auth/getIdentityInfo', method: 'get'} //获取被驳回的认证状态
// requestAddress.GET_EXCHANGE__RAGE = {url: urlHead+'/user/getExchangeRate', method: 'get'}//获取各种汇率

requestAddress.POST_FEE_DETAIL = {url: urlHead+'/user/feeDetails', method: 'post'} //获取抵扣详情
requestAddress.POST_COMMON_AUTH = {url: urlHead+'/auth/commonAuth', method: 'post'} //各种认证，如绑定手机、绑定密码、发起提现等
requestAddress.POST_COMMON_AUTH_UNBIND = {url: urlHead+'/auth/removeAuth', method: 'post'} //解绑手机接口，解绑谷歌验证
requestAddress.POST_CHANGE_PASSWORD = {url: urlHead+'/user/alterLoginPassword', method: 'post'} //修改密码接口
requestAddress.POST_CHANGE_PASSWORD_BY_MOBILE = {url: urlHead+'/user/alterLoginPasswordByMobile', method: 'post'} //手机用户修改密码接口


// requestAddress.DEPTH = {baseURL: '', url: urlHead+'/v1/market/depth', method: 'get'} //深度
requestAddress.TRADE_ORDERS = {url: urlHead+'/v1/trade/orders', method: 'post'} // 买卖/撤单
// requestAddress.KK_PRICE_RANGE = {url: urlHead+'/user/kk/symbol/priceRange', method: 'get'} // 获取KKPriceRange 的接口
requestAddress.GRC_ACTIVITYREWARDS = {url: urlHead+'/user/getGrcActivityRewards', method: 'post'} // 获取grc 详情列表的接口
requestAddress.KK_ACTIVITYREWARDS = {url: urlHead+'/user/getKKActivityRewards', method: 'post'} // 获取KK 详情列表的接口
requestAddress.INITIAL_REWARD = {url: urlHead+'/user/initial/reward', method: 'get'} // 获取活动奖励的接口
requestAddress.POST_USER_ORDERS = {url: urlHead+'/user/orders', method: 'post'} // 当前委托和历史委托，参数为'offsetId:开始查询的订单id','limit:获取数量','isFinalStatus:是否为历史订单，true为历史订单，false为当前订单'

// requestAddress.COMMON_SYMBOLS = {url: urlHead+'/user/symbols', method: 'get'} // 获取货币对
requestAddress.GET_HOMEPAGE_SYMBOLS = {url: urlHead+'/user/homePage/symbols/', method: 'get'} // 获取首页横排导航币对顺序 链接拼接参数H5 PC

// requestAddress.MARKET_PRICES = {url: urlHead+'/v1/market/prices', method: 'get'} // 获取货币对价格
// requestAddress.GET_TICK_CACHE = {url: urlHead+'/user/getTickCache', method: 'get'} // 获取全站实时成交


requestAddress.CURRENCYS = {url: urlHead+'/user/currencys', method: 'get'}  // 资产类型 || 获取币种
requestAddress.ACCOUNTS = {url: urlHead+'/v1/user/currency/accounts', method: 'get'} // 账户资产 || 请求充值提现记录



// 注册用户IP
requestAddress.ADD_API_KEY = {url: urlHead+'/user/addApiKey', method: 'post'}

// 撤销提现申请
requestAddress.POST_CANCEL_WITHDRAWALS = {url: urlHead+'/user/cancelWithdrawRequest', method: 'post'}

// 公告列表
// requestAddress.POST_NOTICE_LIST = {url: urlHead+'/user/findNoticeList', method: 'post'}

// 公告详情
requestAddress.POST_NOTICE_DETAIL = {url: urlHead+'/user/findNoticeInfo', method: 'post'}


// mobile 公告列表
requestAddress.MOBILE_POST_NOTICE_LIST = {url: urlHead+'/user/findNoticeList', method: 'post'}
// mobile 公告详情
requestAddress.MOBILE_POST_NOTICE_DETAIL = {url: urlHead+'/user/findNoticeInfo', method: 'post'}

// 获取服务器时间 /user/getServerTime
// requestAddress.GET_SEVER_TIME = {url: urlHead+'/user/getServerTime', method: 'get'}


// 安全日志记录
requestAddress.POST_LOG_RECORD = {url: urlHead+'/user/findLoginRecords', method: 'post'}

// 首页获取banner
requestAddress.GET_HOME_BANNER = {url: urlHead+'/user/homeBanner', method: 'get'}
// 移动端首页获取banner
requestAddress.GET_HOME_BANNERM = {url: urlHead+'/user/homeBannerM', method: 'get'}




// 2018-4-19 APP下载连接请求
requestAddress.GET_APPUPDATE = {url: urlHead+'/user/AppUpdate', method: 'get'}

// 2018-05-10 为兼容ios加cookie接口
requestAddress.PUT_COOKIE = {url: urlHead+'/user/putcookies', method: 'post'}

// 获取币种资料
requestAddress.GET_CURRENCY_INTRODUCTION = {url: urlHead+'/user/currencyInfo', method: 'post'}


// 2018-5-3 实时成交接口
requestAddress.GET_SYMBOL_TRADE = {url: urlHead+'/user/symbolTrade', method: 'post'}


// 获取认证状态
requestAddress.GET_BIDEBAO_IDENTITY = {url: urlHead+'/user/checkOrder', method: 'get'}
// 获取新的短信验证码
requestAddress.GET_LOCK_CODE = {url: urlHead+'/user/getLockCode', method: 'get'}
// 提交谷歌或短信验证码
requestAddress.POST_MAKE_ORDER = {url: urlHead+'/user/makeOrder', method: 'post'}
// 获取锁仓所有配置
requestAddress.GET_LOCK_CONF = {url: urlHead+'/user/getLockConf', method: 'post'}

// 获取账户余额
requestAddress.GET_LOCK_BALANCE = {url: urlHead+'/user/getUserAccount', method: 'post'}

// 2018-6-16  创建API KEY
requestAddress.API_KEY_EMAIL = {url: urlHead+'/user/apikeyemail', method: 'post'}
// 添加api key /user/addApiKey
requestAddress.MANAGE_ADD_API_KEY = {url: urlHead+'/user/addApiKey', method: 'post'}
// 删除api key /user/delApiKey
requestAddress.MANAGE_DELETE_API_KEY = {url: urlHead+'/user/delApiKey', method: 'post'}
// 短信验证码 auth/getVerificationCode
requestAddress.GET_VERIFICATIONCODE = {url: urlHead+'/auth/getVerificationCode', method: 'post'}


requestAddress.GET_ORDERS_DETAIL = {url: urlHead+'/user/orders', method: 'get'}

// 2018-10-16 退出app端face++认证
requestAddress.POST_EXIT_AUTHENTICATION = {url: urlHead+'/auth/exitAuthentication', method: 'post'}


// 2018-10-22 主板区排行币对
requestAddress.GET_MARKET_RANK = {url: urlHead+'/v1/market/prices/getranking', method: 'get'}

// 自选区
// 获取自选区
requestAddress.GET_COLLECTION_SYMBOL = {url: urlHead+'/user/getCollectionSymbol', method: 'get'}
// 点击取消\添加自选区
requestAddress.POST_COLLECTION_SYMBOL = {url: urlHead+'/user/collectSymbol', method: 'post'}



//2020-02-18，转账相关接口
// requestAddress.REGISTER_BY_MOBILE = {url: urlHead+'/user/registerByMobile', method: 'post'}  // 手机注册
// requestAddress.LOGIN_BY_MOBILE = {url: urlHead+'/user/signInByMobile', method: 'post'}  // 手机登录
// 短信验证码    //  转账接口    auth/getVerificationCode
requestAddress.GET_VERIFICATIONCODE = {url: urlHead+'/auth/getVerificationCode', method: 'post'}//获取手机,邮箱验证码
requestAddress.POST_VERIFYIDENTITY_USER = {url: urlHead+'/user/verifyIsIdentityUser', method: 'post'} //验证收款人是否为实名认证用户
// 查询当前币种的转账数量限制与手续费等信息
requestAddress.GET_TRANSFER_AMOUNT_INFO = {url: urlHead+'/user/transfer/getTransferAmountInfo', method: 'get'} // 获取当前币种是否可以转账



//合约账户接口 2020-07-13
requestAddress.POST_MANAGE_TIME = {url: urlHead+'/future/user/createFutureAccount', method: 'post'}  //合约账户首次进入确认
requestAddress.POST_MANAGE_API = {url: urlHead+'/future/user/getUserApi', method: 'get'}//合约首次进入
requestAddress.GET_USER_AUTH_INFO = {url: urlHead + '/future/user/getUserAuthInfo', method: 'get',} //合约个人信息
requestAddress.GET_SYMBOLS = {url: urlHead + '/future/common/symbols', method: 'get',} // 合约获取币种
requestAddress.GET_TICKER_24HR = {url: urlHead + '/future/common/ticker24hr', method: 'get',} // 合约24小时价格变动接口
requestAddress.GET_MARKET_PRICE = {url: urlHead + '/future/common/marketPrice', method: 'get',} // 合约最新标记价格和资金费率
requestAddress.GET_TICKER_PIRCE = {url: urlHead + '/future/common/tickerPirce', method: 'get',} // 合约最新价格
requestAddress.GET_CURRENT_DELEGATION = {url: urlHead + '/future/orders/openOrders', method: 'get',} // 当前委托
requestAddress.GET_CAPITAL_FLOW = {url: urlHead + '/future/orders/income', method: 'get',} // 资金流水
requestAddress.GET_CAPITAL_ALL_FLOW = {url: urlHead + '/future/orders/allOrders', method: 'get',} // 历史委托
requestAddress.GET_CAPITAL_DEAL = {url: urlHead + '/future/orders/userTrades', method: 'get',} // 历史成交
requestAddress.GET_CAPITAL_CANCEL = {url: urlHead + '/future/orders/cancel', method: 'post',} // 取消订单
requestAddress.GET_CAPITAL_CANCELALL = {url: urlHead + '/future/orders/cancelAll', method: 'post',} // 取消全部订单
requestAddress.POST_CAPITAL_BIAN = {url: urlHead + '/future/account/userAccount', method: 'get',} // 保证金余额
requestAddress.GET_POSITIONSIDE_DUAL = {url: urlHead + '/future/account/positionSide/dual', method: 'get',} // 查询单双仓模式
requestAddress.POST_SINGLE_DOUBLE = {url: urlHead + '/future/account/positionSide', method: 'post',} // 切换单双仓
requestAddress.POST_LEVELRAGE = {url: urlHead + '/future/account/levelrage', method: 'post',} // 调整杠杆接口
requestAddress.POST_MARGIN_TYPE = {url: urlHead + '/future/account/marginType ', method: 'post',} // 变换全仓逐仓
requestAddress.GET_POSITION_RISK = {url: urlHead + '/future/account/positionRiskv2', method: 'get' ,} // 查询全仓逐仓 杠杆倍数 最大头寸

requestAddress.GET_DEPTH = {url: urlHead + '/future/common/depth', method: 'get',} // 合约深度
requestAddress.GET_TRADES = {url: urlHead + '/future/common/aggTrades', method: 'get',} // 获取实时成交
requestAddress.GET_USER_LISTENKEY = {url: urlHead + '/future/user/listenKey', method: 'get',} // 获取 listenKey 信息
requestAddress.POST_KEEP_LISTENKEY = {url: urlHead + '/future/user/keepListenKey', method: 'post',} // 延长 listenKey 信息
requestAddress.POST_CLOSE_LISTENKEY = {url: urlHead + '/future/user/closeListenKey', method: 'post',} // 关闭 listenKey 信息
requestAddress.POST_ORDERS_POSITION = {url: urlHead + '/future/orders/closePosition', method: 'post',} // 平仓
requestAddress.POST_ORDERS_CREATE = {url: urlHead + '/future/orders/create', method: 'post',} // 开仓
requestAddress.POST_STOP_POSITION = {url: urlHead+'/future/orders/stopPosition', method: 'post'}  //止盈止损接口

requestAddress.GET_BALAN_ACCOUNT = {url: urlHead+'/future/account/userBalancev2', method: 'get'}  //账户余额
requestAddress.GET_POSITION_RISKV = {url: urlHead + '/future/account/positionRiskv2', method: 'get' ,} // 查询全仓逐仓


export default requestAddress
