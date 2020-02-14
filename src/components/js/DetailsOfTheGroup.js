const root = {}
root.name = 'DetailsOfTheGroup'
/*------------------------------ 组件 ------------------------------*/
//root.components = {
//  'Loading': resolve => require(['../Loading/Loading.vue'], resolve),
//}
/*------------------------------ data -------------------------------*/
root.data = function () {
  return {}
}
/*------------------------------ 生命周期 -------------------------------*/
root.created = function () {}
root.mounted = function () {}
root.beforeDestroy = function () {}
/*------------------------------ 计算 -------------------------------*/
root.computed = {}
/*------------------------------ 观察 -------------------------------*/
root.watch = {}
/*------------------------------ 方法 -------------------------------*/
root.methods = {}

//退团解散团队post(params:{})
root.methods.post_withdraw = function () {
  this.$http.send('POST_ASSEMBLE_LEVEAGROUP', {
    bind: this,
    params:{},
    callBack: this.re_post_withdraw,
    errorHandler: this.error_post_withdraw
  })
}
root.methods.re_post_withdraw = function (res) {
  console.log("this.res=====",res)
}
root.methods.error_post_withdraw = function (err) {
  console.log("this.err=====",err)
}

//获取用户组等级信息get (query:{})
root.methods.get_group_level = function () {
  this.$http.send('GET_ASSEMBLE_GETMEM', {
    bind: this,
    callBack: this.re_get_group_level,
    errorHandler: this.error_get_group_level
  })
}
root.methods.re_get_group_level = function (res) {
  console.log("this.res=====",res)
}
root.methods.error_get_group_level = function (err) {
  console.log("this.err=====",err)
}

//团员列表get (query:{})
root.methods.get_member_list= function () {
  this.$http.send('GET_QUERYMEMBERLIST', {
    bind: this,
    callBack: this.re_get_member_list,
    errorHandler: this.error_get_member_list
  })
}
root.methods.re_get_member_list = function (res) {
  console.log("this.res=====",res)
}
root.methods.error_get_member_list = function (err) {
  console.log("this.err=====",err)
}

//拼团展示团队详情get (query:{})
root.methods.get_team_details= function () {
  this.$http.send('GET_QUERYSHOWGROUPINFO', {
    bind: this,
    callBack: this.re_get_team_details,
    errorHandler: this.error_get_team_details
  })
}
root.methods.re_get_team_details = function (res) {
  console.log("this.res=====",res)
}
root.methods.error_get_team_details = function (err) {
  console.log("this.err=====",err)
}


export default root
