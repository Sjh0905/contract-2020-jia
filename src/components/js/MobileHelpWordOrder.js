const root = {};

root.name = 'H5WordOrder'

root.data = function () {
  return {
    loading: true, //加载中

    // 弹窗
    popOpen: false,
    popType: 0,
    popText: '系统繁忙',

    // select选择框是否打开
    selectFlag: false,

    selectTitle: '请选择您遇到的问题类型',


    // 所有问题类型
    questionList: [],

    // submit发ajax时控制开关
    submitFlag: false,

    // 选择问题类型
    selectId: '',
    // 写的标题内容
    title: '',
    // 写的问题描述
    content: '',
    // 是否选中的是c2c
    isC2CQuestion: false,
    // c2c单号
    userC2CNumber: '',
    // 提交问题email
    userEmail: this.$store.state.authMessage && this.$store.state.authMessage.province === 'mobile' ? this.$store.state.authMessage.email && this.$store.state.authMessage.email || "" : this.$store.state.authMessage.mobile && this.$store.state.authMessage.mobile || '',
    // 提交问题电话
    userMobile: '',

    // 上传照片
    files: [],
    file_size: [],
    file_names: [],




    // 第一张图片是否可以上传
    uploadImgFirstFlag: true,

    // 第一张图片src
    uploadImgFirstSrc: '',


    // 第一张图片是否可以上传
    uploadImgSecondFlag: true,

    // 第一张图片src
    uploadImgSecondSrc: '',


    // 第一张图片是否可以上传
    uploadImgThirdFlag: true,

    // 第一张图片src
    uploadImgThirdSrc: '',

  }
}

root.created = function () {
  // 请求所有问题类型
  this.getQuestionType();
}

root.components = {
  'Loading': resolve => require(['../vue/Loading'], resolve),
  'PopupPrompt': resolve => require(['../vue/PopupPrompt'], resolve),
}

root.methods = {}

// 限制描述字数 //500
root.methods.SET_TXT_SIZE = function () {
  let size = 500;
  let content_length = this.content.length;
  if (content_length > size) {
    this.content = this.content.substr(0, size);
  };
}

// 获取问题类型列表
root.methods.getQuestionType = function () {
  this.$http.send("GET_ORDER_TEMPLATE", {
    bind: this,
    callBack: this.re_getQuestionType
  })
}

// 请求问题类型回来
root.methods.re_getQuestionType = function (data) {
  this.loading = false
  typeof (data) === 'string' && (data = JSON.parse(data));
  let list = JSON.parse(data.message);
  if (list && list.length>0){
    this.questionList = list
  }
}

root.methods.openSelectWindow = function () {
  this.selectFlag = !this.selectFlag
}
// 选择第几个问题
root.methods.selectItem = function (item) {
  this.selectId = item.id
  this.selectTitle = item.name
  if(this.selectId === 1343095){
    this.isC2CQuestion = true
  } else {
    this.isC2CQuestion = false
  }
  this.selectFlag = false
}



root.methods.changeImg1 = function () {
  let that = this;
  let file = this.$refs.firstQuestionImg.files[0]
  let reader = new FileReader()
  let name = file.name;

  reader.readAsDataURL(file)
  reader.onload = function (e) {

    that.file_names.push({"name1": name});
    that.files.push({'file1': file});
    that.file_size.push({'size1': file.size});


    let src = e.target.result
    that.uploadImgFirstFlag = false
    that.uploadImgFirstSrc = src
    document.getElementById('questionImgFirst').innerHTML = `<img src="${this.result}" width="100%" height="100%" />`

    console.log('上传文件详情',that.files,that.file_size,that.file_names)
  }
}

root.methods.deleteFirstImg = function () {
  let that = this
  for(let item in that.file_names) {
    // console.log('item',item)
    if (that.file_names[item]['name1']) {
      that.file_names.splice(item,1);
      that.file_size.splice(item,1);
      that.files.splice(item,1);
      break
    }
    continue
  }
  // let file = $('#question_img_input_1');
  // file.replaceWith(file.clone())

  console.log('删除后文件详情',that.files,that.file_size,that.file_names)

  this.uploadImgFirstSrc = ''
  document.getElementById('questionImgFirst').innerHTML = ''
  this.uploadImgFirstFlag = true
}

root.methods.changeImg2 = function () {
  let that = this;
  let file = this.$refs.secondQuestionImg.files[0]
  let reader = new FileReader()
  let name = file.name;

  reader.readAsDataURL(file)
  reader.onload = function (e) {

    that.file_names.push({"name2": name});
    that.files.push({'file2': file});
    that.file_size.push({'size2': file.size});

    let src = e.target.result
    that.uploadImgSecondFlag = false
    that.uploadImgSecondSrc = src
    document.getElementById('questionImgSecond').innerHTML = `<img src="${this.result}" width="100%" height="100%" />`

  }
}

root.methods.deleteSecondImg = function () {

  let that = this
  for(let item in that.file_names) {
    // console.log('item',item)
    if (that.file_names[item]['name2']) {
      that.file_names.splice(item,1);
      that.file_size.splice(item,1);
      that.files.splice(item,1);
      break
    }
    continue
  }
  // let file = $('#question_img_input_2');
  // file.replaceWith(file.clone())

  this.uploadImgSecondSrc = ''
  document.getElementById('questionImgSecond').innerHTML = ''
  this.uploadImgSecondFlag = true
}

