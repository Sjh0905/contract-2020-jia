const root = {};

root.name = 'HelpProblem'

root.data = function () {
	return {
		list: []
	}
}

root.created = function () {
	this.getHelpList();
}

root.methods = {}
root.methods.getHelpList = function () {
	// this.$http.send('', {
	// 	bind: this,
	// 	callback: this.displayList
	// });
}

root.methods.displayList = function (data) {
	
}


export default root;