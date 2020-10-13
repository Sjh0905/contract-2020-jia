const root = {}

root.mode = 'history'
root.fallback = true
root.base = '/'

root.routes = []

root.routes.push({
  path: '',
  redirect: '/index',
  meta: {
    mobileHeaderTitle: ''
  },
  caseSensitive: true
})

// 404页面
root.routes.push({
  path: '*',
  redirect: '/index/home',
  meta: {
    mobileHeaderTitle: ''
  },
  caseSensitive: true,
  // component: resolve => require(['@/components/vue/IndexHome'], resolve)
})

// 好友邀请页面
root.routes.push({
  path: '/index/share',
  caseSensitive: true,
  name: 'FriendShare',
  meta: {
    mobileHeaderTitle: '',
    pcname: 'FriendShare',
    h5name: '',
  },
  component: resolve => require(['@/components/vue/IndexShare'], resolve)
})


// 20180607 H5BT活动首页     TODO：要删除
// root.routes.push({
//   path: '/static/mobileBTActivityHomePage',
//   name: 'MobileBTActivityHomePage',
//   caseSensitive: true,
//   meta: {
//     pcname: 'btActivity',
//     h5name: 'MobileBTActivityHomePage',
//   },
//   component: resolve => require(['@/components/btActivity/vue/MobileBTActivityHomePage.vue'], resolve),
// })

// 0714 netease 入口页
root.routes.push({
  path: '/static/registerForPartner',
  name: 'RegisterForPartner',
  caseSensitive: true,
  meta: {
    requireLogin: false,
    pcname: '',
    h5name: 'RegisterForPartner',
  },
  component: resolve => require(['@/components/mobileVue/MobileStaticForNetease.vue'], resolve),
})

root.routes.push({
  path: '/index/registerForPhone',
  name: 'RegisterForPhone',
  caseSensitive: true,
  meta: {
    requireLogin: false,
    requireLoginOff: true,
    pcname: '',
    h5name: 'RegisterForPhone',
  },
  component: resolve => require(['@/components/mobileVue/MobileRegisterForPhone.vue'], resolve),
})

root.routes.push({
  path: '/static/MobileStaticForNeteaseBind',
  name: 'MobileStaticForNeteaseBind',
  caseSensitive: true,
  meta: {
    requireLogin: false,
    pcname: '',
    h5name: 'MobileStaticForNeteaseBind',
  },
  component: resolve => require(['@/components/mobileVue/MobileStaticForNeteaseBind.vue'], resolve),
})

root.routes.push({
  path: '/static/MobileStaticNoJurisdiction',
  name: 'MobileStaticNoJurisdiction',
  caseSensitive: true,
  meta: {
    requireLogin: false,
    pcname: '',
    h5name: 'MobileStaticNoJurisdiction',
  },
  component: resolve => require(['@/components/mobileVue/MobileStaticNoJurisdiction.vue'], resolve),
})

root.routes.push({
  path: '/static/staticForPartnerInfo',
  name: 'MobileStaticForNeteaseInfo',
  caseSensitive: true,
  meta: {
    requireLogin: false,
    pcname: '',
    h5name: 'MobileStaticForNeteaseInfo',
  },
  component: resolve => require(['@/components/mobileVue/MobileStaticForNeteaseInfo.vue'], resolve),
})



// 上币公告 3_6 start
// root.routes.push({
//   path: '/index/currencyNotice',
//   name: 'ELFCurrencyNotice',
//   meta: {
//     requireLogin: false,
//     pcname: 'ELFCurrencyNotice',
//     h5name: '',
//   },
//   caseSensitive: true,
//   component: resolve => require(['@/components/vue/currencyNotice'], resolve)
// })

// 上币公告 3_9 end lost


// -------------------------------- mobile 部分 start ------------------------------------

// 双平台通证合并公投 TODO:要删除 check
// root.routes.push({
//   path: '/index/mobileCombinedVotePage',
//   name: 'MobileCombinedVotePage',
//   meta: {
//     requireLogin: false,
//     pcname: 'CombinedVote',
//     h5name: 'MobileCombinedVotePage',
//   },
//   caseSensitive: true,
//   component: resolve => require(['@/components/combinedCoinVote/vue/MobileCombinedVotePage'], resolve),
// })


// -------------------------------- mobile 部分 end ------------------------------------

// 幸运抽奖 end 2018-9-10

// 活动页面
// root.routes.push({
//   path: '/index/activity',
//   caseSensitive: true,
//   meta: {
//     mobileHeaderTitle: ''
//   },
//   component: resolve => require(['@/components/vue/Activity'], resolve),
//   children: [
//     // {
//     //   path: '',
//     //   // redirect: 'homePage',
//     //   redirect: 'iccOpen',
//     //   caseSensitive: true,
//     //   meta: {
//     //     mobileHeaderTitle: '',
//     //     pcname: 'iccOpen',
//     //     h5name: '',
//     //   },
//     // },
//     //     TODO：要删除
//     // 开放icc
//     // {
//     //   path: 'iccOpen',
//     //   name: 'iccOpen',
//     //   caseSensitive: true,
//     //   meta: {
//     //     mobileHeaderTitle: '',
//     //     pcname: 'iccOpen',
//     //     h5name: '',
//     //   },
//     //   component: resolve => require(['@/components/activity/vue/IccOpen'], resolve),
//     // },
//     //     TODO：要删除
//     // 抽奖活动
//     // {
//     //   path: 'luckDraw',
//     //   name: 'luckDraw',
//     //   caseSensitive: true,
//     //   meta: {
//     //     mobileHeaderTitle: '',
//     //     pcname: 'luckDraw',
//     //     h5name: '',
//     //   },
//     //   component: resolve => require(['@/components/activity/vue/LuckDraw'], resolve),
//     // },
//     //     TODO：要删除，转盘
//     // EOS抽奖活动
//     // {
//     //   path: 'luckDrawEOS',
//     //   name: 'luckDrawEOS',
//     //   caseSensitive: true,
//     //   meta: {
//     //     mobileHeaderTitle: '',
//     //     pcname: 'luckDrawEOS',
//     //     h5name: '',
//     //   },
//     //   component: resolve => require(['@/components/activity/vue/LuckDrawEOS'], resolve),
//     // },
//     //     TODO：要删除
//     // 交易大厅蒙层
//     // {
//     //   path: 'FloatingLayerTradingHall',
//     //   name: 'FloatingLayerTradingHall',
//     //   caseSensitive: true,
//     //   redirect: 'FloatingLayerRecommend',
//     //   meta: {
//     //     requireLogin: false,
//     //     templateClose: false,
//     //     pcname: 'FloatingLayerTradingHall',
//     //     h5name: '',
//     //   },
//     //   component: resolve => require(['@/components/FloatingLayer/vue/FloatingLayerTradingHall'], resolve),
//     // },
//     //     TODO：要删除
//     // 我的推荐蒙层
//     // {
//     //   path: 'FloatingLayerRecommend',
//     //   name: 'FloatingLayerRecommend',
//     //   caseSensitive: true,
//     //   meta: {
//     //     requireLogin: false,
//     //     templateClose: false,
//     //     pcname: 'FloatingLayerRecommend',
//     //     h5name: '',
//     //   },
//     //   component: resolve => require(['@/components/FloatingLayer/vue/FloatingLayerRecommend'], resolve),
//     // },
//   ]
// })


// 币得宝 TODO:要删除 check
// root.routes.push({
//   path: '/coinbaby',
//   component: resolve => require(['@/components/CoinBaby/vue/CoinBaby'], resolve),
//   caseSensitive: true,
//   meta: {},
//   children: [
//     {
//       path: '',
//       redirect: 'biDeBaoList',
//       caseSensitive: true,
//       meta: {
//         mobileHeaderTitle: '',
//         pcname: 'biDeBaoList',
//         h5name: '',
//       }
//     },
//     // 币得宝活动列表
//     //TODO:要删除
//     {
//       path: 'biDeBaoList',
//       name: 'biDeBaoList',
//       caseSensitive: true,
//       meta: {
//         requireLogin: false,
//         templateClose: false,
//         mobileHeaderTitle: '',
//         templatePath: '/index/home',
//         pcname: 'biDeBaoList',
//         h5name: '',
//       },
//       component: resolve => require(['@/components/bidebaoActivity/vue/BiDeBaoList'], resolve),
//     },
//     // 币得宝活动锁仓记录
//     //TODO:要删除
//     {
//       path: 'biDeBaoHistoricalRecords',
//       name: 'biDeBaoHistoricalRecords',
//       caseSensitive: true,
//       meta: {
//         requireLogin: false,
//         templateClose: false,
//         mobileHeaderTitle: '',
//         templatePath: '/index/home',
//         pcname: 'biDeBaoHistoricalRecords',
//         h5name: 'biDeBaoHistoricalRecords',
//       },
//       component: resolve => require(['@/components/bidebaoActivity/vue/BiDeBaoRecordsPage'], resolve),
//     },
//     // H5币得宝 首页列表页
//     //TODO:要删除
//     {
//       path: 'H5BDBIndexList',
//       name: 'H5BDBIndexList',
//       caseSensitive: true,
//       meta: {
//         requireLogin: false,
//         templateClose: false,
//         mobileHeaderTitle: '',
//         pcname: '',
//         h5name: 'H5BDBIndexList',
//       },
//       component: resolve => require(['@/components/bidebaoActivity/vue/H5BDBIndexList'], resolve),
//     },
//     // H5币得宝 锁仓详情页
//     //TODO:要删除
//     {
//       path: 'H5LockPositionDetail',
//       name: 'H5LockPositionDetail',
//       caseSensitive: true,
//       meta: {
//         requireLogin: false,
//         templateClose: false,
//         mobileHeaderTitle: '',
//         pcname: '',
//         h5name: 'H5LockPositionDetail',
//       },
//       component: resolve => require(['@/components/bidebaoActivity/vue/H5LockPositionDetail'], resolve),
//     },
//     // 币得宝  2018-5-17 start
//     //TODO:要删除
//     {
//       path: 'lockPositionDetail',
//       name: 'lockPositionDetail',
//       caseSensitive: true,
//       meta: {
//         requireLogin: false,
//         templateClose: false,
//         mobileHeaderTitle: '',
//         pcname: 'lockPositionDetail',
//         h5name: '',
//         // templatePath: '/index/tradingHallT'
//       },
//       component: resolve => require(['@/components/bidebaoActivity/vue/BidebaoDetail'], resolve),
//     },
//     // 币得宝  2018-5-17 end
//
//     // H5币得宝 立即抢购页
//     //TODO:要删除
//     {
//       path: 'H5BDBPurchaseDetail',
//       name: 'H5BDBPurchaseDetail',
//       caseSensitive: true,
//       meta: {
//         requireLogin: false,
//         templateClose: false,
//         mobileHeaderTitle: '',
//         pcname: '',
//         h5name: 'H5BDBPurchaseDetail',
//       },
//       component: resolve => require(['@/components/bidebaoActivity/vue/H5BDBPurchaseDetail'], resolve),
//     },
//
//   ]
// });

