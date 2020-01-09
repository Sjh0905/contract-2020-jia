import Vue from 'vue'

export default class {
  constructor() {
    this.event = new Map()
  }


  /**
   *
   * @param bind  Vue Component,usually 'this'
   * @param key   String,event key
   * @param func  Function,a function
   * @returns {boolean}
   */
  listen(bind, key, func) {
    if (bind instanceof Vue !== true || typeof (key) !== 'string'
      || typeof (func) !== 'function'
    ) {
      console.warn('you must input right params!')
      return false
    }

    let newMap = this.event.get(key)
    if (typeof(newMap) === 'undefined') {
      this.event.set(key, newMap = new Map())
    }
    let newSet = newMap.get(bind)
    if (typeof (newSet) === 'undefined') {
      newMap.set(bind, newSet = new Set())
    }
    newSet.add(func)
    return true
  }

  /**
   *
   * @param key   String,event key
   * @param bind  Vue Component,usually 'this'
   * @param func  Function,a function
   * @param params   params func needs
   * @returns {boolean}
   */
  notify({key, bind, func}, ...params) {
    // 只有一个值
    if (typeof (key) === 'string' && typeof (bind) === 'undefined' && typeof (func) === 'undefined') {
      this.event.forEach((maps, keys) => {
        if (keys !== key) return
        maps && maps.forEach((sets, binds) => {
          sets && sets.forEach(func => {
            func.bind(binds)(...params)
          })
        })
      })
      return true
    }
    // 有两个值
    if (typeof (key) === 'string' && bind instanceof Vue === true && typeof (func) === 'undefined') {
      this.event.forEach((maps, keys) => {
        if (keys !== key) return
        maps && maps.forEach((sets, binds) => {
          if (binds !== bind) return
          sets && sets.forEach(func => {
            func.bind(binds)(...params)
          })
        })
      })
      return true
    }
    //有三个值
    if (typeof (key) === 'string' && bind instanceof Vue === true && typeof (func) === 'function') {
      this.event.forEach((maps, keys) => {
        if (keys !== key) return
        maps && maps.forEach((sets, binds) => {
          if (binds !== bind) return
          sets && sets.forEach(funcs => {
            if (funcs !== func) return
            funcs && funcs.bind(binds)(...params)
          })
        })
      })
      return true
    }
    console.log("you must input right params!")
    return false
  }

  /**
   *
   * @param bind  Vue Component,usually 'this'
   * @param key   String,event key
   * @param func  Function,a function
   * @returns {boolean}
   */
  unListen(bind, key, func) {
    let paramsNum = arguments.length
    if (paramsNum === 0) {
      console.warn("you must input right params!")
    }

    //第一个有值，并且是key
    if (paramsNum === 1 && typeof (bind) === 'string') {
      let key = bind
      this.event.forEach((value, keys) => {
        if (keys !== key) return
        value && value.clear()
      })
      return true
    }
    // 第一个有值，并且是Vue对象
    if (paramsNum === 1 && bind instanceof Vue === true) {
      this.event.forEach((value) => {
        if (typeof (value) === 'undefined') return
        value.forEach((value, binds) => {
          if (binds !== bind) return
          value && value.clear()
        })
      })
      return true
    }
    // 前两个有值，前两个值分别为Vue对象和key
    if (paramsNum === 2 && bind instanceof Vue === true && typeof (key) === 'string') {
      this.event.forEach((value, keys) => {
        if (keys !== key) return
        value && value.forEach((values, binds) => {
          if (binds !== bind) return
          values && values.clear()
        })
      })
      return true
    }
    // 三个都有值，分别是Vue对象、Key和Function
    if (paramsNum === 3 && bind instanceof Vue === true && typeof (key) === 'string' && typeof (func) === 'function') {
      this.event.forEach((value, keys) => {
        if (keys !== key) return
        value && value.forEach((values, binds) => {
          if (binds !== bind) return
          values && values.delete(func)
        })
      })
      return true
    }
    console.log("you must input right params!")
    return false
  }
}
