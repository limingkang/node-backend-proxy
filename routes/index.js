var users = require('./users');
var selfservice = require('./selfservice');


function routerfun(app){
	app.use('/users', users);
	app.use('/selfservice', selfservice);
}

module.exports=routerfun;
