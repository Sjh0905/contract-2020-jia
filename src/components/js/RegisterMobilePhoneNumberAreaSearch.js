const root = {}
root.name = 'RegisterMobilePhoneNumberAreaSearch'






root.components = {
  'Loading': resolve => require(['../vue/Loading'], resolve),
  'PopupPrompt': resolve => require(['../vue/PopupPrompt'], resolve),
  'PopupWindow': resolve => require(['../vue/PopupWindow'], resolve),
}
root.methods = {}
root.watch = {}


root.data = function () {
  return {
    listData : [],
    filterData: [],
    textInput:''

  }
}
root.mounted = function(){

  this.getArea()

}

root.watch.textInput = function(text){
    this.sleep(200);
    this.textInput = text
    console.log('this.textInput==',this.isNumber(this.textInput))
    this.filterData = this.isNumber(this.textInput) ? this.listData.filter(v=>this.generReg(text).test(v.areaCode)):this.listData.filter(v=>this.generReg(text).test(v.nameCn))


}



root.methods.getArea = function () {
  this.$http.send("REGISTER_BY_MOBILE_INFO", {
    bind: this,
    params: {},
    callBack: this.re_getArea,
    errorHandler: this.error_getArea
  })
}
root.methods.re_getArea =  function (data) {
  if(data) this.listData = data
}
root.mounted.error_getArea =  function () {

}


root.methods.clickItem = function(code){
  this.$store.commit('SET_AREA_CODE',code);
  window.history.go(-1)
}











root.methods.generReg = function (val) {
  return  new RegExp(`(.*)(${val.split('').join(')(.*)(')})(.*)`, 'i');
}
root.methods.sleep = function (ms) {
  return new Promise(res=>setTimeout(res,ms))
}
root.methods.isNumber= function (val) {
  let regPos = /^\d+(\.\d+)?$/; //非负浮点数
  let regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/; //负浮点数
  if(regPos.test(val) || regNeg.test(val)) {
    return true;
  } else {
    return false;
  }
}
export default root
