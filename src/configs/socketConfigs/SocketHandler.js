import wsServer from './SocketServer'
import Vue from 'vue'
const STREAMNAMEARR = ['aggTrade','depth','markPrice','miniTicker']

export default class {
  constructor() {
    this.symbol = '';
    this.socket = null;
    this.onMap = new Map()
    this.socketInterval = null
    // this.init()  //初始化ocket,由于在PreHandler里边对默认symbol做了处理,所以去main.js调用此函数做初始化操作
  }

  test() {}

  init(symbol) {
    symbol && (this.symbol = symbol)

    if (this.socket) {
      return;
    }
    this.socket = new WebSocket(wsServer.send.url);

    /*-----------------------------------------*/
    //初始化socket后需要执行func1或func2,二者不能混写
    //------------------func1------------------//

    this.socket.onopen = ()=> {//这里必须写箭头函数，否则作用域出错
      this.socketInterval = null;//清空定时器
      // this.socket.send(JSON.stringify({
      //   method: 'SUBSCRIBE',
      //   symbol: symbol || this.symbol
      // }));
      // this.emit('subscribe', {symbol:symbol});
      this.emit('SUBSCRIBE', ["btcusdt@depth","btcusdt@aggTrade","btcusdt@kline_15m","btcusdt@markPrice"]);
    }

    //------------------func2------------------//
    // this.emit('subscribe', {symbol:symbol});
    /*-----------------------------------------*/


    this.socket.onmessage = (event)=>{
      // console.log("this.data = 服务端返回 ========"+event.data);
      var data = JSON.parse(event.data);
      if (Object.prototype.toString.call(data) == "[object Object]") {
        // console.log("this.data= callBack ========",data);
        var stream = data.stream || '',
            message = data.data,
            streamKey = STREAMNAMEARR.find(v=>stream.indexOf(v)>-1);

        this.onMap.forEach(function(keyMap,key){
          let funcArr = keyMap.get(streamKey);
          funcArr && funcArr.map(function(callBack){
            // console.log('funcArr ========',callBack);
            callBack(message);
          });
          // console.log('this.onMap========',value);
        });

        // if (topic === 'topic_snapshot') {
        // } else if (topic === 'topic_bar') {
        // } else if (topic === 'topic_prices') {
        // } else if (topic === 'topic_tick') {
        // } else if (topic === 'topic_order') {
        // }
      }
    }

    this.socket.onclose = (event)=>{
      console.log('web socket disconnected.');
      this.close();
      if(!this.socketInterval)this.socketInterval = setInterval(()=>{
        this.init();
      }, 5000);//断开后自动重连
    }

    this.socket.onerror = (event)=>{
      console.log('web socket error.');
      this.close();
      if(!this.socketInterval)this.socketInterval = setInterval(()=>{
        this.init();
      }, 5000);//断开后自动重连
    }

    // function test() {
    //   console.warn("测试取消绑定同一个函数")
    // }
   // this.io.on('connect', function () {
   //    console.warn('socket顺利连接！')
   //  })
    // this.io.on('connect_error', function () {
    //   console.warn('连接出错')
    // })
    // this.io.on('disconnect', function (reason) {
    //   console.warn(reason)
    // })
    // this.io.on('reconnect',function(attempt){
    //   console.warn("尝试重连！",attempt)
    // })
  }

  /**
   * 打开，重新连接
   */
  open() {
    // this.io.open()
  }

  /**
   * 连接，作用和open一样
   */
  connect() {
    // this.io.connect()
  }

  /**
   * 触发一个message事件，相当于emit('message')
   * @param params    一堆参数，最后一个参数可以是callback，参数为socket服务端返回的值
   */
  send(...params) {
    // this.io.send(...params)
  }

