Ape.log(' =====================================>>> \n Start up for test/PostgreSQL.js\n' );
Ape.PostgreSQL.onConnect = function(){
	Ape.log('Connection successfull');
}

Ape.PostgreSQL.onError = function(){
	Ape.log('Could not connect to PostgreSql!');
	Ape.log(this.errorString());
}
/*
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

*/

Ape.log(' =====================================>>> \n Connection object test\n' );
var pgsqlo = new Ape.PostgreSQL({'hostaddr': '10.0.0.25', 'dbname': 'apedevdb', 'user': 'apedev', 'password': 'vedepa', 'port': '5432'});
Ape.log(pgsqlo);
var status = pgsqlo.status();
for (var k in status) {
	Ape.log('\t' + k + ':\t' + status[k]);
 }
/*
pgsqlo.query('SELECT nspname AS pp FROM pg_catalog.pg_namespace', null, function(res, code, affected, lastOid) {
	Ape.log(res);
	Ape.log("code: " + code + " affected:" + affected + " lastOid:" + lastOid );
});
pgsqlo.query('SELECT nspname AS p1 FROM pg_catalog.pg_namespace', null, function(res, code, affected, lastOid) {
	Ape.log(res);
	Ape.log("code: " + code + " affected:" + affected + " lastOid:" + lastOid );
});
*/
Ape.log(' =====================================>>> \n Create table test\n' );
//postgresql server >=9.1
var sqls = ['CREATE TABLE IF NOT EXISTS foo (' + '\n' +
					' id SERIAL PRIMARY KEY,' + '\n' +
					' ed INTEGER,' + '\n' +
					' t TIMESTAMP DEFAULT now(),' +'\n' +
					' bar VARCHAR(32), ' +'\n' +
					' listint integer[]' + '\n' +
					') WITH OIDS ;', 
	'INSERT INTO foo (ed, bar) VALUES (1, \'he?\');',										//this leaves you in the dark,
	'INSERT INTO foo (ed, bar) VALUES (2, \'dump\') RETURNING Ed;',							//this returns a useless column
	'INSERT INTO foo (ed, bar) VALUES (3, \'bump\') RETURNING t;',							//this returns a useless column
	'INSERT INTO foo (ed, bar) VALUES (4, \'cool\') RETURNING Id;',							//this returns the id column
	'INSERT INTO foo (ed, bar) VALUES (5, \'cooler\') RETURNING foo;',						//this returns the whole record, including the default values)
	'INSERT INTO foo (ed, bar) VALUES (6, \'cooler\') RETURNING *;',						//this returns the whole record, including the default values)
	'INSERT INTO foo (ed, bar) VALUES (7, \'boring\'); SELECT currval(\'foo_id_seq\');', 	//you need a primary key, and it takes 2 reads. Note: affected paramenter is 2 in this case!
	'INSERT INTO foo (ED, BAR, listint) VALUES (8, \'COOL\', \'{1, 1 ,2, 3, 5, 8, 13}\');'	//oh yes you can use array's
	];
sqls.each(function(sql, i) {
	pgsqlo.query(sql, null,  function(res, code, affected, lastOid) {
		Ape.log(sql);
		Ape.log("code: " + code + " affected:" + affected + " lastOid:" + lastOid );
		if (code < 0 ) {
			Ape.log(this.errorString());
		} else {
			Ape.log(res);
		}
	});
});
var sql;
sql =  'INSERT INTO foo (bar) VALUES ($1) RETURNING id as var;';
pgsqlo.query(sql, ['Beatnuts` No escapin\' this!'], function(res, code, affected, lastOid) {
	Ape.log(sql);
	Ape.log("code: " + code + " affected:" + affected + " lastOid:" + lastOid );
	if (code < 0 ) {
		Ape.log(this.errorString());
	} else {
		Ape.log(res);
	}
});
/*sql = 'INSERT INTO foo (ed) VALUES ($1) RETURNING Id;'; 
pgsqlo.query(sql,[9], function(res, code, affected, lastOid) {
	Ape.log(sql);
	Ape.log("code: " + code + " affected:" + affected + " lastOid:" + lastOid );
	if (code < 0 ) {
		Ape.log(this.errorString());
	} else {
		Ape.log(res);
	}
});
sql = 'INSERT INTO foo (t) VALUES ($1) RETURNING Id;';
pgsqlo.query(sql, ['yesterday'], function(res, code, affected, lastOid) {
	Ape.log(sql);
	Ape.log("code: " + code + " affected:" + affected + " lastOid:" + lastOid );
	if (code < 0 ) {
		Ape.log(this.errorString());
	} else {
		Ape.log(res);
	}
});

sql = 'INSERT INTO foo (ed, bar) VALUES ($1, $2) RETURNING Id;';
ppgsqlo.query(sql, [10, 'Beatnuts` No escapin\' this!'], function(res, code, affected, lastOid) {
	Ape.log(sql);
	Ape.log("code: " + code + " affected:" + affected + " lastOid:" + lastOid );
	if (code < 0 ) {
		Ape.log(this.errorString());
	} else {
		Ape.log(res);
	}
});*/
/*var orderingMatters = [];
orderingMatters.length = 2;
orderingMatters[1] = 'tst';
orderingMatters[0] = 11;
sql = 'INSERT INTO foo (ed, bar) VALUES ($1, $2) RETURNING Id;';-
gsqlo.query(sql, orderingMatters, function(res, code, affected, lastOid) {
	Ape.log(sql);
	Ape.log("code: " + code + " affected:" + affected + " lastOid:" + lastOid );
	if (code < 0 ) {
		Ape.log(this.errorString());
	} else {
		Ape.log(res);
	}
});
*/

Ape.log("<<< =====================================\n");
