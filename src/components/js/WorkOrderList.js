const root = {}

root.name = 'WorkOrderList'

root.data = function () {
  return {
    orderlist: [],
    status: {1: "已提交", 5: "待申领", 10: "受理中", 20: "已完结"}
  }
}

root.created = function () {
  this.getOrderList()
}

root.methods = {}

root.methods.getOrderList = function () {
  this.$http.send('WORKORDER_LIST', {
    bind: this,
    callBack: this.RE_WORKORDER_LIST,
    errorHandler: this.error_getOrderList,
  })
}
root.methods.RE_WORKORDER_LIST = function (data) {
  typeof (data) === 'string' && (data = JSON.parse(data));
  let list = JSON.parse(data.message);
  if (!!list && list.length > 0) {
    this.orderlist = list;
  }
  console.log("********", this.orderlist)
}
root.methods.error_getOrderList = function (err) {
  console.warn('this is err', err)
}

export default root;
