const root = {}
root.name = 'OfficialQuantitativeRegistration'



root.components = {
  'Loading': resolve => require(['../vue/Loading'], resolve),
}

root.data = () => {
  return {
    loading: true, // 加载中

    // optionsgender: [{
    //   value: '0',
    //   label: '10000 QQ'
    // }, {
    //   value: '1',
    //   label: '20000 QQ'
    // }, {
    //   value: '2',
    //   label: '20000 QQ'
    // }, {
    //   value: '3',
    //   label: '30000 QQ'
    // }, {
    //   value: '4',
    //   label: '40000 QQ'
    // }, {
    //   value: '5',
    //   label: '50000 QQ'
    // }, {
    //   value: '6',
    //   label: '60000 QQ'
    // }, {
    //   value: '7',
    //   label: '70000 QQ'
    // }, {
    //   value: '8',
    //   label: '90000 QQ'
    // }, {
    //   value: '9',
    //   label: '100000 QQ'
    // }
    // ],
    optionsgender:[],
    valuegender: '',
  }
}

root.created = function() {
  this.GET_SUPPORTING()
}

root.computed = {}
// 用户名
root.computed.userName = function () {
  if (this.userType === 0) {
    return this.$globalFunc.formatUserName(this.$store.state.authMessage.mobile)
  }
  if (!this.$store.state.authMessage.email) {
    return '****@****'
  }
  return this.$globalFunc.formatUserName(this.$store.state.authMessage.email)
}

// 用户类型，如果是手机用户，为0，如果是邮箱用户，为1
root.computed.userType = function () {
  return this.$store.state.authMessage && this.$store.state.authMessage.province === 'mobile' ? 0 : 1
}
root.methods = {}

root.methods.GET_SUPPORTING = function () {
  this.$http.send('GET_MATCHDATA', {
    bind: this,
    callBack: this.RE_GET_SUPPORTING,
    errorHandler: this.ERROR_GET_SUPPORTING
  })
}
root.methods.RE_GET_SUPPORTING = function (res) {

  this.optionsgender = res.data
  console.log("this.res=====",res)
}
root.methods.ERROR_GET_SUPPORTING = function (err) {

  console.log("this.err=====",err)
}

export default root
