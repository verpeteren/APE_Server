var userlist = new Object();

Ape.registerHookCmd("connect", function(params, cmd) {
	if (params == undefined || params.name == undefined) return 0;
	if (userlist[params.name.toLowerCase()] != undefined) return ["007", "NICK_USED"];
	if (params.name.length > 16 || params.name.test('[^a-zA-Z0-9]', 'i')) return ["006", "BAD_NICK"];

	cmd.user.setProperty('name', params.name);
	
	return 1;
});

Ape.addEvent('adduser', function(user) {
	userlist[user.getProperty('name').toLowerCase()] = true;	
});

Ape.addEvent('deluser', function(user) {
	delete userlist[user.getProperty('name').toLowerCase()];
});
