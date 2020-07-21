const root = {};

root.name = 'LatestDeal'

let interval;

root.data = function () {
	return {
      list: [],
      baseScale: 0,
      quoteScale: 8,
      socketListArrls: [],
      newsymbol: '',
      tickboolean:1
	}
}

root.components = {
	'Loading': resolve => require(['../vue/Loading'], resolve), // loading
}

root.props = {};

root.props.socketTickArr = {
	type: Array,
	default: function () {
		return [];
	}
}
root.props.socketTickObj = {
	type: Object,
	default: {}
}

root.props.tradeLoading = {
	type: Boolean,
	default: true
}

root.created = function () {
	this.getScaleConfig();
	// 拉取数据
	// this.GET_LATEST_DEAL();
  this.tickCache();

	// interval = setInterval(this.GET_LATEST_DEAL, 2000);
}

root.computed = {};

root.computed.name = function () {
	return this.$store.state.symbol.split('_')[1];
}
root.computed.amountName = function () {
	return this.$store.state.symbol.split('_')[0];
}

root.computed.symbol = function () {
	return this.$store.state.symbol;
}
// 当前socket订阅货币对
root.computed.subscribeSymbol = function () {
  return this.$store.state.subscribeSymbol;
}

root.computed.socketList = function () {

	// if (this.socketTickArr.length > 0) {
	// 	var list = this.socketTickArr.splice(0, 50);
	// }

	if (!!this.socketTickObj.s) {
		this.list.unshift(this.socketTickObj);
		this.list = this.list.splice(0, 50);
		// this.list = list;
	}
	let socketListArr = [];
	let self = this;
	!!this.list && this.list.forEach((v) => {
		if (v.s == self.subscribeSymbol) {
			socketListArr.push(v);
		}
	})

  if(this.newsymbol == ''){
    this.newsymbol = this.symbol;
  }

  //TODO this.socketListArrls.length > 50 && (this.socketListArrls = this.socketListArrls.splice(0,50))

  // if(socketListArr.length>0){
  //   this.newsymbol = this.symbol;
  //   this.socketListArrls = socketListArr.concat(this.socketListArrls)
  //
  //   socketListArr = this.socketListArrls;
  //
  // }else if(this.newsymbol != this.symbol && socketListArr.length==0){
  //   socketListArr = this.socketListArrls;
  // }else{

    //TODO socketListArr = this.socketListArrls;
  // }

  // console.log("this.socketListArrls=============",this.socketListArrls);
  socketListArr > 50 && (socketListArr = socketListArr.splice(0,50))

  // return socketListArr || [];
  return socketListArr;
}


root.watch = {};

root.watch.symbol = function (newValue, oldValue) {
  if (newValue == oldValue) return;
  this.getScaleConfig();
  this.tickCache();
  this.socketList;
}


root.methods = {};

root.methods.getScaleConfig = function () {
  this.$store.state.quoteConfig.forEach(
    v => {
      v.name === this.symbol && (this.baseScale = v.baseScale , this.quoteScale = v.quoteScale)
    }
  )
}

// 拉取数据
// root.methods.tickCache = function () {
//   let params = {
//     symbol: this.symbol
//   };
//   this.$http.send("GET_TICK_CACHE", {
//     bind: this,
//     query: params,
//     callBack: this.RE_GET_LATEST_DEAL,
//     errorHandler: this.error_getCurrency
//   })
// }
// root.methods.RE_GET_LATEST_DEAL = function (res) {
//   // console.log("res---------"+res);
//   if(!res)return
//   let data = res.splice(0,50);
//   this.socketListArrls = data;
// }
// 拉取实时成交数据
root.methods.tickCache = function () {
  let params = {
    // symbol: this.symbol
    symbol: 'BTCUSDT',
    // fromId: '26129'
  };
  this.$http.send("GET_TRADES", {
    bind: this,
    query: params,
    callBack: this.re_tickCache,
    errorHandler: this.error_getCurrency
  })
}
root.methods.re_tickCache = function (res) {
  // console.log("GET_TRADES---------",res);
  if(!res)return
  let data = res.splice(0,50);
  this.socketListArrls = data;
}

// 组件销毁前清除
root.beforeDestroy = function () {
	// clearInterval(interval);
}




export default root;

