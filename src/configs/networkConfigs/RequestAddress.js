// /apis->/crypto
const urlHead = '/apis'
const requestAddress = {}

requestAddress.INDEXHEADER = {url: '', method: 'get', timeout: null, responseType: null} //demo

requestAddress.REGISTER = {url: urlHead+'/user/register', method: 'post'}  // 注册
requestAddress.LOGIN = {url: urlHead+'/user/signin', method: 'post'}  // 登录
// requestAddress.LOGIN = {url: urlHead+'/user/signInForTest', method: 'post'}  // 登录
requestAddress.REGISTER_BY_MOBILE = {url: urlHead+'/user/registerByMobile', method: 'post'}  // 手机注册


requestAddress.REGISTER_BY_MOBILE_INFO = {url: urlHead+'/user/AreaCode', method: 'get'}  // 手机注册获取电话信息
requestAddress.REGISTER_BY_MOBILE_INFO_ZH = {url: urlHead+'/user/AreaCodeForIdenty', method: 'get'}  // 手机注册获取电话信息

requestAddress.LOGIN_BY_MOBILE = {url: urlHead+'/user/signInByMobile', method: 'post'}  // 手机登录
// requestAddress.ORDERS = {url: urlHead+'/v1/user/accounts', method: 'get'} // 请求订单
requestAddress.ORDERS = {url: urlHead+'/v1/user/currency/accounts', method: 'get'} // 请求订单
requestAddress.GOOGLEVALIDATIONSECOND = {url: urlHead+'/auth/bindGA', method: 'post'} //谷歌验证
// requestAddress.GOOGLEVALIDATION = {url: urlHead+'/auth/bindGA?type=WITHDRAW', method: 'get'} //获取谷歌验证码
requestAddress.CHECKLOGININ = {url: urlHead+'/user/checkLogin', method: 'post'} //检查登录
// requestAddress.POSTIDENTIFYINGCODE = {url: urlHead+'/auth/getVerificationCode', method: 'post'} //发起各种验证码请求，谷歌、手机等,{type,mun,purpose}
requestAddress.POST_VERIFICATION_CODE = {url: urlHead+'/auth/getVerificationCode', method: 'post'} //发起各种验证码请求，如谷歌、手机等
requestAddress.LOGIN_OFF = {url: urlHead+'/user/signout', method: 'post'} //登出
// requestAddress.RECHARGE_AND_WITHDRAWALS_RECORD = {url: urlHead+'/v1/user/accounts', method: 'get'}//请求充值提现记录
requestAddress.RECHARGE_AND_WITHDRAWALS_RECORD = {url: urlHead+'/v1/user/currency/accounts', method: 'get'}//请求充值提现记录
requestAddress.RECHARGE = {url: urlHead+'/user/deposit', method: 'post'} //充值
requestAddress.GET_CURRENCY = {url: urlHead+'/user/currencys', method: 'get'} //获取币种

requestAddress.GET_OTC_CURRENCY = {url: urlHead+'/user/otc/currency', method: 'get'} //获取法币
requestAddress.GET_AUTH_STATE = {url: urlHead+'/auth/getAuths', method: 'post'} //获取认证状态
requestAddress.FIND_BACK_PASSWORD = {url: urlHead+'/auth/commonAuth', method: 'post'} //找回密码
requestAddress.VERIFYING_LOGIN_STATE = {url: urlHead+'/auth/isFalseLogin', method: 'post'} //验证伪登录状态
requestAddress.FIND_BACK_PASSWORD_RESET = {url: urlHead+'/user/resetLoginPassword', method: 'post'}//找回密码重置
requestAddress.FIND_BACK_MOBILE_PASSWORD_RESET = {url: urlHead+'/user//resetMobileLoginPassword', method: 'post'}//找回密码重置
requestAddress.RECHARGE_LOG = {url: urlHead+'/user/depositLog', method: 'post'} //充值记录
requestAddress.WITHDRAWS_LOG = {url: urlHead+'/user/withdrawLog', method: 'post'}  //提现记录
// requestAddress.GET_TRANSFER_LIST = {url: urlHead+'/user/inner/transfer/list', method: 'get'}  //转账记录
requestAddress.GET_TRANSFER_LIST = {url: urlHead+'/user/inner/transfer/list', method: 'get'}  //内部转账记录
requestAddress.PROHIBIT_ALL_CURRENCY = {url: urlHead+'/user/transfer/prohibitAllCurrency', method: 'get'}  //内部转账记录
requestAddress.GET_TRANSFER_SPOT_LIST = {url: urlHead+'/user/transfer/spot/list', method: 'get'}  //划转记录
// requestAddress.POST_TRANSFER_SPOT = {url: urlHead+'/user/transfer/spot', method: 'post'}  //划转
requestAddress.POST_TRANSFER_SPOT = {url: urlHead+'/user/transferBetweenAccount', method: 'post'}  //划转
requestAddress.GET_IDENTITY_AUTH_STATUS = {url: urlHead+'/auth/getIdentityAuthStatus', method: 'get'} //获取身份认证状态
requestAddress.FIND_FEE_BDB_INFO = {url: urlHead+'/user/findfeebdbinfo', method: 'get'} //查询BDB是否抵扣
requestAddress.FIND_FEE_DEDUCTION_INFO = {url: urlHead+'/user/findFeeDeductionInfo', method: 'get'} //查询BDB是否抵扣


