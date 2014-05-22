var fs=require('fs');
var path=require('path');
var util=require('util');

var BSO=function(bsoPath, zone){
	if (!(this instanceof BSO)) return new BSO(bsoPath, zone);
	this.bsoPath=bsoPath;
	this.zone=zone;
	this.files={};
//	console.log(path.basename(bsoPath)+" "+path.dirname(bsoPath));
	var stat=fs.statSync(bsoPath);
	if (!stat.isDirectory()){throw bsoPath+' is not Directory';}
};
BSO.prototype.read=function(callback){
	var self=this;
	fs.readdir(path.dirname(this.bsoPath), function(err,dirs){
		if (err) throw err;
		dirs.forEach(function(dir){
			var parts=dir.match(new RegExp(path.basename(self.bsoPath)+'\\.?.*'));
			if (parts!==null) {
				if (parts.index===0){
					var stat=fs.statSync(path.dirname(self.bsoPath)+'/'+parts[0]);
					if (stat.isDirectory()){
						if (path.extname(parts[0]).length===0){
							self.readBSO(path.dirname(self.bsoPath)+'/'+parts[0]);
						}else if (!isNaN(parseInt(path.extname(parts[0]).substr(1),16))){
							self.readBSO(path.dirname(self.bsoPath)+'/'+parts[0],parseInt(path.extname(parts[0]).substr(1),16));
						}
					}
				}
			}
		});
		callback(null,1);
	});
};
BSO.prototype.readBSO=function(dir,zone,net,node){
	var self=this;
	if (zone===undefined){zone=this.zone;}
//	console.log('path: '+dir+', zone: '+zone);
	var parts;
	fs.readdirSync(dir).forEach(function(item) {
		var stat=fs.statSync(dir+'/'+item);
		if (stat.isFile()) {
			if (stat.size===0){return;}
			var prio;
			var kknd;
			var mnet=net;
			var mnode=node;
			var mpoint=0;
			parts=path.extname(item).match(/.([cdhnf])ut/);
			if (parts!==null){
				prio=parts[1];
				kknd='^';
				var filename=dir+'/'+item;
				if (mnet===undefined) {
					mnet=parseInt(path.basename(item,path.extname(item)).substr(0,4),16);
					mnode=parseInt(path.basename(item,path.extname(item)).substr(4,4),16);
				}else {
					mpoint=parseInt(path.basename(item,path.extname(item)).substr(4,4),16);
				}
				self.add(filename,zone+':'+mnet+'/'+mnode+'.'+mpoint,null,kknd,prio);
			}
			parts=path.extname(item).match(/.([cdhnf])lo/);
			if (parts!==null){
				prio=parts[1];
				if (mnet===undefined) {
					mnet=parseInt(path.basename(item,path.extname(item)).substr(0,4),16);
					mnode=parseInt(path.basename(item,path.extname(item)).substr(4,4),16);
				}else {
					mpoint=parseInt(path.basename(item,path.extname(item)).substr(4,4),16);
				}
				var fd=fs.readFileSync(dir+'/'+item);
				fd.toString().split(/\n/).forEach(function(str) {
					if (str.length===0){return;}
					kknd=str.substr(0,1);
					filename=str.substr(1);
					self.add(filename,zone+':'+mnet+'/'+mnode+'.'+mpoint,dir+'/'+item,kknd,prio);
//					console.log('str: '+str);
				});
			}
		} else if (stat.isDirectory()) {
			if (path.extname(item)=='.pnt') {
				var pnet=net;
				var pnode=node;
				if (pnet===undefined) {
					pnet=parseInt(path.basename(item,path.extname(item)).substr(0,4),16);
					pnode=parseInt(path.basename(item,path.extname(item)).substr(4,4),16);
					self.readBSO(dir+'/'+item,zone,pnet,pnode);
				}
			}
		}
	});
};
BSO.prototype.add=function(file,addr,bundle,kknd,prio){
//	console.log(file,addr,bundle,kknd,prio);
	if (!(addr in this.files)) {
		this.files[addr]=[];
	}
	var stat=fs.statSync(file);
	this.files[addr].push({'file':file,'size':stat.size,'bundle':bundle,'kknd':kknd,'prio':prio,'type':'bso'});
};
module.exports=BSO;
