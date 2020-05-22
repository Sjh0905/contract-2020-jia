import toCanvas from '../../../../static/js/circle'

const root = {};

root.name = 'Forecast';

// 轮询刷新列表
let get_list_interval = '';

root.data = function () {
	return {
		// 记载
		loading: false,
    // 弹框
    popType: 0,
    popText: '',
    promptOpen: false,
    // 认证弹框
    popWindowOpen: false,
		// 活动规则弹框
		show_rules: false,
		// 阅读并同意活动规则
		agree_rules: true,
		// 是否阅读过活动规则
		is_agree: true,
		// 默认选中页签
		forecast_tab: 1,
		// 页面名称
		forecast_name: '',
		// 所有竞猜列表
		forecast_list: [],
		// 竞猜类型tab个数数组
		guess_tab: [
      {
        name:'honourGuessList'
      },
      {
        name:'kingGuessList'
      },
      {
        name:'strongestGuessList'
      }
    ],
		// 荣耀竞猜/王者竞猜/最强竞猜
		guess_list: [
      // {
      //   currency:'USDT', //币种
      //   extPeriod:2, //几期
      //   rewardAmount:232, //奖池总额
      //   projectId:1, // 当前Id
      //   eachAmount:12, // 每份多少枚
      //   residueTicket:13, // 所占份数
      //   eachs:100, // 总分数
      //   preWinNumber:2, // 上期中奖编号
      //   projectStatus:'PROCESSING',
      //
      // },
      // {
      //   currency:'USDT', //币种
      //   extPeriod:2, //几期
      //   rewardAmount:232, //奖池总额
      //   projectId:1, // 当前Id
      //   eachAmount:12, // 每份多少枚
      //   residueTicket:13, // 所占份数
      //   eachs:100, // 总分数
      //   preWinNumber:2, // 上期中奖编号
      //   projectStatus:'PROCESSING',
      //
      // }
    ],
		// 销毁记录列表
		destroy_list: [],
		// 展示销毁记录列表
		show_destroy: false,
		// 开奖记录
		prize_list: [],
		// 展示开奖记录列表
		show_prize: false,
		// 展示购买的弹框
		show_buy: true,
		// 本期参与记录
		lottery_record_list: [],
		// 展示参与记录列表
		show_lottery_record_list: false,
		// 预测id
		project_id: '',
		// 期数id
		period_id: '',
		// 每人限购份数和币种，展示用的
		period_currency: {
			periodMax: 10, //每人限投份数
			currency: '' //币种
		},
		// 币种
		// currency: '',
		currency: 'USDT',
		// 每份购买数量
		eachAmount: 100,
		// 购买份数，提交用的
		predict_number: '',
		// 购买份数数量
		predict_number_amount: '',
		// 是否认证
		identity: false,
		// 购买中
		buying: false,

	}
}

root.components = {
  'PopupPrompt': resolve => require(['../../vue/PopupPrompt'], resolve),
  'Loading': resolve => require(['../../vue/Loading'], resolve),
  'PopupWindow': resolve => require(['../../vue/PopupWindow'], resolve),
}

root.created = function () {

}

root.mounted = function () {

	// 渲染列表
	this.GET_GUESS_INDEX();
	// 判断是否阅读过活动规则
	!!this.is_login && this.ACTIVITY_RULES();
	// 获取验证状态
	this.getAuthState();

	// 轮询刷新列表
	get_list_interval = setInterval(this.GET_GUESS_INDEX, 3000);
}

root.computed = {};
// 判断是否登录
root.computed.is_login = function () {
	return this.$store.state.isLogin;
}
// 当前语言
root.computed.lang = function () {
	return this.$store.state.lang;
}

root.watch = {};


root.methods = {};
// 跳到详情页
root.methods.GO_RECORD = function () {
	this.$router.push({name: "Record"});
}
// 关闭认证弹框
root.methods.popWindowClose = function () {
	this.popWindowOpen = false;
}
// 跳到验证界面
root.methods.GO_INDENTITY = function () {
	this.$router.push({name: "authentication"});
}
// 判断验证状态
root.methods.getAuthState = function () {
	this.$http.send('GET_AUTH_STATE', {
		bind: this,
		callBack: this.re_getAuthState,
		errorHandler: this.error_getAuthState
	})
}
// 判断验证状态回调
root.methods.re_getAuthState = function (data) {
	typeof data === 'string' && (data = JSON.parse(data))
	if (!data) return;
	this.identity = data.dataMap.identity;
	this.$store.commit('SET_AUTH_STATE', data.dataMap)
}

