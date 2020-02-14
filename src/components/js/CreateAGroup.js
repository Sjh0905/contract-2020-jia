const root = {}
root.name = 'CreateAGroup'
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

//创建拼团post(params:{})
root.methods.post_create_a_group = function () {
  this.$http.send('POST_ASSEMBLE_CREATEGROUP', {
    bind: this,
    params:{},
    callBack: this.re_post_create_a_group,
    errorHandler: this.error_post_create_a_group
  })
}
root.methods.re_post_create_a_group = function (res) {
  console.log("this.res=====",res)
}
root.methods.error_post_create_a_group = function (err) {
  console.log("this.err=====",err)
}

//检查团名是否可用get (query:{})
root.methods.get_name_available = function () {
  this.$http.send('GET_ASSEMBLE_ISEXISTGNAME', {
    bind: this,
    callBack: this.re_get_name_available,
    errorHandler: this.error_get_name_available
  })
}
root.methods.re_get_name_available = function (res) {
  console.log("this.res=====",res)
}
root.methods.error_get_name_available = function (err) {
  console.log("this.err=====",err)
}


//跳创建好拼团的页面
root.methods.createGroupType = function () {
  this.$router.push({name: 'detailsOfTheGroup'})
}
export default root
