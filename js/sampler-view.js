

if(typeof nt=='undefined') {
	/**
	 * @namespace nt namespace object
	 */
	var nt = new Object();
}

nt.SamplerView = function(app) {
	this.app = app;
	this.keys = new nt.SamplerKeys(this);
};

nt.SamplerView.prototype.setModel = function(model) {
	this.model = model;
};

/**
 * MVC breaks down here beaks view , create <audio> elements which are really an app concern.
 * @return the element on which to play and stop
 */
nt.SamplerView.prototype.initPlayer = function(idx, sample) {
	try {
		
		var row;
		if (idx === 0) row = 3;
		if (idx >= 1 && idx <= 3) row = 2;
		if (idx >= 4 && idx <= 6) row = 1;
		if (idx >= 7 && idx <= 9) row = 0;
		
		var rowDom = $("#r" + row);
		var padContainer = rowDom.create("div.col-xs-2");
		
		padContainer.create("div.pad").text(idx);
		padContainer.create("div.pad-title").text(sample.name);
		var soundDom = padContainer.create("audio.snd#sound-" + idx + "{controls=true,volume=1.0}");
		if (sample.loop) soundDom.attr("loop", true);
		
		var sourceDom = soundDom.create("source");
		sourceDom.attr("src", sample.url);
		sourceDom.attr("type", sample.mediaType);
		sourceDom.attr("preload", "auto");
		// TODO closeArgs()
		var view = this;
		var sndIdx = idx
		padContainer.bind('click', function() {
			view.play(sndIdx);
		});
		
	} catch (err) {
		alert(err);
	}
	
	return $("#sound-" + idx)[0];
	
};

nt.SamplerView.prototype.init = function() {
	var view = this;
	this.keys.bind();
	$("#save-button").click(function() {
		view.app.save();
	});
};

nt.SamplerView.prototype.clear = function(idx) {
	var rows = $('.row');
	rows.html('');
	rows.create('div.col-xs-3');
};

nt.SamplerView.prototype.play = function(idx) {
	this.app.play(parseInt(idx));
};

nt.SamplerView.prototype.stop = function(idx) {
	this.app.stop(parseInt(idx));
};

nt.SamplerView.prototype.pause = function(idx) {
	this.app.pause(parseInt(idx));
};
nt.SamplerView.prototype.loadPrevSoundBank = function() {
	this.app.loadPrevSoundBank();
};
nt.SamplerView.prototype.loadNextSoundBank = function() {
	this.app.loadNextSoundBank();
};

nt.SamplerView.prototype.flash = function(domObject) {
	var button = $(domObject).parent().find('.pad');
	button.addClass('flash');
	
	setTimeout(function() {
		button.removeClass('flash');
	}, 100);
};


nt.SamplerView.prototype.loadSoundBankList = function(banks) {
	var select = $('#sound-bank-select');
	for(var b = 0 ; b < banks.length ; b ++ ) {
		select.create("div.bank").text(banks[b]);
	}
	var view = this;
	var selectDivs = $('#sound-bank-select div.bank');
	selectDivs.first().addClass('selected');
	selectDivs.bind('click', function (elem) {
		var bankName = elem.target.innerHTML;
		view.app.load(bankName);
	});
};
nt.SamplerView.prototype.highlightBank = function(bankName) {
	var selectDivs = $('#sound-bank-select div.bank');
	selectDivs.removeClass('selected');
	for ( var b = 0 ; b < selectDivs.length ; b++ ) {
		if (selectDivs[b].innerHTML === bankName) {
			$(selectDivs[b]).addClass('selected');
		}
	}
};

nt.SamplerView.prototype.openHelp = function() {
	window.open("help.html");
};