// requestAddress.REMOVE_GA_CODE = {url: urlHead+'/auth/removeBindGA', method: 'post'} //取消谷歌验证

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
// requestAddress.GET_BTC_TO_CNY = {url: urlHead+'/user/getBtcToCNY', method: 'get'} //获取BTC对CNY的汇率
requestAddress.GET_EXCHANGE__RAGE = {url: urlHead+'/user/getExchangeRate', method: 'get'}//获取各种汇率

// requestAddress.GET_ORDERS_DETAIL = {url: urlHead+'/v1/trade/orders', method: 'get'} //获取委托订单详情，需要拼接
requestAddress.POST_FEE_DETAIL = {url: urlHead+'/user/feeDetails', method: 'post'} //获取抵扣详情
requestAddress.POST_COMMON_AUTH = {url: urlHead+'/auth/commonAuth', method: 'post'} //各种认证，如绑定手机、绑定密码、发起提现等
requestAddress.POST_COMMON_AUTH_UNBIND = {url: urlHead+'/auth/removeAuth', method: 'post'} //解绑手机接口，解绑谷歌验证
requestAddress.POST_CHANGE_PASSWORD = {url: urlHead+'/user/alterLoginPassword', method: 'post'} //修改密码接口
requestAddress.POST_CHANGE_PASSWORD_BY_MOBILE = {url: urlHead+'/user/alterLoginPasswordByMobile', method: 'post'} //手机用户修改密码接口

// requestAddress.POST_INVITE_TOP = {url: urlHead+'/user/invitetop', method: 'get'} //请求活动页

requestAddress.DEPTH = {baseURL: '', url: urlHead+'/v1/market/depth', method: 'get'} //深度
requestAddress.TRADE_ORDERS = {url: urlHead+'/v1/trade/orders', method: 'post'} // 买卖/撤单
// requestAddress.GRC_PRICE_RANGE = {url: urlHead+'/user/grc/symbol/priceRange', method: 'get'} // 获取grcPriceRange 的接口
requestAddress.KK_PRICE_RANGE = {url: urlHead+'/user/kk/symbol/priceRange', method: 'get'} // 获取KKPriceRange 的接口
requestAddress.GRC_ACTIVITYREWARDS = {url: urlHead+'/user/getGrcActivityRewards', method: 'post'} // 获取grc 详情列表的接口
requestAddress.KK_ACTIVITYREWARDS = {url: urlHead+'/user/getKKActivityRewards', method: 'post'} // 获取KK 详情列表的接口
requestAddress.INITIAL_REWARD = {url: urlHead+'/user/initial/reward', method: 'get'} // 获取活动奖励的接口
requestAddress.POST_USER_ORDERS = {url: urlHead+'/user/orders', method: 'post'} // 当前委托和历史委托，参数为'offsetId:开始查询的订单id','limit:获取数量','isFinalStatus:是否为历史订单，true为历史订单，false为当前订单'

// requestAddress.COMMON_SYMBOLS = {url: urlHead+'/v1/common/symbols', method: 'get'} // 获取货币对
requestAddress.COMMON_SYMBOLS = {url: urlHead+'/user/symbols', method: 'get'} // 获取货币对
requestAddress.GET_HOMEPAGE_SYMBOLS = {url: urlHead+'/user/homePage/symbols/', method: 'get'} // 获取首页横排导航币对顺序 链接拼接参数H5 PC

requestAddress.MARKET_PRICES = {url: urlHead+'/v1/market/prices', method: 'get'} // 获取货币对价格
requestAddress.GET_TICK_CACHE = {url: urlHead+'/user/getTickCache', method: 'get'} // 获取全站实时成交


requestAddress.CURRENCYS = {url: urlHead+'/user/currencys', method: 'get'}  // 资产类型 || 获取币种
// requestAddress.ACCOUNTS = {url: urlHead+'/v1/user/accounts', method: 'get'} // 账户资产 || 请求充值提现记录
requestAddress.ACCOUNTS = {url: urlHead+'/v1/user/currency/accounts', method: 'get'} // 账户资产 || 请求充值提现记录


