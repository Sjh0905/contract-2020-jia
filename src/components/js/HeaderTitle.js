const root = {}

const interval = '';

root.name = 'HeaderTitle'

root.components = {
  'Loading': resolve => require(['../vue/Loading'], resolve),
}

root.data = function () {
	return {
		rate: '',
	    // DB市场的汇率 是用BDB/ETH的汇率 * BDB/ETH的时价算出来的
	    bdb_rate: 0,
		time: 60,
		loading: true,
		get_currency_list: {},
		// 精度
		baseScale: 0,
		quoteScale: 0,
	}
}

root.props = {}
root.props.currency_list = {
	type: Object,
	default: {}
}
root.props.socket_tick = {
	type: Object,
	default: {}
}
root.props.socket_snap_shot = {
	type: Object,
	default: {}
}
root.props.socket_price = {
	type: Object,
	default: {}
}
root.props.btc_eth_rate = {
	type: Object,
	default: {}
}
root.props.buy_sale_list = {
	type: Object,
	default: {}
}


root.computed = {}
// 当前货币对
root.computed.symbol = function () {
	return this.$store.state.symbol;
}
// 实时价格
root.computed.isNowPrice = function () {
	let price = this.$globalFunc.mergeObj(this.socket_snap_shot.price, this.buy_sale_list.price) || 0;
	let priceObj = this.$globalFunc.mergeObj(this.socket_tick, {price: price});
	let now_price = this.$globalFunc.accFixed(priceObj.price, this.quoteScale);
  document.title = now_price+" "+this.$store.state.symbol.replace('_', '/')+" "+this.$t('document_title');
	// if (!!this.socket_snap_shot.price)
	return now_price;
}
// 实时价格的升降
root.computed.direction = function () {
	return this.socket_tick.direction;
}
// 实时价格cny
root.computed.isCnyPrice = function () {
	let close = this.isNowPrice || 0;
	if (this.$store.state.lang === 'CH') {
		return ('￥' + this.$globalFunc.accFixedCny(this.$store.state.exchange_rate_dollar * (close * this.rate), 2));
	} else {
		return ('$' + this.$globalFunc.accFixedCny((close * this.rate), 2));
	}
	// if (this.$store.state.lang === 'EN') {
	// 	return ('$' + ((close * this.rate)).toFixed(2));
	// }
}
root.computed.mergeList = function () {
	let list = this.$globalFunc.mergeObj(this.socket_price, this.currency_list);
	return list;
}

// 24小时涨跌
root.computed.diff24 = function () {
  // let diff = this.isNowPrice  - Number(this.mergeList[this.symbol][1])
  // 减法
  if (!this.mergeList[this.symbol]) return;
  let diff = this.$globalFunc.accFixed(this.$globalFunc.accMinus(this.isNowPrice, this.mergeList[this.symbol][1]), this.quoteScale);
  return diff;
}
// 24小时涨跌百分比 (现价 - 开盘价) / 开盘价
root.computed.diff24Ratio = function () {
	if (!this.mergeList[this.symbol]) return;
	let now_price = this.isNowPrice || 0;
	let diff = ((Number(now_price) - Number(this.mergeList[this.symbol][1])) / Number(this.mergeList[this.symbol][1])*100).toFixed(2);
	if (this.mergeList[this.symbol][1] == 0) {
		return 0
	} else {
		return diff;
	}
}
// time: b[0],
// open: b[1],
// high: b[2],
// low: b[3],
// close: b[4],
// volume: b[5]

// 24小时最低价
root.computed.low24 = function () {
	// console.log('list', this.mergeList[this.symbol][3])
	if (!this.mergeList[this.symbol]) return;
	let low = Math.min((this.isNowPrice || 10000), this.mergeList[this.symbol][3]);
	let low24 = this.$globalFunc.accFixed(low, this.quoteScale);
	return low24;
}
// 24小时最高价
root.computed.high24 = function () {
	// console.log('list', this.mergeList[this.symbol][2])
	if (!this.mergeList[this.symbol]) return;
	let high = Math.max(this.isNowPrice, this.mergeList[this.symbol][2]);
	let high24 = this.$globalFunc.accFixed(high, this.quoteScale);
	return high24;
}
// 24小时成交量
root.computed.volume = function () {
	if (!this.mergeList[this.symbol]) return;
	let volume = this.$globalFunc.accFixed(this.mergeList[this.symbol][5], 0);
	return volume;
}

// 实时价格 需要取BDB/ETH的时价和汇率来算BDB的汇率
root.computed.topic_price = function () {
  return this.socket_price;
}

root.watch = {};

root.watch.isNowPrice = function (newValue, oldValue) {
	this.GET_RATE('');
}

// 监听BDB/ETH的实时价格
root.watch.topic_price = function (newValue, oldValue) {
  // bdb_rate
  let self = this;
  for (let key in newValue) {
    if (key == 'BDB_ETH') {
      self.bdb_rate = newValue[key][4];
    }
  }
}

root.watch.symbol = function (newValue, oldValue) {
	if (newValue == oldValue) return;
	this.getScaleConfig();
}


