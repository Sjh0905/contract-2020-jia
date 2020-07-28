import axios from 'axios'
import NetworkServer from './NetworkServer'
import RequestAddress from './RequestAddress'

export default class {
  constructor(defaultData) {
    this.defaultData = defaultData || {}
    axios.defaults.withCredentials = true
    // this.env = NetworkServer.env
  }

  resetDefaultData(defaultData) {
    this.defaultData = defaultData || {}
  }


  send(key, {bind, params = {}, callBack, errorHandler, urlFragment, query, headers}) {
    if (typeof (key) !== 'string') {
      console.log("you must input a key!")
      return false
    }

    let configure
    // this.env !== 'dev' && (configure = RequestAddress[key])
    // this.env === 'dev' && (configure = RequestAddressDev[key])

    configure = RequestAddress[key]


    if (typeof (configure) === 'undefined') {
      // console.log("network hasn't configure!", key)
      return false
    }


    let newOption = {...NetworkServer.send}

    for (let keys in configure) {
      typeof (configure[keys]) !== 'undefined' && configure[keys] !== null && (newOption[keys] = configure[keys])
    }

    newOption.url && urlFragment && (newOption.url = newOption.url + urlFragment)

    // console.log("this is option", newOption, {...params, ...this.defaultData}, query)

    headers && (newOption.headers = headers)

    if (callBack || errorHandler) {
      return axios({
        ...newOption,
        params: query,
        data: {...params, ...this.defaultData},
      })
        .then(function (res) {
          // console.log(res)
          typeof (callBack) === 'function' && bind && callBack.bind(bind)(res.data, res.status, res.statusText)
          typeof (callBack) === 'function' && !bind && callBack(res.data, res.status, res.statusText)
        })
        .catch(function (err) {
          err && typeof (errorHandler) === 'function' && bind && errorHandler.bind(bind)(err)
          err && typeof (errorHandler) === 'function' && !bind && errorHandler(err)
        })
    }

    return axios({
      ...newOption,
      params: query,
      data: {...params, ...this.defaultData},
    })
  }

  sendFile(key, formData, {bind, callBack, errorHandler}) {
    if (typeof (key) !== 'string') {
      console.log("you must input a key!")
      return false
    }

    let configure
    // this.env !== 'dev' && (configure = RequestAddress[key])
    // this.env === 'dev' && (configure = RequestAddressDev[key])

    configure = RequestAddress[key]

    if (typeof (configure) === 'undefined') {
      console.log("network hasn't configure!")
      return false
    }

    let url = configure.url

    return axios.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
      .then(function (res) {
        typeof (callBack) === 'function' && bind && callBack.bind(bind)(res.data, res.status, res.statusText)
        typeof (callBack) === 'function' && !bind && callBack(res.data, res.status, res.statusText)
      })
      .catch(function (err) {
        err && typeof (errorHandler) === 'function' && bind && errorHandler.bind(bind)(err)
        err && typeof (errorHandler) === 'function' && !bind && errorHandler(err)
      })
  }

  getJSON(url, data, callback) {
    axios({
      url: url,
      data: data,
      method: 'get',
      ...NetworkServer.send
    })
      .then(function (res) {
        callback(res.data)
      })
      .catch(function (err) {

      })
  }

  postJSON(url, data, callback) {
    axios({
      url: url,
      data: data,
      method: 'post',
      ...NetworkServer.send
    })
      .then(function (res) {
        callback(res.data)
      })
      .catch(function (err) {

      })
  }

}
