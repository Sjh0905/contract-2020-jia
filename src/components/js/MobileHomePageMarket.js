const root = {}
root.name = 'MobileHomePageMarket'

root.props = {}
root.computed = {}
root.watch = {}
root.methods = {}


root.props.choose_symbol = {
  type: String,
  default: 'BDB_ETH'
}
// BTC  ETH市场列表
root.props.currency_list = {
	type: Object,
	default: {}
}
// socekt推送列表数据
root.props.socket_price = {
	type: Object,
	default: {}
}
// 展示btc或eth列表的类型 0 或者 1
root.props.currencyType = {
	type: Number,
	default: 0
}
// 实价升降
root.props.socket_tick = {
	type: Object,
	default: {}
}

root.components = {
	'MobileHomePageMarketItem': resolve => require(['../mobileVue/MobileHomePageMarketItem'], resolve)
}

// ajax获取的数据
root.computed.list = function () {
	let data = this.$globalFunc.mergeObj(this.socket_price, this.currency_list)
	var [initO, o, key] = [{}, {}, ""];
	for (let i in data) {
		[key, initO] = ["", {}];
		key = i && i.split("_")[1];
		if (!key) continue;
		initO.name = i;
		[initO.time, initO.open, initO.high, initO.low, initO.close, initO.volume] = [...data[i]];
		!o[key] && (o[key] = []);
		o[key].push(initO);
	}
	let lists = [];
	switch (this.currencyType) {
		case 1:
			lists = o.BTC;
			break;
		case 2:
			lists = o.ETH;
			break;
		case 3:
			lists = o.BDB;
			break;
		case 0:
			lists = o.USDT;
			break;
		default:
			lists = [];
			break;
	}
	return lists

}

root.data = function () {
	return {

	}
}

root.created = function () {

}











// root.props = {}

// var interval = '';
// var interval_cny = '';

// root.data = function () {
// 	return {
// 		type: 0,
// 		// tax: 0,
// 		list: [],
//     // 参数
//     currencyType: 0,  // 货币类型
// 	}
// }

// root.components = {
// 	'MobileHomePageMarketItem': resolve => require(['../mobileVue/MobileHomePageMarketItem'], resolve)
// }

// root.created = function () {
// 	let that = this;

// 	this.$eventBus.listen(this, 'currencyType', this.getCurrencyType)
// 	// console.log('this is props',this.$store.state.currencyList);


//   // 获取币对信息
//   this.getCurrency();
//   // 临时解决socket问题
//   interval = setInterval(that.getCurrency, 5000);

// 	// 折合人民币
// 	// this.getCny();
// 	this.changeCny();
// }


// root.methods = {};

// // 获取币对信息
// root.methods.getCurrency = function (type) {
//   this.$http.send('MARKET_PRICES',{
//     bind: this,
//     callBack: this.displayCurrency
//   });
// }

// // 渲染货币对信息
// root.methods.displayCurrency = function (data) {
//   let that = this;
//   this.$store.commit('getCurrencyList', data);
//   this.displayBTClist(data, this.type);
// }

// // 切换币对市场
// root.methods.changeCurrencyMarket = function (type) {
//   this.currencyType = type;
//   this.$eventBus.notify({key: 'currencyType'}, type)
// }

// root.methods.getCny = function () {

//   console.log('进入此方法进入此方法')
// 	this.$http.send('GET_EXCHANGE__RAGE',{
// 		bind: this,
// 		callBack: this.getNowCny
// 	})
// }

// root.methods.getNowCny = function (data){
// 	this.tax = JSON.parse(data).dataMap.exchangeRate;
// 	// 渲染列表
// 	this.displayCurrencyList(this.$store.state.currencyList, this.type);
// }

// root.methods.changeCny = function () {
// 	// GET_BTC_TO_CNY
// 	let that = this;
//   interval_cny = setInterval(function(){
// 		that.time--;
// 		if (that.time == 0) {
// 		  that.getCny();
// 		  that.time = 60;
// 		}
// 	}, 1000);
// }

// root.methods.getCurrencyType = function (type) {
// 	this.type = type;
// 	console.log('getCurrencyType:', type)
// 	this.displayCurrencyList(this.$store.state.currencyList, this.type);
// }

// root.methods.displayCurrencyList = function (data, type) {
// 		this.displayBTClist(data, type);
// }

// root.methods.displayBTClist = function (data, type) {
// 	// console.log('rate', this.$store.state.exchange_rate.btcExchangeRate, this.$store.state.exchange_rate.ethExchangeRate, this.$store.state.symbol)
// 	let rate = this.$store.state.symbol.indexOf('BTC') ? this.$store.state.exchange_rate.btcExchangeRate : this.$store.state.exchange_rate.ethExchangeRate;
// 	var [initO, o, key] = [{}, {}, ""];
// 	for (let i in data) {
// 		[key, initO] = ["", {}];
// 		key = i && i.split("_")[1];
// 		if (!key) continue;
// 		initO.name = i;
// 		initO.name1 = i.split("_")[0];
// 		initO.name2 = i.split("_")[1];
// 		[initO.time, initO.open, initO.high, initO.low, initO.close, initO.volume] = [...data[i]];
// 		initO.cny = initO.close * rate;
// 		!o[key] && (o[key] = []);
// 		o[key].push(initO);
// 	}
// 	if (type == 0) {
// 		this.list = o.BTX;
// 	} else {
// 		this.list = o.ETX;
// 	}

// 	// console.log('currencyList:', this.list);
// }

// root.beforeDestroy = function () {
//   clearInterval(interval);
//   clearInterval(interval_cny);
// }


export default root
