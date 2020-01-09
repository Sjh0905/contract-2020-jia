const root = {}


root.name = 'IndexHeaderAssetsAlpha'

/*----------------------- 组件 --------------------------*/


root.components = {
	'Loading': resolve => require(['../vue/Loading'], resolve)
}


/*----------------------- data --------------------------*/


root.data = function () {
	return {
		loading: false,

		total: 0, //总资产
		frozen: 0, //冻结
		available: 0, //可用
		currentPrice: {}, //最近一次的socket推送数据

		priceReady: false, //socket连接上
		accountReady: false,  //账户信息拿到

		initData: {},


	}
}

/*----------------------- 生命周期 --------------------------*/

root.created = function () {
	this.getInitData()
	this.getPrice()
	this.getCurrencyAndAccount()
}

/*----------------------- 计算 --------------------------*/


root.computed = {}
// 观测currency是否发生变化
root.computed.watchCurrency = function () {
	return this.$store.state.currencyChange
}
// 计价货币
root.computed.baseCurrency = function () {
	return this.$store.state.baseCurrency
}
// 用户名
// 用户类型，如果是手机用户，为0，如果是邮箱用户，为1
root.computed.userType = function () {
  return this.$store.state.authMessage && this.$store.state.authMessage.province === 'mobile' ? 0 : 1
}

// 邮箱
root.computed.userName = function () {
  if (this.userType === 0) {
    return this.$globalFunc.formatUserName(this.$store.state.authMessage.mobile)
  }
  if (!this.$store.state.authMessage.email) {
    return '****@****'
  }
  return this.$globalFunc.formatUserName(this.$store.state.authMessage.email)
}

/*----------------------- 观察 --------------------------*/

root.watch = {}
root.watch.watchCurrency = function () {
	this.changeAppraisement(this.currentPrice)
}


/*----------------------- 方法 --------------------------*/


root.methods = {}


// 获取初始data
root.methods.getInitData = function () {
	this.$http.send('MARKET_PRICES', {
		bind: this,
		callBack: this.re_getInitData,
		errorHandler: this.error_getInitData
	})
}
// 返回初始data
root.methods.re_getInitData = function (data) {
	typeof data === 'string' && (data = JSON.parse(data))
	// console.warn('获取了初始化数据', data)
	this.initData = data
	this.changeAppraisement(this.initData)
}
// 获取data出错
root.methods.error_getInitData = function (err) {
	console.warn('获取init数据出错', err)
}

// 获取币种和账户
root.methods.getCurrencyAndAccount = function () {
	let currency = [...this.$store.state.currency.values()]
	if (currency.length === 0) {
		// 先获取币种
		this.getCurrency()
		return
	}
	// 再获取账户
	this.getAccounts()
}

// 获取币种
root.methods.getCurrency = function () {
	this.$http.send("GET_CURRENCY", {
		bind: this,
		callBack: this.re_getCurrency,
		errorHandler: this.error_getCurrency
	})
}

// 获取币种回调
root.methods.re_getCurrency = function (data) {
	typeof (data) === 'string' && (data = JSON.parse(data))
	if (!data.dataMap || !data.dataMap.currencys) {
		// console.warn("拿回了奇怪的东西！", data)
		return
	}
	this.$store.commit('CHANGE_CURRENCY', data.dataMap.currencys)
	// 获取账户信息
	this.getAccounts()
}
// 获取币种出错
root.methods.error_getCurrency = function (err) {
	console.warn('获取币种列表出错！', err)
}

// 获取账户信息
root.methods.getAccounts = function () {
	// 请求各项估值
	this.$http.send('RECHARGE_AND_WITHDRAWALS_RECORD', {
		bind: this,
		callBack: this.re_getAccount,
		errorHandler: this.error_getAccount
	})
}

// 获取账户信息回调
root.methods.re_getAccount = function (data) {
	typeof (data) === 'string' && (data = JSON.parse(data))
	if (!data || !data.accounts) {
		console.warn("拿回了奇怪的东西！", data)
		return
	}
	this.$store.commit('CHANGE_ACCOUNT', data.accounts)
	this.accountReady = true
	// this.loading = !(this.accountReady && this.priceReady)
}

// 获取账户信息出错
root.methods.error_getAccount = function (err) {
	console.warn('获取账户信息出错', err)
}
// 通过socket获取价格
root.methods.getPrice = function () {
	this.$socket.on({
		key: 'topic_prices',
		bind: this,
		callBack: this.re_getPrice
	})
}

// 通过socket获取价格的回调
root.methods.re_getPrice = function (data) {
	typeof (data) === 'string' && (data = JSON.parse(data))
	if (!data) return
	this.priceReady = true
	// this.loading = !(this.accountReady && this.priceReady)

	this.currentPrice = data
	this.changeAppraisement(data)

}
// 修改估值
root.methods.changeAppraisement = function (dataObj) {
	typeof (dataObj) === 'string' && (dataObj = JSON.parse(dataObj))
	let data = this.$globalFunc.mergeObj(dataObj, this.initData)
	this.initData = data
	if (!data) return

	let total = 0
	let frozen = 0
	let available = 0

	for (let key in data) {
		let targetName = key.split('_')[0]
		let baseName = key.split('_')[1]
		if (baseName !== this.baseCurrency) continue
		let targetObj = this.$store.state.currency.get(targetName)
		if (!targetObj) continue
		total += targetObj.total * data[key][4]
		frozen += targetObj.frozen * data[key][4]
		available += targetObj.available * data[key][4]
	}

	// 特殊处理，作为base的货币也要加进去
	let baseCurrencyHandle = this.$store.state.currency.get(this.baseCurrency)
	if (baseCurrencyHandle) {
		total += baseCurrencyHandle.total
		frozen += baseCurrencyHandle.frozen
		available += baseCurrencyHandle.available
	}

	this.total = total
	this.frozen = frozen
	this.available = available

}

/*---------------------- 保留小数 begin ---------------------*/
root.methods.toFixed = function (num, acc = 8) {
	return this.$globalFunc.accFixed(num, acc)
}
/*---------------------- 保留小数 end ---------------------*/


export default root
