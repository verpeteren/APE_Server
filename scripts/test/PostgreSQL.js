Ape.log(' =====================================>>> \n Start up for test/PostgreSQL.js\n' );
var sql1 = new Ape.PostgreSQL("postgresql:///apedevdb?apedev:vedepa@host=10.0.0.25&port=5433");
Ape.log(sql1); 

var sql2 = new Ape.PostgreSQL({'hostname': 'ape', 'hostaddr': '10.0.0.25', 'port' : 3306, 'user': 'apedev', 'password': 'vedepa', 'dbname': 'apedevdb'});
Ape.log(sql1); 
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