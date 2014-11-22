

if(typeof nt=='undefined') {
	/**
	 * @namespace nt namespace object
	 */
	var nt = new Object();
}

nt.SamplerFs = function(app) {
	this.app = app;
};

nt.SamplerFs.prototype.saveJson = function(aDom, jsonObj) {
	a.attr('href', 'data:application/x-json;base64,' + btoa(JSON.stringify(jsonObj)));
	a.show();
};


