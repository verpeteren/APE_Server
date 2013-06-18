Ape.log(' =====================================>>> \n Start up for test/Mongo.js\n');
try{
		var db = 'test_ape_mongo';
	var collection = 'test';
		Ape.Mongo.prototype.onConnect = function() {
		Ape.log('[Mongo] Connected to mongo server.');
	};
	Ape.Mongo.prototype.onError = function(errorNo) {
		Ape.log('[Mongo] Connection Error : ' + errorNo + ' : ' + this.errorString());
	};
	
	var mongo = new Ape.Mongo('127.0.0.1', 27017, 2000);
	Ape.log('1	=====================================\n');
	mongo.drop(	db, 
			collection, 
			function() {
				Ape.log('drop ' + db + '.' + collection + ' success');
			},
			function (code, error) {
				Ape.log('drop error code:' + code + ' ' + error);
			}
	);
	Ape.log('2	=====================================\n');
	mongo.insert(	db, 
			collection, 
			{'name': 'peter', 'age' : 99, 1: 'one', 'nice': true, 'iq': 10.255 *10E+3, sports: ['sail', 'hack'], 'data': {'a': 6}}, 
			function(id) {
				Ape.log("Inserted id: " + id);
			}, 
			function (code, error) {
				Ape.log('insert error code:' + code + ' ' + error);
			 }
	);
	mongo.insert(	db, 
			collection, 
			{'name': 'john', 'age' : 99, 1: 'one', 'nice': true, 'iq': 10.255}, 
			function(id) {
				Ape.log("Inserted id: " + id);
			}, 
			function (code, error) {
				Ape.log('insert error code:' + code + ' ' + error);
			}
	);
	Ape.log('3	=====================================\n');
	mongo.query(	db, 
			collection, 
			{'name': 'peter'}, 
			function(res) {
				Ape.log(JSON.stringify(res));
			}, 
			function (code, error) {
				Ape.log('query error code:' + code + ' ' + error);
			}
	);
	Ape.log('4	=====================================\n');
	mongo.query(	db, 
			collection, 
			{'$query': {'name': 'peter'}, '$orderby': {'iq' : -1 }}, 
			function(res) {
				Ape.log(JSON.stringify(res));
			}, 
			function (code, error) {
				Ape.log('query error code:' + code + ' ' + error);
			}
	);
	Ape.log('5	=====================================\n');
	mongo.update(	db,
			collection,
			{'name' : 'peter'},  
			{'$inc' : {'iq': 1}}, 
			function(res) {
				mongo.query(	db,
						collection,
						{'name': 'peter'}, 
						function() {
							Ape.log("update ok");
						}, 
						function (code, error) {
							Ape.log('query error code:' + code + ' ' + error);
						});
		},
		function (code, error) {
			Ape.log('update error code:' + code + ' ' + error);
		}
	);
	Ape.log('6	=====================================\n');
	mongo.remove(	db, 
			collection, 
			{'name' : 'john'},
			function(res) {
				Ape.log("remove ok");
				mongo.query(	db, 
						collection, 
						{'name': 'john'},
						function(res) {
							Ape.log(JSON.strinify(res));
						},
						function (code1, error1) {
							Ape.log('query error code:' + code1 + ' ' + error1);
						});
				mongo.query(	db, 
					collection, 
					{'name': 'peter'},
					function(res) {
						Ape.log(JSON.strinify(res));
					},
					function (code1, error1) {
						Ape.log('query error code:' + code1 + ' ' + error1);
					});
			},
			function (code, error) {
				Ape.log('remove error code:' + code + ' ' + error);
			}
	);
	Ape.log('7	=====================================\n');
	mongo.command(	db, 
			collection, 
			'drop', 
			function(res) {
				Ape.log(JSON.stringify(res));
			}, function (code, msg) {
				Ape.log('error code:' + code + ' ' + msg);
			});
	Ape.log('8	=====================================\n');
	mongo.check(	function() {
				Ape.log("Connection ok");
			},
			function (code, error) {
				Ape.log('error code:' + code + ' ' + error);
			}
	);
	
	Ape.log('9	=====================================\n');
	delete mongo;
	mongo.close();
	Ape.log('10	=====================================\n');
	delete mongo;
	mongo.check(	function() {
				Ape.log("Connection ok");
			}, function (code, error) {
				Ape.log('error code:' + code + ' ' + error);
			}
	 )
}catch(e){
	Ape.log('[Mongo] Connection' + e.message + '\n\t' + e.fileName + ':' + e.lineNumber);	
}

Ape.log('<<< =====================================\n');
