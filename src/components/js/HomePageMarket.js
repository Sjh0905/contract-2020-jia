const root = {}
root.name = 'HomePageMarket'

root.props = {}

const interval = '';
const interval_cny = '';

root.data = function () {
	return {
		type: 0,
		tax: 0,
		list: [],
	    // 参数
	    currencyType: 0,  // 货币类型
	}
}

root.components = {
	'HomePageMarketItem': resolve => require(['../vue/HomePageMarketItem'], resolve)
}

root.created = function () {
	let that = this;
	return;
	this.$eventBus.listen(this, 'currencyType', this.getCurrencyType)
	// console.log('this is props',this.$store.state.currencyList);


  //sss===

	// 获取币对信息
	this.getCurrency();
	// 临时解决socket问题
  interval = setInterval(that.getCurrency, 5000);

	// 折合人民币
	this.getCny();
	this.changeCny();

}

root.methods = {};

// 获取币对信息
root.methods.getCurrency = function (type) {
  this.$http.send('MARKET_PRICES',{
    bind: this,
    callBack: this.displayCurrency
  });
}

// 渲染货币对信息
root.methods.displayCurrency = function (data) {
  let that = this;
  this.$store.commit('getCurrencyList', data);
  this.displayBTClist(data, this.type);
}

// 切换币对市场
root.methods.changeCurrencyMarket = function (type) {
  this.currencyType = type;
  this.$eventBus.notify({key: 'currencyType'}, type)
}

root.methods.getCny = function () {
	this.$http.send('GET_EXCHANGE__RAGE',{
		bind: this,
		callBack: this.getNowCny
	})
}

root.methods.getNowCny = function (data){
	this.tax = JSON.parse(data).dataMap.exchangeRate;
	// 渲染列表
	this.displayCurrencyList(this.$store.state.currencyList, this.type);
}

root.methods.changeCny = function () {
	// GET_BTC_TO_CNY
	let that = this;
	interval_cny = setInterval(function(){
		that.time--;
		if (that.time == 0) {
		  that.getCny();
		  that.time = 60;
		}
	}, 1000);
}

root.methods.getCurrencyType = function (type) {
	this.type = type;
	// console.log('getCurrencyType:', type)
	this.displayCurrencyList(this.$store.state.currencyList, this.type);
}

root.methods.displayCurrencyList = function (data, type) {
		this.displayBTClist(data, type);
}

root.methods.displayBTClist = function (data, type) {
	var [initO, o, key] = [{}, {}, ""];
	for (let i in data) {
		[key, initO] = ["", {}];
		key = i && i.split("_")[1];
		if (!key) continue;
		initO.name = i;
		[initO.time, initO.open, initO.high, initO.low, initO.close, initO.volume] = [...data[i]];
		initO.cny = initO.close*this.tax;
		!o[key] && (o[key] = []);
		o[key].push(initO);
	}
	if (type == 0) {
		this.list = o.BTX;
	} else {
		this.list = o.ETX;
	}
	// console.log('currencyList:', this.list);
}

root.beforeDestroy = function () {
  clearInterval(interval);
  clearInterval(interval_cny);
}


export default root
