const root = {};

root.name = "whiteList";

root.data = function () {
	return {

	}
}

root.computed = {};
root.computed.lang = function () {
	return this.$store.state.lang;
}

root.created = function () {

}


export default root;