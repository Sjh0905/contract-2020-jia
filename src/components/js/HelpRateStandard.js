const root = {};

root.name = 'HelpRateStandard'

root.data = function () {
  return {
  	rate_list: []
  }
}

root.created = function () {
	this.GET_RATE_LIST();
}

root.methods = {}

// 获取列表
root.methods.GET_RATE_LIST = function () {
	this.$http.send("GET_RATE", {
	    bind: this,
	    callBack: this.RE_GET_RATE,
	    errorHandler: this.error_getCurrency
	})
}
root.methods.RE_GET_RATE = function (res) {
	let datas = res.withdrawRules;
	this.rate_list = datas;
}


export default root;
