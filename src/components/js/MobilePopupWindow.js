const root = {}
root.name = 'MobilePopupWindow'
// 此组件需要一个 v-on:close
/*---------------------- 属性 ---------------------*/
root.props = {}

root.props.switch = {
	type: Boolean,
	default: false
}
root.props.close = {
	type: Function
}

/*---------------------- data ---------------------*/

root.data = function () {
	return {}
}
root.computed = {}
root.computed.show = function () {
	return this.switch
}

/*---------------------- 方法 ---------------------*/

root.methods = {}



root.methods.yesClick = function () {
	this.$eventBus.notify({key: 'CANCEL_ALL'})

}
root.methods.closeClick = function () {
	this.$emit('close')
}



export default root
