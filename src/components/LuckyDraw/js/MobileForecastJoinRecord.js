const root = {};

root.name = 'MobileForecastJoinRecord';

root.components = {
  'Loading': resolve => require(['../../vue/Loading'], resolve),
}

root.data = function () {
  return {
    loading: true,
    dataList: [
      {
        participateTime:23132142342,
        countId:12,
        userName:'2570167180@qq.com'
      }
    ],

    currency: '',
  }
}

root.created = function () {
  if(!(this.$route.query.projectId && this.$route.query.periodNumber && this.$route.query.currency)) {
    this.$router.replace({name:'MobileForecastHomePage'})
    return
  }

  this.currency = this.$route.query.currency

  this.$store.commit('changeMobileHeaderTitle', '本期参与');
  if(this.$route.query.isIOS) {
    window.postMessage(JSON.stringify({
        method: 'setTitle',
        parameters: '本期参与'
      })
    );
  }

  this.getInitPage()
}

root.computed = {};

root.watch = {};


root.methods = {};

root.methods.ReturnToActivePage = function () {
  this.$router.push({name:'MobileForecastHomePage'})
}

root.methods.getInitPage = function () {
  this.$http.send('POST_LUCKY_GUESS_CURRENT_PERIOD_PARTAKE', {
    bind: this,
    params: {
      projectId: this.$route.query.projectId,
      periodNumber: this.$route.query.periodNumber,
    },
    callBack: this.re_getInitPage
  })
}

root.methods.re_getInitPage = function (res) {

  typeof(res) == 'string' && (res = JSON.parse(res));


  if (res.result != 'FAIL') {
    this.dataList = res.dataMap.currentPeriodPartakeList;
  }

  this.loading = false
}


root.methods.changeUser = function (userName) {
  if(this.$globalFunc.testEmail(userName)){
    let newUserName = userName.split('@')
    return newUserName[0].substr(0,2) + '****' + newUserName[0].substr(newUserName[0].length-2,2) + '@' + newUserName[1]
  } else {
    let newUserName = userName
    return newUserName.substr(0,3) + '****' + newUserName.substr(newUserName.length-2,2)
  }
}

export default root;
