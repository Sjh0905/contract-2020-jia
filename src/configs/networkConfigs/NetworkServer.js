const server = {}


server.send = {}
server.send.baseURL = ''
// server.send.baseURL = 'http://192.168.2.70/'
// server.send.baseURL = 'http://192.168.2.161/'
server.send.timeout = 15000
server.send.headers = {'X-Requested-With': 'XMLHttpRequest'}


// server.env = 'dev'   // 开发环境
// server.env = ''  // 生产环境
server.env = ''


// websocket配置
server.socket = {}
// socket请求地址
// server.socket.url = 'ws://192.168.2.117:3000' //欧地址
// server.socket.url = 'ws://192.168.2.115:3000' //测试地址
// wss://onli-quotation.2020.exchange
// server.socket.url = process.env.SOCKET || 'wss://wss.highdax.com' //node地址
// server.socket.url = process.env.SOCKET || 'wss://wss.eunex.group/v1/market/notification' //后台socket（java）地址
// server.socket.url = process.env.SOCKET || 'wss://wss.2020.exchange/v1/market/notification' //生产后台socket（java）地址
server.socket.url = process.env.SOCKET || 'wss://fstream.yshyqxx.com/stream' //binance 合约国内生产地址

server.socket.path = '/v1/market' //请求路径
server.socket.transports = ['websocket'] //请求类型


export default server