// 是否阅读过活动规则
root.methods.ACTIVITY_RULES = function () {
	this.$http.send('ACTIVITY_RULES', {
		bind: this,
		params: {
			// userId: 100005
		},
		callBack: this.RE_ACTIVITY_RULES
	})
}
root.methods.RE_ACTIVITY_RULES = function (res) {
	typeof(res) == 'string' && (res = JSON.parse(res));
	let code = res.errorCode;
	if (code == 2) {  // 没同意过
	   this.is_agree = false;
	   this.show_rules = true;
	}
	if (code == 0) { // 同意过了
		this.is_agree = true;
		this.show_rules = false;
	}
}

// 关闭toast
root.methods.closePrompt = function () {
	this.popType = 0;
	this.promptOpen = false;
}

// 获取列表
root.methods.GET_GUESS_INDEX = function () {
	this.$http.send('GET_GUESS_INDEX', {
		bind: this,
		callBack: this.RE_GET_GUESS_INDEX
	})
}
root.methods.RE_GET_GUESS_INDEX = function (res) {
	typeof(res) == 'string' && (res = JSON.parse(res));
	let data = res.dataMap;
	this.forecast_list = data;
	if (!this.forecast_name) {
		if (!!data.honourGuessList) {
			this.forecast_name = 'honourGuessList';
			return;
		}
		if (!!data.kingGuessList) {
			this.forecast_name = 'kingGuessList';
			return;
		}
		if (!!data.strongestGuessList) {
			this.forecast_name = 'strongestGuessList';
			return;
		}
	}
	this.TAB_FORECAST(this.forecast_tab, this.forecast_name);
}

// 查看活动规则弹框
root.methods.SHOW_RULE_DIALOG = function () {
	this.show_rules = true;
}

// 隐藏活动规则弹框
root.methods.HIDE_RULES_DIALOG = function () {

	if (this.is_agree == false && this.is_login) {
		this.GO_HOME();
		return;
	}
	this.agree_rules = false;
	this.show_rules = false;
}

// 进入活动页
root.methods.GO_JOIN = function () {
	if (!this.agree_rules) {
		this.popText = '请阅读并同意该活动规则';
	    this.promptOpen = true;
	    return;
	}
	// 用户阅读并同意规则
	this.AGREE_ACTIVITY_RULES();
	this.agree_rules = false;
	this.show_rules = false;
}

// 用户阅读并同意规则
root.methods.AGREE_ACTIVITY_RULES = function () {
	this.$http.send('AGREE_ACTIVITY_RULES', {
		bind: this,
		params: {
			// userId: 100005
		},
		callBack: this.RE_AGREE_ACTIVITY_RULES,
		errorHandler: this.ERROR_AGREE_ACTIVITY_RULES
	})
}
root.methods.ERROR_AGREE_ACTIVITY_RULES = function () {
	this.popText = this.lang == 'CH' ? '服务器升级中，请稍后再试' : 'In the server upgrade, please try again later';
	this.promptOpen = true;
}
root.methods.RE_AGREE_ACTIVITY_RULES = function (res) {
	typeof(res) == 'string' && (res = JSON.parse(res));
	if (res.errorCode == 0) {
		this.ACTIVITY_RULES();
	}
}

// 确定离开
root.methods.GO_HOME = function () {
	// this.HIDE_RULES_DIALOG();
	this.$router.push({name: "home"});
}

// 切换竞猜页签
root.methods.TAB_FORECAST = function (tab, name) {
	let self = this;
	this.guess_tab = [];
	this.forecast_tab = tab;
	this.forecast_name = name;
	this.RELOAD_CIRCLE(tab, name);
	this.guess_list = this.forecast_list[name];
}
// 重新加载列表
root.methods.RELOAD_CIRCLE = function (tab, name) {
	if (!!this.forecast_list.honourGuessList) {
		this.guess_tab.push({name:"honourGuessList", list: this.forecast_list.honourGuessList});
	}
	if (!!this.forecast_list.kingGuessList) {
		this.guess_tab.push({name:"kingGuessList", list: this.forecast_list.kingGuessList});
	}
	if (!!this.forecast_list.strongestGuessList) {
		this.guess_tab.push({name:"strongestGuessList", list: this.forecast_list.strongestGuessList});
	}
	this.loading = false;
}

