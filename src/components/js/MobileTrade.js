require('../../../static/chart/charting_library.min')

const root = {};

root.name = 'MobileTrade';

let widget;
// 存储当前选定区间
let new_interval = "15";

root.data = function () {
	return {
		quoteScale: 8,
	}
}

root.components = {

}

root.computed = {};

root.computed.symbol = function () {
	return this.$store.state.symbol;
}

root.computed.urlHead = function () {
	return this.$store.state.urlHead;
}

root.created = function () {
}

root.mounted = function () {
	this.initViews();
}

root.methods = {};

// 获取精度
root.methods.getScaleConfig = function () {
  this.$store.state.quoteConfig.forEach(
    v => {
      v.name === this.$store.state.symbol && (this.baseScale = v.baseScale , this.quoteScale = v.quoteScale)
    }
  )
}

root.methods.GO_TRADINGHALL = function () {
	this.$router.push({name: 'mobileTradingHall'});
}

root.methods.initViews = function (lang) {

	let self = this;

	$(function () {
		initTradingView();
	});

	function BitexDataFeed() {
	}

	BitexDataFeed.prototype.onReady = function (callback) {
		// console.error('[onReady]');
		setTimeout(function () {
			callback({
				exchanges: [],
				symbols_types: [],
				supports_marks: false,
				supports_time: true,
				supported_resolutions: ['1', '5', '15', '30', '60', '240', 'D']
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
			name: symbolName.replace('_', '/'),
			description: symbolName.replace('_', '/'),
			type: 'bitcoin',
			session: '24x7',
			timezone: 'Asia/Shanghai',
			minmov: 1,
			// minmove2: 0,
			// pointvalue: 4,
			// fractional: 4,
			pricescale: Math.pow(10, self.quoteScale),
			MinimalPossiblePriceChange: 9,
			has_intraday: true, // has minutes data?
			has_seconds: true,
			intraday_multipliers: ['1', '5', '15', '30', '60', '240', 'D'],
			seconds_multipliers: ['1'],
			has_daily: true,
			has_weekly_and_monthly: false,
			has_empty_bars: true,
			has_no_volume: false,
			volume_precision: 8,
			// volume_precision: self.precision,
			supported_resolutions: ['1', '5', '15', '30', '60', '240', 'D'],
			// supported_resolutions :['1S',"1","60","D", "2D", "3D"],
			data_status: 'streaming',
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
		// console.error('[getBars: symbolInfo = ' + symbolInfo.ticker + ', resolution = ' + resolution
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

		if (!firstDataRequest) {
			setTimeout(function () {
				onHistoryCallback([], { noData: true });
			}, 0);
		}
		var resolution_mapping = {
			'1S': 'K_1_SEC',
			'1': 'K_1_MIN',
			'5': 'K_1_MIN',
			'15': 'K_1_MIN',
			'30': 'K_1_MIN',
			'60': 'K_1_HOUR',
			'240': 'K_1_HOUR',
			'D': 'K_1_DAY'
		};
		this._send(self.urlHead+'/v1/market/bars/' + symbolInfo.ticker + '/' + resolution_mapping[resolution], {
			start: fromTime * 1000,
			end: toTime * 1000
		})
		.done(function (response) {
			if (response) {
				var data = response.bars;
				var i, b;
				bars.length > 0 && (bars = []);
				for(var i = 0; i < data.length; ++i) {
					// t, OHLC, V
					b = data[i];
					bars.push({
						time: b[0],
						open: b[1],
						high: b[2],
						low: b[3],
						close: b[4],
						volume: b[5]
					});
				}
				onHistoryCallback(bars);
			}
		})

	};


	BitexDataFeed.prototype.subscribeBars = function (symbolInfo, resolution, onRealtimeCallback, subscriberUID, onResetCacheNeededCallback) {
		// console.error('[subscribeBars: symbolInfo = ' + symbolInfo.ticker + ', resolution = ' + resolution
		// 	+ ', subscriberUID = ' + subscriberUID);

		// setInterval(function () {
		// 	var t = parseInt(new Date().getTime() / 1000 / 60) * 60 * 1000;
		// 	console.log('onRealtimeCallback: t = ' + t + ', ' + new Date(t).toUTCString());
		// 	onRealtimeCallback({
		// 		time: t,
		// 		open: 100,
		// 		high: 200 + Math.random() * 100,
		// 		low: 300 - Math.random() * 100,
		// 		close: 100,
		// 		volume: 10
		// 	})
		// }, 1000);
		// return;

		// 获取k线数据
		self.$socket.on({
		    key: 'topic_bar',
		    bind: self,
		    callBack: (message) => {
		    	let b = message.data;
		    	if (!b) return;
		    	onRealtimeCallback({
					time: b[0],
					open: b[1],
					high: b[2],
					low: b[3],
					close: b[4],
					volume: b[5]
				});
		    }
	  	})

	};

	BitexDataFeed.prototype.unsubscribeBars = function (subscriberUID) {
		// console.error('[unsubscribeBars: subscriberUID = ' + subscriberUID);
	};


	function initTradingView() {
		var mobile = {
			symbol: self.symbol,
			interval: new_interval,
			width: '100%',
			height: '100%',
			container_id: "mobile_chart_container",
			//	BEWARE: no trailing slash is expected in feed URL
			datafeed: new BitexDataFeed(),
			library_path: "/static/chart/",
			locale: "zh",
			timezone: 'Asia/Shanghai',
			// 引入第三方样式
			custom_css_url: 'css/mobile_chart_mobile.css',
			//	Regression Trend-related functionality is not implemented yet, so it's hidden for a while
			drawings_access: { type: 'black', tools: [ { name: "Regression Trend" } ] },
			disabled_features: ['use_localstorage_for_settings', 'left_toolbar', 'header_symbol_search', 'timeframes_toolbar', 'header_interval_dialog_button', 'header_chart_type', 'header_settings', 'header_indicators', 'header_screenshot', 'create_volume_indicator_by_default', 'border_around_the_chart', 'dont_show_boolean_study_arguments'],
			preset: "mobile",
			toolbar_bg: '#000',
			favorites: {
				intervals: ["1S", "1", "5", "15", "30", "60", "240", "D"],
				chartTypes: ["Candles"]
			},
			overrides: {
				"mainSeriesProperties.style": 2,
				"paneProperties.background": "#131F30",
                "paneProperties.vertGridProperties.color": "#01040a",
                "paneProperties.horzGridProperties.color": "#01040a",
				"symbolWatermarkProperties.transparency": 90,
				"scalesProperties.textColor" : "#AAA",
				"mainSeriesProperties.lineStyle.color": "#02c0cc",
				"mainSeriesProperties.lineStyle.linewidth": 2,
				"paneProperties.legendProperties.showLegend": false,

				// 蜡烛样式
				"mainSeriesProperties.candleStyle.upColor": "#02987D",
				"mainSeriesProperties.candleStyle.downColor": "#C43E4E",
				"mainSeriesProperties.candleStyle.drawWick": true,
				"mainSeriesProperties.candleStyle.drawBorder": true,
				"mainSeriesProperties.candleStyle.borderColor": "#378658",
				"mainSeriesProperties.candleStyle.borderUpColor": "#02987D",
				"mainSeriesProperties.candleStyle.borderDownColor": "#C43E4E",
				"mainSeriesProperties.candleStyle.wickUpColor": '#02987D',
				"mainSeriesProperties.candleStyle.wickDownColor": '#C43E4E',
				"mainSeriesProperties.candleStyle.barColorsOnPrevClose": false,
				"scalesProperties.showRightScale" : false,  //是否显示右侧刻度


				// 边际（百分比）。 用于自动缩放。
				"paneProperties.topMargin": 15,
				"paneProperties.bottomMargin": 10,
			}
		}

		widget = new TradingView.widget(mobile);
		widget.onChartReady(function () {
			let id = widget.id;
			// console.log($("#"+id).contents().find('canvas'))
			$($("#"+id).contents().find('canvas')).on('click', function(){
				console.log(1)
			});
		});
	}
}



export default root;
