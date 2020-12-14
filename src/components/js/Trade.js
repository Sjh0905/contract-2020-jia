require('../../../static/chart/charting_library.min')
// require('../../../static/chart/BTC_USDT_K_1_DAY.json')
import BTC_USDT_K_1_DAY from '../../../static/chart/BTC_USDT_K_1_DAY.json'

const root = {};

root.name = 'Trade'
root.props = {}
root.props.topic_bar = {
  type: Object,
  default: {}
}
root.props.m_new_interval = {
  type: String,
  default: '1'
}

let widget;
// 存储当前选定区间
let new_interval = "1";

// k线开始时间
let startTime = 0;

root.data = function () {
	return {
		quoteScale: 2,
    bartemphc: '',
    starttimehc: '',
    istoday: true,
    currResolution:new_interval
	}
}
root.created = function () {
  // this.getLatestrice()
}

root.mounted = function () {
  new_interval = this.m_new_interval
  this.initTrade();
}

root.computed = {};

root.computed.symbol = function () {
	return this.$store.state.symbol;
}
root.computed.urlHead = function () {
  return this.$store.state.urlHead;
}
// 国际化问题，当国际化的时候切换语言，重新初始化k线
root.computed.lang = function () {
	return this.$store.state.lang;
}


root.watch = {};
root.watch.symbol = function (newValue, oldValue) {
	// widget.setSymbol(newValue, new_interval); // 默认为D，现在临时改成1
	this.getScaleConfig();
	this.initTrade();
}
root.watch.lang = function (newValue, oldValue) {
	this.initTrade();
}

root.methods = {};
//
// root.methods.getLatestrice = function () {
//   this.$http.send('POST_STICK_K',{
//     bind: this,
//     query:{
//       symbol:'BTCUSDT',
//       interval:new_interval
//     },
//     callBack: this.re_getLatestrice,
//     errorHandler:this.error_getLatestrice
//   })
// }
// //
// root.methods.re_getLatestrice = function (data) {
//   typeof(data) == 'string' && (data = JSON.parse(data));
//
// }
// //
// root.methods.error_getLatestrice = function (err) {
//   console.log('获取币安24小时价格变动接口',err)
// }

// 初始化k线
root.methods.initTrade = function () {
	let lang = 'en'
	if (this.lang == 'CH') {
		lang = 'zh'
	} else {
		lang = 'en'
	}
	this.initViews(lang);
	startTime = 0;
}

// 获取精度
root.methods.getScaleConfig = function () {
  this.$store.state.quoteConfig.forEach(
    v => {
      v.name === this.$store.state.symbol && (this.baseScale = v.baseScale , this.quoteScale = v.quoteScale)
    }
  )
}

