const root = {};

import logo from '../../assets/qrcode_icon_logo.png';

root.name = 'PersonalCenterSecurityCenterManageApi';

root.data = function () {
	return {
		// 展示验证信息框
	    show_ga_sms_dialog: false,
	   	// 验证信息
	    verificationCode: '',
    	verificationCodeWA: '',

    	getVerificationCode: false,
	    getVerificationCodeInterval: null,
	    getVerificationCodeCountdown: 60,
	    clickVerificationCodeButton: false,

	    // 是否显示验证
	    showPicker: false,
	    bindGA: false,
	    bindMobile: false,
	    picked: '',
	    // 短信码/谷歌码
	    GACode: '',
	    GACodeWA: '',
	    sending: false,

	    // 弹框参数
	    popWindowOpen: false,
	    // popWindowTitle: '绑定成功',
	    popWindowPrompt: this.$store.state.lang == 'CH' ? 'API秘钥已创建成功' : 'Secret Key created',
      // 删除提示
      deletePopWindowOpen: false,
      deletePopWindowTitle: this.$store.state.lang == 'CH' ? '删除API' : 'Delete the  API',
      deletePopWindowPrompt: this.$store.state.lang == 'CH' ? '是否删除当前API' : 'Whether to delete the current API',

	    // 二维码
	    logo: logo,
	    qrsize: 150,
	    bgColor: '#fff',
	    fgColor: '#000',
	    value: '',

	    // 拼凑二维码value参数
	    value_obj: {},

	    // 当前页面参数
	    api_key: '',
	    secret_key: '',
	}
}

root.created = function () {
  // 获取query值
  let code = this.$route.query.code;

	// 获取验证信息
	this.GET_AUTH_STATE();

  // 校验是否可以添加apikey
  this.MANAGE_ADD_API_KEY(code);

	// 初始化二维码
	this.value_obj = {"apiKey": ""+this.api_key+"", "secretKey": ""+this.secret_key+"", "comment": ""+this.user_name+""};

}

root.mounted = function () {
	this.value = JSON.stringify(this.value_obj);
	this.qrsize = 150 /  window.devicePixelRatio;
}

root.components = {
	'PopupWindow': resolve => require(['../vue/PopupWindow'], resolve),
	'Qrcode': resolve => require(['qrcode-vue'], resolve),
}

root.computed = {};
root.computed.user_name = function () {
	return this.$store.state.authMessage.email;
}
root.computed.lang = function () {
  return this.$store.state.lang;
}


root.watch = {};
root.watch.lang = function (newValue, oldValue) {
  if (newValue == oldValue) return;
  this.popWindowPrompt = this.$store.state.lang == 'CH' ? 'API秘钥已创建成功' : 'Secret Key created';
  this.deletePopWindowTitle = this.$store.state.lang == 'CH' ? '删除API' : 'Delete the  API';
  this.deletePopWindowPrompt = this.$store.state.lang == 'CH' ? '是否删除当前API' : 'Whether to delete the current API';
}


root.methods = {};
// 删除API
root.methods.DELETE_API = function () {
	this.deletePopWindowOpen = true;
}
// 确定删除API
root.methods.deletePopWindowClose = function () {
  this.show_ga_sms_dialog = true;
  this.deletePopWindowOpen = false;
}

// 关闭验证框
root.methods.CLOSE_GA_SMS_DIALOG = function () {
	this.show_ga_sms_dialog = false;
}

// 关闭弹框
root.methods.popWindowClose = function () {
	this.popWindowOpen = false;
  this.deletePopWindowOpen = false;
}

// 检测验证码
root.methods.testVerificationCode = function () {
  if (this.picked !== 'bindMobile') {
    this.verificationCodeWA = ''
    return true
  }
  if (this.verificationCode === '') {
    this.verificationCodeWA = ''
    return false
  }
  this.verificationCodeWA = ''
  return true
}

// 检测谷歌验证码
root.methods.testGACode = function () {
  if (this.picked !== 'bindGA') {
    this.GACodeWA = ''
    return true
  }
  if (this.GACode === '') {
    this.GACodeWA = ''
    return false
  }
  this.GACodeWA = ''
  return true

}

// 是否添加api key
root.methods.MANAGE_ADD_API_KEY = function (code) {
  this.$http.send("MANAGE_ADD_API_KEY", {
      bind: this,
      params: {code: code},
      callBack: this.RE_MANAGE_ADD_API_KEY,
      errorHandler: this.error_getCurrency
  })
}
root.methods.RE_MANAGE_ADD_API_KEY = function (res) {
  let data = res.dataMap;
  let errorCode = res.errorCode;
  if (errorCode == 0) {
    let api = data.apiKey;
    this.api_key = api.apiKey;
    this.secret_key = api.apiSecret;
    if (this.secret_key.length > 6) {
      this.popWindowOpen = true;
      return;
    }
    this.popWindowOpen = false;
  }
  if (errorCode == 1) {
    this.$router.push({name: 'login'});
  }
  if (errorCode == 2) {
    this.$router.push({name: 'openApi'});
  }
  if (errorCode == 3) {
    this.$router.push({name: 'securityCenter'});
  }
}