root.methods.changeImg3 = function () {
  let that = this;
  let file = this.$refs.thirdQuestionImg.files[0]
  let reader = new FileReader()
  let name = file.name;

  reader.readAsDataURL(file)
  reader.onload = function (e) {

    that.file_names.push({"name3": name});
    that.files.push({'file3': file});
    that.file_size.push({'size3': file.size});

    let src = e.target.result
    that.uploadImgThirdFlag = false
    that.uploadImgThirdSrc = src
    document.getElementById('questionImgThird').innerHTML = `<img src="${this.result}" width="100%" height="100%" />`

  }
}

root.methods.deleteThirdImg = function () {

  let that = this
  for(let item in that.file_names) {
    // console.log('item',item)
    if (that.file_names[item]['name3']) {
      that.file_names.splice(item,1);
      that.file_size.splice(item,1);
      that.files.splice(item,1);
      break
    }
    continue
  }
  // let file = $('#question_img_input_3');
  // file.replaceWith(file.clone())

  this.uploadImgThirdSrc = ''
  document.getElementById('questionImgThird').innerHTML = ''
  this.uploadImgThirdFlag = true
}

root.methods.submitAllData = function () {
  if (this.submitFlag) {
    return
  }
  this.submitFlag = true
  if (!this.selectId) {
    this.popType = 0;
    this.popOpen = true;
    this.popText = '请选择问题类型!';
    this.submitFlag = false;
    return false;
  }
  if (!this.title) {
    this.popType = 0;
    this.popOpen = true;
    this.popText = '请输入标题!';
    this.submitFlag = false;
    return false;
  }
  if (!this.content) {
    this.popType = 0;
    this.popOpen = true;
    this.popText = '请输入描述!';
    this.submitFlag = false;
    return false;
  }
  if (this.isC2CQuestion === true && !this.userC2CNumber) {
    this.popType = 0;
    this.popOpen = true;
    this.popText = '请输入您的C2C订单单号!';
    this.submitFlag = false;
    return false;
  }

  if (this.isC2CQuestion === true && !/^\d{16}$/.test(this.userC2CNumber)) {
    this.popType = 0;
    this.popOpen = true;
    this.popText = 'C2C订单单号格式错误!';
    this.submitFlag = false;
    return false;
  }


  if (!this.userEmail) {
    this.popType = 0;
    this.popOpen = true;
    this.popText = '请输入您的欧联注册手机号/邮箱地址!';
    this.submitFlag = false;
    return false;
  }
  if (!this.$globalFunc.testEmail(this.userEmail) && !this.$globalFunc.testMobile(this.userEmail)) {
    console.log('email',this.userEmail,!this.$globalFunc.testEmail(this.userEmail),!this.$globalFunc.testMobile(this.userEmail))
    this.popType = 0;
    this.popOpen = true;
    this.popText = '欧联注册手机号/邮箱地址格式错误!';
    this.submitFlag = false;
    return false;
  }

  if (!this.userMobile) {
    this.popType = 0;
    this.popOpen = true;
    this.popText = '请输入联系方式!';
    this.submitFlag = false;
    return false;
  }
  if (!this.$globalFunc.testEmail(this.userMobile) && !this.$globalFunc.testMobile(this.userMobile)) {
    this.popType = 0;
    this.popOpen = true;
    this.popText = '联系方式格式错误!';
    this.submitFlag = false;
    return false;
  }
  let size = 0;
  for (let i = 0; i < this.file_size.length; i++) {
    let itemSize = this.file_size[i].size1 ||  this.file_size[i].size2 ||  this.file_size[i].size3
    size += itemSize
  }
  if (size === 0) {
    this.popType = 0;
    this.popOpen = true;
    this.popText = '请上传附件!';
    this.submitFlag = false;
    return false;
  }
  if (size > 5242880) {
    this.popType = 0;
    this.popOpen = true;
    this.popText = '上传图片最大5M!';
    this.submitFlag = false;
    return false;
  }
  let formData = new FormData();
  let params = {}
  if(this.isC2CQuestion === true){
    params = {
      'typeId': this.selectId,
      'title': this.title,
      'content': this.content,
      'userEmail': this.userEmail,
      'userMobile': this.userMobile,
      'C2CNUM': this.userC2CNumber
    };
  }
  if(this.isC2CQuestion === false){
    params = {
      'typeId': this.selectId,
      'title': this.title,
      'content': this.content,
      'userEmail': this.userEmail,
      'userMobile': this.userMobile,
    };
  }
  formData.append('identityStr', JSON.stringify(params));
  for (var i = 0; i < this.files.length; i++) {
    // let file_item = this.files[i];
    var file_item;
    for (let item in this.files[i]) {
      file_item = this.files[i][item]
    }
    formData.append('file', file_item, file_item.name);
  }
  this.$http.sendFile('CREATE_ORDER', formData, {
    bind: this,
    callBack: this.successSubmitAllData
  })
}

root.methods.successSubmitAllData = function (data) {
  typeof (data) === 'string' && (data = JSON.parse(data));
  if(data.code && data.code == 200)
  {
    this.popType = 1;
    this.popText = '该工单已完结，请重新提交工单！';
    this.popOpen = true;
    setTimeout(function(){
      window.history.go(-1)
    },1000)
  }else {
    this.popType = 0;
    this.popText = '提交失败!';
    this.popOpen = true;
  }
  this.submitFlag = false;
}



// 关闭pop提示
root.methods.popClose = function () {
  this.popOpen = false
}


export default root;