// 静态页
//TODO:要删除

root.routes.push({
  path: '/static',
  component: resolve => require(['@/components/vue/StaticPage'], resolve),
  caseSensitive: true,
  meta: {},
  children: [
//     {
//       path: '',
//       redirect: 'RecommendActivity',
//       caseSensitive: true,
//       meta: {
//         mobileHeaderTitle: '',
//         pcname: 'RecommendActivity',
//         h5name: '',
//       }
//     },
//     // 推荐返佣
//     //TODO:暂不删除，可能以后会用到 check
//     {
//       path: 'RecommendActivity',
//       name: 'RecommendActivity',
//       caseSensitive: true,
//       meta: {
//         requireLogin: false,
//         mobileHeaderTitle: '',
//         templatePath: '/index/home',
//         pcname: 'RecommendActivity',
//         h5name: 'H5RecommendActivity',
//       },
//       component: resolve => require(['@/components/vue/RecommendedMaid'], resolve),
//     },
//     // 安卓上线
//     //TODO:要删除 check
//     {
//       path: 'androidOnline',
//       name: 'androidOnline',
//       caseSensitive: true,
//       meta: {
//         requireLogin: false,
//         mobileHeaderTitle: '',
//         templatePath: '/index/home',
//         pcname: 'androidOnline',
//         h5name: 'AllAppDownLoad',
//       },
//       component: resolve => require(['@/components/vue/StaticAndroidOnline'], resolve),
//     },
//     // IOST奖励活动
//     // TODO:要删除 check
//     {
//       path: 'IOSTReward',
//       name: 'IOSTReward',
//       caseSensitive: true,
//       meta: {
//         mobileHeaderTitle: '',
//         pcname: 'IOSTReward',
//         h5name: 'H5IOSTReward',
//       },
//       component: resolve => require(['@/components/activity/vue/IOSTReward'], resolve),
//     },
//     // H5IOST奖励活动
//     //TODO:要删除 check
//     {
//       path: 'H5IOSTReward',
//       name: 'H5IOSTReward',
//       caseSensitive: true,
//       meta: {
//         mobileHeaderTitle: '',
//         pcname: 'IOSTReward',
//         h5name: 'H5IOSTReward',
//       },
//       component: resolve => require(['@/components/activity/vue/H5IOSTReward'], resolve),
//     },
//     // Mtc奖励活动
//     //TODO:要删除 check
//     {
//       path: 'MtcReward',
//       name: 'MtcReward',
//       caseSensitive: true,
//       meta: {
//         mobileHeaderTitle: '',
//         pcname: 'MtcReward',
//         h5name: 'H5MTCReward',
//       },
//       component: resolve => require(['@/components/activity/vue/MtcReward'], resolve),
//     },
//     // H5MTC奖励活动
//     //TODO:要删除 check
//     {
//       path: 'H5MTCReward',
//       name: 'H5MTCReward',
//       caseSensitive: true,
//       meta: {
//         mobileHeaderTitle: '',
//         pcname: 'MtcReward',
//         h5name: 'H5MTCReward',
//       },
//       component: resolve => require(['@/components/activity/vue/H5MTCReward'], resolve),
//     },
//     // Key奖励活动
//     //TODO:要删除 check
//     {
//       path: 'KeyReward',
//       name: 'KeyReward',
//       caseSensitive: true,
//       meta: {
//         mobileHeaderTitle: '',
//         pcname: 'KeyReward',
//         h5name: 'H5KEYReward',
//       },
//       component: resolve => require(['@/components/activity/vue/KeyReward'], resolve),
//     },
//     // H5KEY奖励活动
//     //TODO:要删除 check
//     {
//       path: 'H5KEYReward',
//       name: 'H5KEYReward',
//       caseSensitive: true,
//       meta: {
//         mobileHeaderTitle: '',
//         pcname: 'KeyReward',
//         h5name: 'H5KEYReward',
//       },
//       component: resolve => require(['@/components/activity/vue/H5KEYReward'], resolve),
//     },
//     // MTC活动三
//     //TODO:要删除 check
//     {
//       path: 'MtcActivity',
//       name: 'MtcActivity',
//       caseSensitive: true,
//       meta: {
//         mobileHeaderTitle: '',
//         pcname: 'MtcActivity',
//         h5name: 'H5MtcActivity',
//       },
//       component: resolve => require(['@/components/activity/vue/MtcActivity'], resolve),
//     },
//     // H5MTC活动三
//     //TODO:要删除 check
//     {
//       path: 'H5MtcActivity',
//       name: 'H5MtcActivity',
//       caseSensitive: true,
//       meta: {
//         mobileHeaderTitle: '',
//         pcname: 'MtcActivity',
//         h5name: 'H5MtcActivity',
//       },
//       component: resolve => require(['@/components/activity/vue/H5MtcActivity'], resolve),
//     },
//     // KEY活动三
//     //TODO:要删除 check
//     {
//       path: 'KeyActivity',
//       name: 'KeyActivity',
//       caseSensitive: true,
//       meta: {
//         mobileHeaderTitle: '',
//         pcname: 'KeyActivity',
//         h5name: 'H5KeyActivity',
//       },
//       component: resolve => require(['@/components/activity/vue/KeyActivity'], resolve),
//     },
//     // H5KEY活动三
//     //TODO:要删除 check
//     {
//       path: 'H5KeyActivity',
//       name: 'H5KeyActivity',
//       caseSensitive: true,
//       meta: {
//         mobileHeaderTitle: '',
//         pcname: 'KeyActivity',
//         h5name: 'H5KeyActivity',
//       },
//       component: resolve => require(['@/components/activity/vue/H5KeyActivity'], resolve),
//     },
//     // H5币世界注册活动
//     // TODO:要删除 check
//     {
//       path: 'H5BiShiJieRegister',
//       name: 'H5BiShiJieRegister',
//       caseSensitive: true,
//       meta: {
//         requireLogin: false,
//         requireLoginOff: true,
//         mobileHeaderTitle: '',
//         pcname: '',
//         h5name: 'H5BiShiJieRegister',
//       },
//       component: resolve => require(['@/components/activity/vue/H5BiShiJieRegister'], resolve),
//     },
//
//     // H5币世界注册成功
//     // TODO:要删除 check
//     {
//       path: 'H5BiShiJieRegisterSuccess',
//       name: 'H5BiShiJieRegisterSuccess',
//       caseSensitive: true,
//       meta: {
//         requireLogin: true,
//         mobileHeaderTitle: '',
//         pcname: '',
//         h5name: 'H5BiShiJieRegisterSuccess',
//       },
//       component: resolve => require(['@/components/activity/vue/H5BiShiJieRegisterSuccess'], resolve),
//     },
//
//     // H5币世界活动
//     //TODO:要删除 check
//     {
//       path: 'H5BiShiJieActivity',
//       name: 'H5BiShiJieActivity',
//       caseSensitive: true,
//       meta: {
//         mobileHeaderTitle: '',
//         pcname: 'BiShiJieActivity',
//         h5name: 'H5BiShiJieActivity',
//       },
//       component: resolve => require(['@/components/activity/vue/H5BiShiJieActivity'], resolve),
//     },
//
//     // 币世界活动一和二
//     //TODO:要删除  check
//     {
//       path: 'BiShiJieActivity',
//       name: 'BiShiJieActivity',
//       caseSensitive: true,
//       meta: {
//         mobileHeaderTitle: '',
//         pcname: 'BiShiJieActivity',
//         h5name: 'H5BiShiJieActivity',
//       },
//       component: resolve => require(['@/components/activity/vue/BiShiJieActivity'], resolve),
//     },
//     // 币世界活动三
//     TODO:要删除  check
//     {
//       path: 'BiShiJieReward',
//       name: 'BiShiJieReward',
//       caseSensitive: true,
//       meta: {
//         mobileHeaderTitle: '',
//         pcname: 'BiShiJieReward',
//         h5name: 'H5BiShiJieReward',
//       },
//       component: resolve => require(['@/components/activity/vue/BiShiJieReward'], resolve),
//     },
//     // H5币世界活动三
//     //TODO:要删除 check
//     {
//       path: 'H5BiShiJieReward',
//       name: 'H5BiShiJieReward',
//       caseSensitive: true,
//       meta: {
//         mobileHeaderTitle: '',
//         pcname: 'BiShiJieReward',
//         h5name: 'H5BiShiJieReward',
//       },
//       component: resolve => require(['@/components/activity/vue/H5BiShiJieReward'], resolve),
//     },
//
//     // 活动页面模板，嵌入iframe
//     //TODO:要删除   check
//     {
//       path: 'ActivityIframe',
//       name: 'ActivityIframe',
//       caseSensitive: true,
//       meta: {
//         mobileHeaderTitle: ''
//       },
//       component: resolve => require(['@/components/activity/vue/ActivityIframe'], resolve),
//     },
//
//     // 推荐返佣H5版
//
//     //TODO:不要删除  check
//     {
//       path: 'H5RecommendActivity',
//       name: 'H5RecommendActivity',
//       caseSensitive: true,
//       meta: {
//         requireLogin: false,
//         mobileHeaderTitle: '',
//         templatePath: '/index/home',
//         pcname: 'RecommendActivity',
//         h5name: 'H5RecommendActivity',
//       },
//       component: resolve => require(['@/components/mobileVue/StaticH5RecommendedMaid'], resolve),
//     },
//     TODO:要删除 check
//     // 安卓上线H5版
//     // {
//     //   path: 'H5AndroidOnline',
//     //   name: 'H5AndroidOnline',
//     //   caseSensitive: true,
//     //   meta: {
//     //     requireLogin: false,
//     //     mobileHeaderTitle: '',
//     //     templatePath: '/index/home'
//     //   },
//     //   component: resolve => require(['@/components/mobileVue/StaticH5AndroidOnline'], resolve),
//     // },
//
//
//     //TODO:要删除 check
//     // 加入我们详情
//     {
//       path: 'joinUsDetail',
//       name: 'joinUsDetail',
//       caseSensitive: true,
//       meta: {
//         requireLogin: false,
//         templateClose: false,
//         mobileHeaderTitle: '',
//         templatePath: '/index/home',
//         pcname: 'joinUsDetail',
//         h5name: '',
//       },
//       component: resolve => require(['@/components/vue/HelpJoinUsDetail'], resolve),
//     },
//      TODO:要删除 check
//     // 180607 H5挖矿分红说明页
//     {
//       path: 'MobileBTActivityHelp',
//       name: 'MobileBTActivityHelp',
//       caseSensitive: true,
//       meta: {
//         pcname: '',
//         h5name: 'MobileBTActivityHelp',
//       },
//       component: resolve => require(['@/components/btActivity/vue/MobileBTActivityHelp'], resolve),
//     },
//      TODO:要删除   check
//     // H5使用BDB燃料额外奖励 20180616
//     {
//       path: 'MobileUseBDBBurnRewards',
//       name: 'MobileUseBDBBurnRewards',
//
//       caseSensitive: true,
//       meta: {
//         pcname: '',
//         h5name: 'MobileUseBDBBurnRewards',
//         requireLogin: true,
//       },
//       component: resolve => require(['@/components/btActivity/vue/PersonalCenterMobileUseBDBBurnRewards'], resolve)
//     },
//      TODO:要删除   check
//     // 180608 H5挖矿分红收益记录页
//     {
//       path: 'MobileBTActivityProfitRecord',
//       name: 'MobileBTActivityProfitRecord',
//       caseSensitive: true,
//       meta: {
//         // todo 打开必须登录才能看此页面功能
//         requireLogin: false,
//         pcname: '',
//         h5name: 'MobileBTActivityProfitRecord',
//       },
//       //TODO:要删除
//       component: resolve => require(['@/components/btActivity/vue/MobileBTActivityProfitRecord'], resolve),
//       children: [
//         {
//           path: '',
//           caseSensitive: true,
//           redirect: 'MobileBTActivityTradingBTRecords',
//           meta: {
//             pcname: '',
//             h5name: 'MobileBTActivityTradingBTRecords',
//           },
//         },
//         //TODO:要删除
//         {
//           path: 'MobileBTActivityTradingBTRecords',
//           name: 'MobileBTActivityTradingBTRecords',
//           caseSensitive: true,
//           meta: {
//             pcname: '',
//             h5name: 'MobileBTActivityTradingBTRecords',
//           },
//           component: resolve => require(['@/components/btActivity/vue/MobileBTActivityTradingBTRecords'], resolve),
//         },
//
//         //TODO:要删除  check
//         {
//           path: 'MobileBTActivityGetBTRecords',
//           name: 'MobileBTActivityGetBTRecords',
//           caseSensitive: true,
//           meta: {
//             pcname: '',
//             h5name: 'MobileBTActivityGetBTRecords',
//           },
//           component: resolve => require(['@/components/btActivity/vue/MobileBTActivityGetBTRecords'], resolve),
//         },
//       ],
//     },
//  TODO: 要删除   check
    // 180608 H5挖矿分红平台历史页
    // {
    //   path: 'MobileBTActivityPlatformRecord',
    //   name: 'MobileBTActivityPlatformRecord',
    //   caseSensitive: true,
    //   meta: {
    //     pcname: '',
    //     h5name: 'MobileBTActivityPlatformRecord',
    //   },
    //   //TODO:要删除   check
    //   component: resolve => require(['@/components/btActivity/vue/MobileBTActivityPlatformRecord'], resolve),
    //   children: [
    //     {
    //       path: '',
    //       caseSensitive: true,
    //       redirect: 'MobileBTActivityPlatformRecordOutput',
    //       meta: {
    //         pcname: '',
    //         h5name: 'MobileBTActivityPlatformRecordOutput',
    //       },
    //     },
    //     {
    //       path: 'MobileBTActivityPlatformRecordOutput',
    //       name: 'MobileBTActivityPlatformRecordOutput',
    //       caseSensitive: true,
    //       meta: {
    //         pcname: '',
    //         h5name: 'MobileBTActivityPlatformRecordOutput',
    //       },
    //       component: resolve => require(['@/components/btActivity/vue/MobileBTActivityPlatformHistoryRecords'], resolve),
    //     },
    //
    //     {
    //       path: 'MobileBTActivityPlatformDividendRecords',
    //       name: 'MobileBTActivityPlatformDividendRecords',
    //       caseSensitive: true,
    //       meta: {
    //         pcname: '',
    //         h5name: 'MobileBTActivityPlatformDividendRecords',
    //       },
    //       component: resolve => require(['@/components/btActivity/vue/MobileBTActivityPlatformDividendRecords'], resolve),
    //     },
    //   ],
    // },


//     //TODO:要删除  check
//     {
//       path: 'H5RechargeActivity',
//       name: 'H5RechargeActivity',
//       caseSensitive: true,
//       meta: {
//         requireLogin: false,
//         mobileHeaderTitle: '',
//         pcname: 'RechargeActivity',
//         h5name: 'H5RechargeActivity',
//       },
//       component: resolve => require(['@/components/activity/vue/H5RechargeActivity'], resolve),
//     },
//      //TODO:不能删除 check
//     // 充值大赛豪送QST PC版
//     {
//       path: 'RechargeActivity',
//       name: 'RechargeActivity',
//       caseSensitive: true,
//       meta: {
//         requireLogin: false,
//         mobileHeaderTitle: '',
//         pcname: 'RechargeActivity',
//         h5name: 'H5RechargeActivity',
//       },
//       component: resolve => require(['@/components/activity/vue/RechargeActivity'], resolve),
//     },
//
//     // C2C临时页面
//     //TODO:要删除 check
//     {
//       path: 'c2cComing',
//       name: 'c2cComing',
//       caseSensitive: true,
//       meta: {
//         requireLogin: false,
//         mobileHeaderTitle: '',
//         pcname: 'c2cComing',
//         h5name: 'c2cComing',
//       },
//       component: resolve => require(['@/components/vue/TemporaryC2CComingSoon'], resolve),
//     },
//
//     // 20170917 h5幸运预测活动
//     // 幸运预测活动参与记录

//      TODO:要删除 check
//     // 超级为蜜
//     {
//       path: 'superBee',
//       name: 'superBee',
//       caseSensitive: true,
//       meta: {
//         requireLogin: false,
//         mobileHeaderTitle: '',
//         pcname: 'superBee',
//         h5name: 'superBee',
//       },
//       component: resolve => require(['@/components/activity/vue/SuperBee'], resolve),
//     },
  ]
})

    // TODO 要删除 check
