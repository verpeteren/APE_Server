Ape.addEvent('init', function() {
	try {
		include("test/Systemcmd.js");
		include("test/MySQL.js");
		include("test/Socket.js");
		include("test/Pipes.js");
		include('test/Systemcmd.js');
		include('test/Hostname.js');
		include('test/MySQL.js');
		include('test/Socket.js');
		include('test/Pipes.js');
		//include('test/MeteorLeak.js');//this test will harm your server!!!
		include('test/Eval.js');
		include('test/Properties.js');
		include('test/FileReadWrite.js');
		include('test/Status.js');
		include("test/Mongo.js");
		include('test/Status.js');
>>>>>>> .merge_file_YXx5Nz
	} catch (e) {
		Ape.log(e.message + '\n\t' + e.fileName + ':' + e.lineNumber);
	}
});