requestAddress.BTC_USD_K_1_SEC = {url: urlHead+'/v1/market/bars/BTC_USD/K_1_SEC', method: 'get'}

// 获取好友人气榜
requestAddress.GET_SHARE_SORT_LIST = {url: urlHead+'/user/invitetop', method: 'get'}
// 问题模块列表
requestAddress.GET_ORDER_TEMPLATE = {url: urlHead+'/workorder/listOrderType', method: 'get'}
// 提交工单请求
requestAddress.CREATE_ORDER = {url: urlHead+'/workorder/createOrder', method: 'post'}
//工单列表
requestAddress.WORKORDER_LIST = {url: urlHead+'/workorder/listOrderForUser', method: 'get'}

requestAddress.WORKORDER_INFO = {url: urlHead+'/workorder/listOrderInfo', method: 'post'}

requestAddress.REPLY_ORDER = {url: urlHead+'/workorder/replyOrder', method: 'post'}


// 注册用户IP
requestAddress.ADD_API_KEY = {url: urlHead+'/user/addApiKey', method: 'post'}


// 我的推荐
requestAddress.POST_INVITES = {url: urlHead+'/user/getMyInvites', method: 'post'}


// 接极验
requestAddress.GET_GEETEST_INIT = {url: urlHead+'/user/getGeetest', method: 'post'}
// requestAddress.POST_GEETEST_CHECK = {url: urlHead+'/user/checkGeetest', method: 'post'}

// 撤销提现申请
requestAddress.POST_CANCEL_WITHDRAWALS = {url: urlHead+'/user/cancelWithdrawRequest', method: 'post'}

// 公告列表
requestAddress.POST_NOTICE_LIST = {url: urlHead+'/user/findNoticeList', method: 'post'}

// 公告详情
requestAddress.POST_NOTICE_DETAIL = {url: urlHead+'/user/findNoticeInfo', method: 'post'}


// mobile 公告列表
requestAddress.MOBILE_POST_NOTICE_LIST = {url: urlHead+'/user/findNoticeList', method: 'post'}
// mobile 公告详情
requestAddress.MOBILE_POST_NOTICE_DETAIL = {url: urlHead+'/user/findNoticeInfo', method: 'post'}

// 获取平台奖励
requestAddress.POST_PLATFORM_REWARD = {url: urlHead+'/user/findSystemReward', method: 'post'}

//  elf币种url
// 充值奖励列表
requestAddress.DEPOSIT_LOGS_FOR_ELF = {url: urlHead+'/activity/depositLogsForELF', method: 'post'}
// 交易排行榜 /activity/tradeRankingForELF
requestAddress.TRADE_RANKING_FOR_ELF = {url: urlHead+'/activity/tradeRankingForELF', method: 'get'}

// iost 币种url
// 充值奖励列表
requestAddress.DEPOSIT_LOGS_FOR_IOST = {url: urlHead+'/activity/depositLogsForIOST', method: 'post'}
// 交易排行榜
requestAddress.TRADE_RANKING_FOR_IOST = {url: urlHead+'/activity/tradeRankingForIOST', method: 'get'}

// 获取服务器时间 /user/getServerTime
requestAddress.GET_SEVER_TIME = {url: urlHead+'/user/getServerTime', method: 'get'}

// 推荐奖励
requestAddress.POST_INVITE_AWARDS_IOST = {url: urlHead+'/activity/inviteAwardsIOST', method: 'post'}
// 注册奖励
requestAddress.POST_REGIST_AWARDS_IOST = {url: urlHead+'/activity/registAwardsIOST', method: 'post'}

// 安全日志记录
requestAddress.POST_LOG_RECORD = {url: urlHead+'/user/findLoginRecords', method: 'post'}

// 3—23 抽奖活动 start
// 获取抽奖次数
requestAddress.GET_CHANCE = {url: urlHead+'/activity/getMyChance', method: 'post'}
// 加载奖品列表
requestAddress.DRAW_LIST = {url: urlHead+'/activity/prizelist', method: 'post'}
// 点击进行转盘抽奖
requestAddress.CLICK_CHANCE = {url: urlHead+'/activity/drawLottery', method: 'post'}
//提交中奖信息
requestAddress.LUCK_SUBMIT = {url: urlHead+'/activity/submitContacts', method: 'post'}
// 获取已中奖列表
requestAddress.GET_LUCKS = {url: urlHead+'/activity/getlucks', method: 'post'}

// 3—23 抽奖活动 end

// 首页获取banner
requestAddress.GET_HOME_BANNER = {url: urlHead+'/user/homeBanner', method: 'get'}
// 移动端首页获取banner
requestAddress.GET_HOME_BANNERM = {url: urlHead+'/user/homeBannerM', method: 'get'}


