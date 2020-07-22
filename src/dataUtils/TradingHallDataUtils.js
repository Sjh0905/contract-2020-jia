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
        kaipingType:1,//1.可开 2.可平
        buttonType:2,//1.买入/做多+卖出/做空 2.开多+开空 3.平空+平多
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
      },
    },
  },
}

export default tradingHallData
