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
    lastUpdateId:0,
    // orderDepthList : {},

    sellOrders:[],

    buyOrders:[],
    buy_sale_list_temp:{},
    dMaxTotalAmount:0.001,
    totalAmountArr:[],//[<lastUpdateId>,<totalAmount>]
    // sellTotalAmountArr:[],
	}
}

root.created = function () {
	// 获取小数位
	this.getScaleConfig();

	// console.log(this.rate)
	// console.log(this.price,"aaaa")

  // console.log(this.isNowPrice);
  // console.log(this.isPriceNow);

  this.buy_sale_list_temp = Object.assign(this.buy_sale_list,{})

}

root.computed = {}
/*root.computed.orderDepthList = function () {

  let asks = this.buy_sale_list_temp.a || []
  let bids = this.buy_sale_list_temp.b || []
  this.lastUpdateId = this.lastUpdateId == 0 && this.buy_sale_list_temp.lastUpdateId || 0

  let socketAsks = this.socket_snap_shot.a || [];
  let socketBids = this.socket_snap_shot.b || [];
  // console.log('StockCross buyOrders',JSON.stringify(socketBids));

  // let asks = [[102,2], [103,3], [110,0], [104,4]]
  // let socketAsks = [[101,1], [103,0], [110,10], [105,5]]

  let asksTemp = []
  let bidsTemp = []

  //卖单
  for (let i = 0; i < socketAsks.length; i++) {
    let sAItem = socketAsks[i];
    if(!sAItem)continue

    for (let j = 0; j < asks.length; j++) {
      let aItem = asks[j];
      if(!aItem)continue

      //如果socket推过来的是之前没出现的价格，做好缓存
      if (j == asks.length - 1 && sAItem[0] != aItem[0]  && sAItem[1] > 0){
       asksTemp.push(sAItem)
      }

      //如果价格一致
      if(sAItem[0] == aItem[0]){
        //如果最新数量是0
        if(sAItem[1] == 0){
          asks.splice(j,1)
          j--;
          break;
        }
        //如果数量大于0,socket推送的值直接赋值
        aItem[1] = sAItem[1]
        break;
      }
    }
  }

  //买单
  for (let h = 0; h < socketBids.length; h++) {
    let bAItem = socketBids[h];
    if(!bAItem)continue

    for (let k = 0; k < bids.length; k++) {
      let bItem = bids[k];
      if(!bItem)continue

      //如果socket推过来的是之前没出现的价格，做好缓存
      if (k == bids.length - 1 && bAItem[0] != bItem[0]  && bAItem[1] > 0){
        bidsTemp.push(bAItem)
      }

      //如果价格一致
      if(bAItem[0] == bItem[0]){
        //如果最新数量是0
        if(bAItem[1] == 0){
          bids.splice(k,1)
          k--;
          // break;
        }
        //如果数量大于0,socket推送的值直接赋值
        bItem[1] = bAItem[1]
        // break;
      }
    }
  }

  let asksList = asks.concat(asksTemp)//.sort((a,b) => a[0] - b[0]);
  let bidsList = bids.concat(bidsTemp)//.sort((a,b) => a[0] - b[0]);
  // console.log('StockCross asksList',asksList);
  console.log('StockCross buyOrders',JSON.stringify(bidsList));

  this.sellOrders = asksList;
  this.buyOrders = bidsList;

  // this.buy_sale_list_temp.a = asks
  // this.buy_sale_list_temp.b = bids
  // this.buy_sale_list_temp.lastUpdateId = this.socket_snap_shot.U

  this.lastUpdateId = this.socket_snap_shot.U
  let obj = {a:asksList,b:bidsList,lastUpdateId:this.socket_snap_shot.U}
  this.buy_sale_list_temp = obj;
  // console.log('StockCross orderDepthList',obj) ;
  return obj
}*/

// 买卖列表
/*root.computed.sellOrders = function () {

  let asks = this.buy_sale_list_temp.a || []
  this.lastUpdateId = this.lastUpdateId == 0 && this.buy_sale_list_temp.lastUpdateId || 0

  let socketAsks = this.socket_snap_shot.a || [];
  // console.log('StockCross buyOrders',JSON.stringify(socketBids));

  // let asks = [[102,2], [103,3], [110,0], [104,4]]
  // let socketAsks = [[101,1], [103,0], [110,10], [105,5]]

  let asksTemp = []

  //卖单
  for (let i = 0; i < socketAsks.length; i++) {
    let sAItem = socketAsks[i];
    if(!sAItem)continue

    for (let j = 0; j < asks.length; j++) {
      let aItem = asks[j];
      if(!aItem)continue

      //如果socket推过来的是之前没出现的价格，做好缓存
      if (j == asks.length - 1 && sAItem[0] != aItem[0]  && sAItem[1] > 0){
        asksTemp.push(sAItem)
      }

      //如果价格一致
      if(sAItem[0] == aItem[0]){
        //如果最新数量是0
        if(sAItem[1] == 0){
          asks.splice(j,1)
          j--;
          // break;
        }
        //如果数量大于0,socket推送的值直接赋值
        aItem[1] = sAItem[1]
        // break;
      }
    }

  }

  if(asks.length == 0){
    asksTemp = socketAsks
  }

  let asksList = asks.concat(asksTemp).sort((a,b) => a[0] - b[0]);
  console.log('StockCross asksList',asksList);

  this.buy_sale_list_temp.a = asks
  this.buy_sale_list_temp.lastUpdateId = this.socket_snap_shot.U

  return asksList || [];
}
root.computed.buyOrders = function () {

  let bids = this.buy_sale_list_temp.b || []
  this.lastUpdateId = this.lastUpdateId == 0 && this.buy_sale_list_temp.lastUpdateId || 0

  let socketBids = this.socket_snap_shot.b || [];
  // console.log('StockCross buyOrders',JSON.stringify(socketBids));

  let bidsTemp = []

  //买单
  for (let h = 0; h < socketBids.length; h++) {
    let bAItem = socketBids[h];
    if(!bAItem)continue

    for (let k = 0; k < bids.length; k++) {
      let bItem = bids[k];
      if(!bItem)continue

      //如果socket推过来的是之前没出现的价格，做好缓存
      if (k == bids.length - 1 && bAItem[0] != bItem[0]  && bAItem[1] > 0){
        bidsTemp.push(bAItem)
      }

      //如果价格一致
      if(bAItem[0] == bItem[0]){
        //如果最新数量是0
        if(bAItem[1] == 0){
          bids.splice(k,1)
          k--;
          // break;
        }
        //如果数量大于0,socket推送的值直接赋值
        bItem[1] = bAItem[1]
        // break;
      }
    }
  }

  if(bids.length == 0){
    bidsTemp = socketBids
  }

  let bidsList = bids.concat(bidsTemp).sort((a,b) => a[0] - b[0]);
  console.log('StockCross buyOrders',JSON.stringify(bidsList));
  this.buy_sale_list_temp.b = bids
  this.buy_sale_list_temp.lastUpdateId = this.socket_snap_shot.U
  return  bidsList || [];
}*/

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
root.watch.socket_snap_shot = function () {
  this.getOrderDepthList();
};

