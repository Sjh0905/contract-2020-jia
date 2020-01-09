const root = {}
root.name = "IndexShare"

const interval = '';


root.data = function () {
  return {
    list: [],
    list_height: '375px',
    show_more_btn: true,
    show_register_btn: true,
    time: 3600
  }
}

root.created = function () {
  // 如果已登录，不显示注册按钮
  if (!!this.$store.state.authMessage.userId) {
    this.show_register_btn = false;
  }
  // 获取邀请列表
  // this.getList();
  // 列表一小时更新一次
  // this.listIntervalUpdate();
  // 直接渲染列表，不在请求后台数据
  this.displayList();
}

root.components = {
  'IndexHeader': resolve => require(['../vue/IndexHeader'], resolve),
  'IndexFooter': resolve => require(['../vue/IndexFooter'], resolve),
}

root.methods = {}

root.methods.loadMoreList = function () {
  this.list_height = 'auto';
  this.show_more_btn = false;
}

root.methods.listIntervalUpdate = function () {
  let that = this;
  interval = setInterval(function () {
    that.time--;
    if (that.time == 0) {
      that.getList();
      that.time = 3600;
    }
  }, 1000);
}

root.methods.getList = function () {
  let params = {
    "startRecord": 0,
    "endRecord": 30
  };
  this.$http.send('GET_SHARE_SORT_LIST', {
    bind: this,
    params: params,
    callBack: this.displayList,
  })
}
root.methods.displayList = function (data) {
  // if (!!data) {
  //   typeof (data) === 'string' && (data = JSON.parse(data))
  //   this.list = data;
  // }
  let list = [
  {inviteduserEmail: "7755647@qq.com",invitedPersons: '173', invitedNum: '30000'},
  {inviteduserEmail: "453063441@qq.com",invitedPersons: '105', invitedNum: '10000'},
  {inviteduserEmail: "55341848@qq.com",invitedPersons: '96', invitedNum: '10000'},
  {inviteduserEmail: "864651719@qq.com",invitedPersons: '93', invitedNum: '10000'},
  {inviteduserEmail: "353517776@qq.com",invitedPersons: '93', invitedNum: '10000'},
  {inviteduserEmail: "932978967@qq.com",invitedPersons: '85', invitedNum: '10000'},
  {inviteduserEmail: "116371286@qq.com",invitedPersons: '83', invitedNum: '10000'},
  {inviteduserEmail: "329758924@qq.com",invitedPersons: '81', invitedNum: '10000'},
  {inviteduserEmail: "46408488@qq.com",invitedPersons: '78', invitedNum: '10000'},
  {inviteduserEmail: "2451623355@qq.com",invitedPersons: '78', invitedNum: '10000'},
  {inviteduserEmail: "luckyalex1991@gmail.com",invitedPersons: '72', invitedNum: '2000'},
  {inviteduserEmail: "948181401@qq.com",invitedPersons: '57', invitedNum: '2000'},
  {inviteduserEmail: "365107563@qq.com",invitedPersons: '56', invitedNum: '2000'},
  {inviteduserEmail: "663856220@qq.com",invitedPersons: '47', invitedNum: '2000'},
  {inviteduserEmail: "1641392040@qq.com",invitedPersons: '45', invitedNum: '2000'},
  {inviteduserEmail: "694483887@qq.com",invitedPersons: '37', invitedNum: '2000'},
  {inviteduserEmail: "181041165@qq.com",invitedPersons: '36', invitedNum: '2000'},
  {inviteduserEmail: "3195617@qq.com",invitedPersons: '36', invitedNum: '2000'},
  {inviteduserEmail: "837946017@qq.com",invitedPersons: '35', invitedNum: '2000'},
  {inviteduserEmail: "763834625@qq.com",invitedPersons: '33', invitedNum: '2000'},
  {inviteduserEmail: "282514901@qq.com",invitedPersons: '31', invitedNum: '2000'},
  {inviteduserEmail: "rlz@vc8.cn",invitedPersons: '29', invitedNum: '2000'},
  {inviteduserEmail: "245209908@qq.com",invitedPersons: '28', invitedNum: '2000'},
  {inviteduserEmail: "diaogetai@126.com",invitedPersons: '26', invitedNum: '2000'},
  {inviteduserEmail: "33010440@qq.com",invitedPersons: '26', invitedNum: '2000'},
  {inviteduserEmail: "709711897@qq.com",invitedPersons: '25', invitedNum: '2000'},
  {inviteduserEmail: "785360892@qq.com",invitedPersons: '25', invitedNum: '2000'},
  {inviteduserEmail: "wangyi4741@qq.com",invitedPersons: '23', invitedNum: '2000'},
  {inviteduserEmail: "597405388@qq.com",invitedPersons: '21', invitedNum: '2000'},
  {inviteduserEmail: "342528568@qq.com",invitedPersons: '20', invitedNum: '2000'},
  {inviteduserEmail: "743540900@qq.com",invitedPersons: '20', invitedNum: '2000'},
  ];
  this.list = list;
}
root.methods.handlerEmail = function (name) {
  let nameArr = name.split('@')
  return `${nameArr[0][0]}****${nameArr[0].length === 0 ? '' : nameArr[0].charAt(nameArr[0].length - 1)}@${nameArr[1]}`
}

root.beforeDestroy = function () {
  clearInterval(interval);
}


export default root
