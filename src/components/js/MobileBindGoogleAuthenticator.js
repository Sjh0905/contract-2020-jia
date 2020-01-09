import Clipboard from "clipboard";

const root = {}
root.name = 'MobileBindGoogleAuthenticator'



/*----------------------------- 组件 ------------------------------*/

root.components = {
	'Loading': resolve => require(['../vue/Loading'], resolve),
	'PopupPrompt': resolve => require(['../vue/PopupPrompt'], resolve),

}

/*----------------------------- data ------------------------------*/


root.data = function () {
	return {
		loading: true,
		secretKey: '',
		verificationCode: '',
		verificationCodeWA: '',
		psw: '',
		pswWA: '',
		uri: '',

		popType: 0,
		popOpen: false,
		popText: '系统繁忙',

		getAuthReady: false,
		getGAReady: false,


		sending: false
	}
}

/*----------------------------- 生命周期 ------------------------------*/

root.created = function () {
	this.getAuthState()
	// 发送请求获取
	this.$http.send('POST_VERIFICATION_CODE',
		{
			bind: this,
			params: {
				type: 'ga',
				mun: this.$store.state.authMessage.email,
				purpose: 'bind'
			},
			callBack: this.re_bind_google,
			errorHandler: this.error_bind_google,
		})
}

/*----------------------------- 计算 ------------------------------*/

root.computed = {}
// 判断是否是手机
root.computed.isMobile = function () {
	return this.$store.state.isMobile
}

/*----------------------------- 方法 ------------------------------*/

root.methods = {}
// 获取认证状态
root.methods.getAuthState = function () {
	if (!this.$store.state.authState) {
		this.$http.send('GET_AUTH_STATE', {
			bind: this,
			callBack: this.re_getAuthState,
			errorHandler: this.error_getAuthState
		})
		return
	}
	if (this.$store.state.authState.ga) {
		this.$router.push('/index/personal/securityCenter')
		return
	}
	this.getAuthReady = true
	this.loading = !(this.getAuthReady && this.getGAReady)
}
// 判断验证状态回调
root.methods.re_getAuthState = function (data) {
	typeof data === 'string' && (data = JSON.parse(data))
	// console.warn("获取验证状态")
	if (!data) return
	this.$store.commit('SET_AUTH_STATE', data.dataMap)
	if (data.dataMap.ga) {
		this.$router.push('/index/personal/securityCenter')
	}
	this.getAuthReady = true
	this.loading = !(this.getAuthReady && this.getGAReady)

}
// 判断验证状态出错
root.methods.error_getAuthState = function (err) {
	console.warn("获取验证状态出错！", err)
	this.$router.push('/index/personal/securityCenter')
}



// 获取谷歌码
root.methods.re_bind_google = function (data) {
	// console.log('data')
	typeof data === 'string' && (data = JSON.parse(data))
	// console.warn('返回谷歌验证url data', data)

	this.uri = data.dataMap.uri
	this.secretKey = data.dataMap.secretKey
	this.getGAReady = true
	this.loading = !(this.getAuthReady && this.getGAReady)
}
root.methods.error_bind_google = function (err) {
	console.warn("返回出错", err)
}


// 点击复制
root.methods.clickCopy = function () {

	let copyBtn = new Clipboard('._m_bg_cpr');
	let that = this
	copyBtn.on('success', function (e) {
		e.clearSelection();
		that.popOpen = true
		that.popType = 1
		that.popText = '复制成功'
		copyBtn.destroy()
	})
	copyBtn.on('error', function (e) {
		that.popOpen = true
		that.popType = 0
		that.popText = '复制失败'
		copyBtn.destroy()
	})

}

root.methods.goToBind = function () {
	this.$router.push('/index/personal/securityCenter/MobileGoBindGoogleAuthenticator')

}

root.methods.popClose = function () {
	this.popOpen = false
}
export default root
