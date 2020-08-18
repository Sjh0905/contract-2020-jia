'use strict'
module.exports = {
  NODE_ENV: '"production"',
  // SOCKET: process.env.SOCKET ? JSON.stringify(process.env.SOCKET) : "'wss://wss.20jys.com/v1/market/notification'",
  SOCKET: process.env.SOCKET ? JSON.stringify(process.env.SOCKET) : "''",
  CLOSELOG: process.env.CLOSELOG ? JSON.stringify(process.env.CLOSELOG) : "''",
  DOMAIN: process.env.DOMAIN ? JSON.stringify(process.env.DOMAIN) : "'http://otc.2020-ex.com/'",
  CONTRACT_URL: process.env.CONTRACT_URL ? JSON.stringify(process.env.CONTRACT_URL) : "'http://www.2020-ex.com/'",
  STATIC_URL: process.env.STATIC_URL ? JSON.stringify(process.env.STATIC_URL) : "'https://www.20jys.com/'",
  GRC_URL: process.env.GRC_URL ? JSON.stringify(process.env.GRC_URL) : "'https://build.2020.exchange/events/grc-token-mining'",
}
