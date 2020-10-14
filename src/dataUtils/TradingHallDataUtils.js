/**
 * Created by zuopengyu on 07-04
 */

const tradingHallData = {}

/** 页面功能模块显示逻辑配置信息
 * singleWarehouseMode: 单仓模式,
 * doubleWarehouseMode: 双仓模式,
 * openWarehouse: 开仓
 * closeWarehouse: 平仓
 * limitPrice: 限价
 * marketPrice: 市价
 * limitProfitStopLoss: 限价止盈止损
 * marketPriceProfitStopLoss: 市价止盈止损
 * passiveDelegation: 被动委托,
 * effectiveTime: 生效时间,
 * reducePositions: 只减仓,
 * triggerType: 触发类型,
 * triggerPrice: 触发价,
 * price: 买入/卖出价,
 * amount: 买入/卖出量,
 * securityDeposit: 保证金,
 * kaipingType: 1.可开 2.可平,
 * buttonType: 1.买入/做多+卖出/做空 2.开多+开空 3.平空+平多
 */
tradingHallData.positionModeConfigs = {
  singleWarehouseMode:{
    limitPrice:{
      passiveDelegation:true,
      effectiveTime:true,
      reducePositions:true,
      triggerType:false,
      triggerPrice:false,
      price:true,
      amount:true,
      securityDeposit:true,
      kaipingType:1,//1.可开 2.可平
      buttonType:1,//1.买入/做多+卖出/做空 2.开多+开空 3.平空+平多
      buttonType1Create:true,//用来判断接口调用类型
    },
    marketPrice:{
      passiveDelegation:false,
      effectiveTime:false,
      reducePositions:true,
      triggerType:false,
      triggerPrice:false,
      price:false,
      amount:true,
      securityDeposit:true,
      kaipingType:1,//1.可开 2.可平
      buttonType:1,//1.买入/做多+卖出/做空 2.开多+开空 3.平空+平多
      buttonType1Create:true,//用来判断接口调用类型
    },
    limitProfitStopLoss:{
      passiveDelegation:false,
      effectiveTime:true,
      reducePositions:true,
      triggerType:true,
      triggerPrice:true,
      price:true,
      amount:true,
      securityDeposit:true,
      kaipingType:1, //1.可开 2.可平
      buttonType:1, // 1.买入/做多+卖出/做空 2.开多+开空 3.平空+平多
      buttonType1Stop:true,//用来判断接口调用类型
    },
    marketPriceProfitStopLoss:{
      passiveDelegation:false,
      effectiveTime:false,
      reducePositions:true,
      triggerType:true,
      triggerPrice:true,
      price:false,
      amount:true,
      securityDeposit:true,
      kaipingType:1,//1.可开 2.可平
      buttonType:1,//1.买入/做多+卖出/做空 2.开多+开空 3.平空+平多
      buttonType1Stop:true,//用来判断接口调用类型
    },
  },
  doubleWarehouseMode:{
    openWarehouse:{
      limitPrice:{
        passiveDelegation:true,
        effectiveTime:true,
        reducePositions:false,
        triggerType:false,
        triggerPrice:false,
        price:true,
        amount:true,
        securityDeposit:true,
        kaipingType:1,//1.可开 2.可平
        buttonType:2,//1.买入/做多+卖出/做空 2.开多+开空 3.平空+平多
        buttonType2Create:true,//用来判断接口调用类型
      },
      marketPrice:{
        passiveDelegation:false,
        effectiveTime:false,
        reducePositions:false,
        triggerType:false,
        triggerPrice:false,
        price:false,
        amount:true,
        securityDeposit:true,
        kaipingType:1,//1.可开 2.可平
        buttonType:2,//1.买入/做多+卖出/做空 2.开多+开空 3.平空+平多
        buttonType2Create:true,//用来判断接口调用类型
      },
      limitProfitStopLoss:{
        passiveDelegation:false,
        effectiveTime:true,
        reducePositions:false,
        triggerType:true,
        triggerPrice:true,
        price:true,
        amount:true,
        securityDeposit:true,
        kaipingType:1,//1.可开 2.可平
        buttonType:2,//1.买入/做多+卖出/做空 2.开多+开空 3.平空+平多
        buttonType2Stop:true,//用来判断接口调用类型
      },
      marketPriceProfitStopLoss:{
        passiveDelegation:false,
        effectiveTime:false,
        reducePositions:false,
        triggerType:true,
        triggerPrice:true,
        price:false,
        amount:true,
        securityDeposit:true,
        kaipingType:1,//1.可开 2.可平
        buttonType:2,//1.买入/做多+卖出/做空 2.开多+开空 3.平空+平多
        buttonType2Stop:true,//用来判断接口调用类型
      },
    },
    closeWarehouse:{
      limitPrice:{
        passiveDelegation:true,
        effectiveTime:true,
        reducePositions:false,
        triggerType:false,
        triggerPrice:false,
        price:true,
        amount:true,
        securityDeposit:false,
        kaipingType:2,//1.可开 2.可平
        buttonType:3,//1.买入/做多+卖出/做空 2.开多+开空 3.平空+平多
        buttonType3Create:true,//用来判断接口调用类型
      },
      marketPrice:{
        passiveDelegation:false,
        effectiveTime:false,
        reducePositions:false,
        triggerType:false,
        triggerPrice:false,
        price:false,
        amount:true,
        securityDeposit:false,
        kaipingType:2,//1.可开 2.可平
        buttonType:3,//1.买入/做多+卖出/做空 2.开多+开空 3.平空+平多
        buttonType3Create:true,//用来判断接口调用类型
      },
      limitProfitStopLoss:{
        passiveDelegation:false,
        effectiveTime:true,
        reducePositions:false,
        triggerType:true,
        triggerPrice:true,
        price:true,
        amount:true,
        securityDeposit:false,
        kaipingType:2,//1.可开 2.可平
        buttonType:3,//1.买入/做多+卖出/做空 2.开多+开空 3.平空+平多
        buttonType3Stop:true,//用来判断接口调用类型
      },
      marketPriceProfitStopLoss:{
        passiveDelegation:false,
        effectiveTime:false,
        reducePositions:false,
        triggerType:true,
        triggerPrice:true,
        price:false,
        amount:true,
        securityDeposit:false,
        kaipingType:2,//1.可开 2.可平
        buttonType:3,//1.买入/做多+卖出/做空 2.开多+开空 3.平空+平多
        buttonType3Stop:true,//用来判断接口调用类型
      },
    },
  },
}
/**
 * 存储订单/交易更新推送与接口Key值的映射关系
 * @type {{}}
 */
