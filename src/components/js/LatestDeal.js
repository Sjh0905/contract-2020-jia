const root = {};

root.name = 'LatestDeal'

let interval;

root.data = function () {
	return {
		list: [],
		baseScale: 0,
    quoteScale: 8,
    socket_list_arrls: [],
    newsymbol: '',
    tickboolean:1
	}
}

root.components = {
	'Loading': resolve => require(['../vue/Loading'], resolve), // loading
}

root.props = {};

root.props.socket_tick_arr = {
	type: Array,
	default: function () {
		return [];
	}
}
root.props.socket_tick_obj = {
	type: Object,
	default: {}
}

root.props.trade_loading = {
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

root.computed.socket_list = function () {

	if (this.socket_tick_arr.length > 0) {
		var list = this.socket_tick_arr.splice(0, 50);
		// this.list = list;
	}

	if (!!this.socket_tick_obj.symbol) {
		var lists = [];
		lists.unshift(this.socket_tick_obj);
		var list = lists.splice(0, 50);
		// this.list = list;

	}
	let socket_list_arr = [];
	let self = this;
	!!list && list.forEach((v) => {
		if (v.symbol == self.symbol) {
			socket_list_arr.push(v);
		}
	})

  if(this.newsymbol == ''){
    this.newsymbol = this.symbol;
  }

  this.socket_list_arrls.length > 50 && (this.socket_list_arrls = this.socket_list_arrls.splice(0,50))

  if(socket_list_arr.length>0){
    // this.socket_list_arrls = socket_list_arr;
    this.newsymbol = this.symbol;

    // console.log("socket_list_arr=============",socket_list_arr);
    // this.socket_list_arrls.unshift(socket_list_arr[0])

    this.socket_list_arrls = socket_list_arr.concat(this.socket_list_arrls)

    socket_list_arr = this.socket_list_arrls;

  }else if(this.newsymbol != this.symbol && socket_list_arr.length==0){
    socket_list_arr = this.socket_list_arrls;
    // return socket_list_arr || [];
  }else{

    socket_list_arr = this.socket_list_arrls;
  }

  // console.log("this.socket_list_arrls=============",this.socket_list_arrls);
  socket_list_arr > 50 && (socket_list_arr = socket_list_arr.splice(0,50))

  // return socket_list_arr || [];
  return socket_list_arr;

}


root.watch = {};

root.watch.symbol = function (newValue, oldValue) {
	if (newValue == oldValue) return;
	this.getScaleConfig();
  this.tickCache();
  this.socket_list;
}


root.methods = {};

root.methods.getScaleConfig = function () {
  this.$store.state.quoteConfig.forEach(
    v => {
      v.name === this.$store.state.symbol && (this.baseScale = v.baseScale , this.quoteScale = v.quoteScale)
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
//   this.socket_list_arrls = data;
// }
// 拉取实时成交数据
root.methods.tickCache = function () {
  let params = {
    symbol: this.symbol
  };
  this.$http.send("GET_TRADES", {
    bind: this,
    query: params,
    callBack: this.RE_tickCache,
    errorHandler: this.error_getCurrency
  })
}
root.methods.RE_tickCache = function (res) {
  // console.log("res---------"+res);
  if(!res)return
  let data = res.splice(0,50);
  this.socket_list_arrls = data;
}

// 组件销毁前清除
root.beforeDestroy = function () {
	// clearInterval(interval);
}




export default root;