// 我的推荐新接口
requestAddress.POST_RECOMMEND = {url: urlHead+'/user/myinvitees', method: 'post'}

// 2018-4-11  IOST活动  请求详情
requestAddress.GET_REWARD_LIST = {url: urlHead+'/activity/usdtActivityAccount', method: 'post'}
requestAddress.GET_RECEIVE = {url: urlHead+'/activity/receiveUSDTReward', method: 'post'}

// 2018-4-17 动态获取费率标准
requestAddress.GET_RATE = {url: urlHead+'/user/withdrawFeeInfo', method: 'get'}

// 2018-4-18  MTC活动 请求推荐人数 Recommend
requestAddress.GET_RECOMMEND = {url: urlHead+'/activity/invitesForMTC', method: 'get'}
// 获取MTC排行奖励
requestAddress.GET_RANKINGS_URL = {url: urlHead+'/activity/activityInfoForMTC', method: 'get'}

// 2018-4-25  notice顶部小红点接口
requestAddress.GET_READ_NOTICE = {url: urlHead+'/user/readNotice', method: 'post'}
requestAddress.GET_HAVE_READ_NOTICE = {url: urlHead+'/user/readNoticeList', method: 'post'}


// 2018-4-26 我的推荐新接口，多了累计推荐总计的返回值
requestAddress.POST_NEW_INVITES = {url: urlHead+'/user/myinvitees', method: 'post'}


// 2018-4-19 APP下载连接请求
requestAddress.GET_APPUPDATE = {url: urlHead+'/user/AppUpdate', method: 'get'}

// 2018-4-25  KEY活动
requestAddress.GET_KEY_RECOMMEND = {url: urlHead+'/activity/invitesForKEY', method: 'get'}
requestAddress.GET_KEY_RANKINGS_URL = {url: urlHead+'/activity/activityInfoForKEY', method: 'get'}

// 2018-4-26  MTC请求详情和点击领取
requestAddress.GET_MTC_LIST = {url: urlHead+'/activity/receiveMTCActivity', method: 'post'}
requestAddress.GET_MTC_ACTIVE = {url: urlHead+'/activity/receiveMTCReward', method: 'post'}

// 2018-5-2   KEY请求详情和点击领取
requestAddress.GET_KEY_LIST = {url: urlHead+'/activity/keepCapitalActivity', method: 'post'}
requestAddress.GET_KEY_ACTIVE = {url: urlHead+'/activity/receiveCapitalReward', method: 'post'}

// 2018-5-8 获取邀请人数
requestAddress.GET_PERSON_URL = {url: urlHead+'/user/getInviteSuccess', method: 'get'}

// 2018-5-9 获取邀请海报
requestAddress.GET_POSTER_URL = {url: urlHead+'/user/createPoster', method: 'get'}

// 2018-5-9 充值交易排行
requestAddress.GET_RECHARGE_SORT_URL = {url: urlHead+'/activity/activityInfoAll', method: 'post'}

// 2018-5-10 币世界活动三奖励列表
requestAddress.GET_BISHIJIE_LIST_URL = {url: urlHead+'/activity/currencysRewardInfo', method: 'post'}
// 2018-5-10 币世界活动三立即领取
requestAddress.BISHIJIE_RECEIVE = {url: urlHead+'/activity/receiveRewardCurrencys', method: 'post'}

// 2018-05-10 币世界注册页接口
requestAddress.BISHIJIE_REGISTER_BANNER_PRICE = {url: urlHead+'/activity/getPrice', method: 'post'}

// 2018-05-10 为兼容ios加cookie接口
requestAddress.PUT_COOKIE = {url: urlHead+'/user/putcookies', method: 'post'}

// 获取币种资料
requestAddress.GET_CURRENCY_INTRODUCTION = {url: urlHead+'/user/currencyInfo', method: 'post'}


// 2018-5-3 实时成交接口
requestAddress.GET_SYMBOL_TRADE = {url: urlHead+'/user/symbolTrade', method: 'post'}

// 2018-5-18 币得宝活动 列表
requestAddress.GET_BIDEBAO_LIST = {url: urlHead+'/user/lockAccountprojects', method: 'get'}

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


// 2018-5-21 币得宝活动 历史记录
requestAddress.GET_BIDEBAO_RECORDS = {url: urlHead+'/user/getLockPostionRecord', method: 'post'}

// 2018-6-16  创建API KEY
requestAddress.API_KEY_EMAIL = {url: urlHead+'/user/apikeyemail', method: 'post'}
// 添加api key /user/addApiKey
requestAddress.MANAGE_ADD_API_KEY = {url: urlHead+'/user/addApiKey', method: 'post'}
// 删除api key /user/delApiKey
requestAddress.MANAGE_DELETE_API_KEY = {url: urlHead+'/user/delApiKey', method: 'post'}
// 短信验证码 auth/getVerificationCode
requestAddress.GET_VERIFICATIONCODE = {url: urlHead+'/auth/getVerificationCode', method: 'post'}