root.watch.symbol = function (newValue, oldValue) {
	if (newValue == oldValue) return;
	this.getScaleConfig();
}
//设置买卖盘累计最大值
root.methods.setDMaxTotalAmount = function (arr) {
  if(arr[0] == this.totalAmountArr[0]){
    this.dMaxTotalAmount = Math.max(this.totalAmountArr[1],arr[1]) || 0.001
    this.totalAmountArr = []
    return
  }
  this.totalAmountArr = arr
}
root.methods.getOrderDepthList = function () {
  let asks = this.buy_sale_list_temp.a || []
  let bids = this.buy_sale_list_temp.b || []
  this.lastUpdateId = this.lastUpdateId == 0 && this.buy_sale_list_temp.lastUpdateId || 0

  let socketAsks = this.socket_snap_shot.a || [];
  let socketBids = this.socket_snap_shot.b || [];
  // console.log('StockCross buyOrders',JSON.stringify(socketBids));

  // let asks = [[102,2], [103,3], [110,0], [104,4]]
  // let socketAsks = [[101,1], [103,0], [110,10], [105,5]]

  let asksTemp = [],bidsTemp = []

  //卖单
  for (let i = 0; i < socketAsks.length; i++) {
    let sAItem = socketAsks[i];
    if(!sAItem)continue

    for (let j = 0; j < asks.length; j++) {
      let aItem = asks[j];
      if(!aItem)continue

      //如果socket推过来的是之前没出现的价格，做好缓存
      if (j == asks.length - 1 && sAItem[0] != aItem[0]  && sAItem[1] > 0){
        asksTemp.push(sAItem)
      }

      //如果价格一致
      if(sAItem[0] == aItem[0]){
        //如果最新数量是0
        if(sAItem[1] == 0){
          asks.splice(j,1)
          j--;
          break;
        }
        //如果数量大于0,socket推送的值直接赋值
        aItem[1] = sAItem[1]
        break;
      }
    }
  }

  if(asks.length == 0){
    asksTemp = socketAsks.filter(v=>v[1] > 0) || []
  }

  //买单
  for (let h = 0; h < socketBids.length; h++) {
    let bAItem = socketBids[h];
    if(!bAItem)continue

    for (let k = 0; k < bids.length; k++) {
      let bItem = bids[k];
      if(!bItem)continue

      //如果socket推过来的是之前没出现的价格，做好缓存
      if (k == bids.length - 1 && bAItem[0] != bItem[0]  && bAItem[1] > 0){
        bidsTemp.push(bAItem)
      }

      //如果价格一致
      if(bAItem[0] == bItem[0]){
        //如果最新数量是0
        if(bAItem[1] == 0){
          bids.splice(k,1)
          k--;
          // break;
        }
        //如果数量大于0,socket推送的值直接赋值
        bItem[1] = bAItem[1]
        // break;
      }
    }
  }

  if(bids.length == 0){
    bidsTemp = socketBids.filter(v=>v[1] > 0) || []
  }

  let asksList = asks.concat(asksTemp).sort((a,b) => a[0] - b[0]);
  let bidsList = bids.concat(bidsTemp).sort((a,b) => b[0] - a[0]);
  // console.log('StockCross asksList',asksList);
  // console.log('StockCross buyOrders',JSON.stringify(bidsList));

  this.sellOrders = asksList;
  this.buyOrders = bidsList;

  // this.buy_sale_list_temp.a = asks
  // this.buy_sale_list_temp.b = bids
  // this.buy_sale_list_temp.lastUpdateId = this.socket_snap_shot.U

  this.lastUpdateId = this.socket_snap_shot.U
  let obj = {a:asksList,b:bidsList,lastUpdateId:this.socket_snap_shot.U}
  this.buy_sale_list_temp = obj;
  // console.log('StockCross orderDepthList',obj) ;
  // return obj

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
