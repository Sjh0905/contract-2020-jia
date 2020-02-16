const root = {}
root.name = 'JoinAGroup'
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

//查询组详情get (query:{})
root.methods.get_check_group_details= function () {
  this.$http.send('GET_QUERYGROUPINFO', {
    bind: this,
    callBack: this.re_get_check_group_details,
    errorHandler: this.error_get_check_group_details
  })
}
root.methods.re_get_check_group_details = function (res) {
  console.log("this.res=====",res)
}
root.methods.error_get_check_group_details = function (err) {
  console.log("this.err=====",err)
}

//加入拼团post(params:{})
root.methods.post_join_group = function () {
  this.$http.send('POST_ASSEMBLE_JOINGROUP', {
    bind: this,
    params:{},
    callBack: this.re_post_join_group,
    errorHandler: this.error_post_join_group
  })
}
root.methods.re_post_join_group = function (res) {
  console.log("this.res=====",res)
}
root.methods.error_post_join_group = function (err) {
  console.log("this.err=====",err)
}

//模糊查询可加入小组get (query:{})
root.methods.get_fuzzy_query= function () {
  this.$http.send('GET_QUERYGROUPLIST', {
    bind: this,
    callBack: this.re_get_fuzzy_querys,
    errorHandler: this.error_get_fuzzy_query
  })
}
root.methods.re_get_fuzzy_querys = function (res) {
  console.log("this.res=====",res)
}
root.methods.error_get_fuzzy_query = function (err) {
  console.log("this.err=====",err)
}


root.methods.createGroupType = function () {
  this.$router.push({name: 'detailsOfTheGroup'})
}
export default root