// 2018-06-08 平台分红接口 start

// 平台分红-首页算力信息
// requestAddress.GET_BTACTIVITY_CURRENT = {url: '/apis/apis/activity/current', method: 'get'}//原来这个样
requestAddress.GET_BTACTIVITY_CURRENT = {url: urlHead+'/apis/activity/current', method: 'get'}


// 个人挖矿信息1 *用于bt首页
requestAddress.GET_BT_MININGINFORMATION_FOR_USER = {url: urlHead+'/activity/miningInformation', method: 'get'}

// 个人挖矿信息2 *用于bt首页
requestAddress.GET_BT_USER_REWARD = {url: urlHead+'/activity/getUserReward', method: 'get'}

// 平台分配信息1 轮询接口 *用于bt首页
requestAddress.GET_BT_FEE_DIVIDENT = {url: urlHead+'/activity/getFeeDividend', method: 'get'}

// 平台分配信息2 *用于bt首页
requestAddress.GET_BT_PLATFORM_DATA = {url: urlHead+'/activity/platformData', method: 'get'}

// 个人当前BT资产 *用于bt首页
requestAddress.GET_BT_USER_ACCOUNT_INFO = {url: urlHead+'/activity/getUserAccountInfo', method: 'get'}

// 平台分配收益 *用于平台分配历史页
requestAddress.GET_BT_PLATFORM_HISTORY_LIST_DIG_HISTORY = {url: urlHead+'/activity/list/dig/history', method: 'post'}

// 平台总计获得BT *用于平台分配历史页
requestAddress.GET_BT_PLATFORM_DIG_AMOUNT = {url: urlHead+'/activity/get/dig/amount', method: 'get'}

// 平台分配历史 *用于分配收益页
requestAddress.GET_BT_PLATFORM_DIVIDEND_FOR_HISTORY = {url: urlHead+'/activity/dividendForHistory', method: 'post'}

// 获取我的邀请奖励数据
requestAddress.GET_USER_REWARD_FOR_INVITES = {url: urlHead+'/user/myinvitees', method: 'post'}
requestAddress.GET_KK_REWARD_FOR_INVITES = {url: urlHead+'/user/getKKDetail/', method: 'get'}
requestAddress.GET_FF_REWARD_FOR_INVITES = {url: urlHead+'/user/getFFDetail/', method: 'get'}


// 获取收益记录
requestAddress.GET_BT_GRAND_TOTAL = {url: urlHead+'/activity/grandTotal', method: 'get'}

// 获取收益记录表 *用于个人历史收益页 挖矿收益
requestAddress.GET_BT_REVENUE_RECORD = {url: urlHead+'/activity/revenueRecord', method: 'post'}

// 配置我的推荐的百分比 *用于我的推荐页面
requestAddress.GET_BT_REGULATION_CONFIG = {url: urlHead+'/activity/regulationConfig', method: 'get'}

// 获取bdb燃烧额外奖励
requestAddress.GET_BT_BURNING_BDB_REWARD = {url: urlHead+'/activity/buringBDBReward', method: 'post'}


// 我的推荐是否展示'查看历史'四个字
requestAddress.GET_MY_INVITES_HISTORY_SHOW = {url: urlHead+'/user/historyInviteFlag', method: 'get'}


// 2018-06-12 平台分红接口 end

// 2018-07-03 获取我的邀请海报地址
// requestAddress.GET_USER_MY_INVITES_POSTER = {url: urlHead+'/user/getInvitePoster', method: 'post'}
requestAddress.GET_USER_INVITE_POSTER = {url: urlHead+'/user/getUserInvitePoster', method: 'post'}


// 2018-07-11 交易排行榜接口
// 获取用户交易信息
requestAddress.GET_USER_TRANSCATION = {url: urlHead+'/activity/getUserTranscation', method: 'get'}
// 获取文案
requestAddress.GET_DESCRIPTION = {url: urlHead+'/activity/getDescription', method: 'post'}
// 获取榜单
requestAddress.GET_RANKING_LIST = {url: urlHead+'/activity/getRankingList', method: 'get'}

// 2018-07-02 是否弹出某个朦层
requestAddress.SHOW_FLOAT_LAYER = {url: urlHead+'/activity/needbtlayer', method: 'get'}
// 2018-07-02 是否已经查看了某个朦层
requestAddress.READY_LAYER = {url: urlHead+'/activity/readbtlayer', method: 'get'}

