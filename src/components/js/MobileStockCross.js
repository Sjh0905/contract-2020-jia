const root = {}
root.name = 'MobileStockCross'
root.components = {
	'MobileStockCrossItems': resolve => require(['../mobileVue/MobileStockCrossItems'], resolve)
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

root.data = function () {
	return {
		// direction: '',
		// isPriceNow: '- -',
		baseScale: 0,
		quoteScale: 0,
	}
}

root.created = function () {
	// 获取小数位
	this.getScaleConfig();



}

root.computed = {}
// 计算当前symbol
root.computed.symbol = function () {
  return this.$store.state.symbol;
}
// 买卖列表
root.computed.sellOrders = function () {
  console.log("=======root.computed.sellOrders=======1",this.buy_sale_list)
	let list = this.$globalFunc.mergeObj(this.socket_snap_shot, this.buy_sale_list);
  if(list.symbol != this.symbol)return []
	return list.sellOrders;
}
root.computed.buyOrders = function () {
  console.log("=======root.computed.buyOrders=======1",this.buy_sale_list)
	let list = this.$globalFunc.mergeObj(this.socket_snap_shot, this.buy_sale_list);
  if(list.symbol != this.symbol)return []
	return list.buyOrders;
}

// 实时价格
root.computed.isPriceNow = function () {
	let priceObj = this.$globalFunc.mergeObj(this.socket_snap_shot, this.buy_sale_list);
	let priceNow = priceObj.price;
	// store存储当前价格，填写到买卖中，当做默认值
	this.$store.commit('SET_DEPTH_PRICE', priceNow);
	return priceNow || '- -';
}

// 获取上升或下降
root.computed.direction = function () {
	return this.socket_tick.direction;
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
