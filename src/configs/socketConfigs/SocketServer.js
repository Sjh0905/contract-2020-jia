import NetworkServer from '../networkConfigs/NetworkServer'

const Configs = {}

Configs.send = {}

Configs.send.url = NetworkServer.socket.url

Configs.send.options = {}
Configs.send.options.path = NetworkServer.socket.path || '/v1/market'  //请求路径
Configs.send.options.transports = NetworkServer.socket.transports || ['websocket'] //请求


Configs.send.options.reconnection = true //是否自动重新连接
Configs.send.options.reconnectionAttempts = 100 //重新连接尝试次数
Configs.send.options.reconnectionDelayMax = 3000 //重新连接之间最长等待时间
Configs.send.options.timeout = 20000 //connect_error和connect_timeout事件发出之前的等待时间
Configs.send.options.autoConnect = true //自动连接
Configs.send.options.query = {} //携带的query


export default Configs