// 2018-07-14 网易注册新接口
requestAddress.NETEASE_REGISTER = {url: urlHead+'/user/partnerRegister', method: 'post'}

requestAddress.NETEASE_BIND_USER = {url: urlHead+'/user/partnerBindUser', method: 'post'}

// 2018-07-27 网易着陆页接口
requestAddress.NETEASE_TEMP_SEND = {url: urlHead+'/user/tempSend', method: 'post'}


requestAddress.NETEASE_LAND_VALIDATE = {url: urlHead+'/user/landValidate', method: 'post'}
// requestAddress.NETEASE_LAND_VALIDATE = {url: urlHead+'/activity/v1/landValidate', method: 'post'}
// 2018-07-27 网易着陆页之后，判断另两个活动页
requestAddress.NETEASE_MUTUAL_VALIDATE = {url: urlHead+'/user/mutualValidate', method: 'get'}
// 2018-07-31 网易获取币对汇率
requestAddress.NETEASE_FIND_EXCHANGE_RATE = {url: urlHead+'/user/findExchangeRate', method: 'get'}
// 2018-08-01 网易详情页
requestAddress.NETEASE_STROKE_CAPITAL = {url: urlHead+'/user/strokeCapital', method: 'post'}

// 2018-08-10 bt挖矿获取平台今日挖bt数量
requestAddress.GET_BT_PLATFORM_BT_DATA = {url: urlHead+'/activity/getPlatformBTData', method: 'get'}

// 2018-9-5 获取cookie
requestAddress.GET_COOKIES = {url: urlHead+'/user/getCookies', method: 'get'}


// 2018-9-12
// 幸运抽奖首页列表
requestAddress.GET_GUESS_INDEX = {url: urlHead+'/luckyGuess/guessIndex', method: 'get'}
// 销毁记录
requestAddress.GET_DESTROY_RECORD = {url: urlHead+'/luckyGuess/getDestroyRecord', method: 'post'}
// 开奖记录
requestAddress.GET_LOOTERY_RECORD = {url: urlHead+'/luckyGuess/getLotteryRecord', method: 'post'}
// 买入
requestAddress.LUCK_GUESS = {url: urlHead+'/luckyGuess/toGuess', method: 'post'}
// 显示每人购买多少数量
requestAddress.TO_PARTICIPATE = {url: urlHead+'/luckyGuess/toParticipate', method: 'post'}
// 是否勾选过同意规则
requestAddress.ACTIVITY_RULES = {url: urlHead+'/luckyGuess/validateActivityRules', method: 'post'}
// 已阅读并同意抽奖规则
requestAddress.AGREE_ACTIVITY_RULES = {url: urlHead+'/luckyGuess/agreeActivityRules', method: 'post'}
// 我的参与记录
requestAddress.POST_MY_PREDICT_RECORD = {url: urlHead+'/luckyGuess/myPredictRecord', method: 'post'}
// 我的参与详情
requestAddress.POST_MY_PREDICT_RECORD_DETAIL = {url: urlHead+'/luckyGuess/predictRecordDetail', method: 'post'}
// 本期参与记录
requestAddress.POST_LUCKY_GUESS_CURRENT_PERIOD_PARTAKE = {url: urlHead+'/luckyGuess/currentPeriodPartake', method: 'post'}
requestAddress.GET_PERIOD_RECORD = {url: urlHead+'/luckyGuess/getperiodRecord', method: 'get'}




// 2018-9-13 超级为蜜
requestAddress.GET_SUPER_BEE_MECHANISM_INFO = {url: urlHead+'/user/applyHoneyWei', method: 'get'} // 机构为蜜列表
requestAddress.POST_SUPER_BEE_PERSONAL_RECOED = {url: urlHead+'/user/currencyRecord', method: 'post'} // 我的为蜜 个人中心
requestAddress.POST_SUPER_BEE_REVENUE_RECORD = {url: urlHead+'/user/revenueRecord', method: 'post'} // 我的为蜜 收益记录
requestAddress.POST_SUPER_BEE_PERCONAL_UN_LOCK = {url: urlHead+'/user/unlockHoney', method: 'post'} // 我的为蜜解锁
requestAddress.GET_SUPER_BEE_USER_STATE = {url: urlHead+'/user/getUserAptitude', method: 'get'} // 我的为蜜状态
requestAddress.GET_SUPER_BEE_STATE = {url: urlHead+'/user/getBeeUser', method: 'get'} // 获取是否是为蜜用户
requestAddress.GET_SUPER_BEE_INTRODUCTION = {url: urlHead+'/user/introductionForBee', method: 'post'} // 获取为蜜资料


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


