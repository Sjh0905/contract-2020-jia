'use strict'
module.exports = {
  NODE_ENV: '"production"',
  SOCKET: process.env.SOCKET ? JSON.stringify(process.env.SOCKET) : "''",
  CLOSELOG: process.env.CLOSELOG ? JSON.stringify(process.env.CLOSELOG) : "''",
  DOMAIN: process.env.DOMAIN ? JSON.stringify(process.env.DOMAIN) : "'https://otc.eunex.group/'",
  STATIC_URL: process.env.STATIC_URL ? JSON.stringify(process.env.STATIC_URL) : "'https://logo.eunex.group/'",
  GRC_URL: process.env.GRC_URL ? JSON.stringify(process.env.GRC_URL) : "'https://build.eunex.group/events/grc-token-mining'",
}
