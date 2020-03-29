const root = {}

root.name = 'MobileStockCrossItems'

root.props = {}
root.props.transactionData = {
	type: Array, default: function () {
		return []
	}
}
root.props.transactionType = {type: Number}

root.data = function () {
	return {
		word: '',
		baseScale: 0,
		quoteScale: 0,
		highColor: false,
		list: []
	}
}

root.computed = {}

// 获取价格区间
root.computed.GRCPriceRangeH5 = function () {
  // return ['0.2504','0.2506']
  return this.$store.state.KKPriceRange;
}

root.computed.depth_list = function () {
	let list = [];
  let transactionData = this.getPriceChangeOrders(this.transactionData)
	let depth = transactionData.splice(0, 9);
	depth.forEach(v => {
		list.push({
			price: v.price,
			amount: v.amount,
			is_select: false
		})
	});

	return transactionData instanceof Array ? list : [];
}

// 当前委托价格list
root.computed.order_list = function () {
	return this.$store.state.openOrder
}

// 深度图百分比  如果是 ETH->BTC的，数量超过10就满，BDB->BTC或BDB->ETH的，超过10万才满,ICC->BTC超过100万才满, ELF的超过1万就满
root.computed.deep = function () {
	let symbol = this.$store.state.symbol;
	let name = symbol.split('_')[0];
	let deeps;
	switch (name) {
		case 'BDB':
			deeps = 1000;
			break;
		case 'ICC':
			deeps = 10000;
			break;
		case 'ELF':
			deeps = 100;
			break;
		case 'IOST':
			deeps = 4000;
			break;
		default:
			deeps = 0.1;
			break;
	}
	return deeps;
}

root.watch = {};
root.watch.depth_list = function (newValue, oldValue) {
	this.getScaleConfig();
	this.contrastDeepthOpenOrder(this.order_list, newValue);
}

root.watch.order_list = function (newValue, oldValue) {
	this.contrastDeepthOpenOrder(newValue, this.depth_list);
}

root.methods = {}

root.methods.getPriceChangeOrders = function(transactionData){

  if(this.$store.state.symbol == 'GRC_USDT' && this.GRCPriceRangeH5.length >0){
    let minPrice = this.GRCPriceRangeH5[0] || 0;
    let maxPrice = this.GRCPriceRangeH5[this.GRCPriceRangeH5.length -1] || 10;

    // console.log('this is minPrice',minPrice,'maxPrice',maxPrice);

    if(transactionData instanceof Array)
      transactionData = transactionData.filter(v => !!v && v.price >= minPrice && v.price <= maxPrice)

    transactionData = transactionData.splice(0, 9)
    return transactionData
  }

  transactionData = transactionData.splice(0, 9)
  console.log(transactionData)
  return transactionData

}



// 深度图和当前委托价格对比，如果深度图的价格和当前委托价格有一样的，需要变色显示
root.methods.contrastDeepthOpenOrder = function (order_list, depth_list) {
	let self = this;
	depth_list.forEach(v => {
		let price = v.price;
		if (order_list.indexOf(price) > -1) {
			Object.assign(v, {is_select: true});
		} else {
			Object.assign(v, {is_select: false});
		}
	})
	this.list = depth_list;
}

root.created = function () {
	this.getScaleConfig()


	if (this.transactionType) {
		this.word = '买'
	}
	if (!this.transactionType) {
		this.word = '卖'
	}
}


root.methods.getBuyAndSaleWidth = (num, maxNum) => {

}

root.methods.scale = function (num, scale) {
	var r = /^[+-]?[1-9]?[0-9]*\.[0-9]*$/;
	if (r.test(num)) {
		var l = scale - num.toString().length + 1
		if (l > 0) {
			for (var i = 0; i < l; i++) {
				num += '0'
			}
		}
		return num.toString().substr(0, scale + 1)
	}
	if (!r.test(num)) {

		var l = scale - num.toString().length + 1
		num += '.'
		if (l > 0) {
			for (var i = 0; i < l; i++) {
				num += '0'
			}
		}
		return num.toString().substr(0, scale + 1)
	}
}

// 买卖价格
root.methods.updatePrice = function (type, price) {
	this.$eventBus.notify({key: 'SET_PRICE'}, price);
}


root.methods.getScaleConfig = function () {
	this.$store.state.quoteConfig.forEach(
		v => {
			v.name === this.$store.state.symbol && (this.baseScale = v.baseScale , this.quoteScale = v.quoteScale)
		}
	)
	// console.log('baseScale', this.baseScale)
}

root.methods.formatnumber = function (value, num) {
	value = this.$globalFunc.accFixed(value, 8)
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


root.methods.scientificToNumber = function (num) {
	var str = num.toString();
	var reg = /^(\d+)(e)([\-]?\d+)$/;
	var arr, len,
		zero = '';
	if (!reg.test(str)) {
		if (!num.toString().split('.')[1] || num.toString().split('.')[1].length < 7) {
			return num;
		} else {
			// return num.toFixed(8)
			return this.$globalFunc.accFixed(num, 8);
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

root.methods.highPrice = function (list, item, index) {

	if (!index) return true

	if (this.formatnumber(item.price, 8).substr(7, 1) != this.formatnumber(list[index - 1].price, 8).substr(7, 1)) return true

}

export default root