// 2019-3-4
// 获取投票情况
requestAddress.GET_VOTE_STATUS = {url: urlHead+'/activity/combinecoin/vote/status', method: 'get'}
// 获取用户投票数量
requestAddress.GET_VOTE_USABLE = {url: urlHead+'/activity/combinecoin/vote/', method: 'get'}//需要拼接UID
// 投票
requestAddress.POST_VOTE = {url: urlHead+'/activity/combinecoin/vote/', method: 'post'}//需要拼接UID

//2019-04-25,获取充值排行
requestAddress.GET_RECHARGE_RANKING_LIST = {url: urlHead+'/activity/promotion/ranking', method: 'get'}

//2020-02-12,KK交易挖矿报名
requestAddress.GET_MATCH_DATA = {url: urlHead+'/quant/matchData/', method: 'get'}//查询配套数据
requestAddress.GET_BALANCE = {url: urlHead+'/quant/getUserBalance/', method: 'get'}//查询用户余额
requestAddress.GET_GETREG_DATA = {url: urlHead+'/quant/getRegData/', method: 'get'}//查询报名记录
requestAddress.GET_USER_TRADE = {url: urlHead+'/quant/user/getUserTrade/', method: 'get'}//量化展示_量化交易记录
requestAddress.GET_TRADE = {url: urlHead+'/quant/user/quantTrade/', method: 'get'}//量化展示_量化基本信息
requestAddress.GET_HISTORY = {url: urlHead+'/quant/user/getHistRegAct/', method: 'get'}//量化展示_量化基本信息
requestAddress.GET_HISTORICAL_DETAILS = {url: urlHead+'/quant/user/getRewardDetail/', method: 'get'}//量化展示_量化基本信息
requestAddress.POST_REGACT = {url: urlHead+'/quant/regAct', method: 'post'}//活动报名


//2020-02-14，拼团相关接口
requestAddress.POST_CREATE_GROUP = {url: urlHead+'/assemble/createGroup', method: 'post'}//活动报名/
requestAddress.POST_LEVEA_GROUP = {url: urlHead+'/assemble/leveaGroup', method: 'post'}//活动报名/
requestAddress.POST_JOIN_GROUP = {url: urlHead+'/assemble/joinGroup', method: 'post'}//活动报名/
requestAddress.GET_ISEXIST_GNAME = {url: urlHead+'/assemble/isExistGname/', method: 'get'}//检查团名是否可用
requestAddress.GET_ASSEMBLE_GET = {url: urlHead+'/assemble/getMem/', method: 'get'}//获取用户组等级信息
requestAddress.GET_MEMBER_LIST = {url: urlHead+'/assemble/queryMemberList/', method: 'get'}//团员列表
requestAddress.GET_GROUP_INFO = {url: urlHead+'/assemble/queryShowGroupInfo/', method: 'get'}//拼团展示团队详情
requestAddress.GET_QUERY_GROUP_INFO = {url: urlHead+'/assemble/queryGroupInfo/', method: 'get'}//查询组详情
requestAddress.GET_GROUP_LIST = {url: urlHead+'/assemble/queryGroupList/', method: 'get'}//模糊查询可加入小组
requestAddress.GET_GROUP_MEMBERS = {url: urlHead+'/assemble/showImpGroupMembers/', method: 'get'}//显示重要团成员信息
requestAddress.GET_GROUP_DISCOUNT = {url: urlHead+'/assemble/getGroupDiscount/', method: 'get'}//获取团长剩余折扣
requestAddress.POST_SET_MEMBER = {url: urlHead+'/assemble/setGroupMember', method: 'post'} // 设置团成员折扣
requestAddress.GET_EDIT_MEMBER = {url: urlHead+'/assemble/getEditQqMember/', method: 'get'} // 获取编辑member信息
requestAddress.POST_MODIFY_DISCOUNT = {url: urlHead+'/assemble/reduceMemberDisCount', method: 'post'} // 组织成员降级

//2020-02-18，转账相关接口
// requestAddress.REGISTER_BY_MOBILE = {url: urlHead+'/user/registerByMobile', method: 'post'}  // 手机注册
// requestAddress.LOGIN_BY_MOBILE = {url: urlHead+'/user/signInByMobile', method: 'post'}  // 手机登录
// 短信验证码    //  转账接口    auth/getVerificationCode
requestAddress.GET_VERIFICATIONCODE = {url: urlHead+'/auth/getVerificationCode', method: 'post'}//获取手机,邮箱验证码
requestAddress.POST_VERIFYIDENTITY_USER = {url: urlHead+'/user/verifyIsIdentityUser', method: 'post'} //验证收款人是否为实名认证用户
// 查询当前币种的转账数量限制与手续费等信息
requestAddress.GET_TRANSFER_AMOUNT_INFO = {url: urlHead+'/user/transfer/getTransferAmountInfo', method: 'get'} // 获取当前币种是否可以转账


