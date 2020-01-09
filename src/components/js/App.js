const root = {}

root.name = 'App'


/*------------------------------ 生命周期 -------------------------------*/


root.created = function () {
  document.title = this.$t('document_title')
  this.$eventBus.listen(this, 'LANGCHANGED', this.changeLang)
}


/*------------------------------ 计算 -------------------------------*/
root.computed = {}
// 判断语言
root.computed.lang = function () {
  return this.$store.state.lang
}


/*------------------------------ 观察 -------------------------------*/
root.watch = {}
// 观察是否切换语言
root.watch.lang = function (oldVal, newVal) {
  document.title = this.$t('document_title')
}
root.methods = {}
root.methods.changeLang = function (lang) {

  var state = this.$store.state
  this.$i18n.locale = lang
  this.$store.commit('CHANGE_LANG', lang)
  this.$cookies.set('BWLanguageSet', lang, 60 * 60 * 24 * 30)
  zE('webWidget', 'setLocale', state.langZendeskObj[state.lang]);//切换右下角帮助的语言
}



export default root
