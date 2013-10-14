Ape.log(' =====================================>>> \n Start up for test/PostgreSQL.js\n' );
Ape.PostgreSQL.onConnect = function(){
	var status = pgsql.status();
	for (var k in status) {
		Ape.log('\t' + k + ':\t' + status[k]);
	 }
	Ape.log('Connection successfull');
}

Ape.PostgreSQL.onError = function(){
	Ape.log('Could not connect to PostgreSql!');
	Ape.log(this.errorString());
	var status = pgsql.status();
	for (var k in status) {
		Ape.log('\t' + k + ':\t' + status[k]);
	 }
}

Ape.log(' =====================================>>> \n Connection string test\n' );
var pgsql1 = new Ape.PostgreSQL('hostaddr=10.0.0.25 dbname=apedevdb user=apedev password=vedepa port=5432');
Ape.log(pgsql1);
pgsql1.query('SELECT pg_tables.* FROM pg_tables pg_tables', null, function(res, code, affected, lastOid) {
	Ape.log(res);
	Ape.log("code: " + code + " affected:" + affected + " lastOid:" + lastOid );
});
delete pgsql1;

Ape.log(' =====================================>>> \n Connection object test\n' );
var pgsql2 = new Ape.PostgreSQL({'hostaddr': '10.0.0.25', 'dbname': 'apedevdb', 'user': 'apedev', 'password': 'vedepa', 'port': '5432'});
Ape.log(pgsql2);
pgsql2.query('SELECT nspname AS pp FROM pg_catalog.pg_namespace', null, function(res, code, affected, lastOid) {
	Ape.log(res);
	Ape.log("code: " + code + " affected:" + affected + " lastOid:" + lastOid );
});
Ape.log(' =====================================>>> \n Insert tests\n' );

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
	pgsql2.query(sql, null,  function(res, code, affected, lastOid) {
		Ape.log(sql);
		Ape.log("code: " + code + " affected:" + affected + " lastOid:" + lastOid );
		if (code < 0 ) {
			Ape.log(this.errorString());
		} else {
			Ape.log(res);
		}
	});
});

Ape.log(' =====================================>>> \n Hstore tests\n' );
//
// apt-get install postgresql-contrib-9.1
// su postgres
// pgsql
// >\connect apedevdb
//

var dummyBook = {'author': "John Do", 'pages': 123,'category': 'Comics'};
var sqls = ['CREATE TABLE products (' + '\n' +
			'	 id serial PRIMARY KEY,' + '\n' +
			'	name varchar,' + '\n' +
			'	attributes hstore' + '\n' +
			');' ,
	'INSERT INTO products (name, attributes) VALUES (\'Geek Love: A Novel\', \'author    => "Katherine Dunn",  pages     => 368,  category  => fiction\' );',
	//9.2 'INSERT INTO products (name, attributes) VALUES (\'Blablabla\', \'' + JSON.stringify(dummyBook) + '\'::json::hstore);',
	'SELECT name, attributes->\'device\' as device FROM products WHERE attributes->\'pages\' > \'300\'',
	//'SELECT attributes->author::hstore::json FROM products WHERE attributes->\'pages\' > \'300\';'
	];
sqls.each(function(sql, i) {
	pgsql2.query(sql, null,  function(res, code, affected, lastOid) {
		Ape.log(sql);
		Ape.log("code: " + code + " affected:" + affected + " lastOid:" + lastOid );
		if (code < 0 ) {
			Ape.log(this.errorString());
		} else {
			Ape.log(res);
		}
	});
});


Ape.log(' =====================================>>> \n Parameter tests\n' );
sql1 =  'INSERT INTO foo (bar) VALUES ($1) RETURNING id as var;';
pgsql2.query(sql1, ['Beatnuts` No escapin\' this!'], function(res, code, affected, lastOid) {
	Ape.log(sql1);
	Ape.log("code: " + code + " affected:" + affected + " lastOid:" + lastOid );
	if (code < 0 ) {
		Ape.log(this.errorString());
	} else {
		if (res[0]['id'] == '') {
			Ape.log("-----> POSTGRESQL BUG REPORT 8524 13/10/2013")
		}
		Ape.log(res);
	}
});
sql2 = 'INSERT INTO foo (ed) VALUES ($1) RETURNING Id;'; 
pgsql2.query(sql2,[9], function(res, code, affected, lastOid) {
	Ape.log(sql2);
	Ape.log("code: " + code + " affected:" + affected + " lastOid:" + lastOid );
	if (code < 0 ) {
		Ape.log(this.errorString());
	} else {
		Ape.log(res);
	}
});
sql3 = 'INSERT INTO foo (t) VALUES ($1) RETURNING Id;';
pgsql2.query(sql3, ['yesterday'], function(res, code, affected, lastOid) {
	Ape.log(sql3);
	Ape.log("code: " + code + " affected:" + affected + " lastOid:" + lastOid );
	if (code < 0 ) {
		Ape.log(this.errorString());
	} else {
		Ape.log(res);
	}
});

sql4 = 'INSERT INTO foo (ed, bar) VALUES ($1, $2);';
pgsql2.query(sql4, [10, 'Beatnuts` No escapin\' this!'], function(res, code, affected, lastOid) {
	Ape.log(sql4);
	Ape.log("code: " + code + " affected:" + affected + " lastOid:" + lastOid );
	if (code < 0 ) {
		Ape.log(this.errorString());
	} else {
		Ape.log(res);
	}
});

createList = function() {
	return '{666, 668}';
}

var orderingMatters = [];
orderingMatters.length = 3;
orderingMatters[0] = 11;
orderingMatters[1] = createList();
orderingMatters[2] = 'tst';
sql5 = 'INSERT INTO foo (ed, listint, bar) VALUES ($1, $2, $3) RETURNING Id;';-
pgsql2.query(sql5, orderingMatters, function(res, code, affected, lastOid) {
	Ape.log(sql5);
	Ape.log("code: " + code + " affected:" + affected + " lastOid:" + lastOid );
	if (code < 0 ) {
		Ape.log(this.errorString());
	} else {
		Ape.log(res);
	}
});
sql6 = 'SELECT name, attributes->\'device\' as device FROM products WHERE attributes->\'pages\' > $1';-
pgsql2.query(sql6, [200], function(res, code, affected, lastOid) {
	Ape.log(sql6);
	Ape.log("code: " + code + " affected:" + affected + " lastOid:" + lastOid );
	if (code < 0 ) {
		Ape.log(this.errorString());
	} else {
		Ape.log(res);
	}
});

Ape.log("<<< =====================================\n");
