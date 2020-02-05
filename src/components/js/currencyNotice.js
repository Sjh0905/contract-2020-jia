const root = {}
root.name = 'currencyNotice'

import Countdown from '../../../static/js/countdown'

root.data = function () {
	return {
		// 弹框
		popType: 0,
		popText: '还未开放！',
		promptOpen: false,
		// 分页
		maxPage: 1,
		selectIndex: 1,
		size: 100,

		endTime: '', // 结束时间
		startTime: '',  // 开始时间戳
		serverTime: '', // 服务器时间
		// 页面
		ranking: this.$store.state.lang == 'CH' ? '未上榜' : 'unavailable', // 排名
		volume: '0',  // 交易量

		recharge: '0', // 充值
		reward: '0', // 奖励
		surplus: 0,  // 剩余奖励

		list: [],  // 奖励list
		list_1: [], // 充值
		list_type: '1',  //列表类型
		langs: {
			home: this.$store.state.lang == 'CH' ? '首页' : 'Home',
			detail: this.$store.state.lang == 'CH' ? '活动详情' : 'Event info',
			title0: this.$store.state.lang == 'CH' ? 'ELF上币活动排行榜' : 'Valuable ELF Market Members',
			title1: this.$store.state.lang == 'CH' ? 'ELF上币活动充值奖励' : 'ELF Deposits Bonus',
			ranking: this.$store.state.lang == 'CH' ? '当前排名' : 'My ranking',
			Volume: this.$store.state.lang == 'CH' ? '当前交易量' : 'Transaction Volume',
			valuable_members_list: this.$store.state.lang == 'CH' ? '交易排行榜' : 'Valuable Members List',
			Ranking: this.$store.state.lang == 'CH' ? '排行' : 'Ranking',
			uid: this.$store.state.lang == 'CH' ? '用户名' : 'UID',
			buy: this.$store.state.lang == 'CH' ? '买入' : 'Buy',
			sell: this.$store.state.lang == 'CH' ? '卖出' : 'Sell',
			value: this.$store.state.lang == 'CH' ? '交易量' : 'Volume',
			Bonus: this.$store.state.lang == 'CH' ? '奖励' : 'Bonus',
			one: this.$store.state.lang == 'CH' ? '活动时间 : 2018年3月8日17:00-3月10日17:00' : 'Time: 2018/3/8 17:00-2018/3/10 17:00 (HK Time)',
			two: this.$store.state.lang == 'CH' ? '活动内容 : 活动期间凡参与ELF交易的用户，按ELF交易量（买入量+卖出量）进行排名发放BDB奖励' : 'Details: To celebrate ælf listing, TwentyTwenty  offers extra bonus for valuable ELF market members. Top 50 members with high volume ELF transactions (sum of both ELF Buy and Sell amount) will get:',
			three_title: this.$store.state.lang == 'CH' ? '活动奖励' : 'Bonus',
			three_one: this.$store.state.lang == 'CH' ? '第一名奖励：10000枚BDB' : 'First: 10000 BDB',
			three_two: this.$store.state.lang == 'CH' ? '第二名奖励：6000枚BDB' : 'Second: 6000 BDB',
			three_three: this.$store.state.lang == 'CH' ? '第三名奖励：3000枚BDB' : 'Third: 3000 BDB',
			three_four: this.$store.state.lang == 'CH' ? '第四名至第十名各奖励：1000枚BDB' : '4th – 10th: 1000 BDB',
			three_five: this.$store.state.lang == 'CH' ? '第十一名至第五十名各奖励：600枚BDB' : '11th – 50th: 600 BDB',
			four: this.$store.state.lang == 'CH' ? '奖励发放：活动奖励将于活动结束后2个工作日内发放' : 'Bonus will be settled 2 business days after this event',
			rules: this.$store.state.lang == 'CH' ? '活动规则' : 'activity rules',
			five_one: this.$store.state.lang == 'CH' ? '自成交不计入奖励排行' : 'Please note that transactions made to oneself will not be taken into account',
			five_two: this.$store.state.lang == 'CH' ? '如发现恶意交易等不当行为，TwentyTwenty 有权取消活动资格及奖励' : 'Any behavior of unfair competition will be disqualified immediately',
			five_three: this.$store.state.lang == 'CH' ? '本活动最终解释权归TwentyTwenty 所有' : 'TwentyTwenty  reserves the right of further adjustment and final interpretation of this announcement',

			Total_Deposit: this.$store.state.lang == 'CH' ? '当前充值' : 'Total Deposit',
			now_Bonus: this.$store.state.lang == 'CH' ? '奖励' : 'Bonus',
			Bonus_list: this.$store.state.lang == 'CH' ? '充值奖励' : 'Deposits Bonus List',
			Remaining: this.$store.state.lang == 'CH' ? '剩余奖励' : 'Remaining',
			count_down: this.$store.state.lang == 'CH' ? '倒计时' : 'Count down',
			last_deposit: this.$store.state.lang == 'CH' ? '充值时间' : 'Last deposit',
			total_deposit: this.$store.state.lang == 'CH' ? '充值' : 'Total deposit',
			recharge_one: this.$store.state.lang == 'CH' ? '活动时间 : 2018年3月8日14:00-3月10日17:00' : 'Time: 2018/3/8 14:00-2018/3/10 17:00 (HK Time)',
			recharge_two: this.$store.state.lang == 'CH' ? '活动奖励 : 充值ELF可按照100:1的奖励获得BDB奖励,总计5万枚BDB送完为止！先充先得！' : 'Due to limited quantity of coin, whoever comes first gets first till all 50,000 BDB are given out',
			recharge_three: this.$store.state.lang == 'CH' ? '奖励发放 : 活动奖励将于活动结束后2个工作日内发放' : 'Bonus will be settled 2 business days after this event.',
			recharge_four_one: this.$store.state.lang == 'CH' ? '单个账户BDB最小发放为0.1枚；最大发放为2000枚。即单个账户充值低于10ELF或高于200000ELF不计入奖励' : 'For each account, the minimum reward is 0.1 BDB, and the maximum reward limit is up to 2000 BDB.',
			recharge_four_two: this.$store.state.lang == 'CH' ? '如发现恶意交易等不当行为，TwentyTwenty 有权取消活动资格及奖励' : 'Please note that any behavior of unfair competition will be disqualified immediately',
			recharge_four_three: this.$store.state.lang == 'CH' ? '本活动最终解释权归TwentyTwenty 所有' : 'TwentyTwenty  reserves the right of further adjustment and final interpretation of this announcement',
			List: this.$store.state.lang == 'CH' ? '序号' : 'List',
		},
	}
}

