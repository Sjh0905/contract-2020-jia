// import root from "../../components/fundProducts/js/MobileFundBuy";

const GlobalFunction = {}


GlobalFunction.testFunc = function () {
  console.log('yes!')
}

// this.$globalFunc.CryptoJS.SHA1(email + ':' + password).toString()
import CryptoJS from '../../../static/sha1.min'
import Big from 'big.js'

GlobalFunction.CryptoJS = CryptoJS

GlobalFunction.testEmail = function (src) {
  if(!src) return
  var src = src.trim();
  if (/^[_a-zA-Z0-9-\+]+(\.[_a-zA-Z0-9-]+)*@[a-zA-Z0-9-]+(\.[a-zA-Z0-9]+)*(\.[a-zA-Z]{2,})$/.test(src)) {
    return true
  }
  // if (/^[_a-zA-Z0-9-\\+]+(\.[_a-zA-Z0-9-]+)*@[\.0-9A-z]+((.com)|(.net)|(.com.cn)|(.cn)|(.COM)|(.NET)|(.COM.CN)|(.CN))+$/.test(src)) {
  //   return true [_a-zA-Z\@\.]
  // }
  return false
}

// 去掉输入的所有空格
GlobalFunction.testTrim = function (str) {
  // if (/^(\d{15}$|^\d{18}$|^\d{17}(\d|X|x))$/.test(src)) {
  //   return true
  // }
  // return false
    return str.replace(/\s+/g,"")
}

// 判断身份证号
GlobalFunction.testIdCode = function (src) {
  if (/^(\d{15}$|^\d{18}$|^\d{17}(\d|X|x))$/.test(src)) {
    return true
  }
  return false
}

// 6到16位字母+数字
GlobalFunction.testPsw = function (psw) {
  // if (/^[0-9a-zA-Z]{6,16}$/.test(psw)) return true
  // return false
  return /^(?![A-Z]+$)(?![a-z]+$)(?!\d+$)(?![\W_]+$)\S{8,16}$/.test(psw)
}

//校验登录名：只能输入5-20个以字母开头、可带数字、“_”、“.”的字串
GlobalFunction.testId = function (id) {
  if (/^[a-zA-Z]{1}([a-zA-Z0-9]|[._]){4,19}$/.test(id)) return true
  return false
}

// 判断手机号或者邮箱
GlobalFunction.emailOrMobile = function (src) {
  if (this.testMobile(src)) {
    return 1
  }
  // TODO 正则有点儿问题，进行修改
  // if (/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(src)) {
  //   return 2
  // }
  if (this.testEmail(src)) {
    return 2
  }

  return 0
}
// 判断手机号
GlobalFunction.testMobile = function (mobile) {

  // console.log("testMobile",mobile);
  if(/[_a-zA-Z\@\.\u4E00-\u9FFF]/.test(mobile))return false//如果有特殊字符，非法

  return true

  if (/^\d{11}$/.test(mobile)) return true
  return false
}

// 判断推荐人 0到8位数字
GlobalFunction.testReferee = function (referee) {
  return /^\d{0,8}$/.test(referee)
}

// 判断是否全是数字
GlobalFunction.testNumber = function (number) {
  return /^[0-9]*$/.test(number)
}

