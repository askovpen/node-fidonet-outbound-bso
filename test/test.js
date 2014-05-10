var BSO = require('../');
var util = require('util');
var path = require('path');
var assert = require('assert');
describe('Fidonet Outbound BSO', function(){
	var bso=BSO(path.join(__dirname,'/out'),2);
	it('read bso', function(done){
		bso.read(function(err){
			if (err) throw err;
			console.log(util.inspect(bso.files,true,Infinity,true));
			assert.equal(Object.keys(bso.files).length,2);
			done();
		});
	});
});