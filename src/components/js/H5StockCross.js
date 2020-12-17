const root = {}
root.name = 'H5StockCross'
root.components = {
  'Loading': resolve => require(['../vue/Loading'], resolve), // loading
}

root.methods = {}

root.props = {}
root.props.buy_sale_list = {
  type: Object,
  default: {}
}
root.props.socket_snap_shot = {
  type: Object,
  default: {}
}
root.props.socket_tick = {
  type: Object,
  default: {}
}
root.props.isNowPrice = {
  type: String,
  default: '0'
}
root.props.markPrice = {
  type: String,
  default: '0'
}
root.props.direction = {
  type: String,
  default: 'txt-white'
}

root.props.trade_loading = {
  type: Boolean,
  default: true
}
root.props.setTransactionPrice = {
  type: Function,
  default:()=>{}
}

root.data = function () {
  return {
    // direction: '',
    // isPriceNow: '- -',
    baseScale: 0,
    quoteScale: 0,
    optionQuote:4,
    value: '',

    type: 3,
    lastUpdateId:0,
    // orderDepthList : {},

    sellOrders:[],

    buyOrders:[],
    buy_sale_list_temp:{},
    dMaxTotalAmount:10000,//防止切换币对时深度背景铺满整条，分母默认值大一些
    totalAmountArr:[],//[<lastUpdateId>,<totalAmount>]
    // sellTotalAmountArr:[],
  }
}

root.created = function () {
  // 获取小数位
  this.getScaleConfig();

  this.buy_sale_list_temp = Object.assign(this.buy_sale_list,{})

}

root.computed = {}

root.computed.symbol = function () {
  return this.$store.state.symbol;
}

root.computed.price=function(){
  return this.$globalFunc.accFixed(this.isPriceNow, this.quoteScale)
}

root.watch = {};
root.watch.buy_sale_list = function () {
  this.buy_sale_list_temp = Object.assign(this.buy_sale_list,{})
  this.getOrderDepthList();
};
root.watch.socket_snap_shot = function () {
  this.getOrderDepthList();
};

root.watch.symbol = function (newValue, oldValue) {
  if (newValue == oldValue) return;
  this.getScaleConfig();
}
// root.watch.lastUpdateId = function (newValue, oldValue){
//   // if(newValue != oldValue){//为了保证socket不推送时也能执行，屏蔽这行
//   this.setDMaxTotalAmount([this.lastUpdateId,this.totalAmount]);
//   // console.log('StockCrossItems totalAmount is success watch',this.totalAmount);
//   // }
// }
//设置买卖盘累计最大值
root.methods.setDMaxTotalAmount = function (arr) {
  if(arr[0] == this.totalAmountArr[0]){
    this.dMaxTotalAmount = Math.max(this.totalAmountArr[1],arr[1]) || 10000
    this.totalAmountArr = []
    return
  }
  this.totalAmountArr = arr
}
root.methods.getOrderDepthList = function () {
  let asks = this.buy_sale_list_temp.a || []
  let bids = this.buy_sale_list_temp.b || []
  this.lastUpdateId = this.lastUpdateId == 0 && this.buy_sale_list_temp.lastUpdateId || 0

  let socketAsks = this.socket_snap_shot.a || [];
  let socketBids = this.socket_snap_shot.b || [];
  // console.log('StockCross buyOrders',JSON.stringify(socketBids));

  // let asks = [[102,2], [103,3], [110,0], [104,4]]
  // let socketAsks = [[101,1], [103,0], [110,10], [105,5]]

  let asksTemp = [],bidsTemp = []

  //卖单
  for (let i = 0; i < socketAsks.length; i++) {
    let sAItem = socketAsks[i];
    if(!sAItem)continue

    for (let j = 0; j < asks.length; j++) {
      let aItem = asks[j];
      if(!aItem)continue

      //如果socket推过来的是之前没出现的价格，做好缓存
      if (j == asks.length - 1 && sAItem[0] != aItem[0]  && sAItem[1] > 0){
        asksTemp.push(sAItem)
      }

      //如果价格一致
      if(sAItem[0] == aItem[0]){
        //如果最新数量是0
        if(sAItem[1] == 0){
          asks.splice(j,1)
          j--;
          break;
        }
        //如果数量大于0,socket推送的值直接赋值
        aItem[1] = sAItem[1]
        break;
      }
    }
  }

  if(asks.length == 0){
    asksTemp = socketAsks.filter(v=>v[1] > 0) || []
  }

  //买单
  for (let h = 0; h < socketBids.length; h++) {
    let bAItem = socketBids[h];
    if(!bAItem)continue

    for (let k = 0; k < bids.length; k++) {
      let bItem = bids[k];
      if(!bItem)continue

      //如果socket推过来的是之前没出现的价格，做好缓存
      if (k == bids.length - 1 && bAItem[0] != bItem[0]  && bAItem[1] > 0){
        bidsTemp.push(bAItem)
      }

      //如果价格一致
      if(bAItem[0] == bItem[0]){
        //如果最新数量是0
        if(bAItem[1] == 0){
          bids.splice(k,1)
          k--;
          break;
        }
        //如果数量大于0,socket推送的值直接赋值
        bItem[1] = bAItem[1]
        break;
      }
    }
  }

  if(bids.length == 0){
    bidsTemp = socketBids.filter(v=>v[1] > 0) || []
  }

  let asksList = asks.concat(asksTemp).sort((a,b) => a[0] - b[0]);
  let bidsList = bids.concat(bidsTemp).sort((a,b) => b[0] - a[0]);
  // console.log('StockCross asksList',asksList);
  // console.log('StockCross buyOrders',JSON.stringify(bidsList));

  this.sellOrders = this.handleOrders(asksList,this.socket_snap_shot.U);
  this.buyOrders = this.handleOrders(bidsList,this.socket_snap_shot.U)

  // console.info('最优价格===',{bidPrice:Number(this.buyOrders[0][0]),askPrice:Number(this.sellOrders[0][0])})
  this.$store.commit('CHANGE_ORDER_BOOK_TICKER',{bidPrice:Number(this.buyOrders[0].price),askPrice:Number(this.sellOrders[0].price)})


  this.lastUpdateId = this.socket_snap_shot.U
  let obj = {a:asksList,b:bidsList,lastUpdateId:this.socket_snap_shot.U}
  this.buy_sale_list_temp = obj;
  // console.log('StockCross orderDepthList',obj) ;
  // return obj

}

