const root = {}
root.name = 'StockCross'
root.components = {
	'StockCrossItems': resolve => require(['../vue/StockCrossItems'], resolve),
	'Loading': resolve => require(['../vue/Loading'], resolve), // loading
}

root.methods = {}

root.props = {}
root.props.buy_sale_list = {
	type: Object,
	default: {}
}
root.props.socket_snap_shot = {
	type: Object,
	default: {}
}
root.props.socket_tick = {
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
root.props.currency_list = {
  type: Object,
  default: {}
}

root.props.trade_loading = {
	type: Boolean,
	default: true
}

root.data = function () {
	return {
		// direction: '',
		// isPriceNow: '- -',
		baseScale: 0,
		quoteScale: 0,
    options: [{
      value:  2,
      label: '2位小数',
    }, {
      value: 3,
      label: '3位小数',
    }, {
      value: 4,
      label: '4位小数',
    }],
    optionQuote:4,
    value: '',

    type: 3,

	}
}

root.created = function () {
	// 获取小数位
	this.getScaleConfig();

	// console.log(this.rate)
	// console.log(this.price,"aaaa")

  // console.log(this.isNowPrice);
  // console.log(this.isPriceNow);


}

root.computed = {}
// 买卖列表
root.computed.sellOrders = function () {

  let list = this.$globalFunc.mergeObj(this.socket_snap_shot, this.buy_sale_list);

  if(list.symbol != this.symbol)return []

  // console.log('<<<<<>>>>>',list);
  // console.log('=====rer=====1',list.sellOrders);

  return list.sellOrders;
}
root.computed.buyOrders = function () {

	let list = this.$globalFunc.mergeObj(this.socket_snap_shot, this.buy_sale_list);

  if(list.symbol != this.symbol)return []

  // console.log('==========2',list);

  return list.buyOrders;
}

// 实时价格
root.computed.isPriceNow = function () {
	// let priceObj = this.$globalFunc.mergeObj(this.socket_snap_shot, this.buy_sale_list);
	// let priceNow = priceObj.price;
	// // store存储当前价格，填写到买卖中，当做默认值
	// this.$store.commit('SET_DEPTH_PRICE', priceNow);
	// return priceNow || '- -';
  // return '- -'

  // console.log("this.socket_snap_shot=====",this.socket_snap_shot);
  // console.log("this.buy_sale_list=====",this.buy_sale_list);
  // console.log("this.buy_sale_list=====",this.symbol);
  if(!!this.buy_sale_list.symbol && this.buy_sale_list.symbol != this.symbol)return '- -'
  if(!!this.socket_snap_shot.symbol && this.socket_snap_shot.symbol != this.symbol)return '- -'

  let price = this.$globalFunc.mergeObj(this.socket_snap_shot.price, this.buy_sale_list.price) || 0;
  let priceObj = this.$globalFunc.mergeObj(this.socket_tick, {price: price});
  let now_price = this.$globalFunc.accFixed(priceObj.price, this.quoteScale);
  document.title = now_price+" "+this.$store.state.symbol.replace('_', '/')+" "+this.$t('document_title');

  // if (!!this.socket_snap_shot.price)
  // console.log("isPriceNow==stockCross====="+now_price);
  return now_price;
}

// 实时价格
// root.computed.isNowPrice = function () {
//   let price = this.$globalFunc.mergeObj(this.socket_snap_shot.price, this.buy_sale_list.price) || 0;
//   let priceObj = this.$globalFunc.mergeObj(this.socket_tick, {price: price});
//   let now_price = this.$globalFunc.accFixed(priceObj.price, this.quoteScale);
//   document.title = now_price+" "+this.$store.state.symbol.replace('_', '/')+" "+this.$t('document_title');
//   // if (!!this.socket_snap_shot.price)
//   console.log("isNowPrice==stockCross=====" + now_price);
//   return now_price;
// }

// 获取上升或下降
root.computed.direction = function () {
	return this.socket_tick.direction;
}

root.computed.symbol = function () {
	return this.$store.state.symbol;
}

root.computed.rate=function(){
	if (!this.btc_eth_rate.dataMap) return;
  let rate;
  let rateObj = this.btc_eth_rate.dataMap.exchangeRate;
  let lang = this.$store.state.lang;
  let type = this.symbol.split('_')[ 1];
  if (type == 'BTC') {
    rate = rateObj.btcExchangeRate || 0;
  }
  if (type == 'ETH') {
    rate = rateObj.ethExchangeRate || 0;
  }
  if (type == 'BDB') {
    rate = rateObj.ethExchangeRate * this.bdb_rate || 0;
  }
  if (type == 'USDT') {
    rate = 1;
  }
  return rate;
    this.change_price = ('￥' + this.$globalFunc.accFixedCny(this.$store.state.exchange_rate_dollar * (price * rate), 2));

}

root.computed.price=function(){
	return this.$globalFunc.accFixed(this.isPriceNow, this.quoteScale)
}

root.watch = {};

root.watch.symbol = function (newValue, oldValue) {
	if (newValue == oldValue) return;
	this.getScaleConfig();
}

root.methods.computerdPrice = function (v){
    this.optionQuote = v
  // console.log('this.optionQuote=====',this.optionQuote)
}


root.methods.excuteList = function(){
    this.buyOrders.forEach(v=>Number(v.price).toFixed(2))
   // console.log('this.buyOrders==============',this.buyOrders)
  return  this.buyOrders
}



// 获取小数点位数
root.methods.getScaleConfig =  function () {
	 this.$store.state.quoteConfig.forEach(
		v => {
			v.name === this.$store.state.symbol && (this.baseScale = v.baseScale , this.quoteScale = v.quoteScale)
		}
	)
}

// 保留位数
root.methods.formatnumber = function (value, num) {
	value = this.scientificToNumber(value)
	var a, b, c, i;
	a = value.toString();
	b = a.indexOf(".");
	c = a.length;
	if (num == 0) {
		if (b != -1) {
			a = a.substring(0, b);
		}
	} else {//如果没有小数点
		if (b == -1) {
			a = a + ".";
			for (i = 1; i <= num; i++) {
				a = a + "0";
			}
		} else {//有小数点，超出位数自动截取，否则补0
			a = a.substring(0, b + num + 1);
			for (i = c; i <= b + num; i++) {
				a = a + "0";
			}
		}
	}
	return a;
}

//科学记数法
root.methods.scientificToNumber = function (num) {
	var str = num.toString();
	var reg = /^(\d+)(e)([\-]?\d+)$/;
	var arr, len,
		zero = '';
	if (!reg.test(str)) {
		if (!num.toString().split('.')[1] || num.toString().split('.')[1].length < 7) {
			return num;
		} else {
			return num.toFixed(8)
		}
	} else {
		arr = reg.exec(str);
		len = Math.abs(arr[3]) - 1;
		for (var i = 0; i < len; i++) {
			zero += '0';
		}
		return '0.' + zero + arr[1];
	}
}

// 买卖盘的切换
root.methods.changeTab = function (type) {
//    type 0 全部  1买盘  2卖盘
  this.type = type

}










// ======================================================================


// root.data = function () {
// 	return {
// 		sellOrders: [],
// 		buyOrders: [],
// 		priceNow: '- -',
// 		direction: '',
// 		SCALE: null
// 	}
// }

// root.created = function () {




// 	this.getScaleConfig()

// 	this.$eventBus.listen(this, 'SWITCH_SYMBOL', this.SWITCH_SYMBOL)

// 	this.$eventBus.listen(this, 'CHANGE_PRICE', this.listenPrice)


// 	this.$http.send("DEPTH", {bind: this, query: {symbol: this.$store.state.symbol}, callBack: this.RE_DEPTH})


// 	var that = this
// 	this.$socket.on({
// 		key: 'topic_snapshot', bind: this, callBack: function (message) {


// 			that.sellOrders = message.sellOrders.splice(0, 12)

// 			that.buyOrders = message.buyOrders.splice(0, 12)


// 		}
// 	})
// 	this.$socket.on({
// 		key: 'topic_tick', bind: this, callBack: function (message) {

// 			that.priceNow = that.formatnumber(message instanceof Array && message[0].price || message.price, that.quoteScale)

// 			that.direction = message.direction

// 			that.$store.state.temp_price = message.price
// 		}
// 	})


// }


// root.methods.listenPrice = function (price) {
// 	this.getScaleConfig()

// 	// this.price = price;
// 	this.priceNow = price
// }

// root.methods.RE_DEPTH = function (data) {


// 	this.sellOrders = data.sellOrders.splice(0, 12);
// 	this.buyOrders = data.buyOrders.splice(0, 12);

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

// root.methods.scale = function (num, scale) {
// 	var r = /^[+-]?[1-9]?[0-9]*\.[0-9]*$/;
// 	if (r.test(num)) {
// 		var l = scale - num.toString().length + 1
// 		if (l > 0) {
// 			for (var i = 0; i < l; i++) {
// 				num += '0'
// 			}
// 		}
// 		return num.toString().substr(0, scale + 1)
// 	}
// 	if (!r.test(num)) {

// 		var l = scale - num.toString().length + 1
// 		num += '.'
// 		if (l > 0) {
// 			for (var i = 0; i < l; i++) {
// 				num += '0'
// 			}
// 		}
// 		return num.toString().substr(0, scale + 1)
// 	}
// }

// root.methods.SWITCH_SYMBOL = function (data) {
// 	this.getScaleConfig()


// 	this.$http.send("DEPTH", {
// 		bind: this, query: {symbol: this.$store.state.symbol}, callBack: this.RE_DEPTH
// 	})

// }

// root.methods.doScale = function (num) {

// 	var value = Math.floor(parseFloat(num) * 100) / 100;

// 	var xsd = value.toString().split(".");

// 	if (xsd.length == 1) {
// 		value = value.toString() + ".00";
// 		return value;
// 	}
// 	if (xsd.length > 1) {
// 		if (xsd[1].length < 2) {
// 			value = value.toString() + "0";
// 		}
// 		return value;
// 	}
// }


// root.methods.getScaleConfig =  function () {



// 	 this.$store.state.quoteConfig.forEach(
// 		v => {
// 			v.name === this.$store.state.symbol && (this.baseScale = v.baseScale , this.quoteScale = v.quoteScale)
// 		}
// 	)

// }


export default root