root.created = function () {
	// 获取兑换汇率
	this.getCny();
	// 一小时更新一次汇率
	// this.changeCny();

	// 判断是否有 props currency_list带过来的值，如果没有请求
	!this.currency_list[this.symbol] ? this.getCurrencyList() : (this.loading = false);

	// 获取小数位
	this.getScaleConfig();
}


root.methods = {};
// 获取小数点位数
root.methods.getScaleConfig =  function () {
	 this.$store.state.quoteConfig.forEach(
		v => {
			v.name === this.$store.state.symbol && (this.baseScale = v.baseScale , this.quoteScale = v.quoteScale)
		}
	)
}
// 获取汇率
root.methods.GET_RATE = function (data) {
	let btc_eth_rate = !!data ? data : this.btc_eth_rate;
	if (!btc_eth_rate.dataMap) {
		return 0;
	}
	let type = this.$store.state.symbol.split('_')[1];
	let rate_obj = btc_eth_rate.dataMap.exchangeRate;
	switch (type) {
		case 'BTC':
			this.rate = rate_obj.btcExchangeRate || 0;
			break;
		case 'ETH':
			this.rate = rate_obj.ethExchangeRate || 0;
			break;
		case 'BDB':
			this.rate = rate_obj.ethExchangeRate * this.bdb_rate || 0;
			break;
		case 'USDT':
			this.rate = 1;
			break;
		default:
			this.rate = 0;
			break;
	}
}

// 如果没有属性带过来，请求一遍
root.methods.getCurrencyList = function () {
	this.$http.send('MARKET_PRICES',{
		bind: this,
		callBack: this.re_getCurrencyList
	})
}

// 渲染币对列表信息
root.methods.re_getCurrencyList = function (data) {
	typeof(data) == 'string' && (data = JSON.parse(data));
	this.get_currency_list = data;
	this.loading = false;
}

// 获取汇率
root.methods.getCny = function () {
	this.$http.send('GET_EXCHANGE__RAGE', {bind: this, callBack: this.getNowCny})
}
// 判断汇率
root.methods.getNowCny = function (data) {
	typeof(data) == 'string' && (data = JSON.parse(data));
	this.GET_RATE(data);
}


// 一小时轮询一次汇率
root.methods.changeCny = function () {
	let that = this;
	interval = setInterval(function () {
		that.time--;
		if (that.time == 0) {
			that.getCny();
			that.time = 60;
		}
	}, 1000);
}


// 获取区间位置
root.methods.rangePrice = function (max, min, every) {
	let position = (every / (max - min) * 100).toFixed(2);
	position = position > 95 ? 95 : (position < 0 ? 0 : position);
	this.max_min_pisition = position;
	// console.log('position', position);
}

// 组件销毁前清除 interval
root.beforeDestroy = function () {
	clearInterval(interval);
}


































//=====================================================



// root.data = function () {
// 	return {
// 		topicTick: null,
// 		open: 0,
// 		high: 0,
// 		low: 0,
// 		close: 0,
// 		volume: 0,
// 		title: this.$store.state.symbol,
// 		time: 60,
// 		tax: 0,
// 		cny: 0,
// 		interval: null,
// 		quoteScale: 0,
// 		baseScale: 0,
// 		priceNow: '- -',
// 		diff24Ratio: '- -',
// 		diff24: '- -',
// 		high24: '- -',
// 		low24: '- -',
// 		// 实价和最高最低的区间位置
// 		max_min_pisition: 47
// 	}
// }

// //TODO:scale 从/common/symbols拿

// root.created = function () {
// 	//获取精度
// 	this.getScaleConfig()

// 	//拉一波初始数据
// 	this.getCachePrice()

// 	var that = this
// 	this.$socket.on({
// 		key: 'topic_tick', bind: this, callBack: function (message) {
// 			that.priceNow = that.formatnumber(message instanceof Array && message[0].price || message.price, that.quoteScale);
// 		}
// 	})

// 	this.$socket.on({
// 		key: 'topic_prices', bind: this, callBack: function (message) {



// 			if (!message[that.$store.state.symbol]) return

// 			that.open = message[that.$store.state.symbol][1]
// 			that.high = message[that.$store.state.symbol][2]
// 			that.low = message[that.$store.state.symbol][3]
// 			that.close = message[that.$store.state.symbol][4]
// 			that.volume = message[that.$store.state.symbol][5]


// 			if (that.$store.state.lang === 'CH') {
// 				that.cny = '￥' + (6.7 * (that.close * that.tax)).toFixed(2)
// 			}
// 			if (that.$store.state.lang === 'EN') {
// 				that.cny = '$' + ((that.close * that.tax)).toFixed(2)
// 			}


// 			that.diff24 = that.formatnumber(that.close - that.open, that.quoteScale)
// 			that.diff24Ratio = ((that.close - that.open) / that.open * 100 + 0.004).toFixed(2)
// 			that.high24 = that.formatnumber(that.high, that.quoteScale)
// 			that.low24 = that.formatnumber(that.low, that.quoteScale)

// 			that.rangePrice(that.high24, that.low24, that.priceNow);