// // 2018年6月7日 BT活动
// root.routes.push({
//   path: '/bt',
//   // 注意，此处新建了一个标准化的组件，但担心会有统一的调整，如果有，使用StaticPage即可
//   component: resolve => require(['@/components/btActivity/vue/BtPage.vue'], resolve),
//   caseSensitive: true,
//   meta: {},
//   children: [
//     {
//       path: '',
//       redirect: 'btActivity',
//       caseSensitive: true,
//       meta: {
//         mobileHeaderTitle: '',
//         pcname: 'btActivity',
//         h5name: 'MobileBTActivityHomePage',
//       }
//     },

//     // bt活动主页面
//     {
//       path: 'btActivity',
//       name: 'btActivity',
//       caseSensitive: true,
//       meta: {
//         mobileHeaderTitle: '',
//         pcname: 'btActivity',
//         h5name: 'MobileBTActivityHomePage',
//       },
//       component: resolve => require(['@/components/btActivity/vue/BtActivity.vue'], resolve),
//     },
//   ]
// })

// TODO 要删除  check
// 安卓上线H5版
// root.routes.push({
//   path: '/static/H5AndroidOnline',
//   name: 'H5AndroidOnline',
//   caseSensitive: true,
//   meta: {
//     requireLogin: false,
//     pcname: 'androidOnline',
//     h5name: 'H5AndroidOnline',
//   },
//   component: resolve => require(['@/components/mobileVue/StaticH5AndroidOnline'], resolve),
// })


// 关于我们页面
root.routes.push({
  path: '/index/aboutUs',
  caseSensitive: true,
  meta: {
    mobileHeaderTitle: '',
    pcname: 'aboutUs',
    h5name: '',
  },
  name: 'aboutUs',
  component: resolve => require(['@/components/vue/IndexAboutUs'], resolve),
})