// 不允许特殊字符
GlobalFunction.testSpecial = function (src) {
  return /["'<>%;)(&=＜＞％；）（＆＇＂＝]/.test(src)
}

// 只可以中，英，数字
GlobalFunction.testSpecials = function (src) {
  return /^[\u4e00-\u9fa5_a-zA-Z0-9]+$/.test(src)
}

// 检测ACT地址
GlobalFunction.testACTAddress = function (src) {
  return /^ACT([0-9a-zA-Z]{32,33})|([0-9a-zA-Z]{64,65})$/.test(src)
}

// 检测BTC地址
GlobalFunction.testBTCAddress = function (src) {
  return /^[13][0-9a-zA-Z]{30,36}$/.test(src)
}

// 检测OMNI地址
GlobalFunction.testOMNIAddress = function (src) {
  return /^[13][0-9a-zA-Z]{30,36}$/.test(src)
}

// 检测ETH地址
GlobalFunction.testETHAddress = function (src) {
  return /^0x[0-9A-Fa-f]{40}$/.test(src)
}

// 检测EOS地址
GlobalFunction.testEOSAddress = function (src) {
  return /^(?=^[1-5.a-z]{1,12}$)(([1-5a-z]{1,}[.]{1}[1-5a-z]{1,})|([1-5a-z]{1,12}))$/.test(src)
}

// 检测WCG地址
GlobalFunction.testWCGAddress = function (src) {
  return /^WCG-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{5}$/.test(src)
}

// 检测TRX地址
GlobalFunction.testTRXAddress = function (src) {
  return /^T[a-zA-Z0-9]{33}$/.test(src)
}

// 格式化用户名
GlobalFunction.formatUserName = function (src) {
  if(!src) return
  let userNameType = GlobalFunction.emailOrMobile(src)
  // 如果是手机号
  if (userNameType === 1) {
    return `${src.slice(0, 3)}****${src.slice(7, 11)}`
  }
  // 如果是邮箱
  let emailArr = src.split('@')
  let first = emailArr[0]
  first.length > 2 && (first = `${first.slice(0, 2)}****`)
  return `${first}@${emailArr[1]}`
}

// 列表中格式化用户名
GlobalFunction.listFormatUserName = function (src) {
  let userNameType = GlobalFunction.emailOrMobile(src)
  if (userNameType === 1) {
    return `${src.slice(0, 3)}****${src.slice(7, 11)}`
  }
  let nameArr = src.split('@')
  return `${nameArr[0][0]}****${nameArr[0].length === 0 ? '' : nameArr[0].charAt(nameArr[0].length - 1)}@${nameArr[1]}`
}


//格式化时间年-月-日  时：分：秒
GlobalFunction.formatDateUitl = function (time, formatString, offset = 8) {

  var pad0 = function (num, n) {
    var len = num.toString().length;
    while (len < n) {
      num = "0" + num;
      len++;
    }
    return num;
  }


  // time += (3600000 * offset)


  var myDate = new Date(time);

  formatString = formatString.replace('yy', myDate.getYear())
  // console.log()
  formatString = formatString.replace('YYYY', myDate.getFullYear())
  formatString = formatString.replace('MM', pad0(myDate.getMonth() + 1, 2))
  formatString = formatString.replace('DD', pad0(myDate.getDate(), 2))
  formatString = formatString.replace('hh', pad0(myDate.getHours(), 2))
  formatString = formatString.replace('mm', pad0(myDate.getMinutes(), 2))
  formatString = formatString.replace('ss', pad0(myDate.getSeconds(), 2))

  return formatString;
}

//目前仅限用于会员卡到期，比较客户端时间与格林威治标准时间,如果为true，取时间戳，否则取格式化后的时间，time：接口返回的会员卡购买时间
GlobalFunction.comparedWithGreenwichTime = function (time) {
  if(!time)return false

  let d = new Date(time),h = d.getHours(),m = d.getMinutes()
  let totalM = h * 60 + m
  //返回格林威治时间和本地时间之间的时差，以分钟为单位
  let offsetMinute = Math.abs(new Date().getTimezoneOffset())
  return totalM < offsetMinute
}

//倒计时,new Date("2019/03/10 00:00:00").getTime()可以将指定时间转化为时间戳
GlobalFunction.timeCountdown = function (nowTime = 0,beginTime = 0,type = '') {
  let stepTime = beginTime - nowTime;
  if(stepTime <= 0)return 0;

  let stepDay = Math.floor(stepTime/86400000);
  stepTime -= stepDay * 86400000;
  let stepHour = Math.floor(stepTime/3600000);
  stepTime -= stepHour * 3600000;
  let stepMinute = Math.floor(stepTime/60000);
  stepTime -= stepMinute * 60000;
  let stepSecond = Math.floor(stepTime/1000);

  // console.log('stepDay  stepHour  stepMinute  stepSecond ',stepDay,stepHour,  stepMinute , stepSecond);
  stepHour < 10 && (stepHour = "0" + stepHour);
  stepMinute < 10 && (stepMinute = "0" + stepMinute);

  stepSecond < 10 && (stepSecond = "0" + stepSecond);

  if(type == ":h"){
    return stepHour + ":" + stepMinute + ":" + stepSecond
  }

  return stepDay + "天" + stepHour + "时" + stepMinute + "分" + stepSecond + "秒"
}

// 合并对象，保留original里的值
GlobalFunction.mergeObj = function (originalObj, targetObj) {
  if (!targetObj) {
    return originalObj
  }
  return Object.assign(targetObj, originalObj)
}

// 处理精度
GlobalFunction.formatPrice = function () {

}

// 处理市场数据，币种没有对BTC的，根据ETH转换过来
GlobalFunction.handlePrice = function (currency, initData) {
  let currencyArr = [...currency.values()]
  let ETH_BTC = initData['ETH_BTC']
  if (!ETH_BTC) return
  for (let i = 0; i < currencyArr.length; i++) {
    let currentCurrency = currencyArr[i].currency
    if (currentCurrency == 'BTC') continue
    // currentCurrency == 'BTC' && console.warn('this is currentCurrency', currentCurrency)
    let BTCSymbol = currentCurrency + '_' + 'BTC'
    let BTCObj = initData[BTCSymbol]
    // currentCurrency == 'BTC' && console.warn('this is BTC',BTCObj,BTCSymbol)
    // currentCurrency == 'BTC' && console.warn('this is currentCurrency', currentCurrency)

    if (BTCObj) continue
    let reversalObj = initData['BTC' + '_' + currentCurrency]
    if (reversalObj) {
      initData[BTCSymbol] = [
        reversalObj[0],
        reversalObj[1] ? GlobalFunction.accDiv(1, reversalObj[1]) : 0,
        reversalObj[2] ? GlobalFunction.accDiv(1, reversalObj[2]) : 0,
        reversalObj[3] ? GlobalFunction.accDiv(1, reversalObj[3]) : 0,
        reversalObj[4] ? GlobalFunction.accDiv(1, reversalObj[4]) : 0,
        0,
      ]
      continue
    }

    let ETHSymbol = currentCurrency + '_' + 'ETH'
    let ETHObj = initData[ETHSymbol]
    // console.warn('this is ETH',ETHObj,ETHSymbol)
    if (!ETHObj) {
      let reversalETHObj = initData['ETH_' + currentCurrency]
      if (!reversalETHObj) {
        continue
      }
      ETHObj = [
        reversalETHObj[0],
        reversalETHObj[1] ? GlobalFunction.accDiv(1, reversalETHObj[1]) : 0,
        reversalETHObj[2] ? GlobalFunction.accDiv(1, reversalETHObj[2]) : 0,
        reversalETHObj[3] ? GlobalFunction.accDiv(1, reversalETHObj[3]) : 0,
        reversalETHObj[4] ? GlobalFunction.accDiv(1, reversalETHObj[4]) : 0,
        0,
      ]
    }

    initData[BTCSymbol] = [
      ETHObj[0],
      GlobalFunction.accMul(ETHObj[1], ETH_BTC[1]),
      GlobalFunction.accMul(ETHObj[2], ETH_BTC[2]),
      GlobalFunction.accMul(ETHObj[3], ETH_BTC[3]),
      GlobalFunction.accMul(ETHObj[4], ETH_BTC[4]),
      0,
    ]
  }
}

// 精度处理不保留四舍五入，只舍弃，不进位
GlobalFunction.accFixed = function (num, acc) {
  // console.warn('isNaN(num)',isNaN(num))
  if (isNaN(num)) return (0).toFixed(acc)
  let number = Number(GlobalFunction.accDiv(Math.floor(GlobalFunction.accMul(num, Math.pow(10, acc))), Math.pow(10, acc)))
  return number.toFixed(acc)
}

// 精度处理保留进位，只要大于0就进位
GlobalFunction.accFixedCny = function (num, acc) {
  // console.warn('isNaN(num)',isNaN(num))
  if (isNaN(num)) return (0).toFixed(acc)
  let number = Number(GlobalFunction.accDiv(Math.ceil(GlobalFunction.accMul(num, Math.pow(10, acc))), Math.pow(10, acc)))
  return number.toFixed(acc)
}


// 新的Math Floor方法
GlobalFunction.newFixed = function (num, acc = 8) {
  if (isNaN(num)) return 0
  // 检测科学计数法
  // let reg = /^(\d+)(e)([\-]?\d+)$/
  let reg = /^[\-]?(\d+)?[\.]?(\d+)(e)([\-]?\d+)$/
  let numString = new Big(num).toString()

  // 如果是科学计数法，用原方法
  if (reg.test(numString)) {
    let number = Number(GlobalFunction.accDiv(Math.floor(GlobalFunction.accMul(num, Math.pow(10, acc))), Math.pow(10, acc)))
    return number.toFixed(acc)
  }
  // 如果不是科学计数法
  let numArr = numString.split('.')

  if (acc <= 0) {
    return numArr[0]
  }

  let ansArr = []
  ansArr[0] = numArr[0]
  ansArr[1] = '.'
  ansArr[2] = ''
  for (let i = 0; i < acc; i++) {
    if (!numArr[1] || !numArr[1][i]) {
      ansArr[2] += '0'
      continue
    }
    ansArr[2] += numArr[1][i]
  }
  return ansArr.join('')
}

// 新的Math Floor 用狗代码的写法，出了bug不负责
GlobalFunction.testFixed = function (num, acc = 8) {
  let numArr, numString, reg = /^(\d+)?[\.]?(\d+)(e)([\-]?\d+)$/
  return isNaN(num) ? (0).toFixed(acc) :
    (
      reg.test(numString = new Big(num).toString())
      &&
      Number(GlobalFunction.accDiv(Math.floor(GlobalFunction.accMul(num, Math.pow(10, acc))), Math.pow(10, acc))).toFixed(acc)
      ||
      (
        (numArr = numString.split('.')) &&
        (
          acc <= 0 && numArr[0] ||
          [numArr[0], '.', numArr[1].substring(0, acc) + new Array(Math.max(0, acc - numArr[1].length + 1)).join('0')].join('')
        )
      )
    )
}


/**
 * 精度加法运算
 * 使用big.js
 */
GlobalFunction.accAdd = function (arg1, arg2) {
  isNaN(arg1) && (arg1=0);isNaN(arg2) && (arg2=0)
  let num1 = new Big(arg1 || 0)
  let num2 = new Big(arg2 || 0)
  return num1.plus(num2).toString()
}

/**
 * 精度减法运算
 * 使用big.js
 */
GlobalFunction.accMinus = function (arg1, arg2) {
  isNaN(arg1) && (arg1=0);isNaN(arg2) && (arg2=0)
  let num1 = new Big(arg1 || 0)
  let num2 = new Big(arg2 || 0)
  return num1.minus(num2).toString()
}

/**
 * 精度除法运算
 * 使用big.js
 */
GlobalFunction.accDiv = function (arg1, arg2) {
  isNaN(arg1) && (arg1=0);isNaN(arg2) && (arg2=1)
  if(!Number(arg2) || Number(arg2) == 0)return 0

  let num1 = new Big(arg1)
  let num2 = new Big(arg2)
  return num1.div(num2).toString()
}

/**
 * 精度乘法运算
 * 使用big.js
 */
GlobalFunction.accMul = function (arg1, arg2) {
  isNaN(arg1) && (arg1=0);isNaN(arg2) && (arg2=0)
  let num1 = new Big(arg1 || 0)
  let num2 = new Big(arg2 || 0)
  return num1.mul(num2).toString()
}

/**
 * 链式计算以及精度截取
 * @returns {chainFactory}
 * 使用demo如下:
 * let chainCal = this.$globalFunc.chainCal
 * let res1 = chainCal().accAdd(1200.999,200.009).accMinus(200).accMul(2).getResult();
 * let res11 = chainCal().accAdd(1200.999,200.009).accMinus(200).accMul(2).proFixed(2).getResult();
 * let res2 = chainCal().accMinus(1200,200).accMinus(200).accMul(2).getResult();
 * let res3 = chainCal().accMul(120,2).accMinus(200).accMul(2).accDiv(10).getResult();
 * let res4 = chainCal().accDiv(120,2).accMinus(20).accMul(6).accAdd(2).getResult();
 */

//2020-09-17 瓜哥神笔计算链式调用及精度截取
GlobalFunction.chainCal = function () {

  let self = GlobalFunction;
  let chainFactory = function () {}

  chainFactory.result = 0;//用于存储每步计算结果，如果不继续计算，取result的值即最后结果
  chainFactory.getResult = function () {
    return this.result || 0;
  }
  chainFactory.getParas = function (paras) {
    if(paras.length == 2)return [paras[0] || 0,paras[1] || 0]
    return [this.result || 0,paras[0] || 0];
  }
  chainFactory.accAdd = function (...paras) {

    let [num1,num2] = this.getParas(paras)
    this.result = self.accAdd(num1, num2)
    return this;
  }
  chainFactory.accMinus = function (...paras) {

    let [num1,num2] = this.getParas(paras)
    this.result = self.accMinus(num1, num2)
    return this;
  }
  chainFactory.accMul = function (...paras) {

    let [num1,num2] = this.getParas(paras)
    this.result = self.accMul(num1, num2)
    return this;
  }
  chainFactory.accDiv = function (...paras) {

    let [num1,num2] = this.getParas(paras)
    if(!Number(num2)){
      num2 = 1;//由于num2是除数，容错值是1
      console.error('you have entered an illegal divisor!');
    }
    this.result = self.accDiv(num1, num2)
    return this;
  }

  //精度处理不保留四舍五入，只舍弃，不进位，其实是向下取整，为负数时结果绝对值会加1
  chainFactory.accFixed = function (acc = 8) {
    this.result = self.accFixed(this.result, acc)
    return this;
  }
  //新的Math Floor方法，可处理科学计数法
  chainFactory.newFixed = function (acc = 8) {
    this.result = self.newFixed(this.result, acc)
    return this;
  }
  //Number.prototype.toFixed()，可四舍五入
  chainFactory.proFixed = function (acc = 2) {
    this.result = Number(this.result).toFixed(acc)
    return this;
  }

  return chainFactory;
}

/**
 * 修改小数为百分数
 */

GlobalFunction.changeNumPercent = function (num) {
  let numBig = new Big(num)
  let numPercent = numBig.mul(100).toString()
  return numPercent
}

/**
 * BT请求百分数
 */
GlobalFunction.getBTRegulationConfig = function (that, callback) {
  that.$http.send('GET_BT_REGULATION_CONFIG', {
    callBack: (data) => {
      typeof data === 'string' && (data = JSON.parse(data));

      data.reward = GlobalFunction.accFixed(GlobalFunction.changeNumPercent(data.reward), 0);

      data.activity = GlobalFunction.accFixed(GlobalFunction.changeNumPercent(data.activity), 0);

      that.$store.commit('SET_BT_REWARD', data.reward);
      that.$store.commit('SET_BT_ACTIVITY', data.activity);
      callback && callback(data)
    },
    errorHandler: (err) => {

    }
  })
}

// 请求用户认证状态
GlobalFunction.getAuthState = function (that, callback) {
  return that.$http.send('GET_AUTH_STATE', {
    callBack: (data) => {
      typeof data === 'string' && (data = JSON.parse(data));
      that.$store.commit('SET_AUTH_STATE', data.dataMap)
      callback && callback(data)
    }
  })
}

// 数组新增且去重
GlobalFunction.addArray = function (item, arr) {
  if (!Array.isArray(arr)) return []
  arr.push(item)
  return [...new Set(arr)]
}

// 数组删除且去重
GlobalFunction.removeArray = function (item, arr) {
  if (!Array.isArray(arr)) return []
  let newSet = new Set(arr)
  newSet.delete(item)
  return [...newSet]
}

//转化到只有字母,默认全大写，如果传第二个参数则为全小写
GlobalFunction.toOnlyCapitalLetters = function (text,isLowerCase) {
  let textTemp = text.replace(/[^A-Z]/g,'')

  if(isLowerCase)return textTemp.toLowerCase()

  return textTemp
}

//合约订单方向
GlobalFunction.getOrderSide = function (positionSide,side) {

  let orderSideMap = {
    "SHORT":{
      "BUY":"平空",
      "SELL":"开空"
    },
    "LONG":{
      "BUY":"开多",
      "SELL":"平多"
    },
    "BOTH":{
      "BUY":"买入",
      "SELL":"卖出"
    }
  }

  //国际化时可以返回变量字符串
  // orderSideMap = {
  //   "SHORT":{
  //     "SELL":"sale",
  //     "BUY":"sale"
  //   },
  //   "LONG":{
  //     "BUY":"sale",
  //     "SELL":"sale"
  //   },
  //   "BOTH":{
  //     "SELL":"sale",
  //     "BUY":"sale"
  //   }
  // }

  return orderSideMap[positionSide] && orderSideMap[positionSide][side] || ""
}


// // 格式化时间
// root.methods.formatDateUitl = function (time) {
//   return this.$globalFunc.formatDateUitl(time, 'YYYY-MM-DD hh:mm:ss')
// }
export default GlobalFunction
