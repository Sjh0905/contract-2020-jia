const root = {}
root.name = 'IndexHeaderAlpha'

/*------------------------------- 组件 --------------------------------*/

root.components = {
	'IndexHeaderAssets': resolve => require(['../vue/IndexHeaderAssets'], resolve)
}

/*------------------------------- data --------------------------------*/

root.data = function () {
	return {
		popOpen: false,
		languageFlag: 'language-img-china',
    noticeInterval: ''
	}
}

/*------------------------------- 生命周期 --------------------------------*/

root.created = function () {

  // 获取小红点
  if(this.isLogin){
    this.getNoticeRedPoint()
  }
  if(!this.isLogin){
    this.$store.commit('changeNoticeRedPoint',false);
  }
}


/*------------------------------- 组件 --------------------------------*/

root.computed = {}
// 判断是否是手机
root.computed.isMobile = function () {
	return this.$store.state.isMobile
}

root.computed.mobileHeaderTitle = function () {
	return this.$store.state.mobileHeaderTitle;
}
// 是否登录
root.computed.isLogin = function () {
	if (this.$store.state.authMessage.userId !== '') return true
	return false
}
// 是否显示右侧菜单
root.computed.changePopOpen = function () {
	if (this.$store.state.mobilePopOpen === true) return true
	return false
}

// 返回用户邮箱
root.computed.userName = function () {
	return this.$store.state.authMessage.email
}
root.computed.lang = function () {
	// 返回语言
	return this.$store.state.lang
}

root.computed.langNum = function () {
  if (this.lang === 'CH') return 1
  if (this.lang === 'EN') return 2
  if (this.lang === 'CA') return 3
  return 1
}

root.computed.redPoint = function () {
  return this.$store.state.noticeRedPoint
}


root.watch = {}

root.watch.lang = function (newValue, oldValue) {
  this.getNoticeRedPoint()
}

root.watch.redPoint = function (newValue, oldValue) {
  if(!newValue) {
    this.noticeInterval && clearInterval(this.noticeInterval)
    this.noticeInterval = setInterval(() => {
      this.getNoticeRedPoint()
    }, 600000)
  }
}

root.watch.isLogin = function (newValue, oldValue) {
  if(newValue) {
    this.getNoticeRedPoint()
  }
  if(!newValue) {
    this.$store.commit('changeNoticeRedPoint',false);
  }
}

/*------------------------------- 方法 --------------------------------*/

root.methods = {}
// 切换语言
root.methods.changeLanguage = function (lang) {
	this.$i18n.locale = lang
	this.$store.commit('CHANGE_LANG', lang)
	this.$cookies.set('BWLanguageSet', lang, 60 * 60 * 24 * 30)
	this.$eventBus.notify({key: 'LANGCHANGED'})
  // 获取小红点
  this.getNoticeRedPoint()
}
// 登出
root.methods.loginOff = function () {
	this.$http.send('LOGIN_OFF',
		{
			bind: this,
			params: {},
			callBack: this.re_login_off_callback
		}
	)
}
// 登出回调
root.methods.re_login_off_callback = function (data) {
	// 清除cookie
	this.$cookies.remove("popShow");
	this.$store.commit('LOGIN_OUT');
	window.location.reload();
}

// 请求公告顶部小红点
root.methods.getNoticeRedPoint = function () {
  this.$http.send('GET_READ_NOTICE',
    {
      bind: this,
      params: {
        languageId: this.langNum
      },
      callBack: this.re_get_notice_callback
    }
  )
}

root.methods.re_get_notice_callback = function (data) {
  console.log('获取小红点',data.readNotice)
  data.readNotice && this.$store.commit('changeNoticeRedPoint',true);
  !data.readNotice && this.$store.commit('changeNoticeRedPoint',false);
  let that = this

  if(!data.readNotice) {
    that.noticeInterval && clearInterval(that.noticeInterval)
    that.noticeInterval = setInterval(() => {
      that.getNoticeRedPoint()
    }, 600000)
  }
}

//移动端是否显示右侧菜单
root.methods.clickChangePopOpen = function () {
	this.$store.commit('changeMobilePopOpen', !this.$store.state.mobilePopOpen)
}

// 移动端跳转交易大厅，打开交易大厅弹窗
root.methods.changeMobileTradingHallFlag = function () {
	this.$store.commit('changeMobileTradingHallFlag',true)
	this.$store.commit('changeMobilePopOpen', false)
}

// 移动端跳转当前委托和历史委托
root.methods.changeBuyOrSaleView = function (num) {
	console.log(num)
	this.$store.commit('BUY_OR_SALE_TYPE', num)
	this.$store.commit('changeMobilePopOpen', false)
}

// 移动端跳转，关闭菜单
root.methods.closeMobilePopOpen = function () {
	this.$store.commit('changeMobilePopOpen', false)
}




root.methods.goToPersonal = function () {

}


// 打开客服对话框
root.methods.openYsf = function () {
	ysf.config({
		uid: this.$store.state.authMessage.userId && this.$store.state.authMessage.userId || "无",
		email: this.$store.state.authMessage.email && this.$store.state.authMessage.email || "无",

	});
	console.log()
	ysf.open();
}


export default root
