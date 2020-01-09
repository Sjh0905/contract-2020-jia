// bitex exchange

function reload() {
	var url = location.pathname;
	if (location.search) {
		url = url + location.search + '&t=' + new Date().getTime();
	} else {
		url = url + '?t=' + new Date().getTime();
	}
	location.assign(url);
}

function showError(err) {
	UIkit.notification(err, { status: 'danger'});
}

function getJSON(url, data, callback) {
	if (arguments.length === 2) {
		callback = data;
		data = {};
	}
	$.ajax({
		type: 'GET',
		dataType: 'json',
		url: url,
		data: data
	}).done(function (resp) {
		if (resp && resp.success) {
			callback(resp.result);
		} else {
			showError(resp.result.message);
		}
	}).fail(function (jqXHR) {
		showError('Network error: ' + jqXHR.status);
	});
}

function postJSON(url, data, callback) {
	if (arguments.length === 2) {
		callback = data;
		data = {};
	}
	$.ajax({
		type: 'POST',
		dataType: 'json',
		url: url,
		data: JSON.stringify(data || {}),
		contentType: 'application/json'
	}).done(function (resp) {
		if (resp && resp.success) {
			callback(resp.result);
		} else {
			showError(resp.result.message);
		}
	}).fail(function (jqXHR) {
		showError('Network error: ' + jqXHR.status);
	});
}

