const root = {}
root.name = 'MobileHistoryDetail'

/*------------------------------ 组件 -------------------------------*/

root.components = {
	'Loading': resolve => require(['../vue/Loading'], resolve),
}

/*------------------------------ data -------------------------------*/

root.data = function () {
	return {
		loading: true,
		limit: 10,
		orderDetail: [],
		loadingMoreShow: false, //加载更多
		loadingMoreShowing: false, //正在加载更多

		replaced: false,//是否抵扣

		originalCurrency: '',//费率币种
		replacedCurrency: '',//抵扣币种
		originalFee: 0, //原来的手续费
		refundedFee: 0, //抵扣金额
		replacedFee: 0, //抵扣手续费

		feeDetailReady: false, //获取费率详情成功
		orderDetailReady: false,//获取各订单成功

		order:null
	}
}

/*------------------------------ props -------------------------------*/

root.props = {}
// order的id，必须
// root.props.orderId = {
// 	type: Number,
// 	required: true
// }
// // 货币对，必须
// root.props.symbol = {
// 	type: String,
// 	required: true
// }
// root.props.orderType = {
// 	type: Number,
// 	required: true
// }

/*------------------------------ 计算 -------------------------------*/

root.computed = {}
// 计算当前symbol
root.computed.symbol = function () {
	// console.warn('symbol',this.$store.state.symbol);
	return this.$store.state.symbol;
}
// 均值
root.computed.averagePrice = function () {
	let avargePrice = 0, price = 0, amount = 0

	this.orderDetail.forEach(v => {
		// amount += v.amount
		amount = this.accAdd(amount, v.amount)
		// price += v.price * v.amount
		price = this.accAdd(price, this.accMul(v.price, v.amount))
	})
	// avargePrice = price / (amount === 0 ? 1 : amount)
	avargePrice = this.accDiv(price, (amount === 0 ? 1 : amount))
	return avargePrice
}

// 总计成交数量
root.computed.amount = function () {
	let amount = 0
	this.orderDetail.forEach(v => {
		amount += v.amount
	})
	return amount
}
// 总成交价
root.computed.filledPrice = function () {
  let filledPrice = 0
  this.orderDetail.forEach(v => {
    // filledPrice += v.amount * v.price
    filledPrice = this.accAdd(filledPrice, this.accMul(v.amount, v.price))
  })
  return filledPrice
}
// 总费率
root.computed.totalFee = function () {
  let fee = 0
  this.orderDetail.forEach(v => {
    // fee += v.fee
    fee = this.accAdd(fee, v.fee)
  })
  return fee
}

// 中英文
root.computed.lang = function () {
	return this.$store.state.lang
}

// 实际到账
root.computed.actualAccount = function () {
  let actualAccount = 0
  this.orderDetail.forEach(v => {
    // actualAccount += v.amount - v.fee
    actualAccount = this.accAdd(actualAccount, this.accMinus(v.amount, v.fee))
  })
  return actualAccount
}

// 所有币对精度信息
root.computed.quoteScale_list = function () {
	let quoteScale_obj = {};
	let quoteScale_list = this.$store.state.quoteConfig;
	quoteScale_list.forEach(v => {
		quoteScale_obj[v.name] = {quoteScale: v.quoteScale, baseScale: v.baseScale};
	})
	return quoteScale_obj;
}

/*------------------------------ 生命周期 -------------------------------*/

root.created = function () {
	this.$store.commit('changeMobileHeaderTitle', '订单详情');

	this.order = this.$route.query

	this.getDetail()
}


/*------------------------------ 方法 -------------------------------*/

root.methods = {}
// 获取订单详情
root.methods.getDetail = function () {
	this.$http.send('GET_ORDERS_DETAIL', {
		bind: this,
		urlFragment: `/${this.order.id}/matches`,
		params: {
			limit: this.limit,
		},
		callBack: this.re_getDetail,
		errorHandler: this.error_getDetail,
	})
}

// 获取订单详情回调
root.methods.re_getDetail = function (data) {
	typeof data === 'string' && (data = JSON.parse(data))
	if (!data || !data.matches) {
    this.getFeeDetail()
    return false
  }
	console.warn("order detail获取到数据！", data)
	this.orderDetail = data.matches
	this.orderDetailReady = true
	this.loading = !(this.orderDetailReady && this.feeDetailReady)


  // this.getFeeDetail()
}
// 获取订单详情失败
root.methods.error_getDetail = function (err) {
	console.warn("order detail获取数据失败！", err)
}


// 获取费率
root.methods.getFeeDetail = function () {
	this.$http.send('POST_FEE_DETAIL', {
		bind: this,
		params: {
			orderId: this.order.id,
			// orderId: '2817743'
		},
		callBack: this.re_getFeeDetail,
		errorHandler: this.error_getFeeDetail
	})
}

// 获取费率回调
root.methods.re_getFeeDetail = function (data) {
	typeof data === 'string' && (data = JSON.parse(data))
	if (!data) return
	console.warn("获取费率详情！", data)
	this.feeDetailReady = true
	this.loading = !(this.orderDetailReady && this.feeDetailReady)
	if (data.errorCode) {
    this.originalFee = this.totalFee
    console.log(this.totalFee)
    console.log('this.originalFee',this.originalFee,this.refundedFee)
		return
	}
	this.replaced = true
	let fundObj = data.dataMap.extOrderFeeRefund
	this.originalCurrency = fundObj.originalFeeCurrency
	this.replacedCurrency = fundObj.replacedFeeCurrency
	this.originalFee = fundObj.originalFee
	this.refundedFee = fundObj.refundedFee
	this.replacedFee = fundObj.replacedFee


  console.log('fundObj',fundObj)
  console.log('this.originalCurrency',this.originalCurrency)
  console.log('this.replacedCurrency',this.replacedCurrency)
  console.log('this.originalFee',this.originalFee)
  console.log('this.refundedFee',this.refundedFee)
  console.log('this.replacedFee',this.replacedFee)

}
// 获取费率失败
root.methods.error_getFeeDetail = function (err) {
	console.warn("获取费率详情出错！", err)
	this.feeDetailReady = true
	this.loading = !(this.orderDetailReady && this.feeDetailReady)
}


// 订单状态
root.methods.getStatus = function (order) {
	if (order.status === 'PARTIAL_CANCELLED') return this.$t('orderPageHistoricalEntrustmentDetail.partialCancelled', {point: ((order.filledAmount / order.amount) * 100).toFixed(2) < 0.01 ? '<0.01' : ((order.filledAmount / order.amount) * 100).toFixed(2)})
	// `撤单（成交 ${((order.filledAmount / order.amount) * 100).toFixed(2) < 0.01 ? '<0.01' : ((order.filledAmount / order.amount) * 100).toFixed(2)}%）` //部分成功
	if (order.status === 'FULLY_CANCELLED') return this.$t('orderPageHistoricalEntrustmentDetail.fullyCancelled')
	// if (order.status === 'FULLY_FILLED') return this.$t('orderPageHistoricalEntrustmentDetail.fullyFilled')
	if (order.status === 'FULLY_FILLED') return "完全成交 (100%)"
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

export default root
