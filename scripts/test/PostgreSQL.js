Ape.log(' =====================================>>> \n Start up for test/PostgreSQL.js\n' );
Ape.PostgreSQL.onConnect = function(){
	Ape.log('Connection successfull');
}

Ape.PostgreSQL.onError = function(errorNo){
	Ape.log('Could not connect to PostgreSql: error = ' + errorNo);
}

var sql = new Ape.PostgreSQL("hostaddr=10.0.0.25 dbname=apedevdb user=apedev password=vedepa port=5432", Ape.PostgreSQL.onConnect, Ape.PostgreSQL.onError);
Ape.log(sql);
delete (sql);

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
