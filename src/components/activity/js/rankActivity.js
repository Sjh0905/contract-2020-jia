const root = {};

import Countdown from '../../../../static/js/countdown'

root.name = "rankActivity";

// 定时刷新 一小时刷新一次
let setinterval;

root.data = function () {
	return {
		loading: true,
		// 刷新间隔
		interval: 3600, // 一小时刷新一次
	 	// 弹框
	    popType: 0,
	    popText: this.$store.state.lang == 'CH' ? '还未开放!' : 'unavailable!',
	    promptOpen: false,

	    // 当前期结束时间
	    end_time: '',

		list: 20,

		// 用户交易信息
		transcation: {},
		// 描述
		description: {},
		// 描述列表
		rules_list: [],
		// 活动内容列表
		content_list: [],
		// 列表
		ranking_list: [],
		// 保留多少条
		limit_length: 20,
		// 交易额大于多少为第一名
		limit: 500000000,
		// 是否初始化倒计时
		is_start_down: true,
		// 是否暂停
		pause: 1,  // 0 暂停， 1 没暂停
		// 活动结束
		finished: false

	}
}

root.components = {
  'PopupPrompt': resolve => require(['../../vue/PopupPrompt'], resolve),
  'Loading': resolve => require(['../../vue/Loading'], resolve),
}

root.computed = {};

root.computed.lang = function () {
	return this.$store.state.lang;
}

root.computed.is_login = function () {
	return this.$store.state.isLogin;
}

root.computed.server_time = function () {
	return this.$store.state.serverTime;
}


root.watch = {};

root.watch.lang = function (newValue, oldValue) {
	if (newValue == oldValue) return;
	// 描述
	this.description = {};
	// 描述列表
	this.rules_list = [];
	// 活动内容列表
	this.content_list = [];
	// 列表
	this.ranking_list = [];
	this.INIT_GET_ALL();
}

root.watch.server_time = function (newValue, oldValue) {
	if (Number(newValue) < Number(this.end_time)) return;
	// this.INIT_GET_ALL();
}


root.created = function () {
	this.INIT_GET_ALL();
}

root.mounted = function () {
	
}

root.methods = {};

root.methods.INIT_GET_ALL = async function () {
	// 获取列表
	await this.GET_RANKING_LIST();
	// 获取用户信息
	await  this.GET_USER_TRANSCATION();
	// 一小时更新一次列表
	setinterval = setInterval(this.GET_RANKING_LIST, this.interval*1000);

	this.loading = false;
}

// 提示信息
root.methods.closePrompt = function () {
  this.promptOpen = false;
}

// 倒计时
root.methods.initTimes = function (now, end) {
	if (this.loading) return;
  	let self = this;
	new Countdown(document.getElementById('times'), {
	format: '<span style="margin-left: 2px;">hh</span>:<span style="margin-left: 2px;">mm</span>:<span style="margin-left: 2px;">ss</span>',
	startTime: now,
	lastTime: end
	});
}

// 获取用户交易信息
root.methods.GET_USER_TRANSCATION = function () {
	this.$http.send('GET_USER_TRANSCATION', {
		bind: this,
		callBack: this.RE_GET_USER_TRANSCATION,
		errorHandler: this.ERROR_FUN,
	})
}
root.methods.RE_GET_USER_TRANSCATION = function (res) {
	typeof (res) === 'string' && (res = JSON.parse(res));
	let datas = res.dataMap;
	this.transcation = datas.userInfo;
}

// 获取文案
root.methods.GET_DESCRIPTION = function () {
	this.$http.send('GET_DESCRIPTION', {
		bind: this,
		params: {
			language: this.lang == 'CH' ? 'CH' : 'EN'
		},
		callBack: this.RE_GET_DESCRIPTION,
		errorHandler: this.ERROR_FUN,
	})
}
root.methods.RE_GET_DESCRIPTION = function (res) {
	typeof (res) === 'string' && (res = JSON.parse(res));
	this.description = res;
	this.rules_list = JSON.parse(res.rules);
	this.content_list = JSON.parse(res.content);

	let rewards = res.rewards;
	typeof (rewards) === 'string' && (rewards = JSON.parse(rewards));
	for (var i = 0; i < this.ranking_list.length; i++) {
		let item = this.ranking_list[i];
		if (rewards[i]) {
			item.reward = rewards[i];
		} else {
			item.reward = '';
		}
	}

	// 初始化倒计时
	let start_time = res.createdAt;
	let urls = window.location.pathname;
	this.end_time = res.updatedAt;
	if (this.pause == '0') return;
	
	if (Number(this.end_time) <= Number(this.server_time)) {
		this.finished = true;
		return;
	}
	if (Number(start_time) > Number(this.server_time) || !this.is_start_down || urls.indexOf('rankActivity') == -1) return;
	this.initTimes(this.server_time, this.end_time);
	this.is_start_down = false;

}

// 获取榜单
root.methods.GET_RANKING_LIST = function () {
	this.$http.send('GET_RANKING_LIST', {
		bind: this,
		params: {
			language: this.lang == 'CH' ? 'CH' : 'EN'
		},
		callBack: this.RE_GET_RANKING_LIST ,
		errorHandler: this.ERROR_FUN,
	})
}
root.methods.RE_GET_RANKING_LIST = function (res) {
	typeof (res) === 'string' && (res = JSON.parse(res));
	this.limit = res.limit*1;
	let record = res.record;
	this.pause = res.pause;
	for (let i = 0; i < Number(this.limit_length); i++) {
		if (i < record.length) {
			if (i===0 && this.limit > record[0].amount) {
				this.ranking_list.push({email: '', amount: 0});
				this.ranking_list.push(record[0]);
			} else {
				this.ranking_list.push(record[i]);
			}
		} else {
			this.ranking_list.push({email: '', amount: 0});
		}
	}
	// 获取描述
	this.GET_DESCRIPTION();
}

root.methods.changeEmail = function (email) {
    if (email === '') {
      return '--'
    }
    let emailArr = email.split('@')
    let first = emailArr[0]
    first.length > 2 && (first = `${first.slice(0, 1)}***${first.slice(-1)}`)
    return `${first}@${emailArr[1]}`
}


// 错误提示
root.methods.ERROR_FUN = function (error) {
	// console.log(error)
    this.popText = this.$store.state.lang == 'CH' ? '请求失败!' : 'unavailable!';
    // this.promptOpen = true;
}


// 组件结束前清除定时 
root.beforeDestroy = function () {
	clearInterval(setInterval);
}






export default root;