root.components = {
	'IndexHeader': resolve => require(['../vue/IndexHeader'], resolve),
	'IndexFooter': resolve => require(['../vue/IndexFooter'], resolve),
	'PopupPrompt': resolve => require(['../vue/PopupPrompt'], resolve),
	'PageBar': resolve => require(['../vue/BasePageBar'], resolve),
}

root.mounted = function () {

}

root.computed = {}
root.computed.lang = function () {
	return this.$store.state.lang;
}

root.computed.is_login = function () {
	return this.$store.state.isLogin
}

root.watch = {}
root.watch.lang = function (newValue, oldValue) {
	this.ranking = newValue == 'CH' ? '未上榜' : 'unavailable'
	this.langs = {
		home: newValue == 'CH' ? '首页' : 'Home',
		detail: newValue == 'CH' ? '活动详情' : 'Event info',
		title0: newValue == 'CH' ? 'ELF上币活动排行榜' : 'Valuable ELF Market Members',
		title1: newValue == 'CH' ? 'ELF上币活动充值奖励' : 'ELF Deposits Bonus',
		ranking: newValue == 'CH' ? '当前排名' : 'My ranking',
		Volume: newValue == 'CH' ? '当前交易量' : 'Transaction Volume',
		valuable_members_list: newValue == 'CH' ? '交易排行榜' : 'Valuable Members List',
		Ranking: newValue == 'CH' ? '排行' : 'Ranking',
		uid: newValue == 'CH' ? '用户名' : 'UID',
		buy: newValue == 'CH' ? '买入' : 'Buy',
		sell: newValue == 'CH' ? '卖出' : 'Sell',
		value: newValue == 'CH' ? '交易量' : 'Volume',
		Bonus: newValue == 'CH' ? '奖励' : 'Bonus',
		one: newValue == 'CH' ? '活动时间 : 2018年3月8日17:00-3月10日17:00' : 'Time: 2018/3/8 17:00-2018/3/10 17:00 (HK Time)',
		two: newValue == 'CH' ? '活动内容 : 活动期间凡参与ELF交易的用户，按ELF交易量（买入量+卖出量）进行排名发放BDB奖励' : 'Details: To celebrate ælf listing, TwentyTwenty  offers extra bonus for valuable ELF market members. Top 50 members with high volume ELF transactions (sum of both ELF Buy and Sell amount) will get:',
		three_title: newValue == 'CH' ? '活动奖励' : 'Bonus',
		three_one: newValue == 'CH' ? '第一名奖励：10000枚BDB' : 'First: 10000 BDB',
		three_two: newValue == 'CH' ? '第二名奖励：6000枚BDB' : 'Second: 6000 BDB',
		three_three: newValue == 'CH' ? '第三名奖励：3000枚BDB' : 'Third: 3000 BDB',
		three_four: newValue == 'CH' ? '第四名至第十名各奖励：1000枚BDB' : '4th – 10th: 1000 BDB',
		three_five: newValue == 'CH' ? '第十一名至第五十名各奖励：600枚BDB' : '11th – 50th: 600 BDB',
		four: newValue == 'CH' ? '奖励发放：活动奖励将于活动结束后2个工作日内发放' : 'Bonus will be settled 2 business days after this event',
		rules: newValue == 'CH' ? '活动规则' : 'activity rules',
		five_one: newValue == 'CH' ? '自成交不计入奖励排行' : 'Please note that transactions made to oneself will not be taken into account',
		five_two: newValue == 'CH' ? '如发现恶意交易等不当行为，TwentyTwenty 有权取消活动资格及奖励' : 'Any behavior of unfair competition will be disqualified immediately',
		five_three: newValue == 'CH' ? '本活动最终解释权归TwentyTwenty 所有' : 'TwentyTwenty  reserves the right of further adjustment and final interpretation of this announcement',

		Total_Deposit: newValue == 'CH' ? '当前充值' : 'Total Deposit',
		now_Bonus: newValue == 'CH' ? '奖励' : 'Bonus',
		Bonus_list: newValue == 'CH' ? '充值奖励' : 'Deposits Bonus List',
		Remaining: newValue == 'CH' ? '剩余奖励' : 'Remaining',
		count_down: newValue == 'CH' ? '倒计时' : 'Count down',
		last_deposit: newValue == 'CH' ? '充值时间' : 'Last deposit',
		total_deposit: newValue == 'CH' ? '充值' : 'Total deposit',
		recharge_one: newValue == 'CH' ? '活动时间 : 2018年3月8日14:00-3月10日17:00' : 'Time: 2018/3/8 14:00-2018/3/10 17:00 (HK Time)',
		recharge_two: newValue == 'CH' ? '活动奖励 : 充值ELF可按照100:1的奖励获得BDB奖励,总计5万枚BDB送完为止！先充先得！' : 'Due to limited quantity of coin, whoever comes first gets first till all 50,000 BDB are given out',
		recharge_three: newValue == 'CH' ? '奖励发放 : 活动奖励将于活动结束后2个工作日内发放' : 'Bonus will be settled 2 business days after this event.',
		recharge_four_one: newValue == 'CH' ? '单个账户BDB最小发放为0.1枚；最大发放为2000枚。即单个账户充值低于10ELF或高于200000ELF不计入奖励' : 'For each account, the minimum reward is 0.1 BDB, and the maximum reward limit is up to 2000 BDB.',
		recharge_four_two: newValue == 'CH' ? '如发现恶意交易等不当行为，TwentyTwenty 有权取消活动资格及奖励' : 'Please note that any behavior of unfair competition will be disqualified immediately',
		recharge_four_three: newValue == 'CH' ? '本活动最终解释权归TwentyTwenty 所有' : 'TwentyTwenty  reserves the right of further adjustment and final interpretation of this announcement',
		List: this.$store.state.lang == 'CH' ? '序号' : 'List',
	}
}

