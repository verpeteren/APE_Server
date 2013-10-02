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
pgsql.query('SELECT pg_tables.* FROM pg_tables pg_tables', function(res, code) {
	Ape.log(res);
	Ape.log(code);
});



Ape.log(' =====================================>>> \n Connection object test\n' );
//libpq >= 9.0
var pgsqlo = new Ape.PostgreSQL({'hostaddr': '10.0.0.25', 'dbname': 'apedevdb', 'user': 'apedev', 'password': 'vedepa', 'port': '5432'});
Ape.log(pgsqlo);
var status = pgsqlo.status();
for (var k in status) {
	Ape.log('\t' + k + ':\t' + status[k]);
 }
pgsqlo.query('SELECT nspname FROM pg_catalog.pg_namespace', function(res, code) {
	Ape.log(res);
	Ape.log(code);
});
pgsqlo.query('SELECT nspname FROM pg_catalog.pg_namespace', function(res, code) {
	Ape.log(res);
	Ape.log(code);
});

Ape.log(' =====================================>>> \n Create table test\n' );
//postgresql server >=9.1
var sql = 'CREATE TABLE IF NOT EXISTS foo (' + '\n' +
					' id SERIAL,' + '\n' +
					' bar varchar' +'\n' +
					');';
Ape.log(sql);
pgsqlo.query(sql,  function(res, code) {
	Ape.log(res);
	Ape.log(code);
});






//pgsql.query("insert into nonextistingTable (foo, bar) Values (NULL, '');
//Ape.log(psql.errorString());
delete (pgsql);

//var sql2 = new Ape.PostgreSQL({';



//pgsql.query("insert into nonextistingTable (foo, bar) Values (NULL, '');
//Ape.log(psql.errorString());

//var sql2 = new Ape.PostgreSQL({'hostaddr': '10.0.0.25', 'port' : 5432, 'user': 'apedev', 'password': 'vedepa', 'dbname': 'apedevdb'});
//Ape.log(sql2); 
/*sql.onConnect = function() {
    Ape.log('[MySQL] Connected to mysql server. Trying Query');

    sql.query("SELECT * FROM test_table", function(res, errorNo) {
            if (errorNo) {
                    Ape.log('[MySQL] Request error : ' + errorNo + ' : '+ this.errorString());
            } else {
                    Ape.log('[MySQL] Fetching ' + res.length);
                    for(var i = 0; i < res.length; i++) {
                            Ape.log(res[i].ID + "  -> " + res[i].value); //res[i].<column name>
                    }
            }
    });
}

sql.onError = function(errorNo) {
  Ape.log('[MySQL] Connection Error : ' + errorNo + ' : '+ this.errorString());
}
*/
Ape.log("<<< =====================================\n");
