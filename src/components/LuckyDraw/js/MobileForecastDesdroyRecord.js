const root = {};

root.name = 'MobileForecastDesdroyRecord';

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
  this.$store.commit('changeMobileHeaderTitle', '销毁记录');
  if(this.$route.query.isIOS) {
    window.postMessage(JSON.stringify({
        method: 'setTitle',
        parameters: '销毁记录'
      })
    );
  }

  this.getInitPage()
}

root.computed = {};

root.watch = {};


root.methods = {};

root.methods.getInitPage = function () {
  this.$http.send('GET_DESTROY_RECORD', {
    bind: this,
    params: {
      projectId: this.$route.query.projectId,
      periodNumber: this.$route.query.periodNumber,
      ticketStatus: this.$route.query.ticketStatus,
    },
    callBack: this.re_getInitPage
  })
}

root.methods.re_getInitPage = function (res) {

  typeof(res) == 'string' && (res = JSON.parse(res));

  if (res.result != 'FAIL') {
    this.dataList = res.dataMap.destroyRecordList;
  }

  this.loading = false
}


export default root;