// 		}
// 	})

// 	this.$eventBus.listen(this, 'CHANGE_PRICE', this.listenPrice)

// 	this.$eventBus.listen(this, 'SWITCH_SYMBOL', this.SWITCH_SYMBOL)


// 	// 获取兑美元汇率
// 	this.getCny();

// 	this.changeCny();


// }

// root.methods = {}
// // 获取区间位置
// root.methods.rangePrice = function (max, min, every) {
// 	let position = (every / (max - min) * 100).toFixed(2);
// 	position = position > 95 ? 95 : (position < 0 ? 0 : position);
// 	this.max_min_pisition = position;
// 	// console.log('position', position);
// }

// root.methods.listenPrice = function (price) {

// 	this.getScaleConfig()
// 	// this.topicTick = {'price': price};
// 	this.priceNow = price
// 	// this.cny = (price * this.tax).toFixed(2)
// 	// this.getCny()


// 	if (this.$store.state.lang === 'CH') {
// 		this.cny = '￥' + (6.7 * (price * this.tax)).toFixed(2)
// 	}
// 	if (this.$store.state.lang === 'EN') {
// 		this.cny = '$' + ((price * this.tax)).toFixed(2)
// 	}

// }

// root.methods.changeCny = function () {
// 	// GET_BTC_TO_CNY
// 	let that = this;
// 	interval = setInterval(function () {
// 		that.time--;
// 		if (that.time == 0) {
// 			that.getCny();
// 			that.time = 60;
// 		}
// 	}, 1000);
// }

// root.methods.getCny = function () {
// 	this.$http.send('GET_EXCHANGE__RAGE', {bind: this, callBack: this.getNowCny})
// }

// root.methods.SWITCH_SYMBOL = function (data) {
// 	this.getScaleConfig()
// 	this.getCachePrice()
// 	this.getCny()

// 	// if (this.$store.state.lang === 'CH') {
// 	// 	this.cny = '￥' + 6.7 * (this.priceNow * this.tax).toFixed(2)
// 	// }
// 	// if (this.$store.state.lang === 'EN') {
// 	// 	this.cny = '$' + (this.priceNow * this.tax).toFixed(2)
// 	// }



// }


// root.methods.getNowCny = function (data) {
// 	// console.log('JSON.parse(data)')

// 	if (this.$store.state.symbol.split('_')[1] === "BTC" || this.$store.state.symbol.split('_')[1] === "BTX") {
// 		this.tax = JSON.parse(data).dataMap.exchangeRate.btcExchangeRate
// 	}
// 	if (this.$store.state.symbol.split('_')[1] === "ETH" || this.$store.state.symbol.split('_')[1] === "ETX") {
// 		this.tax = JSON.parse(data).dataMap.exchangeRate.ethExchangeRate
// 	}

// }

// root.methods.getCachePrice = function () {
// 	this.$http.send('MARKET_PRICES', {bind: this, callBack: this.RE_MARKET_PRICES})
// }
// root.methods.RE_MARKET_PRICES = function (data) {

// 	this.priceNow = this.formatnumber(data[this.$store.state.symbol][4], this.quoteScale)

// 	let t = data[this.$store.state.symbol]

// 	this.diff24 = this.formatnumber(t[4] - t[1], this.quoteScale)
// 	this.diff24Ratio = ((t[4] - t[1]) / t[1] * 100 + 0.004).toFixed(2)
// 	this.high24 = this.formatnumber(t[2], this.quoteScale)
// 	this.low24 = this.formatnumber(t[4], this.quoteScale)

// 	this.volume = t[5]

// 	// 获取时价位置区间
// 	this.rangePrice(this.high24, this.low24, this.priceNow)
// }

// //获取精度
// root.methods.getScaleConfig = function () {

// 	this.$store.state.quoteConfig.forEach(
// 		v => {
// 			v.name === this.$store.state.symbol && (this.baseScale = v.baseScale , this.quoteScale = v.quoteScale)
// 		}
// 	)

// }

// root.beforeDestroy = function () {
// 	clearInterval(interval);
// }


// root.computed = {}

// root.computed.changeSymbol = function () {
// 	return this.$store.state.symbol
// }


// root.watch = {}


// root.watch.changeSymbol = function (newVal, oldVal) {
// 	this.title = newVal;
// 	console.log('symbol changed')
// }


// root.methods.formatnumber = function (value, num) {
// 	var a, b, c, i;
// 	a = value.toString();
// 	b = a.indexOf(".");
// 	c = a.length;
// 	if (num == 0) {
// 		if (b != -1) {
// 			a = a.substring(0, b);
// 		}
// 	} else {//如果没有小数点
// 		if (b == -1) {
// 			a = a + ".";
// 			for (i = 1; i <= num; i++) {
// 				a = a + "0";
// 			}
// 		} else {//有小数点，超出位数自动截取，否则补0
// 			a = a.substring(0, b + num + 1);
// 			for (i = c; i <= b + num; i++) {
// 				a = a + "0";
// 			}
// 		}
// 	}
// 	return a;
// }

export default root