root.methods.handleOrders = function (transactionData = [],lastUpdateId) {

  // let depth;
  // this.type < 3 ? (depth = this.transactionData.slice(0,32)) : (depth = this.transactionData.slice(0, 16))

  let depthLength = 6;
  let depth = transactionData.slice(0,depthLength)
  let lengthStep = depthLength - depth.length;

  let list2 = [];
  let totalAmount = depth.reduce((pre,curr)=> {
    let currPrice = (curr && Number(curr[1]) || 0)
    curr.perAmount= this.accAdd(currPrice,pre)
    list2.push({
      price: curr[0],
      amount: curr[1],
      is_select: false,
      perAmount:curr.perAmount
    })
    return curr.perAmount
  },0);

  let arrStep = Array(lengthStep).fill({is_select: false,amount:'-',perAmount:'-',price:'-'})
  list2 = [...list2,...arrStep]

  this.setDMaxTotalAmount([lastUpdateId,totalAmount]);
  this.totalAmount = totalAmount;
  // this.hide_now_price([this.lastUpdateId,totalAmount])

  this.$store.commit('SET_DEPTH_MAX_TOTAL_AMOUNT', totalAmount)

  // console.log('this is lastUpdateId',this.transactionType,this.lastUpdateId)
  // console.log('this is depth_list',JSON.stringify(list2))
  return list2 instanceof Array ? list2 : [];
}


root.methods.computerdPrice = function (v){
  this.optionQuote = v
  // console.log('this.optionQuote=====',this.optionQuote)
}


root.methods.excuteList = function(){
  this.buyOrders.forEach(v=>Number(v.price).toFixed(2))
  // console.log('this.buyOrders==============',this.buyOrders)
  return  this.buyOrders
}



// 获取小数点位数
root.methods.getScaleConfig =  function () {
  this.$store.state.quoteConfig.forEach(
    v => {
      v.name === this.$store.state.symbol && (this.baseScale = v.baseScale , this.quoteScale = v.quoteScale)
    }
  )
}

/*---------------------- 加法运算 begin ---------------------*/
root.methods.accAdd = function (num1, num2) {
  return this.$globalFunc.accAdd(num1, num2)
}


export default root
