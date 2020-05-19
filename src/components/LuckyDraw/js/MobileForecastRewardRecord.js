const root = {};

root.name = 'MobileForecastRewardRecord';

root.components = {
  'Loading': resolve => require(['../../vue/Loading'], resolve),
}

root.data = function () {
  return {
    loading: true,
    dataList: [],
  }
}

root.created = function () {
  if(!this.$route.query.projectId) {
    this.$router.replace({name:'MobileForecastHomePage'})
    return
  }


  this.$store.commit('changeMobileHeaderTitle', '开奖记录');
  if(this.$route.query.isIOS) {
    window.postMessage(JSON.stringify({
        method: 'setTitle',
        parameters: '开奖记录'
      })
    );
  }
  this.getInitPage()
}

root.computed = {};

root.watch = {};


root.methods = {};
root.methods.getInitPage = function () {
  this.$http.send('GET_LOOTERY_RECORD', {
    bind: this,
    params: {
      projectId: this.$route.query.projectId,
    },
    callBack: this.re_getInitPage
  })
}

root.methods.re_getInitPage = function (res) {

  typeof(res) == 'string' && (res = JSON.parse(res));

  if (res.result != 'FAIL') {
    this.dataList = res.dataMap.lotteryRecordList;
  }

  this.loading = false
}

export default root;
