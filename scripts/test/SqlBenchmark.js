/*
 * This is a small benchmark to validate the efford for building a Ape.PostgreSQL adapter.
 * Is only meant to ease my counsious and my family. provided that postgresq is faster indeed.... :-).
 * Hmm, that migth sound a little biased..  Here is my outcome.
 * 
 *					start						end								duration
 * Postgresql 		2013-10-15 13:07:55.070493	2013-10-15 13:08:17.413611		 23 seconds
 * MySql			2013-10-15 13:43:13			2013-10-15 13:44:58				105 seconds
 *
 *
 * Test it out yourself:
 * Set on of these variables my or pg with the connection parameters that you like. 
 *
 * How does it work
 * 1) connect
 * 2) create the tables
 * 3) insert basedata for customers and build a lookup
 * 4) insert basedata for parts and build a lookup
 * 5) wait, (the timer start is embedded in 6.)
 * 6) insert each part for each customer in the orders table, increment the quantity field
 * 7) wait
 * 8) print a sql statement that should return 2 records, with the timer results
 *
 * setup:
 * uname -a: Linux P2201 3.2.0-4-686-pae #1 SMP Debian 3.2.46-1+deb7u1 i686 GNU/Linux
 * select version(); "PostgreSQL 9.1.9 on i686-pc-linux-gnu, compiled by gcc (Debian 4.7.2-5) 4.7.2, 32-bit"
 * status; "mysql  Ver 14.14 Distrib 5.5.31, for debian-linux-gnu (i686) using readline 6.2"
 *
 * You cheated in your setup: 
 *  - You did not use localhost:				Seperate functions, seperate hosts
 *  - Why is that grace delay so high:				MySql takes long to insert the basedata in the customer and parts table
 *  - You probably had a bad setup:					Nope, standard apt-get install, but I configured postgresql with extensive logging, to slow it down.
 *  - You used InnoDb, that is slow:				But we are talking about a RDBMS, not a flat file.
 *  - You do not escape quotes in pg:				Correct: but when bug 8524 is solved, it will even run faster in postgresql
 *  - you used a very old version of mysac: 		Please help me upgrade it.
 *  - This is not a representative way of working:	libmod-spidermonkey treats the datebase object as a fifo queue
 *  - You used many indexes:						Yes, I like it
 *  - Of course this is slow, you should use mongo:	Maybe another time, Is mongo webscale?
 */

my = {hostip: '10.0.0.25:3306', user: 'ape', password: 'ape', db: 'ape_test'};
pg = {connect: 'hostaddr=10.0.0.25 dbname=apedevdb user=apedev password=vedepa port=5432'};

//pg = false;
my = false

var grace = 60 * 1000 ;