root.created = function () {
	// 获取充值奖励列表
	this.get_logs_for_elf(1);
	// 获取服务器时间
	this.get_server_time();
}

root.methods = {}
// 获取服务器时间
root.methods.get_server_time = function () {
	this.$http.send('GET_SEVER_TIME', {
		bind: this,
		callBack: this.RE_GET_SEVER_TIME,
	})
}
root.methods.RE_GET_SEVER_TIME = function (res) {
	this.serverTime = res;
	this.startTime = this.$globalFunc.formatDateUitl(res, 'YYYY-MM-DD hh:mm:ss');
	if (res > '1520488800000') {
		// 初始化倒计时
		this.initTimes(this.startTime, this.endTime);
	} else {
		$('#times').text('未开始');
	}
}

// 获取奖励列表信息
root.methods.get_logs_for_elf = function (page) {
	let params = {
		fromIndex: page == 1 ? 1 : ((page - 1) * 100) + 1,
		toIndex: page * 100 > this.size ? this.size : page * 100
	}
	this.$http.send("DEPOSIT_LOGS_FOR_ELF", {
	    bind: this,
	    params: params,
	    callBack: this.RE_DISPLAY_LIST,
	    errorHandler: this.error_getCurrency
  	})
}
// 获取交易排行榜
root.methods.trade_ranking_for_elf = function () {
	this.$http.send("TRADE_RANKING_FOR_ELF", {
	    bind: this,
	    callBack: this.RE_RANKING_LIST,
	    errorHandler: this.error_getCurrency
  	})
}
// 提示信息
root.methods.closePrompt = function () {
	this.promptOpen = false;
}
// 切换排行榜类型
root.methods.CHANGE_TYPE = function (type) {
	let now = new Date().getTime();
	if (type == 0 && this.serverTime < '1520499600000') {
		this.promptOpen = true;
		return;
	}
	this.list_type = type;
	if (type == 1) {
		// 充值奖励
		this.get_logs_for_elf(1);
	} else {
		// 获取交易排行榜列表
		this.trade_ranking_for_elf();
	}
}