root.methods.initViews = function (lang) {

	let self = this;
  const resolution_mapping = {
    '1S': '1m',
    '1': '1m',
    '5': '5m',
    '15': '15m',
    '30': '30m',
    '60': '1h',
    '120': '2h',
    '240': '4h',
    '1440': '1d',
    '4320': '3d',
    '10080': '1w',
  };

	$(function () {
		initTradingView();
	});

	function BitexDataFeed() {}

	BitexDataFeed.prototype.onReady = function (callback) {
		// console.error('[onReady]');
		setTimeout(function () {
			callback({
				exchanges: [],
				symbols_types: [],
				supports_marks: false,
				supports_time: true,
				supported_resolutions: ['1', '5', '15', '30', '60','120', '240','1440','4320','10080']
				// supported_resolutions: ["1S","1","60","D", "2D", "3D"]
			});
		}, 0);
	};

	BitexDataFeed.prototype.searchSymbols = function (userInput, exchange, symbolType, onResultReadyCallback) {
		// console.error('[searchSymbols]');
		setTimeout(function () {
			onResultReadyCallback([]);
		}, 0);
	};
	BitexDataFeed.prototype.resolveSymbol = function (symbolName, onSymbolResolvedCallback, onResolveErrorCallback) {
		// console.error('[resolveSymbol]',symbolName);
		var symbol = {
			ticker: symbolName,
			// name: symbolName.replace('_', '/'),
			// description: symbolName.replace('_', '/'),
      name: symbolName.replace('_', ''),
			description: symbolName.replace('_', ''),
			type: 'bitcoin',
			session: '24x7',
			timezone: 'Asia/Shanghai',
			minmov: 1,
			// minmove2: 0,
			// pointvalue: 4,
			// fractional: 4,
			// pricescale: 100000000,
			pricescale: Math.pow(10, self.quoteScale),
			MinimalPossiblePriceChange: 9,
			has_intraday: true, // has minutes data?
			has_seconds: true,
			intraday_multipliers: ['1', '5', '15', '30', '60','120', '240','1440','4320','10080'],
			seconds_multipliers: ['1'],
			has_daily: true,
			has_weekly_and_monthly: false,
			has_empty_bars: true,
			has_no_volume: false,
      //价格坐标精度
			volume_precision: 0,
			// volume_precision: self.precision,
			supported_resolutions: ['1', '5', '15', '30', '60','120', '240','1440','4320','10080'],
			// supported_resolutions :['1S',"1","60","D", "2D", "3D"],
			data_status: 'streaming',
      e:0,

		};
		setTimeout(function () {
			onSymbolResolvedCallback(symbol);
		}, 0);
	};

	BitexDataFeed.prototype._send = function (url, params) {
		var request = url;
		if (params) {
			for (var i = 0; i < Object.keys(params).length; ++i) {
				var key = Object.keys(params)[i];
				var value = encodeURIComponent(params[key]);
				request += (i === 0 ? '?' : '&') + key + '=' + value;
			}
		}
		return $.ajax({
			type: 'GET',
			url: request,
			contentType: 'text/plain'
		});
	};

	BitexDataFeed.prototype._send2 = function (symbol, type,cb) {
    var data = require('../../../static/chart/'+symbol+'_'+type+'.json')
	  cb(data)
	};

	// 获取服务器时间
	BitexDataFeed.prototype.getServerTime = function(callback) {
		this._send(self.urlHead+'/v1/common/timestamp')
		.done(function(response) {
			// console.log('getServerTime====',response)
			var time = +response.timestamp;
			if (!isNaN(time)) {
				// callback(time);
			}
		})
		.fail(function() {
		});
	};

	let bars = [];

	BitexDataFeed.prototype.getBars = function (symbolInfo, resolution, fromTime, toTime, onHistoryCallback, onErrorCallback, firstDataRequest) {
		// console.log('[getBars: symbolInfo = ' + symbolInfo.ticker + ', resolution = ' + resolution
		// 	+ ', from = ' + fromTime + ' (' + new Date(fromTime).toUTCString() + '), to = ' + toTime + ' ('
		// 	+ new Date(toTime).toUTCString() + '), firstDataRequest = ' + firstDataRequest);

		// var i;
		// var n = 1;
		// var start = parseInt(new Date().getTime() / 1000) - 2 * 24 * 3600;
		// var end = firstDataRequest ? parseInt(new Date().getTime() / 1000) : toTime;
		// var p = 1500.01;
		// for (i = start / 60; i<toTime / 60; i++) {
		// 	var c = p + Math.random() * 100 - 50;
		// 	if (c < 1000) {
		// 		c = 1000;
		// 	}
		// 	bars.push({
		// 		time: i * 60 * 1000,
		// 		open: p,
		// 		high: p + Math.random() * 50,
		// 		low: c - Math.random() * 30,
		// 		close: c,
		// 		volume: Math.random() * 10
		// 	});
		// 	p = c;
		// }
		// setTimeout(function () {
		// 	onHistoryCallback(bars);
		// }, 0);
		// return;

		// 禁止向前拖拽数据
		if (!!self.isMobile && !firstDataRequest) {
			setTimeout(function () {
				onHistoryCallback([], { noData: true });
			}, 0);
		}
		if (!self.isMobile && Number(toTime*1000) < Number(startTime)) {
			setTimeout(function () {
				onHistoryCallback([], { noData: true });
			}, 0);
		}

    console.log("========resolution=======",resolution)

		//清空缓存测试
    //  localStorage.clear();

    //日线放缓存
    // if(resolution == '15'){
    if(false){//目前不做缓存
      //k线放入缓存
      this.bartemphc = JSON.parse(localStorage.getItem(symbolInfo.ticker+"_bars"));
      this.starttimehc = localStorage.getItem(symbolInfo.ticker+"_time");

      //判断缓存里的时间是否是今天生成的，如果是取缓存数据，如果不是则调用接口
      if (new Date(parseInt(this.starttimehc)).toDateString() === new Date().toDateString()) {
        //今天
        this.istoday = true;
      } else if (new Date(parseInt(this.starttimehc)) < new Date()){
        //之前
        this.istoday = false;
      }

      //判断缓存里的数据是否为空，如果为空或者时间不是当天的，则去调用接口
      if(this.bartemphc == null || this.starttimehc == null || !this.istoday){
        // this._send(self.urlHead+'/v1/market/bars/' + symbolInfo.ticker + '/' + resolution_mapping[resolution], {
        //   start: fromTime * 1000,
        //   end: toTime * 1000
        // })
        this._send(self.urlHead+'/future/common/candlestick', {
          symbol:self.$globalFunc.toOnlyCapitalLetters(symbolInfo.ticker),
          interval:resolution_mapping[resolution],
          start: fromTime * 1000,
          end: toTime * 1000
        })
          .done(function (response) {
            if (response) {

              var data = response.data;
              var i, b;
              // bars.length > 0 && (bars = []);
              bars = [];
              // var length = data.length;
              var time = "";

              for(var i = 0; i < data.length; ++i) {
                // t, OHLC, V

                b = data[i];
                startTime = response.startTime || 0;
                bars.push({
                  // time: b[0],
                  // open: b[1],
                  // high: b[2],
                  // low: b[3],
                  // close: b[4],
                  // volume: b[5]
                  time: b.openTime,
                  open: b.open,
                  high: b.high,
                  low: b.low,
                  close: b.close,
                  volume: b.volume
                });
                // if(i == length-1){
                //   time = b[0];
                // }
              }

              //k线放入缓存
              localStorage.setItem(symbolInfo.ticker+"_bars",JSON.stringify(bars));
              localStorage.setItem(symbolInfo.ticker+"_time",time.toString());
              onHistoryCallback(bars);
            }

          })
      }else if(this.bartemphc != null && this.starttimehc != null){
        onHistoryCallback(this.bartemphc);
      }
    }else{
      // this._send(self.urlHead+'/v1/market/bars/' + symbolInfo.ticker + '/' + resolution_mapping[resolution], {
      //   start: fromTime * 1000,
      //   end: toTime * 1000
      // })
      this._send(self.urlHead+'/future/common/candlestick', {
        symbol:self.$globalFunc.toOnlyCapitalLetters(symbolInfo.ticker),
        interval:resolution_mapping[resolution],
        start: fromTime * 1000,
        end: toTime * 1000
      })
        .done(function (response) {
          if (response) {
            var data = response.data;
            var i, b;
            // bars.length > 0 && (bars = []);
            bars = [];
            // var length = data.length;
            var time = "";
            // console.log("data.length=="+data.length);
            for(var i = 0; i < data.length; ++i) {
              // t, OHLC, V

              b = data[i];
              startTime = response.startTime || 0;
              //价格必须是number类型，否则均线样式会错乱
              bars.push({
                // time: b[0],
                // open: b[1],
                // high: b[2],
                // low: b[3],
                // close: b[4],
                // volume: b[5]
                time: b.openTime,
                open: Number(b.open),
                high: Number(b.high),
                low: Number(b.low),
                close: Number(b.close),
                volume: Number(b.volume)
              });
              // if(i == length-1){
              //   time = b[0];
              // }
            }
            onHistoryCallback(bars);
          }
        })
    }


	};


	BitexDataFeed.prototype.subscribeBars = function (symbolInfo, resolution, onRealtimeCallback, subscriberUID, onResetCacheNeededCallback) {
		// console.log('[subscribeBars: symbolInfo = ' + symbolInfo.ticker + ', resolution = ' + resolution
		// 	+ ', subscriberUID = ' + subscriberUID);

    /*var resolution_mapping = {
      '1S': '1m',
      '1': '1m',
      '5': '5m',
      '15': '15m',
      '30': '30m',
      '60': '1h',
      '240': '4h',
      'D': '1d'
    };*/

    var getKLineStream = (symbol,currResolution)=>{
      return symbol + "@kline_" + resolution_mapping[currResolution]
    }

    //TODO:1.将币对拆分出来，2.socket合并城城代码 3.初始化写在哪里合适
    if(self.currResolution != resolution){

      let symbol = self.$globalFunc.toOnlyCapitalLetters(symbolInfo.ticker,true);

      let lastKlineStream = getKLineStream(symbol,self.currResolution)
      console.log('this is curr resolution',symbol,self.currResolution,lastKlineStream);
      self.$socket.emit('UNSUBSCRIBE', [lastKlineStream])

      self.currResolution = resolution

      let newKlineStream = getKLineStream(symbol,self.currResolution)
      console.log('this is curr resolution22',symbol,self.currResolution,newKlineStream);
      self.$socket.emit('SUBSCRIBE', [newKlineStream])
    }


    // 获取k线数据
		self.$socket.on({
		    key: 'kline',
		    bind: self,
		    callBack: (message) => {

		    	let b = message.k;
		    	if (!b || self.$store.state.subscribeSymbol != b.s) return;
	    		if (resolution_mapping[resolution] == b.i) {
            // console.log('获取k线数据',b.i,message);
            //价格必须是number类型，否则均线样式会错乱
	    			onRealtimeCallback({
              time: b.t,
              open: Number(b.o),
              high: Number(b.h),
              low: Number(b.l),
              close: Number(b.c),
              volume: Number(b.v)
            });
		    	}
		    }
	  	})
	};

	BitexDataFeed.prototype.unsubscribeBars = function (subscriberUID) {
		// console.error('[unsubscribeBars: subscriberUID = ' + subscriberUID);
	};


	function initTradingView() {
		var mobile = {
      container_id: "chart_container",
      fullscreen: false,
			width: '100%',
			height: '100%',
      autosize: true,
      library_path: "/static/chart/",
      locale: "zh",
      timezone: 'Asia/Shanghai',
      symbol: self.symbol,
      interval: new_interval,
			// 引入第三方样式
			custom_css_url: 'css/chart_mobile.css',
      //	BEWARE: no trailing slash is expected in feed URL
      datafeed: new BitexDataFeed(),
      // 'create_volume_indicator_by_default_once','create_volume_indicator_by_default',//使交易量消失
			disabled_features: ['use_localstorage_for_settings', 'left_toolbar', 'header_symbol_search', 'timeframes_toolbar', 'header_interval_dialog_button', 'header_chart_type','header_widget_dom_node', 'header_settings', 'header_indicators', 'header_screenshot', 'volume_force_overlay', 'create_volume_indicator_by_default','border_around_the_chart'],
      //	Regression Trend-related functionality is not implemented yet, so it's hidden for a while
      drawings_access: { type: 'black', tools: [ { name: "Regression Trend" } ] },
      // preset: "mobile",
      // toolbar_bg: '#081724',
      toolbar_bg: '#0D111F',

      favorites: {
				intervals: ["1S", "1", "5", "15", "30", "60","120", "240",'1440', '4320', '10080'],
				chartTypes: ["Candles"]
			},
      // favorites: {
      //   intervals: ["1S", "1", "5", "15", "30", "60","120", "240","360","720", "D"],
      //   chartTypes: ["Candles"]
      // },
			overrides: {
				"mainSeriesProperties.style": 1,
				"paneProperties.background": "#081724",
        // "paneProperties.vertGridProperties.color": "#454545",
        // "paneProperties.horzGridProperties.color": "#454545",
        // "symbolWatermarkProperties.color" : "#944",//水印
        // "symbolWatermarkProperties.transparency": 90,//水印透明度
				"mainSeriesProperties.lineStyle.color": "#02c0cc",
				"mainSeriesProperties.lineStyle.linewidth": 1,
        //指标参数的显示、隐藏  true为展开（显示）; false为隐藏
        "paneProperties.legendProperties.showLegend": false,
        // "paneProperties.legendProperties.showStudyArguments": true,

				// 蜡烛样式
				"mainSeriesProperties.candleStyle.upColor": "#86CB12",
				"mainSeriesProperties.candleStyle.downColor": "#F60076",
				"mainSeriesProperties.candleStyle.drawWick": true,
				"mainSeriesProperties.candleStyle.drawBorder": true,
				// "mainSeriesProperties.candleStyle.borderColor": "#378658",
				"mainSeriesProperties.candleStyle.borderUpColor": "#86CB12",
				"mainSeriesProperties.candleStyle.borderDownColor": "#F60076",
				"mainSeriesProperties.candleStyle.wickUpColor": '#86CB12',
				"mainSeriesProperties.candleStyle.wickDownColor": '#F60076',
				"mainSeriesProperties.candleStyle.barColorsOnPrevClose": false,

        // 背景网格颜色
        "paneProperties.vertGridProperties.color": "#1E1F22",
        "paneProperties.horzGridProperties.color": "#1E1F22",
        // 边际（百分比）。 用于自动缩放。
        "paneProperties.topMargin": 13,
        "paneProperties.bottomMargin": 5,
        // 刻度，分界线，字体颜色
        "scalesProperties.lineColor" : "#1E1F22",
        "scalesProperties.e" : 0,

        "scalesProperties.textColor": "#6B7DA2",
        "timeScale.rightOffset": 5,
			},
      studies_overrides: {
        "volume.volume.color.0": "#F60076",
        "volume.volume.color.1": "#86CB12",
      },

		}
		var pc = {
			container_id: 'chart_container',
			fullscreen: false,
			width: '100%',
			height: '100%',
			autosize: true,
			library_path: '/static/chart/',
			locale: lang,
			timezone: 'Asia/Shanghai',
			symbol: self.symbol,
			interval: new_interval, // initial interval = 1 min  默认是 "D"
			timeframe: '240', // display 4 hours

			// 引入第三方样式
			custom_css_url: 'css/chart.css',

			datafeed: new BitexDataFeed(),
			// datafeed: new Datafeeds.UDFCompatibleDatafeed(config),
			// header_indicators 已放开left_toolbar
      // 'create_volume_indicator_by_default_once','create_volume_indicator_by_default',//使交易量消失
			disabled_features: ['use_localstorage_for_settings', '', 'header_symbol_search', 'timeframes_toolbar', 'header_interval_dialog_button', 'header_chart_type', 'header_settings', '', 'header_screenshot', 'volume_force_overlay','create_volume_indicator_by_default','border_around_the_chart'],
			//	Regression Trend-related functionality is not implemented yet, so it's hidden for a while
			drawings_access: { type: 'black', tools: [ { name: "Regression Trend" } ] },
			debug: !true,
			// supports_time: true,

			toolbar_bg: '#0D111F',

			// list of time frames visible in timeframes picker at the bottom of the chart:
			time_frames: [
				// { text: "3y", resolution: "W" },
				// { text: "8m", resolution: "D" },
				// { text: "2m", resolution: "D" },
				// { text: "1m", resolution: "60" },
				// { text: "1w", resolution: "30" },
				// { text: "7d", resolution: "30" },
				// { text: "2d", resolution: "5" },
				// { text: "1d", resolution: "5" }
			],
			overrides: {
				"mainSeriesProperties.style": 1, // 3 为山形图
        "paneProperties.background": "#0D111F",
				"symbolWatermarkProperties.color" : "#944",//水印
				"volumePaneSize": "medium",
				"mainSeriesProperties.lineStyle.color": "#02c0cc",
				"mainSeriesProperties.lineStyle.linewidth": 1,
        //指标参数的显示、隐藏  true为展开（显示）; false为隐藏
				"paneProperties.legendProperties.showLegend": false,
				"paneProperties.legendProperties.showStudyArguments": true,

				// 山行图线和阴影颜色
				// "mainSeriesProperties.areaStyle.color1": "#d8f7ff",
				// "mainSeriesProperties.areaStyle.color2": "#ffffff",
				// "mainSeriesProperties.areaStyle.linecolor": "#F60076",
				// "mainSeriesProperties.areaStyle.linewidth": 2,
				// "mainSeriesProperties.areaStyle.priceSource": "close",
				// 蜡烛样式
				"mainSeriesProperties.candleStyle.upColor": "#86CB12",
				"mainSeriesProperties.candleStyle.downColor": "#F60076",
				"mainSeriesProperties.candleStyle.drawWick": true,
				"mainSeriesProperties.candleStyle.drawBorder": true,
				// "mainSeriesProperties.candleStyle.borderColor": "#000",
				"mainSeriesProperties.candleStyle.borderUpColor": "#86CB12",
				"mainSeriesProperties.candleStyle.borderDownColor": "#F60076",
				"mainSeriesProperties.candleStyle.wickUpColor": '#86CB12',
				"mainSeriesProperties.candleStyle.wickDownColor": '#F60076',
				"mainSeriesProperties.candleStyle.barColorsOnPrevClose": false,
				// 背景网格颜色
				"paneProperties.vertGridProperties.color": "#1E1F22",
				"paneProperties.horzGridProperties.color": "#1E1F22",
				// 边际（百分比）。 用于自动缩放。
				"paneProperties.topMargin": 15,
				"paneProperties.bottomMargin": 8,
        // "scalesProperties.showLeftScale" : false,//不显示左坐标
        // "scalesProperties.showRightScale" : false,//不显示右坐标
				// 刻度，分界线，字体颜色
				"scalesProperties.lineColor" : "#1E1F22",
				"scalesProperties.textColor": "#6B7DA2",
				"timeScale.rightOffset": 5,
        "scalesProperties.linewidth" : 0,
        "scalesProperties.lineheight" : 0,
				// Bars styles
				"mainSeriesProperties.barStyle.upColor": "red",
				"mainSeriesProperties.barStyle.downColor": "#F60076",
				"mainSeriesProperties.barStyle.barColorsOnPrevClose": false,
				"mainSeriesProperties.barStyle.dontDrawOpen": false,
			},
			studies_overrides: {
			    "volume.volume.color.0": "#F60076",
			    "volume.volume.color.1": "#86CB12",
			},

			favorites: {
				intervals: ["1S","1", "5", "15", "30", "60","120", "240","1440","4320","10080"],
				chartTypes: ["Candles"]
			},
		};

		widget = new TradingView.widget(self.$store.state.isMobile ? mobile : pc);
		// 自定义图方法
		widget.onChartReady(function () {
			// !self.$store.state.isMobile && widget.chart().createStudy('MACD', false, true);
      widget.chart().createStudy('Moving Average', false, false,[4, 'close', 0], null, {
        'Plot.color': '#F60000',
        'Plot.linewidth': 1
      });
      widget.chart().createStudy('Moving Average', false, false,[9, 'close', 0], null, {
        'Plot.color': '#FFF100',
        'Plot.linewidth': 1
      });
      widget.chart().createStudy('Moving Average', false, false,[13, 'close', 0], null, {
        'Plot.color': '#00FF57',
        'Plot.linewidth': 1
      });
      widget.chart().createStudy('Moving Average', false, false,[55, 'close', 0], null, {
        'Plot.color': '#02DCEB',
        'Plot.linewidth': 1
      });
      widget.chart().createStudy('Moving Average', false, false,[144, 'close', 0], null, {
        'Plot.color': '#FE00FF',
        'Plot.linewidth': 1
      });
      widget.chart().createStudy('Bollinger Bands',false, false,[20, 2],null, {
        'Median.color': '#3f4ff8', 'Median.linewidth': 1,
        'Upper.color': '#3f4ff8', 'Upper.linewidth': 1,
        'Lower.color': '#3f4ff8', 'Lower.linewidth': 1,
        'Plots Background.color':'#626874',
      });
      let MACDConfigs = self.$store.state.isMobile ? {
        'Histogram.color': '#838B99', 'Histogram.linewidth': 1, 'Histogram.transparency': 35,
        'MACD.color': '#86CB12', 'MACD.linewidth': 2, 'MACD.transparency': 35,
        'Signal.color': '#F60076', 'Signal.linewidth': 2, 'Signal.transparency': 35,
        //价格坐标精度
        'precision':0,
      } : {
        'Histogram.color': '#838B99', 'Histogram.linewidth': 1, 'Histogram.transparency': 35,
        'MACD.color': '#86CB12', 'MACD.linewidth': 1, 'MACD.transparency': 35,
        'Signal.color': '#F60076', 'Signal.linewidth': 1, 'Signal.transparency': 35,
        'precision':0,
      }

      let StochasticRSIConfigs = self.$store.state.isMobile ? {
        '%K.color': '#86CB12', '%K.linewidth': 2, '%K.transparency': 35,
        '%D.color': '#F60076', '%D.linewidth': 2, '%D.transparency': 35,
        'UpperLimit.color': '#0D111F', 'UpperLimit.linewidth': 0,
        'LowerLimit.color': '#0D111F', 'LowerLimit.linewidth': 0,
        'Hlines Background.color':'#626874',
        'precision':0,
      } : {
        '%K.color': '#86CB12', '%K.linewidth': 1, '%K.transparency': 35,
        '%D.color': '#F60076', '%D.linewidth': 1, '%D.transparency': 35,
        'UpperLimit.color': '#0D111F', 'UpperLimit.linewidth': 0,
        'LowerLimit.color': '#0D111F', 'LowerLimit.linewidth': 0,
        'Hlines Background.color':'#626874',
        'precision':0,
      }
      let RelativeStrengthIndexConfigs = self.$store.state.isMobile ? {
        'Plot.color': '#86CB12', 'Plot.linewidth': 2, 'UpperLimit.value': 80, 'LowerLimit.value': 20,
        'UpperLimit.color': '#0D111F', 'UpperLimit.linewidth': 0,
        'LowerLimit.color': '#0D111F', 'LowerLimit.linewidth': 0,
        'Hlines Background.color':'#D8D8D8',
        'precision':0,
      } : {
        'Plot.color': '#86CB12', 'Plot.linewidth': 1, 'UpperLimit.value': 80, 'LowerLimit.value': 20,
        'UpperLimit.color': '#0D111F', 'UpperLimit.linewidth': 0,
        'LowerLimit.color': '#0D111F', 'LowerLimit.linewidth': 0,
        'Hlines Background.color':'#D8D8D8',
        'precision':0,
      }
      widget.chart().createStudy('MACD',false, false,[2,33,'close',3],null,MACDConfigs);
      widget.chart().createStudy('Stochastic RSI',false, false,[14,14,2,3],null, StochasticRSIConfigs);
      widget.chart().createStudy('Relative Strength Index',false, false,[4],null, RelativeStrengthIndexConfigs);

			// 移动端切换显示
			if (self.$store.state.isMobile) {
				let iframeName = widget.id;
				let btn = $("#"+iframeName).contents().find('.left').find('.header-group-intervals').find('.quick').find('.apply-common-tooltip');
				$('.interval_button').each(function(i,v){
					$(v).unbind('click');
					let k;
					if (i < 2) {
						k = 0;
					} else {
						k = i - 1;
					}
					$(v).on('click', function (e) {
						$(btn).eq(k).trigger('click');
						if (i < 1) {
							widget.chart().setChartType(3);
						} else {
							widget.chart().setChartType(1);
						}
					});
				})
			} else {  // pc端切换显示
				let intervals_list = [ "1", "5", "15", "30", "60","120", "240","1440","4320","10080"]
				let intervals_key = 0;
				for (var i = 0; i < intervals_list.length; i++) {
					let item = intervals_list[i];
					if (item == widget.options.interval) {
						intervals_key = i;
					}
				}
				// 添加分时
				let line = lang == 'en' ? 'line' : '分时';
				let new_interval_btn_list =
          lang == 'en' ? [{title: '1m'}, {title: '5m'}, {title: '15m'}, {title: '30m'}, {title: '1H'}, {title: '2H'},{title: '4H'},{title: 'D'},{title: '3D'},{title: '7D'}]
        :[{title: '1分钟'}, {title: '5分钟'}, {title: '15分钟'}, {title: '30分钟'}, {title: '1小时'}, {title: '2小时'},{title: '4小时'},{title: '1天'},{title: '3天'},{title: '1周'}];
				widget.createButton().attr('title', line).on('click', function (e) {
					$(this).parents('.group').siblings().find('.button').children('span').removeClass('new_selected')
					$(this).parents('.group').find('span').addClass('new_selected');
					$(this).parents('.group').siblings().first().find('.quick').children('span').eq(0).trigger('click')
					!self.$store.state.isMobile && widget.chart().setChartType(3)
		        }).append($('<span class="new_apply_common_tooltip">'+line+'</span>'));
				// 添加按钮及选中样式
				for (let i = 0; i < new_interval_btn_list.length; i++) {
					let item = new_interval_btn_list[i];
					if (intervals_key == i) {
						widget.createButton().attr('title', item.title).on('click', function (e) {
              $(this).parents('.group').siblings().find('.button').removeClass('new_selected2')
							$(this).parents('.group').siblings().find('.button').children('span').removeClass('new_selected');
				        	$(this).find('span').addClass('new_selected').parents('.group').siblings().first().find('.quick').children('span').eq(i).trigger('click')
				        	!self.$store.state.isMobile && widget.chart().setChartType(1)
				        }).append($('<span class="new_apply_common_tooltip new_selected">'+item.title+'</span>'));
					} else {
						widget.createButton().attr('title', item.title).on('click', function (e) {
              $(this).parents('.group').siblings().find('.button').addClass('new_selected2')
              $(this).parents('.group').siblings().find('.button').children('span').removeClass('new_selected');
				        	$(this).find('span').addClass('new_selected').parents('.group').siblings().first().find('.quick').children('span').eq(i).trigger('click')
				        	!self.$store.state.isMobile && widget.chart().setChartType(1)
				        }).append($('<span class="new_apply_common_tooltip">'+item.title+'</span>'));
					}
				}
			}


			widget.chart().onIntervalChanged().subscribe(null, function(interval, obj) {
				// if (interval == '1') {
				// 	widget.chart().setChartType(3);  // 山形图
				// } else {
				// 	widget.chart().setChartType(1);  // 蜡烛图
				// }
				// interval 重新赋值
				new_interval = interval;
				startTime = 0;
			})
		})
	}
}



export default root
