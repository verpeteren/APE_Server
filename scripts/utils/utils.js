var ape_http_request = Ape.HTTPRequest;

Ape.HTTPRequest = function(url, data) {
	switch ($type(data)) {
		case 'object': case 'hash': data = Hash.toQueryString(data);
	}
	ape_http_request(url, data);
};

Ape.randomString = function(length, chars) {
	//http://stackoverflow.com/questions/10726909/random-alpha-numeric-string-in-javascript
	//console.log(randomString(16, 'aA'));  //console.log(randomString(32, '#aA'));  //console.log(randomString(64, '#A!'));
	var mask = '';
	var result = '';
	if (chars.indexOf('a') > -1) mask += 'abcdefghijklmnopqrstuvwxyz';
	if (chars.indexOf('A') > -1) mask += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
	if (chars.indexOf('#') > -1) mask += '0123456789';
	if (chars.indexOf('!') > -1) mask += '~`!@#$%^&*()_+-={}[]:";\'<>?,./|\\';
	for (var i = length; i > 0; --i) {
		result += mask[Math.round(Math.random() * (mask.length - 1))];
	}
	return result;
};