// 销毁记录
root.methods.GET_DESTROY_RECORD = function () {
	this.show_destroy = true;
	this.$http.send('GET_DESTROY_RECORD', {
		bind: this,
		callBack: this.RE_GET_DESTROY_RECORD
	})
}
root.methods.RE_GET_DESTROY_RECORD = function (res) {
	typeof(res) == 'string' && (res = JSON.parse(res));
	if (res.result != 'FAIL') {
		this.destroy_list = !!res.dataMap && res.dataMap.destroyRecordList;
	}
}

// 关闭销毁记录弹框
root.methods.HIDE_DESTROY_DIALOG = function () {
	this.show_destroy = false;
	this.show_prize = false;
	this.show_lottery_record_list = false;
	this.prize_list = [];
	this.destroy_list = [];
	this.lottery_record_list = [];
	this.currency = '';
}

// 开奖记录
root.methods.GET_PRIZE_LIST = function (projectId) {
	this.show_prize = true;
	this.$http.send('GET_LOOTERY_RECORD', {
		bind: this,
		params: {
			projectId: projectId,
		},
		callBack: this.RE_GET_LOOTERY_RECORD
	})
}
root.methods.RE_GET_LOOTERY_RECORD = function (res) {
	typeof(res) == 'string' && (res = JSON.parse(res));
	if (res.result != 'FAIL') {
		console.log(1)
		this.prize_list = !!res.dataMap && res.dataMap.lotteryRecordList;
	}
}

// 没有认证的话，跳到去认证界面

// 参与抽奖-展示买入弹框
root.methods.SHOW_BUY = function (project_id, period_id, currency, eachAmount) {
	this.currency = currency; // 币种
	this.eachAmount = eachAmount; //每份数量
	// 如果没有登录，跳到登录界面
	if (!this.is_login) {
		this.$router.push({name: "login", query: {name: 'Forecast'}});
		return;
	}
	if (!this.identity) { // 如果没有认证，跳到认证页面
		this.popWindowOpen = true;
		return;
	}
	this.$http.send('TO_PARTICIPATE', {
		bind: this,
		params: {
			projectId: project_id,
		},
		callBack: this.RE_SHOW_BUY
	})
	this.project_id = project_id;
	this.period_id = period_id;
}
root.methods.RE_SHOW_BUY = function (res) {
	typeof(res) == 'string' && (res = JSON.parse(res));
	let code = res.errorCode;
	if (code == 0) {
		// 项目id和期数
		this.show_buy = true;
		this.period_currency = res.dataMap;
	}
	if (code == '-1') {
		this.popText = '参数为空';
	    this.promptOpen = true;
	    return;
	}
	if (code == '1') {
		this.popText = '用户未登录';
	    this.promptOpen = true;
	    return;
	}
	if (code == '2') {
		this.popText = '未查询到相应的项目';
	    this.promptOpen = true;
	    return;
	}
	if (code == '3') {
		this.popText = '超出每人每天最大参与次数';
	    this.promptOpen = true;
	    return;
	}
}

// 隐藏买入弹框
root.methods.HIDE_BUY = function () {
	this.show_buy = false;
	this.project_id = '';
	this.period_id = '';
	this.predict_number = '';
	this.currency = '';
}

// 购买只能输入数量
root.methods.INPUT_NUMBER = function () {
	this.predict_number = this.predict_number.replace(/\D/g,'');
	if (Number(this.predict_number) > Number(this.period_currency.periodMax)) {
		this.predict_number = this.period_currency.periodMax + '';
	}
	// 每份实际数量
	this.predict_number_amount = this.predict_number * this.eachAmount;
}