// 认证状态
root.methods.GET_AUTH_STATE = function () {
	this.$http.send("GET_AUTH_STATE", {
	    bind: this,
	    callBack: this.RE_GET_AUTH_STATE,
	    errorHandler: this.error_getCurrency
  	})
}
root.methods.RE_GET_AUTH_STATE = function (res) {
	typeof res === 'string' && (res = JSON.parse(res));
	let data = res.dataMap;
	this.identity_type = data;
	if (res.result == 'SUCCESS' && (data.sms || data.ga)) {
		this.identity = true;
	}
	// 两者都验证了
	this.bindGA = data.ga;
	this.bindMobile = data.sms;

	this.bindMobile && (this.picked = 'bindMobile');
	this.bindGA && (this.picked = 'bindGA');
	if (this.bindGA && this.bindMobile) {
		this.showPicker = true;
	}

	this.loading = false
}

// 点击发送
root.methods.click_send = function () {
  let canSend = true;

  if (this.verificationCode === '' && this.picked === 'bindMobile') {
    this.verificationCodeWA = this.$t('signPageResetPassword.verificationCodeWA_0')
    canSend = false
  }
  if (!this.clickVerificationCodeButton && this.picked === 'bindMobile') {
    this.verificationCodeWA = this.$t('signPageResetPassword.verificationCodeWA_1')
    canSend = false
  }
  if (this.GACode === '' && this.picked === 'bindGA') {
    this.GACodeWA = this.$t('signPageResetPassword.GACodeWA_0')
    canSend = false
  }


  if (!canSend) {
    // console.log("不能发送！")
    return
  }

  let pickedType = ''
  if (this.picked === 'bindMobile') {
    pickedType = 'mobile'
  }
  if (this.picked === 'bindGA') {
    pickedType = 'ga'
  }

  let code = ''
  this.picked === 'bindGA' && (code = this.GACode)
  this.picked === 'bindMobile' && (code = this.verificationCode)
  // console.log('emailemial', this.$route.query.email)

  this.sending = true;

  let params

  console.log(code,'code')

  if (pickedType === 'mobile') {
  	params = {
  		"method": pickedType,
  		"code": code,
  		"apiKey": this.api_key
  	};
    this.$http.send('MANAGE_DELETE_API_KEY', {
      bind: this,
      params: params,
      callBack: this.RE_LOAD_OPEN_API,
      errorHandler: this.ERROR_LOAD_OPEN_API
    })
    return
  }

  params = {
    "method": pickedType,
	"code": code,
	"apiKey": this.api_key
  }

  this.$http.send('MANAGE_DELETE_API_KEY', {
    bind: this,
    params: params,
    callBack: this.RE_LOAD_OPEN_API,
    errorHandler: this.ERROR_LOAD_OPEN_API
  })

}

root.methods.ERROR_LOAD_OPEN_API = function () {
  this.sending = false;
}

// 跳到创建页
root.methods.RE_LOAD_OPEN_API = function (res) {
  typeof(res) === 'string' && (res = JSON.parse(res));
  if (res.errorCode == 0) {
    this.$router.push({name: 'openApi'});
  }
  if (res.errorCode == 1) {
    this.verificationCodeWA = '用户未登录';
    this.GACodeWA = '用户未登录';
    this.sending = false;
  }
  if (res.errorCode == 2) {
    this.verificationCodeWA = '暂不可用';
    this.GACodeWA = '暂不可用';
    this.sending = false;
  }
  if (res.errorCode == 3) {
    this.verificationCodeWA = '验证码错误';
    this.GACodeWA = '验证码错误';
    this.sending = false;
  }
}

// 点击发送验证码
root.methods.click_getVerificationCode = function () {

  this.getVerificationCode = true
  this.clickVerificationCodeButton = true
  this.verificationCodeWA = ''

  this.getVerificationCodeInterval && clearInterval(this.getVerificationCodeInterval)

  this.getVerificationCodeInterval = setInterval(() => {
    this.getVerificationCodeCountdown--
    if (this.getVerificationCodeCountdown <= 0) {
      this.getVerificationCode = false
      this.getVerificationCodeCountdown = 60
      clearInterval(this.getVerificationCodeInterval)
    }
  }, 1000)

  this.$http.send('GET_VERIFICATIONCODE', {
    bind: this,
    params: {
      "mun": "delete",
      "purpose": "apikey",
      "type": "mobile"
    },
    callBack: this.re_getVerificationCode
  })

}


root.methods.re_getVerificationCode = function (data) {
  if (typeof data === 'string') data = JSON.parse(data);
  let errorCode = data.errorCode;
  if (errorCode > 0) {
    this.getVerificationCode = true;
  }
  if (errorCode == 1) {
    this.verificationCodeWA = '用户未登录';
  }
  if (errorCode == 2) {
    this.verificationCodeWA = '此用户未绑定手机';
  }
  if (errorCode == 3) {
    this.verificationCodeWA = '发送过于频繁';
  }
  if (errorCode == 4) {
    this.verificationCodeWA = '参数错误';
  }
    
}






export default root;