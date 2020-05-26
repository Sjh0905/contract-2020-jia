const root = {};

root.name = 'MobileForecastRewardRecord';

root.components = {
  'Loading': resolve => require(['../../vue/Loading'], resolve),
}

root.data = function () {
  return {
    loading: false,
    dataList: [
      // {
      //   winNumber:2,
      //   itemNumber:10000020,
      //   lotteryTime:1323231223122
      // },
      // {
      //   winNumber:2,
      //   itemNumber:10000020,
      //   lotteryTime:1323231223122
      // },
      // {
      //   winNumber:2,
      //   itemNumber:10000020,
      //   lotteryTime:1323231223122
      // },
      // {
      //   winNumber:2,
      //   itemNumber:10000020,
      //   lotteryTime:1323231223122
      // }
    ],
    isApp:false,
    isIOS:false
  }
}

root.created = function () {
  if(!this.$route.query.projectId) {
    this.$router.replace({name:'treasureBox'})
    return
  }


  this.$store.commit('changeMobileHeaderTitle', '开奖记录');
  if(this.$route.query.isIOS) {
    window.postMessage(JSON.stringify({
      method: 'revertHeader'
    }))
    window.postMessage(JSON.stringify({
        method: 'setTitle',
        parameters: '开奖记录'
      })
    );
    window.postMessage(JSON.stringify({
      method: 'setH5Back',
      parameters: {
        canGoH5Back:true
      }
    }))
  }
  this.isIOSQuery()
  this.getInitPage()
}

root.computed = {};

root.watch = {};


root.methods = {};

root.methods.goToCurrentPre = function (item) {
  console.info('item=====',item)
  this.$router.push({name: 'MobileForecastJoinRecord', query: {projectId: item.projectId,periodNumber:item.itemNumber,currency:item.currency,isIOS:this.isIOS || '',blockContractUrl:item.blockContractUrl,winNumber:item.winNumber}})
  // this.$router.push('/static/mobileForecastJoinRecord?projectId='+item.projectId)
  // mobileForecastJoinRecord?projectId=1&periodNumber=00000003&currency=KK
}

root.methods.ReturnToActivePage = function () {
  this.$router.push('/index/treasureBox')
}
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

// 判断是否是ios打开
root.methods.isIOSQuery = function () {
  if(this.$route.query.isIOS) {
    this.isIOS = true
  } else {
    this.isIOS = false
  }
}

export default root;