// 买入期数
root.methods.BUY_PERIOD = function () {
	if (!this.predict_number || this.predict_number == 0) {
		this.popText = '请输入购买数量';
	    this.promptOpen = true;
	    return;
	}
	this.buying = true;
	this.$http.send('LUCK_GUESS', {
		bind: this,
		params: {
			projectId: this.project_id,
			periodNumber: this.period_id,
			predictNumber: this.predict_number

		},
		callBack: this.RE_BUY_PERIOD,
		errorHandler: this.ERROR_BUY_PERIOD
	})
}
// 出现叹号就表示接口报500，502等服务端错误时候提示
root.methods.ERROR_BUY_PERIOD = function (err) {
	this.buying = false;
	// 超时了
	if((err + '').indexOf('timeout') !== '-1') {
		this.popText = this.lang == 'CH' ? '网络连接不稳定，请前往“参与记录”查看参与详情' : 'Connection failure, go to records for reviewing your games.';
		this.promptOpen = true;
		return;
	}
	// 否则是服务端报错了
	this.popText = this.lang == 'CH' ? '参与失败，请重试!' : 'Request failure, please try again!';
	this.promptOpen = true;
}
root.methods.RE_BUY_PERIOD = function (res) {
	let self = this;
	typeof(res) == 'string' && (res = JSON.parse(res));
	this.buying = false;
	let code = res.errorCode;

	if (code == 0) {
    // 购买份数
		this.HIDE_BUY();
		// 重新渲染列表
		this.GET_GUESS_INDEX();
    let successFrequency = res.dataMap.successFrequency;
		// toast弹框提示
		this.popType = 1;
		this.popText = this.lang != 'CH' ? 'You have successfully purchased '+successFrequency+', go to records for reviewing your games.' : '您已成功购买'+successFrequency+'份，请前往参与记录查看';
	    this.promptOpen = true;
	    return false;
	}
	// 错误码提示
	switch (code) {
		case 1:
			self.popText = self.lang == 'CH' ? '您当前未登录，请先登录' : 'Please login first';
			self.promptOpen = true;
			break;
		case 2:
			self.popText = self.lang == 'CH' ? '您当前未实名认证，请先前往实名认证' : 'Please complete KYC verfication';
			self.promptOpen = true;
			break;
		case 3:
			self.popText = self.lang == 'CH' ? '已经不存在这个场景' : 'Page expired';
			self.promptOpen = true;
			break;
		case 4:
			self.popText = self.lang == 'CH' ? '超出每期可投份数' : 'Maximum predictions exceeded';
			self.promptOpen = true;
			break;
		case 5:
			self.popText = self.lang == 'CH' ? '今日参与次数已用完，请明日再来' : 'Participation limit exceeded, please try tomorrow';
			self.promptOpen = true;
			break;
		case 6:
			self.popText = self.lang == 'CH' ? '超出用户可用数量' : 'Insufficient predictions';
			self.promptOpen = true;
			break;
		case 7:
			self.popText = self.lang == 'CH' ? '本期已售完，下期要抓紧哦～' : 'Sold out, Join us in the next game~';
			self.promptOpen = true;
			break;
		case 8:
			self.popText = self.lang == 'CH' ? '超出本期剩余参与份数' : 'Prediction limit exceeded';
			self.promptOpen = true;
			break;
		case 9:
			self.popText = self.lang == 'CH' ? '项目已下架' : 'Event expired';
			self.promptOpen = true;
			break;
		case 10:
			self.popText = self.lang == 'CH' ? '服务器升级中，请稍后再试' : 'In the server upgrade, please try again later';
			self.promptOpen = true;
			break;
		default:
			self.popText = self.lang == 'CH' ? '参与失败，请重试' : 'Request failure, please try again';
			self.promptOpen = true;
			break;
	}
}

// 本期记录列表
root.methods.GET_PERIOD_PARTAKE = function (projectId, periodNumber, ticketStatus, currency) {
	this.currency = currency;
	this.$http.send('POST_LUCKY_GUESS_CURRENT_PERIOD_PARTAKE', {
		bind: this,
		params: {
			projectId: projectId,
			periodNumber: periodNumber,
			ticketStatus: ticketStatus,
		},
		callBack: this.RE_GET_PERIOD_PARTAKE,
		errorHandler: this.ERROR_GET_PERIOD_PARTAKE
	})
}

root.methods.ERROR_GET_PERIOD_PARTAKE = function () {

}

root.methods.RE_GET_PERIOD_PARTAKE = function (res) {
  typeof(res) == 'string' && (res = JSON.parse(res));
  if (res.result != 'FAIL') {
  	this.show_lottery_record_list = true;
    this.lottery_record_list = res.dataMap.currentPeriodPartakeList;
  }
}

// 邮箱加密
root.methods.changeUser = function (userName) {
  if(this.$globalFunc.testEmail(userName)){
    let newUserName = userName.split('@')
    return newUserName[0].substr(0,2) + '****' + newUserName[0].substr(newUserName[0].length-2,2) + '@' + newUserName[1]
  } else {
    let newUserName = userName
    return newUserName.substr(0,3) + '****' + newUserName.substr(newUserName.length-2,2)
  }
}

// 合约地址
root.methods.GO_URL_DETAIL = function (url) {
	window.open(url);
}

root.methods.toFixed = function (num, acc = 8) {
  return this.$globalFunc.accFixed(num, acc)
}

// svg在页面上画圆环
root.methods.changeSvg = function (num1,num2) {
  return ''+this.toFixed(Number(num1) * 267/ Number(num2),0) + ' 276'

}

// 组件结束后删掉轮询
root.beforeDestroy = function () {
	clearInterval(get_list_interval);
}








export default root;