//2020-03-13会员相关接口
requestAddress.POST_BUY_CARD = {url: urlHead+'/memberCard/buyCard', method: 'post'} //会员卡购买
requestAddress.GET_CHECK = {url: urlHead+'/memberCard/checkMember/', method: 'get'} // 是否是会员
requestAddress.GET_BUY_RECORDS = {url: urlHead+'/memberCard/buyRecords/', method: 'get'} // 会员购买记录
requestAddress.GET_CHECK_ENOUGH_BALANCE = {url: urlHead+'/memberCard/checkEnoughBalance/', method: 'get'} // 会员卡报名是否金额足够
requestAddress.POST_TRANSFERVIP = {url: urlHead+'/memberCard/transferMemberCard', method: 'post'}//会员卡转让

requestAddress.LOCK_ASSET = {url: urlHead+'/asset/user/lock/asset', method: 'post'} // 锁仓接口
requestAddress.LOCK_ASSET_RECODE = {url: urlHead+'/asset/user/assets', method: 'get'} // 锁仓记录
requestAddress.UNLOCK_ASSET_RECODE = {url: urlHead+'/asset/user/unlock/asset', method: 'post'} // 解锁锁仓
requestAddress.TOTAL_LOCK_REWARD = {url: urlHead+'/asset/user/total/reward', method: 'get'} // 锁仓累计
requestAddress.LOCK_COUNT = {url: urlHead+'/asset/user/lock/count', method: 'get'} // 锁仓次数

//2020-05-28TKF理财相关接口
requestAddress.GET_PROJECT_LIST = {url: urlHead+'/tkf/projectList', method: 'get'} // TKF产品简介
requestAddress.POST_PURCHASE_TKF = {url: urlHead+'/tkf/purchase', method: 'post'} // 申购TKF
requestAddress.GET_FUND_DETAILS = {url: urlHead+'/tkf/purchasePageInfo', method: 'get'} // 申购基金详情
requestAddress.TKF_FINANCIAL_RECORDS = {url: urlHead+'/tkf/financialRecords', method: 'get'}  //理财基金状态
requestAddress.TKF_PREDICT_RECORD_DETAIL = {url: urlHead+'/tkf/predictRecordDetail', method: 'post'}  //基金详情
requestAddress.FUND_RECORDS_LISTS = {url: urlHead+'/tkf/tkfPayRecord', method: 'get'}  //基金记录页面
requestAddress.GET_TKF_TICKETS = {url: urlHead+'/tkf/getTkftickets', method: 'get'}  //开奖记录页面

//2020-06-05 获取热度值接口
requestAddress.GET_HEAT_LIST = {url: urlHead+'/memberCard/queryHotDetail/', method: 'get'}  //获取热度列表


//2020-06-15  跟单相关接口
requestAddress.BIG_BROTHER_LIST = {url: urlHead+'/follow/listGod', method: 'post'} //首页大佬列表
requestAddress.POST_ADDFOLLOWER= {url: urlHead+'/follow/user/addFollower', method: 'post'}  //跟单
requestAddress.POST_BROTHER_ORDER= {url: urlHead+'/follow/user/historyOrderList', method: 'post'}  //大佬历史持仓
requestAddress.POST_BROTHER_ORDER_SELF= {url: urlHead+'/follow/historyOrderList', method: 'post'}  //用户历史持仓
requestAddress.POST_FOLLOWUSER= {url: urlHead+'/follow/user/listFollowUser', method: 'post'}  //大佬跟随者
requestAddress.POST_FOLLOWUSER_LIST= {url: urlHead+'/follow/listFollowUser', method: 'post'}  //用户跟随者
requestAddress.POST_MY_USER= {url: urlHead+'/follow/user/myFollowList', method: 'post'}  //我的镜像交易
requestAddress.POST_DEL_FOLLOWER= {url: urlHead+'/follow/user/delFollower', method: 'post'}  //取消跟随
requestAddress.POST_AUTO_RENEW= {url: urlHead+'/follow/user/autoRenew', method: 'post'}  //自动续费
requestAddress.POST_UPDATE_RATEORLOT= {url: urlHead+'/follow/user/updateFollowRateOrLot', method: 'post'}  //确认修改
requestAddress.POST_GOD= {url: urlHead+'/follow/god', method: 'post'}  //自动续费
requestAddress.POST_GOD_BY_USERID= {url: urlHead+'/follow/godByUserId', method: 'post'}  //是否开启带单
requestAddress.POST_REVISION_FEE= {url: urlHead+'/follow/updateFee', method: 'post'}  //修改带单费用
requestAddress.POST_MANAGE = {url: urlHead+'/follow/followManage', method: 'post'}  //修改带单费用

export default requestAddress
