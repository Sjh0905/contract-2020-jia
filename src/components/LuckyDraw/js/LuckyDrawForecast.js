const root = {};

root.name = 'LuckyDrawForecast';

root.data = function () {
  return {
    showIndexHeader: true
  }
}

root.components = {
  'IndexHeader': resolve => require(['../../vue/IndexHeader'], resolve),
  'IndexFooter': resolve => require(['../../vue/IndexFooter'], resolve),
}

root.created = function () {
  if (this.$route.query && this.$route.query.isIOS) {
    this.showIndexHeader = false
  }
}

root.computed = {};
root.computed.isMobile = function () {
  return this.$store.state.isMobile
}

root.watch = {};


root.methods = {};


export default root;
