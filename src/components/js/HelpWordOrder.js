const root = {};

root.name = 'HelpWordOrder'

root.data = function () {
  return {
    popType: 0,
    popText: '',
    promptOpen: false,


    template_list: [],
    id: 0,
    files: [],
    file_size: [],
    file_names: [],
    title: '',
    content: '',
    userEmail: this.$store.state.authMessage && this.$store.state.authMessage.province === 'mobile' ? this.$store.state.authMessage.email && this.$store.state.authMessage.email || "" : this.$store.state.authMessage.mobile && this.$store.state.authMessage.mobile || '',
    userMobile: '',
    file: '',
    states: false,

    C2CId: '', // C2C单号
  }
}

root.computed = {}

root.computed.is_login = function () {
  return this.$store.state.isLogin;
}

root.computed.lang = function () {
  return this.$store.state.lang;
}

// 是否显示C2C单号
root.computed.showC2C = function () {
  if (this.id == '1343095') {
    return true
  }
  return false
}

// 用户类型，如果是手机用户，为0，如果是邮箱用户，为1
root.computed.userType = function () {
  return this.$store.state.authMessage && this.$store.state.authMessage.province === 'mobile' ? 0 : 1
}

root.created = function () {
  this.getTemplateType();
}

root.components = {
  'PopupPrompt': resolve => require(['../vue/PopupPrompt'], resolve),
}

root.methods = {}
// 限制描述字数 //500
root.methods.SET_TXT_SIZE = function () {
  let size = 500;
  let content_length = this.content.length;
  if (content_length > size) {
    this.content = this.content.substr(0, size);
  }
  ;
}
// 提示信息
root.methods.closePrompt = function () {
  this.promptOpen = false;
}
// 获取问题类型列表
root.methods.getTemplateType = function () {
  this.$http.send("GET_ORDER_TEMPLATE", {
    bind: this,
    callBack: this.displayTemplate
  })
}
// 渲染问题类型列表
root.methods.displayTemplate = function (data) {
  typeof (data) === 'string' && (data = JSON.parse(data));
  let list = JSON.parse(data.message);
  if (!!list && list.length > 0) {
    this.template_list = list;
  }
}
// 文件选择
root.methods.updateFile = function () {
  this.$refs.update.click();
}

// 修改问题模板
root.methods.changeTemplateType = function (e) {
  console.log(e)
}

// 文件上传
root.methods.changeUpdate = function () {

  let file = this.$refs.update.files[0];
  let that = this;
  if (!/image\/\w+/.test(file.type)) {
    that.popText = this.$t('onlyImg');
    that.popType = 0;
    that.promptOpen = true;
    return false;
  }
  let reader = new FileReader();
  let name = file.name;
  this.files.push(file);
  this.file_size.push(file.size);

  reader.readAsDataURL(file);
  reader.onload = function (e) {
    if (that.file_names.length == 3) {
      that.popText = that.$t('onlyThree');
      that.popType = 0;
      that.promptOpen = true;
      return;
    }
    that.file_names.push({"name": name});
  }
}

// 可以提交
root.methods.canSend = function () {
  let params = {
    'typeId': this.id,
    'title': this.title,
    'content': this.content,
    'userEmail': this.userEmail,
    'userMobile': this.userMobile,
  }
  if (this.showC2C) {
    params['C2CNUM'] = this.C2CId
  }
  if (!params.typeId) {
    this.popType = 0;
    this.promptOpen = true;
    this.popText = this.$t('chooseQuestion');
    return false;
  }
  if (!params.title) {
    this.popType = 0;
    this.promptOpen = true;
    this.popText = this.$t('inputTitle');
    return false;
  }
  if (!params.content) {
    this.popType = 0;
    this.promptOpen = true;
    this.popText = this.$t('inputDescribe');
    return false;
  }
  if (!params.userEmail) {
    this.popType = 0;
    this.promptOpen = true;
    this.popText = this.$t('form_email');
    return false;
  }

  if (this.showC2C && !params['C2CNUM']) {
    this.popType = 0;
    this.promptOpen = true;
    this.popText = this.$t('c2cTitle')
    return false;
  }

  if (this.showC2C && !/^\d{16}$/.test(params['C2CNUM'])) {
    this.popType = 0;
    this.promptOpen = true;
    this.popText = this.$t('c2cWrong')
    return false;
  }

  if (
    !this.$globalFunc.testEmail(params.userEmail)
    && !this.$globalFunc.testMobile(params.userEmail)
  ) {
    this.popType = 0;
    this.promptOpen = true;
    this.popText = this.$t('emailWrong');
    return false;
  }
  if (
    !this.$globalFunc.testEmail(params.userMobile)
    && !this.$globalFunc.testMobile(params.userMobile)
  ) {
    this.popType = 0;
    this.promptOpen = true;
    this.popText = this.$t('informationWrong');
    return false;
  }
  let size = 0;
  for (var i = 0; i < this.file_size.length; i++) {
    size += this.file_size[i];
  }
  if (this.file_size.length <= 0) {
    this.popType = 0;
    this.promptOpen = true;
    this.popText = this.$t('inputImg');
    return false;
  }
  if (size > 5242880) {
    this.popType = 0;
    this.promptOpen = true;
    this.popText = this.$t('inputImgTooLarge');
    return false;
  }
  return true;
}

// 表单提交
root.methods.formSubmit = function () {
  if (!this.canSend()) {
    return
  }
  let params = {
    'typeId': this.id,
    'title': this.title,
    'content': this.content,
    'userEmail': this.userEmail,
    'userMobile': this.userMobile,
  };
  if (this.showC2C) {
    params['C2CNUM'] = this.C2CId
  }
  let formData = new FormData();
  formData.append('identityStr', JSON.stringify(params));
  for (var i = 0; i < this.files.length; i++) {
    let file_item = this.files[i];
    formData.append('file', file_item, file_item.name);
  }
  this.$http.sendFile('CREATE_ORDER', formData, {
    bind: this,
    callBack: this.successSubmit
  })
}

// 提交成功
root.methods.successSubmit = function (data) {

  typeof (data) === 'string' && (data = JSON.parse(data));
  if (data.code && data.code == 200) {
    this.popType = 1;
    this.popText = this.$t('commitSuccess');
    this.promptOpen = true;
    // window.location.href = "/index/help/workOrderList";
    this.$router.push({name: 'workOrderList'})
  } else {
    this.popType = 0;
    this.popText = this.$t('commitFail');
    this.promptOpen = true;
  }
  this.states = false
}


export default root;
