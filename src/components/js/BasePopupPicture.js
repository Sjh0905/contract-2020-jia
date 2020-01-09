const root = {}
root.name = 'BasePopupPicture'


/*---------------------- 属性 ---------------------*/
root.props = {}

root.props.open = {
  type: Boolean,
  default: false
}
root.props.close = {
  type: Function
}

root.props.closeCountDown = {
  type: [Number,String]
}

root.props.pop_width = {
  type: Boolean,
  default: false
}

/*---------------------- data ---------------------*/

root.data = function () {
  return {
    countDown: 0,
    countDownInterval: null
  }
}

root.computed = {}
root.computed.show = function () {
  return this.open
}


/*---------------------- 生命周期 ---------------------*/
root.created = function () {
  this.beginCountDown()
}
root.beforeDestroy = function () {
  this.endCountDown()
}
/*---------------------- 方法 ---------------------*/

root.methods = {}

// 开始倒计时
root.methods.beginCountDown = function () {
  this.countDown = this.closeCountDown
  this.countDownInterval && clearInterval(this.countDownInterval)
  this.countDownInterval = setInterval(() => {
    this.countDown--
    if (this.countDown <= 0) {
      this.countDownInterval && clearInterval(this.countDownInterval)
    }
  }, 1000)
}
// 结束倒计时
root.methods.endCountDown = function () {
  this.countDownInterval && clearInterval(this.countDownInterval)
}


root.methods.closeClick = function () {
  this.close && this.close()
}


export default root
