const root = {}

root.name = 'WorkOrderInfo'

root.data = function () {
  return {
    orderInfo: [],
    status: {1: this.$t('Submitted'), 5: this.$t('Pending'), 10: this.$t('Processing'), 20: this.$t('Processed')},
    id: {},
    userId: this.$store.state.authMessage.userId && this.$store.state.authMessage.userId || "",
    userEmail: this.$store.state.authMessage.email && this.$store.state.authMessage.email || "",
    comment: "",
    files: [],
    history: [],
    textArea: false,
    file_size: [],
    file_names: [],
    popType: 0,
    popText: '',
    promptOpen: false,
    reply: false,

    //C2C订单号
    custom: null,


  }
}

root.created = function () {

  this.getOrderInfo();
}

root.components = {
  'PopupPrompt': resolve => require(['../vue/PopupPrompt'], resolve),
}


root.methods = {}
root.methods.closePrompt = function () {
  this.promptOpen = false;
}

root.methods.updateFile = function () {
  this.$refs.update.click();
}

root.methods.changeUpdate = function () {
  let that = this;
  let file = this.$refs.update.files[0];
  let reader = new FileReader();
  let name = file.name;
  this.files.push(file);
  this.file_size.push(file.size);
  // console.log(file);
  if (!/image\/\w+/.test(file.type)) {
    that.popText = this.$t('onlyImg');
    that.popType = 0;
    that.promptOpen = true;
    return false;
  }
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


root.methods.getOrderInfo = function () {
  let params = {"ticketId": this.$route.query.id};
  this.$http.send('WORKORDER_INFO', {bind: this, params, callBack: this.RE_WORKORDER_INFO})
}

root.methods.RE_WORKORDER_INFO = function (data) {
  typeof (data) === 'string' && (data = JSON.parse(data));
  let info = JSON.parse(data.message);
  if (info) {
    this.orderInfo = info;
    this.custom = info.custom || '';
    this.history = info.comments;
    if (this.history.length > 2)
      this.history.sort((v, v1) => v.timestamp - v1.timestamp);
  }
}

root.methods.replyOrder = function () {
  if (this.reply) {
    return false;
  }
  this.reply = true
  let params = {
    ticketId: this.$route.query.id,
    comment: this.comment
  };
  if (!params.comment) {
    this.popType = 0;
    this.promptOpen = true;
    this.popText = this.$t('enterContent');
    return false;
  }
  let formData = new FormData();
  formData.append('jsonParams', JSON.stringify(params));
  for (var i = 0; i < this.files.length; i++) {
    let file_item = this.files[i];
    formData.append('file', file_item, file_item.name);
  }


  this.$http.sendFile('REPLY_ORDER', formData, {
    bind: this,
    callBack: this.RE_REPLYORDER,

  })


}
root.methods.RE_REPLYORDER = function (data) {
  typeof (data) === 'string' && (data = JSON.parse(data));
  if (data.code && data.code == 200) {
    this.popType = 1;
    this.popText = this.$t('commitSuccess');
    this.promptOpen = true;
    this.textArea = false
    this.history.push({staffId: 231029, comment: this.comment});
    this.comment = ""
  } else if (data.code && data.code == 8803) {
    this.popType = 0;
    this.popText = this.$t('orderEnd');
    this.promptOpen = true;
  } else {
    this.popType = 0;
    this.popText = this.$t('commitFail');
    this.promptOpen = true;
  }
  this.reply = false


}


root.methods.addDialogue = function () {
  this.textArea = !this.textArea
}

export default root;
