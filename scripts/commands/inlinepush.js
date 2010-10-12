Ape.registerCmd("inlinepush", false, function(params, infos) {
	if (params.password == Ape.config("inlinepush.conf", "password")) {
		
		if (params.channel != undefined && params.data != undefined && params.raw != undefined) {
			var chan = Ape.getChannelByName(params.channel);
			if (chan == undefined) return ["401", "UNKNOWN_CHANNEL"];
			
			chan.pipe.sendRaw(params.raw, params.data);
			
			return {"name":"pushed","data":{"value":"ok"}};
		} else {
			return 0;
		}
	} else {
		return ["400", "BAD_PASSWORD"];
	}

})