// 关于我们页面
root.routes.push({
  path: '/index/joinUs',
  caseSensitive: true,
  meta: {
    mobileHeaderTitle: '',
    pcname: 'joinUs',
    h5name: '',
  },
  name: 'joinUs',
  component: resolve => require(['@/components/vue/HelpJoinUs'], resolve),
})


// 首页
root.routes.push({
  path: '/index',
  redirect: 'home',
  caseSensitive: true,
  meta: {
    mobileHeaderTitle: '',
    pcname: 'home',
    h5name: 'NewH5homePage',
  },
  name: 'home',
  // component: resolve => require(['@/components/vue/IndexHome'], resolve),
})

// H5首页
root.routes.push({
  path: '/H5homePage',
  caseSensitive: true,
  redirect: '/index/newH5homePage',
  meta: {
    mobileHeaderTitle: ''
  },
  name: 'H5homePage',
  component: resolve => require(['@/components/mobileVue/H5HomePage'], resolve),
})

// 2018.4.4 新H5首页
// root.routes.push({
//   path: '/index/newH5homePage',
//   caseSensitive: true,
//   meta: {
//     mobileHeaderTitle: ''
//   },
//   name: 'H5homePage',
//   component: resolve => require(['@/components/mobileVue/newH5HomePage'], resolve),
// })

// {
//   path: '/H5homePage',
//     name: 'H5homePage',
//   meta: {
//   requireLogin: false,
//     mobileHeaderTitle: ''
// },
//   caseSensitive: true,
//     component: resolve => require(['@/components/mobileVue/H5HomePage'], resolve), //临时更改
// },


root.routes.push({
  path: '/huoDong',
  redirect: '/index/newH5homePage',
  // redirect: '/index/sign/login',
  caseSensitive: true,
  component: resolve => require(['@/components/mobileVue/MobilePromotion'], resolve)
})


