

if(typeof nt=='undefined') {
	/**
	 * @namespace nt namespace object
	 */
	var nt = new Object();
}

nt.Sample = function(url, name, loop, mediaType) {
	this.url = url;
	this.name = name || "";
	this.loop = loop || false;
	this.mediaType = mediaType || "audio/wav";
};

nt.SamplerModel = function() {
	this.samples = [];
	
};
/**
 */
nt.SamplerApp = function() {
	this.model = new nt.SamplerModel();
	this.view = new nt.SamplerView(this);
	this.players = [];
	this.banks = [];
	this.currentBank = 0;
	this.init();
	this.view.init();
};

nt.SamplerApp.prototype.init = function() {
//	for( var i = 0 ; i < 10 ; i++ ) {
//		this.add(i, "sound-bank/record-scratch.wav", "Scratch!", false, "audio/wav");
//	}
	$('#sampler').focus();
	var app = this;
	app.loadSoundBankList(function(banks) {
		app.load(banks[0]);
	});
};

nt.SamplerApp.prototype.loadSoundBankList = function(callback) {
	var app = this;
	$.ajax({
		type : 'GET',
		url : 'banks.json',
		dataType : 'json',
		error : function(resp) {
			alert("Could not find the file " + app.basedir() + "/banks.json");
		},
		success : function(resp) {
			app.banks = resp;
			app.view.loadSoundBankList(resp);
			if (callback) callback(resp);
		}
	});
};

nt.SamplerApp.prototype.load = function(soundBank) {
	var app = this;
	$.ajax({
		type : 'GET',
		url : soundBank + '/sound-bank.json',
		dataType : 'json',
		error : function(resp) {
			alert("Could not find the file " + app.basedir() + "/" + soundBank + '/sound-bank.json');
		},
		success : function(resp) {
			app.view.clear();
			app.loadSoundBank(soundBank, resp);
			app.currentBank = app.banks.indexOf(soundBank);
			app.view.highlightBank(soundBank);
		}
	});
};

nt.SamplerApp.prototype.loadSoundBank = function(soundBank, json) {
	var samples = json.samples;
	if (json['background-color']) {
		$('body').css('background-color', json['background-color']);
	}
	else {
		$('body').css('background-color', '#fff');
	}
	for ( var s = 0 ; s < 10 ; s++ ) {
		samples[s].url = soundBank + '/' + samples[s].url;
		this.addSample(s, samples[s]);
	}
	
};
nt.SamplerApp.prototype.add = function(idx, url, name, loop, mediaType) {
	this.addSample(idx, new nt.Sample(url, name, loop, mediaType));
};

nt.SamplerApp.prototype.addSample = function(idx, sample) {
	this.model.samples[idx] = sample;
	var player = this.view.initPlayer(idx, sample);
	this.players[idx] = player;
};

nt.SamplerApp.prototype.play = function(idx) {
	var domObject = this.players[idx];
	try {
		domObject.currentTime = 0.0;
		domObject.play();
		this.view.flash(domObject);
	} catch (err) {
		var fileName = domObject.currentSrc;
		if (fileName.indexOf("file://") === 0) fileName = fileName.substring(7);
		alert("Could not play the audio file\n\n\"" + fileName + "\"");
	}
};

nt.SamplerApp.prototype.stop = function(idx) {
	var domObject = this.players[idx];
	domObject.pause();
	domObject.currentTime = 0.0;
};

nt.SamplerApp.prototype.pause = function(idx) {
	var domObject = this.players[idx];
	domObject.pause();
};

nt.SamplerApp.prototype.change = function(idx, url) {
	this.add(idx, url);
};

nt.SamplerApp.prototype.remove = function(idx) {
	this.players[idx] = undefined;
};

nt.SamplerApp.prototype.loadPrevSoundBank = function() {
	if ( this.currentBank > 0) {
		this.load(this.banks[this.currentBank - 1]);
	}
};
nt.SamplerApp.prototype.loadNextSoundBank = function() {
	if ( this.currentBank + 1 < this.banks.length) {
		this.load(this.banks[this.currentBank + 1]);
	}
};
nt.SamplerApp.prototype.basedir = function() {
	var root = document.baseURI.substring(0, document.baseURI.lastIndexOf("/index.html"));
	if (root.indexOf("file://") === 0) root = root.substring(7);
	return root;
};
/**
 * Save local JSON magic.
 */
nt.SamplerApp.prototype.saveJson = function(aDom, jsonObj) {
	aDom.attr('href', 'data:application/x-json;base64,' + btoa(JSON.stringify(jsonObj)));
	aDom.show();
};