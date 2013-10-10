Ape.log(' =====================================>>> \n Start up for test/PostgreSQL.js\n' );
Ape.PostgreSQL.onConnect = function(){
	Ape.log('Connection successfull');
}

Ape.PostgreSQL.onError = function(){
	Ape.log('Could not connect to PostgreSql!');
	Ape.log(this.errorString());
}

Ape.log(' =====================================>>> \n Connection string test\n' );
var pgsql = new Ape.PostgreSQL('hostaddr=10.0.0.25 dbname=apedevdb user=apedev password=vedepa port=5432');
Ape.log(pgsql);
var status = pgsql.status();
for (var k in status) {
	Ape.log('\t' + k + ':\t' + status[k]);
 }
pgsql.query('SELECT pg_tables.* FROM pg_tables pg_tables', null, function(res, code, affected, lastOid) {
	Ape.log(res);
	Ape.log("code: " + code + " affected:" + affected + " lastOid:" + lastOid );
	pgsql.query('SELECT pg.* FROM pg_tables pg', null, function(res, code, affected, lastOid) {
		Ape.log(res);
		Ape.log("code: " + code + " affected:" + affected + " lastOid:" + lastOid );
	});
});



Ape.log(' =====================================>>> \n Connection object test\n' );
var pgsqlo = new Ape.PostgreSQL({'hostaddr': '10.0.0.25', 'dbname': 'apedevdb', 'user': 'apedev', 'password': 'vedepa', 'port': '5432'});
Ape.log(pgsqlo);
var status = pgsqlo.status();
for (var k in status) {
	Ape.log('\t' + k + ':\t' + status[k]);
 }
pgsqlo.query('SELECT nspname AS pp FROM pg_catalog.pg_namespace', null, function(res, code, affected, lastOid) {
	Ape.log(res);
	Ape.log("code: " + code + " affected:" + affected + " lastOid:" + lastOid );
});
pgsqlo.query('SELECT nspname AS p1 FROM pg_catalog.pg_namespace', null, function(res, code, affected, lastOid) {
	Ape.log(res);
	Ape.log("code: " + code + " affected:" + affected + " lastOid:" + lastOid );
});

Ape.log(' =====================================>>> \n Create table test\n' );
//postgresql server >=9.1
var sqls = ['CREATE TABLE IF NOT EXISTS foo (' + '\n' +
					' id SERIAL PRIMARY KEY,' + '\n' +
					' ed INTEGER,' + '\n' +
					' t TIMESTAMP DEFAULT now(),' +'\n' +
					' bar VARCHAR(25)' +'\n' +
					') WITH OIDS ;', 
	'INSERT INTO foo (ed, bar) VALUES (1, \'wowest\');',
	'INSERT INTO foo (ed, bar) VALUES (2, \'coolest\') RETURNING Ed;',
	'INSERT INTO foo (ed, bar) VALUES (3, \'wow\') RETURNING t;',
	'INSERT INTO foo (ed, bar) VALUES (4, \'cool\') RETURNING Id;',
	'INSERT INTO foo (ed, bar) VALUES (4, \'cool\') RETURNING foo;',
	'INSERT INTO BAR (ED, FOO) VALUES (4, \'COOL\') RETURNING id;'
	];
sqls.each(function(sql, i) {
	pgsqlo.query(sql, null,  function(res, code, affected, lastOid) {
		Ape.log(sql);
		Ape.log("code: " + code + " affected:" + affected + " lastOid:" + lastOid );
		Ape.log(res);
	});
});

pgsqlo.query('INSERT INTO foo (bar) VALUES ($1) RETURNING id;', ['No escapin this!'], function(res, code, affected, lastOid) {
	Ape.log("code: " + code + " affected:" + affected + " lastOid:" + lastOid );
	if (code < 0) {
		Ape.log(this.errorString());
	}
	Ape.log(res);
});
Ape.log("<<< =====================================\n");