tradingHallData.socketOrderKeyMap = {
  "s":"symbol",//交易对
  'c':'clientOrderId',//客户端自定订单ID/ 用户自定义的订单号
  "S":"side",// 订单方向/买卖方向
  "o":"type",// 订单类型
  "f":"timeInForce",// 有效方式/有效方法
  "q":"origQty",// 订单原始数量/原始委托数量
  "p":"price",// 订单原始价格/委托价格
  "ap":"avgPrice",// 订单平均价格
  "sp":"stopPrice",// 条件订单触发价格，对追踪止损单无效
  "x":"",// 本次事件的具体执行类型/订单状态
  "X":"status",// 订单的当前状态/订单状态
  "i":"orderId",// 订单ID/系统订单号
  "l":"",// 订单末次成交数量
  "z":"executedQty",// 订单累计已成交数量/成交数量
  "L":"",// 订单末次成交价格
  "N":"",// 手续费资产类型
  "n":"",// 手续费数量
  "T":"time",// 成交时间/订单时间
  "t":"",// 成交ID
  "b":"",// 买单净值
  "a":"",// 卖单净值
  "m":"",// 该成交是作为挂单成交吗？
  "R":"reduceOnly",// 是否是只减仓单
  "wt":"workingType",// 触发价类型
  "ot":"origType",// 原始订单类型/触发前订单类型
  "ps":"positionSide",// 持仓方向
  "cp":"closePosition",// 是否为触发平仓单;/是否条件全平仓
  "AP":"activatePrice",// 追踪止损激活价格
  "cr":"priceRate",// 追踪止损回调比例/跟踪止损回调比例
  "rp":"",// 该交易实现盈亏
}
/**
 * 存储Position更新推送与接口Key值的映射关系
 * @type {{s: string, pa: string, ep: string, cr: string, up: string, mt: string, iw: string, ps: string}}
 */
tradingHallData.socketPositionKeyMap = {
  "s":"symbol",// 交易对
  "pa":"positionAmt",  // 仓位
  "ep":"entryPrice",  // 开仓价格
  "cr":"",  // (费前)累计实现损益
  "up":"unrealizedProfit",  // 持仓未实现盈亏，注意大小写哦，接口返回的是unrealizedProfit，API文档写的是unRealizedProfit
  "mt":"marginType",  // 保证金模式
  // "iw":"isolatedMargin", // iw = isolatedWallet ，而isolatedMargin = isolatedWallet + unRealizedProfi，所以不能映射
  "ps":"positionSide" , // 持仓方向
  // "isAutoAddMargin": "false",
  // "leverage": "10", // 当前杠杆倍数  aa
  // "liquidationPrice": "0", // 参考强平价格  aa
  // "markPrice": "6679.50671178",   // 当前标记价格  aa
  // "maxNotionalValue": "20000000", // 当前杠杆倍数允许的名义价值上限

}
/**
 * 存储 Risk for BTC 表中 Level 和 速算数cum_fast_maintenance_amount 的关系
 * 格式为{Level:cum_fast_maintenance_amount}
 * @type {{"1": number, "2": number, "3": number, "4": number, "5": number, "6": number, "7": number, "8": number, "9": number}}
 */
tradingHallData.cumFastMaintenanceAmount = {
  "1":0,
  "2":50,
  "3":1300,
  "4":16300,
  "5":141300,
  "6":1141300,
  "7":2391300,
  "8":4891300,
  "9":24891300,
}
/**
 * 强平价格计算类型
 * positionSide:BOTH SHORT LONG , marginType: cross isolated
 * 类型1，从 Bracket 最高档开始逐层计算 LP
 * 类型2，如果不为净多头，多仓 MMR&cum 代入强平公式，空仓从最高档开始逐层计算 LP1，
 * 类型2，如为净多头，通过 abs(position_notional_value) 在 bracket 中确定 MMR 和 cum，直接代入强平价格计算公式获得结果
 * @type {{BOTH: {cross: number, isolated: number}, SHORT: {cross: number, isolated: number}, LONG: {cross: number, isolated: number}}}
 */
tradingHallData.LPCalculationType = {
  BOTH:{
    cross:1,
    isolated:1,
  },
  SHORT:{
    cross:2,
    isolated:1,
  },
  LONG:{
    cross:2,
    isolated:1,
  }
}

export default tradingHallData
