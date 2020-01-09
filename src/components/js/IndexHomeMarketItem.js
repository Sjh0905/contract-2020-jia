const root = {};

root.name = 'IndexHomeMarketItem'

root.data = function () {
	return {
		bdb_rate: 0
	}
}

root.created = function () {

}


root.props = {}
root.props.marketItem = {
	type: Object,
	default: {}
}
root.props.btc_eth_rate = {
	type: Object,
	default: {}
}
root.props.marketType = {
	type: Number,
	default: 0
}
root.props.socket_price = {
	type:Object,
	default: {}
}

root.computed = {}
// 实时价格 需要取BDB/ETH的时价和汇率来算BDB的汇率
root.computed.topic_price = function () {
  return this.socket_price;
}

root.computed.rate = function () {
	if (!this.btc_eth_rate.dataMap) {
		return 0;
	}
	let type = this.name.split('_')[1];
	let rate_obj = this.btc_eth_rate.dataMap.exchangeRate;
	switch (type) {
		case 'BTC':
			return rate_obj.btcExchangeRate;
			break;
		case 'ETH':
			return rate_obj.ethExchangeRate;
			break;
		case 'BDB':
			return rate_obj.ethExchangeRate * this.bdb_rate;
			break;
		case 'USDT':
			return 1;
			break;
		default:
			return 0;
			break;
	}
}
// 市场
root.computed.name = function () {
	return this.marketItem.name;
}
// 最新价
root.computed.now_price = function () {
	return this.marketItem.close;	
}
// 实时价格cny
root.computed.cny_price = function () {
	let close = this.now_price || 0;
	if (this.$store.state.lang === 'CH') {
		return ('￥' + this.$globalFunc.accFixedCny(this.$store.state.exchange_rate_dollar * (close * this.rate), 2));
	} else {
		return ('$' + this.$globalFunc.accFixedCny((close * this.rate), 2));
	}
}
// 24小时涨跌
root.computed.diff24 = function () {
	if (this.marketItem.open == 0) {
		return '0.00';
	} else {
		let diff = ((Number(this.now_price) - Number(this.marketItem.open)) / Number(this.marketItem.open)*100).toFixed(2);
  		return diff;
	}
}
// 24小时最低价
root.computed.low24 = function () {
	let low = Math.min((this.now_price || 10000), this.marketItem.low);
	let low24 = this.$globalFunc.accFixed(low, 8);
	return low24;
}
// 24小时最高价
root.computed.high24 = function () {
	// console.log('list', this.mergeList[this.symbol][2])
	let high = Math.max(this.now_price, this.marketItem.high);
	let high24 = this.$globalFunc.accFixed(high, 8);
	return high24;
}
// 24小时成交量
root.computed.volume = function () {
	let volume = this.$globalFunc.accFixed(this.marketItem.volume, 0);
	return volume;
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


root.watch = {}
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


root.methods = {}
// 格式化币对
root.methods.RE_NAME = function (name) {
	return name.replace('_', '/');
}




export default root;