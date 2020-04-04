const root = {}
root.name = 'MobileHomePageMarketItem'

root.props = {}

root.props.choosed = {
  type: Boolean,
  default: false
}
root.props.item = {
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



root.computed = {}

// 交易大厅 or 交易详情
root.computed.hall_symbol = function () {
	return this.$store.state.hall_symbol;
}

root.computed.rate = function () {
  let self = this;
  for (let key in this.socket_price) {
    if (key == 'BDB_ETH') {
      self.bdb_rate = this.socket_price[key][4];
    }
  }
  let type = this.item.name;
  let symbol = type.split('_')[1];
  switch (symbol) {
    case 'BTC':
      return this.$store.state.exchange_rate.btcExchangeRate || 0
      break;
    case 'ETH':
      return this.$store.state.exchange_rate.ethExchangeRate || 0
      break;
    case 'BDB':
      return (this.$store.state.exchange_rate.ethExchangeRate * this.bdb_rate) || 0
      break;
    case 'USDT':
      return 1;
      break;
    default:
      return 0;
      break;
  }
}

root.computed.new_item = function () {
  let rate = this.rate || 0
	let cny_item = {cny: this.item.close * rate * this.$store.state.exchange_rate_dollar};
	let obj_item = Object.assign(this.item, cny_item);
  // console.log(obj_item.name)
	return obj_item;
}

// 实时价格的升降
root.computed.direction = function () {
	return this.socket_tick.direction;
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

root.data = function () {
	return {
    bdb_rate: 0
	}
}
root.created = function () {

}

root.methods = {};
root.methods.changeHeaderBoxFlag = function (item) {
  console.log(item)
  this.$store.commit('changeMobileTradingHallFlag',true);
  this.$store.commit('changeMobileSymbolType',item.name);
  this.$store.commit('SET_HALL_SYMBOL',false);

  // let user_symbol = this.$cookie.get('unlogin_user_symbol_cookie') || 'ETH_USDT'
  // this.$store.commit('SET_SYMBOL', user_symbol)
  let user_id = this.$store.state.authMessage.userId;
  let user_id_symbol = user_id + '-' + item.name;
  !user_id && this.$cookies.set('unlogin_user_symbol_cookie', item.name, 60 * 60 * 24 * 30,"/");
  !!user_id && this.$cookies.set('user_symbol_cookie', user_id_symbol, 60 * 60 * 24 * 30,"/");
  this.$store.commit('SET_SYMBOL', item.name);

}

export default root
