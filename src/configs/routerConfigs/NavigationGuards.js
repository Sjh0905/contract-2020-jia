export default function ($route, $event, $store, $http, $cookies,zE) {


  $route.beforeEach(function (to, from, next) {

    $store.commit('changeMobilePopOpen', false)

    // 获取是否有 query
    let query = {}

    to.query && (query = to.query)
    !to.query && (query = from.query)

    // 如果是安卓打开的
    if (from.query.isApp) {
      query = Object.assign(query, {isApp: true})
    }

    // 如果是ios打开的
    if (from.query.isIOS) {
      query = Object.assign(query, {isIOS: true})
    }


    if (to.meta.requireLogin) {
      if (!query.isApp && !query.isIOS && !$store.state.authState.userId) {
        next('/index/sign/login')
        return
      }
    }

    $store.commit('changeMobileHeaderTitle', '');
    if (to.name != 'mobileTradingHall') {
      $store.commit('SET_HALL_SYMBOL', true);
    }


    if (to.name === 'login' || to.name === 'register' || to.name === 'NewH5homePage') {
      $store.commit('changeMobileLoginShow', true);
    }

    if (to.name != 'login' && to.name != 'register' && to.name != 'NewH5homePage') {
      $store.commit('changeMobileLoginShow', false);
    }

    // 临时关闭
    if (to.meta.templateClose) {
      if (to.meta.templatePath) {
        next(to.meta.templatePath)
        return
      }
      next({name: 'home'})
      return
    }

    // 需要登出才能进的路由
    if (to.meta.requireLoginOff && $store.state.isLogin) {
      next({name: 'home'})
      return
    }




    // 首页去除在线客服入口
    // if (to.name == 'home' || to.name == 'FloatingLayerTradingHall' || to.name == 'FloatingLayerRecommend' || ($store.state.isMobile && to.name !='authentication') || to.name == 'MobileStaticForNeteaseInfo' || to.name == 'RegisterForPartner') {
    //   $('#service').nextAll().remove().end().remove();
    // } else {
    //   if ($('#service').length) {
    //     next()
    //     return
    //   }
    //   let script = document.createElement('script');
    //   script.id = 'service';
    //   // script.src = "https://qiyukf.com/script/298f9d2eee9bb866bba5146a35e1297c.js";
    //   script.src = "../../../static/js/service.js"
    //   setTimeout(function () {
    //     document.body.appendChild(script)
    //   }, 2000)
    // }


    if (to.name === 'mobileTradingHall' || to.name === 'tradingHall') {
      // console.log(from.query)
      if (from.name === 'NewH5homePage' && to.query.symbol) {
        $store.commit('changeMobileHeaderTitle', '交易大厅');
        $store.commit('SET_HALL_SYMBOL', true)
      }
      else {
        $store.commit('changeMobileHeaderTitle', '交易大厅');
        $store.commit('SET_HALL_SYMBOL', false)
      }
    }


    if (zE != undefined && $store.state.isMobile){
      (to.name === 'NewH5homePage') && zE('webWidget', 'show');
      (to.name !== 'NewH5homePage') && zE('webWidget', 'hide');
    }

    // 如果是手机，跳转的地址是pc地址，并且手机地址不等于pc地址
    if ($store.state.isMobile && to.name === to.meta.pcname && to.meta.pcname != to.meta.h5name) {
      if (to.meta.h5name) {
        next({name: to.meta.h5name, query: query})
        return
      }
      if (!to.meta.h5name) {
        next({name: to.name})
        return
      }
    }

    // 如果是pc地址，跳转的地址是手机地址，并且pc地址不等于手机地址
    if (!$store.state.isMobile && to.name === to.meta.h5name && to.meta.pcname != to.meta.h5name) {
      if (to.meta.pcname) {
        next({name: to.meta.pcname, query: query})
        return
      }
      if (!to.meta.pcname) {
        next({name: to.name})
        return
      }
    }

    // // 显示蒙层
    // if (!$store.state.isMobile && $store.state.isLogin && !$store.state.show_layer) {
    //   $http.send('SHOW_FLOAT_LAYER', {
    //     callBack: function (data) {
    //       $store.commit('SET_LAYER', data);
    //       // if (data.trade) {
    //       //   next({name: 'FloatingLayerTradingHall'})
    //       //   return
    //       // }
    //       if (data.share) {
    //         next({name: 'FloatingLayerRecommend'})
    //         return
    //       }
    //     }
    //   })
    // }


    next()
  })

}
