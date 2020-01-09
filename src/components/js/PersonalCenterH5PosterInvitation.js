const root = {}

root.name = 'H5PosterInvitation'


root.data = function () {
  return {
    loading: true,

    getRateFlag: false,
    getImgFlag: false,

    imgSrc: '',
  }
}

root.created = function () {
  this.$store.commit('changeMobileHeaderTitle', '我的专属邀请海报');

  // 请求bt值
  this.getBTFunc();
  // 请求海报图片
  this.getPosterImage();

}

root.computed = {}

root.computed.btActivity = function () {
  return this.$store.state.btActivity;
}

root.components = {
  'Loading': resolve => require(['../vue/Loading'], resolve)
}



root.methods = {}

root.methods.getBTFunc = function(){
  let that = this;
  this.$globalFunc.getBTRegulationConfig(this,(data)=>{
    that.getRateFlag = true
    that.loading = !(that.getRateFlag && that.getImgFlag)
  })
}

// 获取海报
root.methods.getPosterImage = function () {
  this.$http.send('GET_USER_MY_INVITES_POSTER', {
    bind: this,
    params: {
      type :"invite",
      param:"CH"      // 英文传EN
    },
    callBack: this.re_getPosterImage,
    errorHandler: this.error_getPosterImage
  })
}

root.methods.re_getPosterImage = function (data) {
  typeof(data) === 'string' && (data = JSON.parse(data));
  this.imgSrc = data.dataMap.inviteUrl;


  this.getImgFlag = true;
  this.loading = !(this.getRateFlag && this.getImgFlag)
}

root.methods.error_getPosterImage = function (err) {
  console.log(err)
}

export default root