// 渲染交易排行榜列表
root.methods.RE_RANKING_LIST = function (res) {
	typeof (res) === 'string' && (res = JSON.parse(res))
	let data = res;
	this.list_1 = data.tradeRankings;
	this.ranking = data.myRanking;  // 排名
	this.volume = data.myTradeAmount;  // 交易量
}

// 渲染充值奖励列表
root.methods.RE_DISPLAY_LIST = function (res) {
	typeof (res) === 'string' && (res = JSON.parse(res))
	let data = res.dataMap.depositLogMap;
	this.list = data.depositLogs;
	this.size = data.size;
	this.maxPage = Math.ceil(data.size / 100);
	this.endTime = this.$globalFunc.formatDateUitl(data.endTime,'YYYY-MM-DD hh:mm:ss');
	this.startTime = '2018-03-08 14:00:00'
	this.surplus = data.budgetBalance; // 剩余
	this.recharge = data.myDepositAmount;  //充值
	this.reward = data.myReward; // 奖励
	this.get_server_time();
}

// 翻页
root.methods.clickChangePage = function (page) {
	this.get_logs_for_elf(page);
	this.selectIndex = page;
}

// 倒计时
root.methods.initTimes = function (now, end) {
	let self = this;
	new Countdown(document.getElementById('times'),{
	   format: '<span style="border:1px solid #fafafa;padding: 2px; border-radius: 3px;margin-left: 5px;">hh</span>:<span style="border:1px solid #fafafa;padding: 2px; border-radius: 3px;margin-left: 5px;">mm</span>:<span style="border:1px solid #fafafa;padding: 2px; border-radius: 3px;margin-left: 5px;">ss</span>',
	   startTime: now,
	   lastTime: end
	});
}

export default root;