Ape.log(' =====================================>>> \n Start up for test/SqlBenchmark.js\n' );
var i;
var CUSTOMERS = new Hash({
	'lisa': null, 
	'bart': null, 
	'maggie': null, 
	'homer': null, 
	'marge': null, 
	'millhouse': null, 
	'martin': null, 
	'ralph': null, 
	'burns': null, 
	'smithers': null, 
	'barney': null, 
	'grampa': null, 
	'flanders': null, 
	'wiggum': null, 
	'lovejoy': null, 
	'willie': null, 
	'apu': null, 
	'bob': null, 
	'skinner': null, 
	'edna ': null, 
	'krusty': null, 
	'nelson': null, 
	'quimby': null, 
	'brockman': null, 
	'apu': null, 
	'riviera': null, 
	'otto': null, 
	'patty': null, 
	'selma': null, 
	'frink': null
});
var PARTS = new Hash({
	'Akiapolaau': null, 
	'Anhinga': null, 
	'Apapane': null, 
	'Auklet': null, 
	'Avocets': null, 
	'Blue Jay': null, 
	'Bobwhite': null, 
	'Brown Thrasher': null, 
	'Bunting': null, 
	'Canary': null, 
	'Cardinal': null, 
	'Chat': null, 
	'Chickadee': null, 
	'Chicken': null, 
	'Cockatiel': null, 
	'Condor': null, 
	'Cormorant': null, 
	'Crossbill': null, 
	'Crow': null, 
	'Curlew': null, 
	'Currawong': null, 
	'Dowitchers': null, 
	'Duck': null, 
	'Eagle': null, 
	'Egret': null, 
	'Eider': null, 
	'Elepaio': null, 
	'Falcon': null, 
	'Flycatcher': null, 
	'Gallinule': null, 
	'Goldfinch': null, 
	'Goose': null, 
	'Grosbeak': null, 
	'Grouse': null, 
	'Gull': null, 
	'Harrier': null, 
	'Heron': null, 
	'Hummingbird': null, 
	"I-iwi": null, 
	'Ibis': null, 
	'Jaeger': null, 
	'Kite': null, 
	'Limpkin': null, 
	'Loon': null, 
	'Macaw': null, 
	'Magpie': null, 
	'Murrelet': null, 
	'Muscovy': null, 
	'Nene': null, 
	'Omao': null, 
	'Oriole': null, 
	'Owl': null, 
	'Palila': null, 
	'Parakeet': null, 
	'Parrot': null, 
	'Peep (Stint)': null, 
	'Pelican': null, 
	'Penguine': null, 
	'Peregrine': null, 
	'Phalarope': null, 
	'Pigeon': null, 
	'Plover': null, 
	'Puffins': null, 
	'Quail': null, 
	'Raven': null, 
	'Robin': null, 
	'Rosella': null, 
	'Sanderling': null, 
	'Sandpipyer': null, 
	'Sapsucker': null, 
	'Scoter': null, 
	'Shrike': null, 
	'Solitaire': null, 
	'Sora': null, 
	'Sparrow': null, 
	'Stint (Peep)': null, 
	'Stork': null, 
	'Swan': null, 
	'Swift': null, 
	'Tanagers': null, 
	'Tern': null, 
	'Thrush': null, 
	'Thornbill': null, 
	'Turkey': null, 
	'Vagrants': null, 
	'Vulture': null, 
	'Warbler': null, 
	'Waxwing': null, 
	'Whimbrel': null, 
	'Whippoorwill': null, 
	'Woodpecker': null 
});
if (pg) {
	Ape.log(' =====================================>>> \n Postgresql benchmark\n' );
	customers = CUSTOMERS;
	parts = PARTS;
	Ape.PostgreSQL.onConnect = function() {
		var status = pgsql.status();
		for (var k in status) {
			Ape.log('\t' + k + ':\t' + status[k]);
		 }
		Ape.log('Connection successfull');
	}
	Ape.PostgreSQL.onError = function() {
		Ape.log('Could not connect to PostgreSql!');
		Ape.log(this.errorString());
		var status = pgsql.status();
		for (var k in status) {
			Ape.log('\t' + k + ':\t' + status[k]);
		 }
	}
	var psql = new Ape.PostgreSQL(pg.connect);
	psql.query('DROP TABLE IF EXISTS ORDERS; ' + 
		'DROP TABLE IF EXISTS PARTS; ' + '\n' +
		'DROP TABLE IF EXISTS CUSTOMERS; ' + '\n' +
		'CREATE TABLE CUSTOMERS (' + '\n' +
		'	CUST_ID			SERIAL 				PRIMARY KEY, ' + '\n' +
		'	CUST_NAME		VARCHAR (20)		NOT NULL, ' + '\n' +
		'	CREATED			TIMESTAMP 			DEFAULT NOW()' + '\n' +
		'); ' + '\n' + 
		'CREATE UNIQUE INDEX I_CUSTOMERS_NAME ON CUSTOMERS (CUST_NAME);' + '\n' +
		'CREATE TABLE PARTS( ' + '\n' +
		'	PART_ID			SERIAL				PRIMARY KEY, ' + '\n' +
		'	PART_NAME		VARCHAR(20)			NOT NULL' + '\n' +
		'); ' + '\n' +
		'CREATE UNIQUE INDEX I_PARTS_NAME ON PARTS (PART_NAME);' + '\n' +
		'CREATE TABLE ORDERS( ' + '\n' +
		'	ORDER_ID		SERIAL				PRIMARY KEY, ' + '\n' +
		'	CUST_ID			INT					NOT NULL REFERENCES CUSTOMERS(CUST_ID) ON DELETE RESTRICT, ' + '\n' +
		'	PART_ID 		INT					NOT NULL REFERENCES PARTS(PART_ID) ON DELETE RESTRICT, ' + '\n' +
		'	QUANTITY		INT					NOT NULL, ' + '\n' +
		'	ENTRY 			TIMESTAMP DEFAULT NOW()'  + '\n' +
		');' + '\n' +
		'CREATE INDEX I_ORDERS_CUST_ID ON ORDERS (CUST_ID);' + '\n' +
		'CREATE INDEX I_ORDERS_PART_ID ON ORDERS (PART_ID);' , null, function(res, code, affected, lastOid) {
		if (code != 0 ) {
			Ape.log(this.errorString());
		}
	});
	customers.each(function(c, customer) {
		//8524 psql.query('INSERT INTO CUSTOMERS (CUST_NAME) VALUES ($1) RETURNING CUST_ID;', [customer], function(res, code, affected, lastOid) {
		psql.query('INSERT INTO CUSTOMERS (CUST_NAME) VALUES (\'' + customer + '\') RETURNING CUST_ID;', null, function(res, code, affected, lastOid) {
			customers[customer] = res[0].cust_id;
		});
	});
	parts.each(function(p, part) {
		//8524 psql.query('INSERT INTO PARTS (PART_NAME) VALUES ($1) RETURNING PART_ID;', [part], function(res, code, affected, lastOid) {
		psql.query('INSERT INTO PARTS (PART_NAME) VALUES (\'' + part + '\') RETURNING PART_ID;', null, function(res, code, affected, lastOid) {
			parts[part]= res[0].part_id;
		});
	});
	Ape.setTimeout(function() {
		i = 0;
		customers.each(function(c, customer) {
			parts.each(function(p, part) {
				psql.query('INSERT INTO ORDERS (CUST_ID, PART_ID, QUANTITY) VALUES ($1, $2, $3)', [c, p, i ], function(res, code, affected, lastOid) {});
			});
			i++;
		});
		Ape.setTimeout(function() {
			Ape.log('SELECT MIN(ENTRY) FROM ORDERS WHERE CUST_ID = \'' + customers['lisa'] +'\' AND PART_ID = \'' + parts['Akiapolaau'] + '\' UNION SELECT MAX(ENTRY) FROM ORDERS WHERE CUST_ID = \'' + customers['frink'] + '\' AND PART_ID = \'' + parts['Woodpecker'] + '\'');
			//psql.query('SELECT MIN(ENTRY) FROM ORDERS WHERE CUST_ID = $1 AND PART_ID = $2 UNION SELECT MAX(ENTRY) FROM ORDERS WHERE CUST_ID = $3 AND PART_ID = $4', [customers['lisa'], parts['Akiapolaau'], customers['frink'], parts['Woodpecker']], function(res, code, affected, lastOid) {
			//	Ape.log("Postgresql duration: " + (res[0].entry - res[1].entry) );
			//});
		}, grace);
	}, grace);
}
if (my) {
	Ape.log(' =====================================>>> \n Mysql benchmark\n' );
	customers = CUSTOMERS;
	parts = PARTS;
	var msql = new Ape.MySQL(my.hostip, my.user, my.password, my.db);
	msql.onConnect = function() {
		var sqls = 'DROP TABLE IF EXISTS ORDERS; ' + '\n' + 
				'DROP TABLE IF EXISTS PARTS; ' + '\n' +
				'DROP TABLE IF EXISTS CUSTOMERS; ' + '\n' +
				'CREATE TABLE CUSTOMERS ( ' + '\n' +
				'	CUST_ID						INT NOT NULL AUTO_INCREMENT, ' + '\n' +
				'	CUST_NAME VARCHAR (20)      NOT NULL, ' + '\n' +
				'	CREATED						TIMESTAMP DEFAULT CURRENT_TIMESTAMP,' + '\n' +
				'	PRIMARY KEY (CUST_ID),' + '\n' +
				'	UNIQUE INDEX I_CUSTOMERS_NAME (CUST_NAME)' + '\n' +
				')ENGINE=InnoDB; ' + '\n' +
				'CREATE TABLE PARTS( ' + '\n' +
				'	PART_ID 					INT NOT NULL AUTO_INCREMENT, ' + '\n' +
				'	PART_NAME					VARCHAR(20)		NOT NULL, ' + '\n' +
				'	PRIMARY KEY (PART_ID), ' + '\n' +
				'	UNIQUE INDEX I_PARTS_NAME (PART_NAME)' + '\n' +
				')ENGINE=InnoDB;' + '\n' +
				'CREATE TABLE ORDERS( ' + '\n' +
				'	ORDER_ID 					INT NOT NULL AUTO_INCREMENT, ' + '\n' +
				'	CUST_ID						INT		NOT NULL, ' + '\n' +
				'	PART_ID 					INT NOT NULL, ' + '\n' +
				'	QUANTITY 					INT NOT NULL, ' + '\n' +
				'	ENTRY 						TIMESTAMP DEFAULT CURRENT_TIMESTAMP, ' + '\n' +
				'	PRIMARY KEY (ORDER_ID),  ' + '\n' +
				'	INDEX i_orders_customers_cust_id (CUST_ID),'+ '\n' +
				'	INDEX i_orders_parts_part_id (PART_ID),' + '\n' +
				'	FOREIGN KEY f_customers_customer_id (CUST_ID) REFERENCES CUSTOMERS(CUST_ID) ON DELETE RESTRICT,' + '\n' +
				'	FOREIGN KEY f_parts_part_id (PART_ID) REFERENCES PARTS(PART_ID) ON DELETE RESTRICT' + '\n' +
				')ENGINE=InnoDB;';
		sqls.split(';').each(function(sql, i) {
			if (sql.trim() != '' ) {
				msql.query(sql, function(res, errorNo) {
					if (errorNo) {
						Ape.log('[MySQL] Request error : ' + errorNo + ' : '+ this.errorString());
					} 
				});
			}
		});
		customers.each(function(c, customer) {
			msql.query('INSERT INTO CUSTOMERS (CUST_NAME) VALUES (\'' + Ape.MySQL.escape(customer) + '\');', function(res, code) {
				customers[customer] = msql.getInsertId();
			});
		});
		parts.each(function(p, part) {
			msql.query('INSERT INTO PARTS (PART_NAME) VALUES (\'' + Ape.MySQL.escape(part) + '\')', function(res, code) {
				parts[part]= msql.getInsertId();
			});
		});
		Ape.setTimeout(function() {
			i = 0;
			customers.each(function(c, customer) {
				parts.each(function(p, part) {
					msql.query('INSERT INTO ORDERS (CUST_ID, PART_ID, QUANTITY) VALUES (\'' + c + '\', \'' + p + '\', \'' + i +'\')', function(res, code) {});
				});
				i++;
			});
			Ape.setTimeout(function() {
				Ape.log('SELECT MIN(ENTRY) FROM ORDERS WHERE CUST_ID = \'' + customers['lisa'] +'\' AND PART_ID = \'' + parts['Akiapolaau'] + '\' UNION SELECT MAX(ENTRY) FROM ORDERS WHERE CUST_ID = \'' + customers['frink'] + '\' AND PART_ID = \'' + parts['Woodpecker']+'\'');
			}, grace);
		}, grace);
	};
	msql.onError = function(errorNo) {
	  Ape.log('[MySQL] Connection Error : ' + errorNo + ' : '+ this.errorString());
	};
}

Ape.log("<<< =====================================\n");
