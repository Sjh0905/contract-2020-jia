const root = {};

root.name = 'HomePageMarketItem';

root.data = function () {
	return {

	}
}

root.props = {}

root.props.item = {
	type: Object,
	default: {}
}

root.props.tax = {
	type: Number,
	default: 0
}


root.created = function () {
	let that = this;
	// console.log('symbolsss',this.item.name);
	// 订阅socket
	// this.$socket.emit('subscribe', {symbol: this.item.name});

	// // socket 实时监听
	// this.$socket.on({
	// 	key: 'topic_prices', bind: this, callBack: function (message) {
	// 		// console.log('topic_prices=====', message);
	// 		that.item.open = message[that.$store.state.symbol][1]
	// 		that.item.high = message[that.$store.state.symbol][2]
	// 		that.item.low = message[that.$store.state.symbol][3]
	// 		that.item.close = message[that.$store.state.symbol][4]
	// 		that.item.volume = message[that.$store.state.symbol][5]
	// 		that.item.cny = (that.item.close * that.tax)
	// 	}
	// })
}

root.methods = {};

root.methods.urlAndHash = function (hash) {
	this.$store.state.symbol = hash;
	this.$router.push('/index/tradingHall');
}




export default root;