  /**
   * 触发一个自定义事件
   * @param method     字符串，事件名称
   * @param params  币对名称
   */
  emit(method, params) {

    //存储当期币对
    this.symbol = params && params.symbol || '';
    // if (this.socket.readyState===1 && params && params.symbol) {
      this.socket.send(JSON.stringify({
        id:1,
        method,
        params
      }));
    // }
  }

  /**
   * 监听一个（自定义）事件
   * @param key   字符串，事件名称
   * @param callBack  函数，参数是socket服务端返回的值
   */
  on({key, bind, callBack}) {

    if (bind instanceof Vue === false) {
      console.log("参数使用错误，必须有bind参数，且bind为Vue实例，一般为this")
    }
    // 记录绑定的函数
    let keyMap = this.onMap.get(bind)
    !keyMap && this.onMap.set(bind, keyMap = new Map())//以Vue实例为键值创建对象，
    let funcArr = keyMap.get(key)
    !funcArr && keyMap.set(key, funcArr = [])//keyMap存放的是绑定的回调函数
    funcArr.push(callBack)
    // console.log("keyMap---------------"+JSON.stringify(keyMap));

    // this.io.on(key, callBack)

    // console.log("key---------------"+key);
    // this.socket.send(key)
    // this.socket.onmessage = (event)=> {
    //   this.data = '服务端返回：' + event.data;
    //   console.log("this.data3333333333333========="+this.data);
    //   // callBack(event.data)
    // }


  }

  /**
   * 取消监听 TODO：后续优化
   * @param key 字符串，事件名称
   * @param callBack  函数
   */
  off({key, bind, callBack}) {
    return
    // 如果没有写bind，则表示取消绑定一个函数
    if (bind instanceof Vue === false) {
      // this.io.off(key, callBack)
      // this.closeWebSocket();
    }

    // 如果写了bind，则表示把此组件的on取消掉
    if (bind instanceof Vue === true) {
      let keyMap = this.onMap.get(bind)
      // 如果没有绑定，退出即可
      if (!keyMap) return
      keyMap.forEach((value, keys) => {
        if (!value) return
        value.forEach((value) => {
          // this.io.off(keys, value)
          // this.closeWebSocket();
        })
      })
      this.onMap.delete(bind)
    }
  }

  /**
   * 只监听一次事件
   * @param key   字符串，事件名称
   * @param callBack    函数，参数是socket服务端返回的值
   */
  once(key, callBack) {
    // this.io.once(key, callBack)

  }

  /**
   * 主动关闭socket
   */
  close() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }

  /**
   * 主动关闭socket，和close一致
   */
  disconnect() {
    // this.io.disconnect()
  }

  /*initWebSocket() {
    //连接错误
    this.socket.onerror = this.setErrorMessage

    // //连接成功
    this.socket.onopen = this.setOnopenMessage

    //收到消息的回调
    this.socket.onmessage = this.setOnmessageMessage

    //连接关闭的回调
    this.socket.onclose = this.setOncloseMessage

    //监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常。
    window.onbeforeunload = this.onbeforeunload
  }
  setErrorMessage() {
    this.data = "WebSocket连接发生错误" + '   状态码：' + this.socket.readyState;
    console.log("this.data1111111111111========="+this.data);
  }
  setOnopenMessage() {
    this.data = "WebSocket连接成功" + '   状态码：' + this.socket.readyState;
    console.log("this.data2222222222222222========="+this.data);
  }
  setOnmessageMessage(event,callBack) {
    this.data = '服务端返回 setOnmessageMessage：' + event.data;
    console.log("this.data= callBack ==="+callBack+"====="+this.data);
  }
  setOncloseMessage() {
    this.data = "WebSocket连接关闭" + '   状态码：' + this.socket.readyState;
    console.log("this.data44444444444========="+this.data);
  }
  onbeforeunload() {
    this.closeWebSocket();
  }
  //websocket发送消息
  send() {
    this.socket.send(this.text)
    this.text = ''
  }
  closeWebSocket() {
    this.socket.close()
  }*/



}
