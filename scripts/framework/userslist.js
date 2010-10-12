Ape.addEvent("mkchan", function(channel) {
	channel.userslist = new Object();
});

Ape.addEvent("afterJoin", function(user, channel) {
	channel.userslist[user.getProperty('pubid')] = user;
});

Ape.addEvent("left", function(user, channel) {
	delete channel.userslist[user.getProperty('pubid')];
});

Ape.registerCmd("list", false, function(params, infos) {
	
});
