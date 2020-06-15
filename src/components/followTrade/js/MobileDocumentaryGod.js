const root = {}
root.name = 'mobileDocumentaryGod'
/*------------------------------ 组件 ------------------------------*/
//root.components = {
//  'Loading': resolve => require(['../Loading/Loading.vue'], resolve),
//}
/*------------------------------ data -------------------------------*/
root.data = function () {
  return {
    followType:1,
    historicalList:[
      {type:true},
      {type:true},
      {type:false},
      {type:false},
      {type:true},
      {type:false},
      {type:true},
    ],
    followerList:[]
  }
}
/*------------------------------ 生命周期 -------------------------------*/
root.created = function () {
  console.info('params: {item:item}',this.$route.params.item)
  if(this.$route.query.isApp) {
    window.postMessage(JSON.stringify({
        method: 'setTitle',
        parameters: '区块恋'
      })
    );
    window.postMessage(JSON.stringify({
      method: 'setH5Back',
      parameters: {
        canGoH5Back:false
      }
    }))
  }
}
root.mounted = function () {}
root.beforeDestroy = function () {}
/*------------------------------ 计算 -------------------------------*/
root.computed = {}
// 检验是否是APP
root.computed.isApp = function () {
  return this.$route.query.isApp ? true : false
}
/*------------------------------ 观察 -------------------------------*/
root.watch = {}
/*------------------------------ 方法 -------------------------------*/
root.methods = {}
// 切换历史跟单和跟随者
root.methods.toggleType = function (type) {
  this.followType = type
}
// 返回跟单首页
root.methods.jumpToFollowTrade = function () {
  this.$router.push({name:'mobileFollowTrade'})
}
export default root
