const root = {}

root.name = 'Notice'


root.data = function () {
	return {

	}
}

root.created = function () {
  this.changeWindow()
}

root.computed = {}

// 判断是否是手机
root.computed.isMobile = function () {
  return this.$store.state.isMobile
}

root.components = {

}

root.methods = {}

root.methods.changeWindow = function () {
  if(this.isMobile === false){
    return
  }
  this.$router.push({name: 'mobileNotice'})

}


export default root
