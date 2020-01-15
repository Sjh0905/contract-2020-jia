const root = {}
root.name = 'RegisterTopBar'
root.props = {}
root.props.type = {
  type: String,
  default: '1'
}
root.props.title = {
  type: String,
  default: '欢迎注册'
}
root.props.promptText = {
  type: String,
  default: '已经注册'
}
root.props.toDoText = {
  type: String,
  default: '立即登录'
}
root.props.warningText = {
  type: String,
  default: '重置登录密码后24小时内禁止提币'
}
root.props.toFunc = {
  type: Function,
  default: ()=>_
}
root.props.toRouter = {
  type: String,
  default: '/index/sign/login'
}
/*------------------------------ data -------------------------------*/
root.data = function () {
  return {

    // type:'1',// 1-需要有操作按钮 2-只有提示信息
    // title:'欢迎注册',
    // promptText:'已经注册',
    // toDoText:'立即登录',
    // warningText:'重置登录密码后24小时内禁止提币'

  }
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
export default root