// 首页index下的路由
root.routes.push({
  path: '/index',
  component: resolve => require(['@/components/vue/Index'], resolve),
  // component: resolve => require(['@/components/activity/vue/H5RankActivity'], resolve),
  // component: resolve => require(['@/components/activity/vue/RechargeActivity'], resolve),
  // component: resolve => require(['@/components/combinedCoinVote/vue/MobileCombinedVotePage'], resolve),
  // component: resolve => require(['@/components/LuckyDraw/vue/MobileForecastHomePage'], resolve),
  caseSensitive: true,
  children: [
    {
      path: 'home',
      name: 'home',
      // redirect: 'home',
      redirect: '/index/tradingHall',
      caseSensitive: true,
      meta: {
        mobileHeaderTitle: '',
        pcname: 'home',
        h5name: 'NewH5homePage',
      },
      component: resolve => require(['@/components/vue/IndexHome'], resolve),
    },
    // 首页
    {
      path: 'homePage',
      name: 'homePage',
      redirect: 'home',
      meta: {
        requireLogin: false,
        mobileHeaderTitle: '',
        pcname: 'home',
        h5name: 'NewH5homePage',
      },
      caseSensitive: true,
      component: resolve => require(['@/components/vue/HomePage'], resolve), //临时更改
    },

    // 2018.4.4 新H5首页
    {
      path: 'newH5homePage',
      name: 'NewH5homePage',
      // redirect: 'h5home',
      meta: {
        requireLogin: false,
        mobileHeaderTitle: '',
        pcname: 'home',
        h5name: 'NewH5homePage',
      },
      caseSensitive: true,
      component: resolve => require(['@/components/mobileVue/NewH5HomePage'], resolve),
    },
    {
      path: 'mobileHeatList',
      name: 'mobileHeatList',
      // redirect: 'h5home',
      meta: {
        requireLogin: false,
        mobileHeaderTitle: '',
        pcname: '',
        h5name: 'mobileHeatList',
      },
      caseSensitive: true,
      component: resolve => require(['@/components/vue/MobileHeatList'], resolve),
    },

    // // 合约首次进入弹框记录
    // {
    //   path: 'contractRiskWarning',
    //   name: 'contractRiskWarning',
    //   meta: {
    //     pcname: '',
    //     h5name: 'contractRiskWarning',
    //     requireLogin: true,
    //     templateClose: false,
    //     requireLoginOff: false,
    //   },
    //   caseSensitive: true,
    //   component: resolve => require(['@/components/vue/ContractRiskWarning'], resolve),
    // },
    {
      path: 'tradingHall',
      name: 'tradingHall',
      caseSensitive: true,
      meta: {
        requireLogin: false,
        templateClose: false,
        mobileHeaderTitle: '',
        pcname: 'tradingHall',
        h5name: 'mobileTradingHall',
        templatePath: '/index/tradingHallT'
      },
      component: resolve => require(['@/components/vue/TradingHall'], resolve),
    },


    // 交易大厅临时页面
    // {
    //   path: 'tradingHallTemporary/xs241/sfe/sf214213/ts22/trade',
    //
    //   caseSensitive: true,
    //   meta: {
    //     requireLogin: false,
    //     templateClose: false,
    //     mobileHeaderTitle: '',
    //     templatePath: '/index/tradingHallT'
    //   },
    //   component: resolve => require(['@/components/vue/TradingHall'], resolve),
    // },
    {
      path: 'mobileTradingHall',
      name: 'mobileTradingHall',
      caseSensitive: true,
      meta: {
        requireLogin: false,
        templateClose: false,
        mobileHeaderTitle: '交易大厅',
        pcname: 'tradingHall',
        h5name: 'mobileTradingHall',
        templatePath: '/index/tradingHallT'
      },
      component: resolve => require(['@/components/mobileVue/MobileTradingHall'], resolve),
    },
    // 交易大厅H5临时页面
    // {
    //   path: 'mobileTradingHallTemporary/ssx/egs/sgwe/123/24212/24555',
    //   caseSensitive: true,
    //   meta: {
    //     requireLogin: false,
    //     templateClose: false,
    //     mobileHeaderTitle: '交易大厅',
    //     templatePath: '/index/tradingHallT'
    //   },
    //   component: resolve => require(['@/components/mobileVue/MobileTradingHall'], resolve),
    // },
    {
      path: 'mobileTradingHallDetail',
      name: 'mobileTradingHallDetail',
      // caseSensitive: true,
      meta: {
        requireLogin: false,
        templateClose: false,
        mobileHeaderTitle: '',
        pcname: 'tradingHall',
        h5name: 'mobileTradingHallDetail',
      },
      component: resolve => require(['@/components/mobileVue/MobileTradingHallDetail'], resolve),
    },
    // 交易大厅H5临时开放etail
    // {
    //   path: 'mobileTradingHallDetailTemporary/ss/ewq123/dfa/23213/4433xx/temporary',
    //   caseSensitive: true,
    //   meta: {
    //     requireLogin: false,
    //     templateClose: false,
    //     mobileHeaderTitle: ''
    //   },
    //   component: resolve => require(['@/components/mobileVue/MobileTradingHallDetail'], resolve),
    // },

    {
      path: 'register',
      name: 'register',
      caseSensitive: true,
      meta: {
        requireLogin: false,
        templateClose: false,
        requireLoginOff: true,
        mobileHeaderTitle: ''
      },
      component: resolve => require(['@/components/vue/Register'], resolve),
    },

    {
      path: 'RegisterMobilePhoneNumberAreaSearch',
      name: 'RegisterMobilePhoneNumberAreaSearch',
      caseSensitive: true,
      meta: {
        requireLogin: false,
        templateClose: false,
        requireLoginOff: true,
        mobileHeaderTitle: ''
      },
      component: resolve => require(['@/components/vue/RegisterMobilePhoneNumberAreaSearch'], resolve),
    },

    // 登录相关
    {
      path: 'sign',
      caseSensitive: true,
      component: resolve => require(['@/components/vue/SignPage'], resolve),
      children: [
        // 默认路由登录
        {
          path: '',
          meta: {
            mobileHeaderTitle: ''
          },
          caseSensitive: true,
          redirect: 'login'
        },
        // 登录
        {
          path: 'login',
          name: 'login',
          meta: {
            requireLogin: false,
            templateClose: false,
            requireLoginOff: true,
            mobileHeaderTitle: ''
          },
          caseSensitive: true,
          component: resolve => require(['@/components/vue/SignPageLogin'], resolve),
        },
        // 找回密码
        {
          path: 'findBackPsw',
          name: 'findBackPsw',
          caseSensitive: true,
          meta: {
            requireLogin: false,
            requireLoginOff: true,
            mobileHeaderTitle: ''
          },
          component: resolve => require(['@/components/vue/SignPageFindBackPassword'], resolve)
        },
        // 确认
        {
          path: 'verification',
          name: 'verification',
          meta: {
            requireLogin: false,
            templateClose: false,
            requireLoginOff: true,
            mobileHeaderTitle: ''
          },
          caseSensitive: true,
          component: resolve => require(['@/components/vue/SignPageVerification'], resolve),
        },
        // 找回密码重置密码
        {
          path: 'resetPsw',
          name: 'resetPsw',
          meta: {
            requireLogin: false,
            templateClose: false,
            requireLoginOff: true,
            mobileHeaderTitle: ''
          },
          caseSensitive: true,
          component: resolve => require(['@/components/vue/SignPageResetPassword'], resolve),
        },
      ]
    },
    // 公告路由  @liufei start
    {
      path: 'notice',
      name: 'notice',
      caseSensitive: true,
      component: resolve => require(['@/components/vue/NoticeCenter'], resolve),
      children: [
        // 列表
        {
          path: 'noticeCenter',
          name: 'noticeCenter',
          caseSensitive: true,
          meta: {
            pcname: 'noticeCenter',
            h5name: 'mobileNotice',
          },
          component: resolve => require(['@/components/vue/NoticeCenter'], resolve),
        },
        // {
        //   path:'',
        //   name:'noticezendesk',
        // },
        // 详情
        {
          path: 'noticeDetail',
          name: 'noticeDetail',
          caseSensitive: true,
          meta: {
            pcname: 'noticeDetail',
            h5name: 'mobileNoticeDetail',
          },
          component: resolve => require(['@/components/vue/NoticeDetail'], resolve),
        }
      ]
    },
    // 公告路由  @liufei end
    // h5公告路由  @rongjiaqi start
    // 公告列表
    {
      path: 'mobileNotice',
      name: 'mobileNotice',
      caseSensitive: true,
      meta: {
        pcname: 'noticeCenter',
        h5name: 'mobileNotice',
      },
      component: resolve => require(['@/components/mobileVue/MobileNotice'], resolve)
    },
    // 公告详情
    {
      path: 'mobileNoticeDetail',
      name: 'mobileNoticeDetail',
      caseSensitive: true,
      meta: {
        pcname: 'noticeDetail',
        h5name: 'mobileNoticeDetail',
      },
      component: resolve => require(['@/components/mobileVue/MobileNoticeDetail'], resolve)
    },
    // h5公告路由  @rongjiaqi end

    // 帮助路由  @liufei start
    {
      path: 'help',
      caseSensitive: true,
      component: resolve => require(['@/components/vue/Help'], resolve),
      children: [
        // 常见问题
        // {
        //   path: 'problem',
        //   caseSensitive: true,
        //   component: resolve => require(['@/components/vue/HelpProblem'], resolve),
        // },
        // 提交工单  TODO 合约删除
        {
          path: 'wordOrder',
          name: 'wordOrder',
          meta: {
            pcname: 'wordOrder',
            h5name: 'H5WordOrder',
            requireLogin: false,
          },
          caseSensitive: true,
          component: resolve => require(['@/components/vue/HelpWordOrder'], resolve),
        },

        {
          path: 'H5WordOrder',
          name: 'H5WordOrder',
          meta: {
            pcname: 'wordOrder',
            h5name: 'H5WordOrder',
            requireLogin: false,
          },
          caseSensitive: true,
          component: resolve => require(['@/components/mobileVue/H5WordOrder'], resolve),
        },
        //
        // // 设置白名单 2018-06-20  TODO 合约删除
        // {
        //   path: 'whiteList',
        //   name: 'whiteList',
        //   meta: {
        //     pcname: 'whiteList',
        //     h5name: '',
        //     requireLogin: false,
        //   },
        //   caseSensitive: true,
        //   component: resolve => require(['@/components/whiteList/vue/whiteList'], resolve),
        // },

        // TODO 合约删除
        // {
        //   path: 'workOrderInfo',
        //   meta: {
        //     pcname: 'workOrderInfo',
        //     h5name: '',
        //     requireLogin: true,
        //   },
        //   caseSensitive: true,
        //   component: resolve => require(['@/components/vue/WorkOrderInfo'], resolve),
        // },
        // TODO 合约删除
        // {
        //   path: 'workOrderList',
        //   name: 'workOrderList',
        //   meta: {
        //     pcname: 'workOrderList',
        //     h5name: '',
        //     requireLogin: true,
        //   },
        //   caseSensitive: true,
        //   component: resolve => require(['@/components/vue/WorkOrderList'], resolve),
        // },
        // // 客户服务  TODO 合约删除
        // {
        //   path: 'service',
        //   caseSensitive: true,
        //   component: resolve => require(['@/components/vue/HelpService'], resolve),
        // },
        // // 您的建议
        // {
        //   path: 'proposal',
        //   caseSensitive: true,
        //   component: resolve => require(['@/components/vue/HelpProposal'], resolve),
        // },
        // 上币申请  TODO 合约删除
        // {
        //   path: 'applyToList',
        //   name: 'applyToList',
        //   caseSensitive: true,
        //   meta: {
        //     pcname: 'applyToList',
        //     h5name: '',
        //     requireLogin: false,
        //     templateClose: false,
        //     requireLoginOff: false,
        //   },
        //   component: resolve => require(['@/components/vue/HelpApplyToList'], resolve),
        // },
        // 二零二零用户协议  TODO 合约删除
        // {
        //   path: 'userAgreement',
        //   name: 'userAgreement',
        //   caseSensitive: true,
        //   meta: {
        //     pcname: 'userAgreement',
        //     h5name: 'userAgreement',
        //     requireLogin: false,
        //     templateClose: false,
        //     requireLoginOff: false,
        //   },
        //   component: resolve => require(['@/components/vue/HelpUserAgreement'], resolve),
        // },
        // 二零二零隐私协议  TODO 合约删除
        // {
        //   path: 'userPrivacy',
        //   name: 'userPrivacy',
        //   caseSensitive: true,
        //   meta: {
        //     pcname: 'userPrivacy',
        //     h5name: 'userPrivacy',
        //     requireLogin: false,
        //     templateClose: false,
        //     requireLoginOff: false,
        //   },
        //   component: resolve => require(['@/components/vue/HelpuserPrivacy'], resolve),
        // },
        // TODO:不能删除 check
        // 费率标准
        // {
        //   path: 'rateStandard',
        //   name: 'rateStandard',
        //   caseSensitive: true,
        //   meta: {
        //     pcname: 'rateStandard',
        //     h5name: '',
        //     requireLogin: false,
        //     templateClose: false,
        //     requireLoginOff: false,
        //   },
        //   component: resolve => require(['@/components/vue/HelpRateStandard'], resolve),
        // },
      ]
    },
    // 帮助路由  @liufei  end
    // 资产路由 pc端

    {
      path: 'MobileHistoryOrder',
      name: 'MobileHistoryOrder',
      caseSensitive: true,
      meta: {
        pcname: 'historicalEntrust',
        h5name: 'MobileHistoryOrder',
        requireLogin: true,
        templateClose: false,
        requireLoginOff: false,
      },
      component: resolve => require(['@/components/vue/MobileHistoryOrder'], resolve),
    },

    {
      path: 'MobileHistoryDetail',
      name: 'MobileHistoryDetail',
      caseSensitive: true,
      meta: {
        pcname: '',
        h5name: 'MobileHistoryDetail',
        requireLogin: true,
        templateClose: false,
        requireLoginOff: false,
      },
      // MobileHistoryDetail
      component: resolve => require(['@/components/mobileVue/MobileHistoryDetail'], resolve),
    },

    // 资产路由 移动端 rongjiaqi
    {
      path: 'mobileAsset',
      caseSensitive: true,
      meta: {
        pcname: '',
        h5name: 'mobileAsset',
        requireLogin: true,
        templateClose: false,
        requireLoginOff: false,
      },
      component: resolve => require(['@/components/mobileVue/MobileAssetPage'], resolve),
      children: [
        // 默认身份认证
        {
          path: '',
          redirect: 'mobileAssetRechargeAndWithdrawals',
          meta: {
            pcname: 'rechargeAndWithdrawals',
            h5name: 'MobileAssetRechargeAndWithdrawals',
            requireLogin: true,
            templateClose: false,
            requireLoginOff: false,
            mobileHeaderTitle: ''
          },
          caseSensitive: true,
        },
        // 移动端资产页
        {
          path: 'mobileAssetRechargeAndWithdrawals',
          name: 'MobileAssetRechargeAndWithdrawals',
          meta: {
            pcname: 'rechargeAndWithdrawals',
            h5name: 'MobileAssetRechargeAndWithdrawals',
            requireLogin: true,
            templateClose: false,
            requireLoginOff: false,
            mobileHeaderTitle: '资产'
          },
          caseSensitive: true,
          component: resolve => require(['@/components/mobileVue/MobileAssetRechargeAndWithdrawals'], resolve),
        },
        // 移动端资产详情页
        {
          path: 'mobileAssetRechargeAndWithdrawalsDetail',
          name: 'MobileAssetRechargeAndWithdrawalsDetail',
          meta: {
            pcname: '',
            h5name: 'MobileAssetRechargeAndWithdrawalsDetail',
            requireLogin: true,
            templateClose: false,
            requireLoginOff: false,
          },
          caseSensitive: true,
          component: resolve => require(['@/components/mobileVue/MobileAssetRechargeAndWithdrawalsDetail'], resolve),
        },
        // 移动端充值列表页
        {
          path: 'mobileAssetRecharge',
          name: 'MobileAssetRecharge',
          meta: {
            pcname: '',
            h5name: 'MobileAssetRecharge',
            requireLogin: true,
            templateClose: false,
            requireLoginOff: false,
            mobileHeaderTitle: '充值'
          },
          caseSensitive: true,
          component: resolve => require(['@/components/mobileVue/MobileAssetRecharge'], resolve),
        },
        // 移动端充值详情页
        {
          path: 'mobileAssetRechargeDetail',
          name: 'MobileAssetRechargeDetail',
          meta: {
            pcname: '',
            h5name: 'MobileAssetRechargeDetail',
            requireLogin: true,
            templateClose: false,
            requireLoginOff: false,
            mobileHeaderTitle: '充值详情'
          },
          caseSensitive: true,
          component: resolve => require(['@/components/mobileVue/MobileAssetRechargeDetail'], resolve),
        },
        // 移动端提现列表页
        {
          path: 'mobileAssetWithdraw',
          name: 'MobileAssetWithdraw',
          meta: {
            pcname: '',
            h5name: 'MobileAssetWithdraw',
            requireLogin: true,
            // 临时关闭
            templateClose: false,
            requireLoginOff: false,
            mobileHeaderTitle: '提现'
          },
          caseSensitive: true,
          component: resolve => require(['@/components/mobileVue/MobileAssetWithdraw'], resolve),
        },
        // 移动端提现详情页
        {
          path: 'mobileAssetWithdrawDetail',
          name: 'MobileAssetWithdrawDetail',
          meta: {
            pcname: '',
            h5name: 'MobileAssetWithdrawDetail',
            requireLogin: true,
            // 临时关闭
            templateClose: false,
            requireLoginOff: false,
            // mobileHeaderTitle: '提现详情'
          },
          caseSensitive: true,
          component: resolve => require(['@/components/mobileVue/MobileAssetWithdrawDetail'], resolve),
        },
        // 移动端资金划转页
        {
          path: 'mobileAssetCapitalTransfer',
          name: 'MobileAssetCapitalTransfer',
          meta: {
            pcname: '',
            h5name: 'MobileAssetCapitalTransfer',
            requireLogin: true,
            // 临时关闭
            templateClose: false,
            requireLoginOff: false,
            // mobileHeaderTitle: '资金划转'
          },
          caseSensitive: true,
          component: resolve => require(['@/components/mobileVue/MobileAssetCapitalTransfer'], resolve),
        },
        // 移动端充提记录页
        {
          path: 'MobileAssetRechargeAndWithdrawRecord',
          name: 'MobileAssetRechargeAndWithdrawRecord',
          meta: {
            pcname: 'rechargeRecord',
            h5name: 'MobileAssetRechargeAndWithdrawRecord',
            requireLogin: true,
            templateClose: false,
            requireLoginOff: false,
            // mobileHeaderTitle: '充提记录'
          },
          caseSensitive: true,
          component: resolve => require(['@/components/mobileVue/MobileAssetRechargeAndWithdrawRecord'], resolve),
        },
        // 移动端锁仓记录页
        {
          path: 'MobileLockHouseRecord',
          name: 'MobileLockHouseRecord',
          meta: {
            pcname: 'LockHouseRecord',
            h5name: 'MobileLockHouseRecord',
            requireLogin: true,
            templateClose: false,
            requireLoginOff: false,
            // mobileHeaderTitle: '充提记录'
          },
          caseSensitive: true,
          component: resolve => require(['@/components/mobileVue/MobileLockHouseRecord'], resolve),
        },

        // 移动端充值记录详情页
        {
          path: 'mobileAssetRechargeRecordDetail',
          name: 'MobileAssetRechargeRecordDetail',
          meta: {
            pcname: '',
            h5name: 'MobileAssetRechargeRecordDetail',
            requireLogin: true,
            templateClose: false,
            requireLoginOff: false,
            // mobileHeaderTitle: '充提记录'
          },
          caseSensitive: true,
          component: resolve => require(['@/components/mobileVue/MobileAssetRechargeRecordDetail'], resolve),
        },
        // 移动端提现记录详情页
        {
          path: 'mobileAssetWithdrawRecordDetail',
          name: 'MobileAssetWithdrawRecordDetail',
          meta: {
            pcname: '',
            h5name: 'MobileAssetWithdrawRecordDetail',
            requireLogin: true,
            // 临时关闭
            templateClose: false,
            requireLoginOff: false,
            // mobileHeaderTitle: '充提记录'
          },
          caseSensitive: true,
          component: resolve => require(['@/components/mobileVue/MobileAssetWithdrawRecordDetail'], resolve),
        },// 移动端划转记录详情页
        {
          path: 'mobileAssetCapitalTransferRecordDetail',
          name: 'MobileAssetCapitalTransferRecordDetail',
          meta: {
            pcname: '',
            h5name: 'MobileAssetCapitalTransferRecordDetail',
            requireLogin: true,
            // 临时关闭
            templateClose: false,
            requireLoginOff: false,
          },
          caseSensitive: true,
          component: resolve => require(['@/components/mobileVue/MobileAssetCapitalTransferRecordDetail'], resolve),
        },// 移动端内部转账记录详情页
        {
          path: 'mobileAssetInternalTransferRecordDetail',
          name: 'MobileAssetInternalTransferRecordDetail',
          meta: {
            pcname: '',
            h5name: 'MobileAssetInternalTransferRecordDetail',
            requireLogin: true,
            // 临时关闭
            templateClose: false,
            requireLoginOff: false,
          },
          caseSensitive: true,
          component: resolve => require(['@/components/mobileVue/MobileAssetInternalTransferRecordDetail'], resolve),
        },// 移动端挖矿记录详情页
        {
          path: 'mobileAssetRewardRecordDetail',
          name: 'MobileAssetRewardRecordDetail',
          meta: {
            pcname: '',
            h5name: 'MobileAssetRewardRecordDetail',
            requireLogin: true,
            // 临时关闭
            templateClose: false,
            requireLoginOff: false,
          },
          caseSensitive: true,
          component: resolve => require(['@/components/mobileVue/MobileAssetRewardRecordDetail'], resolve),
        },
        // 移动端奖励记录详情页
        {
          path: 'mobileAssetEventRewardsRecordDetail',
          name: 'mobileAssetEventRewardsRecordDetail',
          meta: {
            pcname: '',
            h5name: 'mobileAssetEventRewardsRecordDetail',
            requireLogin: true,
            // 临时关闭
            templateClose: false,
            requireLoginOff: false,
          },
          caseSensitive: true,
          component: resolve => require(['@/components/mobileVue/mobileAssetEventRewardsRecordDetail'], resolve),
        },
        // 移动当前锁仓记录详情页
        {
          path: 'mobileAssetcurLockRecordDetail',
          name: 'mobileAssetcurLockRecordDetail',
          meta: {
            pcname: '',
            h5name: 'mobileAssetcurLockRecordDetail',
            requireLogin: true,
            templateClose: false,
            requireLoginOff: false,
            // mobileHeaderTitle: '充提记录'
          },
          caseSensitive: true,
          component: resolve => require(['@/components/mobileVue/mobileAssetcurLockRecordDetail'], resolve),
        },

        // 移动历史锁仓记录详情页
        {
          path: 'mobileAssetHisLockRecordDetail',
          name: 'mobileAssetHisLockRecordDetail',
          meta: {
            pcname: '',
            h5name: 'mobileAssetHisLockRecordDetail',
            requireLogin: true,
            templateClose: false,
            requireLoginOff: false,
            // mobileHeaderTitle: '充提记录'
          },
          caseSensitive: true,
          component: resolve => require(['@/components/mobileVue/mobileAssetHisLockRecordDetail'], resolve),
        },


        // 移动端转账记录页
        {
          path: 'MobileTransfer',
          name: 'MobileTransfer',
          meta: {
            pcname: '',
            h5name: 'MobileTransfer',
            // requireLogin: 请求登录  templateClose：组件关闭
            // requireLoginOff：请求登录关闭  caseSensitive：区分大小写
            requireLogin: true,
            templateClose: false,
            requireLoginOff: false,
          },
          caseSensitive: true,
          component: resolve => require(['@/components/vue/MobileTransfer'], resolve),
        },

        // 移动端转账确认页
        {
          path: 'MobileConfirm',
          name: 'MobileConfirm',
          meta: {
            pcname: '',
            h5name: 'MobileConfirm',
            // requireLogin: 请求登录  templateClose：组件关闭
            // requireLoginOff：请求登录关闭  caseSensitive：区分大小写
            requireLogin: true,
            // templateClose: false,
            // requireLoginOff: false,
          },
          caseSensitive: true,
          component: resolve => require(['@/components/vue/MobileConfirm'], resolve),
        },

        // 移动端转账成功页
        {
          path: 'MobileTransferSuccess',
          name: 'MobileTransferSuccess',
          meta: {
            pcname: '',
            h5name: 'MobileTransferSuccess',
            // requireLogin: 请求登录  templateClose：组件关闭
            // requireLoginOff：请求登录关闭  caseSensitive：区分大小写
            requireLogin: true,
            // templateClose: false,
            // requireLoginOff: false,
          },
          caseSensitive: true,
          component: resolve => require(['@/components/vue/MobileTransferSuccess'], resolve),
        },

        // 移动端转账记录
        // {
        //   path: 'MobileTransferRecords',
        //   name: 'MobileTransferRecords',
        //   meta: {
        //     pcname: '',
        //     h5name: 'MobileTransferRecords',
        //     // requireLogin: 请求登录  templateClose：组件关闭
        //     // requireLoginOff：请求登录关闭  caseSensitive：区分大小写
        //     requireLogin: true,
        //     // templateClose: false,
        //     // requireLoginOff: false,
        //   },
        //   caseSensitive: true,
        //   component: resolve => require(['@/components/vue/MobileTransferRecords'], resolve),
        // },
      ]
    },
    // TODO：合约删除
    // {
    //   path: 'personal',
    //   // name: 'personal',
    //   caseSensitive: true,
    //   meta: {
    //     requireLogin: true,
    //   },
    //   component: resolve => require(['@/components/vue/PersonalCenter'], resolve),
    //   children: [
    //     // 默认身份认证
    //     {
    //       path: '',
    //       redirect: 'auth',
    //       meta: {
    //         requireLogin: true,
    //         templateClose: false,
    //         requireLoginOff: false,
    //         mobileHeaderTitle: '个人中心'
    //       },
    //       caseSensitive: true,
    //     },
    //     // 安全中心  TODO：合约删除
    //     // {
    //     //   path: 'securityCenter',
    //     //   name: 'securityCenter',
    //     //   caseSensitive: true,
    //     //   meta: {
    //     //     requireLogin: true,
    //     //     templateClose: false,
    //     //     requireLoginOff: false,
    //     //     mobileHeaderTitle: ''
    //     //   },
    //     //   component: resolve => require(['@/components/vue/PersonalCenterSecurityCenter'], resolve),
    //     //   children: [
    //     //     // 安全中心默认  TODO：合约删除
    //     //     // {
    //     //     //   path: '',
    //     //     //   caseSensitive: true,
    //     //     //   name: 'securityCenter',
    //     //     //   meta: {
    //     //     //     pcname: 'securityCenter',
    //     //     //     h5name: 'authentication',
    //     //     //     requireLogin: true,
    //     //     //     templateClose: false,
    //     //     //     requireLoginOff: false,
    //     //     //     mobileHeaderTitle: ''
    //     //     //   },
    //     //     //   component: resolve => require(['@/components/vue/PersonalCenterSecurityCenterSecurityCenter'], resolve)
    //     //     // },
    //     //     // 临时增加api TODO：合约删除
    //     //     // {
    //     //     //   path: 'templateApi',
    //     //     //   caseSensitive: true,
    //     //     //   meta: {
    //     //     //     requireLogin: true,
    //     //     //   },
    //     //     //   component: resolve => require(['@/components/vue/TemplateApi'], resolve)
    //     //     // },
    //     //     // 修改登录密码  TODO：合约删除
    //     //     // {
    //     //     //   path: 'modifyLoginPassword',
    //     //     //   name: 'modifyLoginPassword',
    //     //     //
    //     //     //   caseSensitive: true,
    //     //     //   meta: {
    //     //     //     pcname: 'modifyLoginPassword',
    //     //     //     h5name: 'modifyLoginPassword',
    //     //     //     requireLogin: true,
    //     //     //     templateClose: false,
    //     //     //     requireLoginOff: false,
    //     //     //     mobileHeaderTitle: '修改密码'
    //     //     //   },
    //     //     //   component: resolve => require(['@/components/vue/PersonalCenterSecurityCenterModifyLoginPassword'], resolve)
    //     //     // },
    //     //     // // 设置资金密码   TODO 合约删除
    //     //     // {
    //     //     //   path: 'setAssetPassword',
    //     //     //   caseSensitive: true,
    //     //     //   meta: {
    //     //     //     requireLogin: true,
    //     //     //   },
    //     //     //   component: resolve => require(['@/components/vue/PersonalCenterSecurityCenterSetAssetPassword'], resolve)
    //     //     // },
    //     //     // // 修改资金密码   TODO 合约删除
    //     //     // {
    //     //     //   path: 'modifyAssetPassword',
    //     //     //   caseSensitive: true,
    //     //     //   meta: {
    //     //     //     requireLogin: true,
    //     //     //   },
    //     //     //   component: resolve => require(['@/components/vue/PersonalCenterSecurityCenterModifyAssetPassword'], resolve)
    //     //     // },
    //     //     // // 找回资金密码   TODO 合约删除
    //     //     // {
    //     //     //   path: 'retrieveAssetPassword',
    //     //     //   caseSensitive: true,
    //     //     //   meta: {
    //     //     //     requireLogin: true,
    //     //     //   },
    //     //     //   component: resolve => require(['@/components/vue/PersonalCenterSecurityCenterRetrieveAssetPassword'], resolve)
    //     //     // },
    //     //     // 绑定谷歌验证   TODO 合约删除
    //     //     {
    //     //       path: 'bindGoogleAuthenticator',
    //     //       name: 'bindGoogleAuthenticator',
    //     //
    //     //       caseSensitive: true,
    //     //       meta: {
    //     //         pcname: 'bindGoogleAuthenticator',
    //     //         h5name: 'MobileBindGoogleAuthenticator',
    //     //         requireLogin: true,
    //     //         templateClose: false,
    //     //         requireLoginOff: false,
    //     //         mobileHeaderTitle: ''
    //     //       },
    //     //       component: resolve => require(['@/components/vue/PersonalCenterSecurityCenterBindGoogleAuthenticator'], resolve)
    //     //     },
    //     //     //手机绑定谷歌验证码 TODO 合约删除
    //     //     {
    //     //       path: 'MobileBindGoogleAuthenticator',
    //     //       name: 'MobileBindGoogleAuthenticator',
    //     //
    //     //       caseSensitive: true,
    //     //       meta: {
    //     //         pcname: 'bindGoogleAuthenticator',
    //     //         h5name: 'MobileBindGoogleAuthenticator',
    //     //         requireLogin: true,
    //     //         templateClose: false,
    //     //         requireLoginOff: false,
    //     //         mobileHeaderTitle: ''
    //     //       },
    //     //       component: resolve => require(['@/components/mobileVue/MobileBindGoogleAuthenticator'], resolve)
    //     //     },
    //     //     //手机 去 绑定谷歌验证码 TODO 合约删除
    //     //     {
    //     //       path: 'MobileGoBindGoogleAuthenticator',
    //     //       name: 'MobileGoBindGoogleAuthenticator',
    //     //
    //     //       caseSensitive: true,
    //     //       meta: {
    //     //         pcname: '',
    //     //         h5name: 'MobileGoBindGoogleAuthenticator',
    //     //         requireLogin: true,
    //     //         templateClose: false,
    //     //         requireLoginOff: false,
    //     //         mobileHeaderTitle: ''
    //     //       },
    //     //       component: resolve => require(['@/components/mobileVue/MobileGoBindGoogleAuthenticator'], resolve)
    //     //     },
    //     //     //手机 去解绑 谷歌验证码 TODO 合约删除
    //     //     {
    //     //       path: 'MobileReleaseGoogleAuthenticator',
    //     //       name: 'MobileReleaseGoogleAuthenticator',
    //     //       caseSensitive: true,
    //     //       meta: {
    //     //         pcname: 'releaseGoogleAuthenticator',
    //     //         h5name: 'MobileReleaseGoogleAuthenticator',
    //     //         requireLogin: true,
    //     //         templateClose: false,
    //     //         requireLoginOff: false,
    //     //         mobileHeaderTitle: ''
    //     //       },
    //     //       component: resolve => require(['@/components/mobileVue/MobileReleaseGoogleAuthenticator'], resolve)
    //     //     },
    //     //     // 解绑谷歌验证   TODO 合约删除
    //     //     {
    //     //       path: 'releaseGoogleAuthenticator',
    //     //       name: 'releaseGoogleAuthenticator',
    //     //       caseSensitive: true,
    //     //       meta: {
    //     //         pcname: 'releaseGoogleAuthenticator',
    //     //         h5name: 'MobileReleaseGoogleAuthenticator',
    //     //         requireLogin: true,
    //     //         templateClose: false,
    //     //         requireLoginOff: false,
    //     //         mobileHeaderTitle: ''
    //     //       },
    //     //       component: resolve => require(['@/components/vue/PersonalCenterSecurityCenterReleaseGoogleAuthenticator'], resolve)
    //     //     },
    //     //     // 绑定手机号  TODO 合约删除
    //     //     {
    //     //       path: 'bindMobile',
    //     //       name: 'bindMobile',
    //     //       caseSensitive: true,
    //     //       meta: {
    //     //         pcname: 'bindMobile',
    //     //         h5name: 'bindMobile',
    //     //         requireLogin: true,
    //     //         mobileHeaderTitle: '绑定手机号'
    //     //       },
    //     //       component: resolve => require(['@/components/vue/PersonalCenterSecurityCenterBindMobile'], resolve)
    //     //     },
    //     //     // 解绑手机号 TODO 合约删除
    //     //     {
    //     //       path: 'releaseMobile',
    //     //       name: 'releaseMobile',
    //     //       caseSensitive: true,
    //     //       meta: {
    //     //         pcname: 'releaseMobile',
    //     //         h5name: 'releaseMobile',
    //     //         requireLogin: true,
    //     //         templateClose: false,
    //     //         requireLoginOff: false,
    //     //         mobileHeaderTitle: '解绑手机号'
    //     //       },
    //     //       component: resolve => require(['@/components/vue/PersonalCenterSecurityCenterReleaseMobile'], resolve)
    //     //     },
    //     //     // 绑定邮箱  TODO 合约删除
    //     //     {
    //     //       path: 'bindEmail',
    //     //       name: 'bindEmail',
    //     //       caseSensitive: true,
    //     //       meta: {
    //     //         pcname: 'bindEmail',
    //     //         h5name: 'bindEmail',
    //     //         requireLogin: true,
    //     //         mobileHeaderTitle: '绑定邮箱'
    //     //       },
    //     //       component: resolve => require(['@/components/vue/PersonalCenterSecurityCenterBindEmail'], resolve)
    //     //     },
    //     //     // 解绑邮箱  TODO 合约删除
    //     //     {
    //     //       path: 'releaseEmail',
    //     //       name: 'releaseEmail',
    //     //       caseSensitive: true,
    //     //       meta: {
    //     //         pcname: 'releaseEmail',
    //     //         h5name: 'releaseEmail',
    //     //         requireLogin: true,
    //     //         templateClose: false,
    //     //         requireLoginOff: false,
    //     //         mobileHeaderTitle: '解绑邮箱'
    //     //       },
    //     //       component: resolve => require(['@/components/vue/PersonalCenterSecurityCenterReleaseEmail'], resolve)
    //     //     },
    //     //     // 启用API TODO 合约删除
    //     //     {
    //     //       path: 'openApi',
    //     //       name: 'openApi',
    //     //       caseSensitive: true,
    //     //       meta: {
    //     //         pcname: 'openApi',
    //     //         h5name: 'openApi',
    //     //         requireLogin: true,
    //     //         templateClose: false,
    //     //         requireLoginOff: false,
    //     //         mobileHeaderTitle: '启用API'
    //     //       },
    //     //       component: resolve => require(['@/components/vue/PersonalCenterSecurityCenterOpenApi'], resolve)
    //     //     },
    //     //     // 管理API TODO 合约删除
    //     //     {
    //     //       path: 'manageApi',
    //     //       name: 'manageApi',
    //     //       caseSensitive: true,
    //     //       meta: {
    //     //         pcname: 'manageApi',
    //     //         h5name: 'manageApi',
    //     //         requireLogin: true,
    //     //         templateClose: false,
    //     //         requireLoginOff: false,
    //     //         mobileHeaderTitle: '管理API'
    //     //       },
    //     //       component: resolve => require(['@/components/vue/PersonalCenterSecurityCenterManageApi'], resolve)
    //     //     },
    //     //   ]
    //     // },
    //     // 安全日志  todo 合约删除
    //     // {
    //     //   path: 'securityLog',
    //     //   name: 'securityLog',
    //     //   caseSensitive: true,
    //     //   meta: {
    //     //     pcname: 'securityLog',
    //     //     h5name: '',
    //     //     requireLogin: true,
    //     //     templateClose: false,
    //     //     requireLoginOff: false,
    //     //   },
    //     //   component: resolve => require(['@/components/vue/PersonalCenterSecurityLog'], resolve)
    //     // },
    //
    //     // H5我的推荐 TODO 合约删除
    //     {
    //       path: 'H5Recommend',
    //       name: 'H5Recommend',
    //
    //       caseSensitive: true,
    //       meta: {
    //         pcname: '',
    //         h5name: 'H5Recommend',
    //         requireLogin: true,
    //         templateClose: false,
    //         requireLoginOff: false,
    //       },
    //       component: resolve => require(['@/components/mobileVue/PersonalCenterH5Recommend'], resolve)
    //     },
    //
    //     // H5我的专属海报  TODO 合约删除
    //     // {
    //     //   path: 'H5PosterInvitation',
    //     //   name: 'H5PosterInvitation',
    //     //
    //     //   caseSensitive: true,
    //     //   meta: {
    //     //     pcname: '',
    //     //     h5name: 'H5PosterInvitation',
    //     //     requireLogin: true,
    //     //     templateClose: false,
    //     //     requireLoginOff: false,
    //     //   },
    //     //   component: resolve => require(['@/components/mobileVue/PersonalCenterH5PosterInvitation'], resolve)
    //     // },
    //     // 安全策略  TODO 合约删除
    //     // {
    //     //   path: 'securityStrategy',
    //     //   caseSensitive: true,
    //     //   meta: {
    //     //     requireLogin: true,
    //     //   },
    //     //   component: resolve => require(['@/components/vue/PersonalCenterSecurityStrategy'], resolve)
    //     // },
    //
    //
    //     // 身份认证 TODO 合约删除
    //     {
    //       path: 'auth',
    //       caseSensitive: true,
    //       meta: {
    //         requireLogin: true,
    //         templateClose: false,
    //         requireLoginOff: false,
    //       },
    //       component: resolve => require(['@/components/vue/PersonalCenterAuth'], resolve),
    //       children: [
    //         // 默认认证状态
    //         {
    //           path: '',
    //           caseSensitive: true,
    //           meta: {
    //             requireLogin: true,
    //             templateClose: false,
    //             requireLoginOff: false,
    //           },
    //           redirect: 'authentication'
    //         },
    //         // 认证状态 TODO 合约删除
    //         {
    //           path: 'authentication',
    //           name: 'authentication',
    //           caseSensitive: true,
    //           meta: {
    //             pcname: 'authentication',
    //             h5name: 'authentication',
    //             requireLogin: true,
    //             templateClose: false,
    //             requireLoginOff: false,
    //           },
    //           component: resolve => require(['@/components/vue/PersonalCenterAuthAuthenticationState'], resolve)
    //         },
    //         // 去认证  TODO 合约删除
    //         {
    //           path: 'authenticate',
    //           name: 'authenticate',
    //           caseSensitive: true,
    //           meta: {
    //             pcname: 'authenticate',
    //             h5name: '',
    //             requireLogin: true,
    //             templateClose: false,
    //             requireLoginOff: false,
    //           },
    //           component: resolve => require(['@/components/vue/PersonalCenterAuthToAuthenticate'], resolve)
    //         },
    //         //燃烧BDB收益   TODO 合约删除
    //         {
    //           path: 'burnBDBProfit',
    //           name: 'burnBDBProfit',
    //           caseSensitive: true,
    //           meta: {
    //             pcname: 'burnBDBProfit',
    //             h5name: '',
    //             requireLogin: true,
    //             templateClose: false,
    //             requireLoginOff: false,
    //           },
    //           component: resolve => require(['@/components/btActivity/vue/BtActivityBDBBurnProfit'], resolve)
    //         },
    //
    //       ]
    //     },
    //     // 我的为蜜  TODO 合约删除
    //     // {
    //     //   path: 'mySuperBee',
    //     //   name: 'mySuperBee',
    //     //   caseSensitive: true,
    //     //   meta: {
    //     //     pcname: 'mySuperBee',
    //     //     h5name: '',
    //     //     requireLogin: true,
    //     //     templateClose: false,
    //     //     requireLoginOff: false,
    //     //   },
    //     //   component: resolve => require(['@/components/vue/PersonalCenterMySuperBee'], resolve)
    //     // },
    //     // TODO:要删除  TODO 合约删除
    //     // 挖矿收益
    //     // {
    //     //   path: 'btActivity',
    //     //   name: 'btActivity',
    //     //   caseSensitive: true,
    //     //   meta: {
    //     //     mobileHeaderTitle: '',
    //     //     pcname: 'btActivity',
    //     //     h5name: 'MobileBTActivityHomePage',
    //     //     requireLogin: true,
    //     //   },
    //     //   component: resolve => require(['@/components/btActivity/vue/BtActivity.vue'], resolve),
    //     // },
    //   ]
    // },

    // 行情  TODO 合约删除
    {
      path: 'indexHomeMarket',
      name: 'indexHomeMarket',
      caseSensitive: true,
      meta: {
        requireLogin: false,
        mobileHeaderTitle: '',
        pcname: 'indexHomeMarket',
        h5name: 'mobileTradingHall',
      },
      component: resolve => require(['@/components/vue/IndexHomeMarket'], resolve),
    },



    // TODO：弹框组件临时显示（记得删除）  TODO 合约保留
    // {
    //   path: 'PopPublic',
    //   name: 'PopPublic',
    //   caseSensitive: true,
    //   component: resolve => require(['@/components/vue/PopPublic'], resolve),
    //   // meta: {
    //   //   pcname: 'historicalEntrust',
    //   //   h5name: 'MobileHistoryOrder',
    //   //   requireLogin: true,
    //   //   templateClose: false,
    //   //   templatePath: '/index/orderPageT',
    //   //   requireLoginOff: false,
    //   // },
    // },


    // 订单  TODO 合约保留
    {
      path: 'order',
      caseSensitive: true,
      meta: {
        requireLogin: false,
      },
      component: resolve => require(['@/components/vue/OrderPage'], resolve),
      children: [
        // 默认当前订单
        {
          path: '',
          redirect: 'currentEntrust',
          caseSensitive: true,
          meta: {
            pcname: 'currentEntrust',
            h5name: 'mobileTradingHallDetail',
            requireLogin: false,
            templateClose: false,
            templatePath: '/index/orderPageT',
            requireLoginOff: false,
          },
        },
        // 当前订单
        {
          path: 'currentEntrust',
          name: 'currentEntrust',
          caseSensitive: true,
          component: resolve => require(['@/components/vue/OrderPageCurrentEntrustment'], resolve),
          meta: {
            pcname: 'currentEntrust',
            h5name: 'mobileTradingHallDetail',
            requireLogin: false,
            templateClose: false,
            templatePath: '/index/orderPageT',
            requireLoginOff: false,
          },
        },
        // 历史订单
        {
          path: 'historicalEntrust',
          name: 'historicalEntrust',
          caseSensitive: true,
          component: resolve => require(['@/components/vue/OrderPageHistoricalEntrustment'], resolve),
          meta: {
            pcname: 'historicalEntrust',
            h5name: 'MobileHistoryOrder',
            requireLogin: false,
            templateClose: false,
            templatePath: '/index/orderPageT',
            requireLoginOff: false,
          },
        },
        // 历史成交
        {
          path: 'historicalTransaction',
          name: 'historicalTransaction',
          caseSensitive: true,
          component: resolve => require(['@/components/vue/HistoricalTransaction'], resolve),
          meta: {
            pcname: 'historicalTransaction',
            h5name: '',
            requireLogin: false,
            templateClose: false,
            templatePath: '/index/orderPageT',
            requireLoginOff: false,
          },
        },
        // 资金流水
        {
          path: 'capitalFlow',
          name: 'capitalFlow',
          caseSensitive: true,
          component: resolve => require(['@/components/vue/CapitalFlow'], resolve),
          meta: {
            pcname: 'capitalFlow',
            h5name: '',
            requireLogin: false,
            templateClose: false,
            templatePath: '/index/orderPageT',
            requireLoginOff: false,
          },
        },


      ]
    },

    // TODO:要删除 check  TODO 合约删除
    // {
    //   path: 'tradingHallT',
    //   caseSensitive: true,
    //   component: resolve => require(['@/components/vue/TemplateCloseTradingHall'], resolve),
    //   meta: {},
    // },

    // TODO:要删除 check   TOD`O 合约删除
    // {
    //   path: 'assetPageT',
    //   caseSensitive: true,
    //   component: resolve => require(['@/components/vue/TemplateCloseAssetPage'], resolve),
    //   meta: {
    //     requireLogin: true,
    //   },
    // },

    // TODO:要删除 check  TODO 合约删除
    // {
    //   path: 'orderPageT',
    //   caseSensitive: true,
    //   component: resolve => require(['@/components/vue/TemplateCloseOrderPage'], resolve),
    //   meta: {
    //     requireLogin: true,
    //   },
    // },
  ]
})


// 合约首次进入弹框记录
root.routes.push({
  path: '/index/contractRiskWarning',
  name: 'contractRiskWarning',
  meta: {
    requireLogin: true,
    pcname: '',
    h5name: 'contractRiskWarning',
  },
  caseSensitive: true,
  component: resolve => require(['@/components/vue/ContractRiskWarning'], resolve)
})

// 合约全部记录
root.routes.push({
  path: '/index/mobileContractAllRecords',
  name: 'mobileContractAllRecords',
  meta: {
    requireLogin: true,
    pcname: '',
    h5name: 'mobileContractAllRecords',
  },
  caseSensitive: true,
  component: resolve => require(['@/components/vue/MobileContractAllRecords'], resolve)
})

export default root
