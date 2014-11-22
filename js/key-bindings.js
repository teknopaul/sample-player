

if(typeof nt=='undefined') {
	/**
	 * @namespace nt namespace object
	 */
	var nt = new Object();
}

/**
 * KeyBindings for the Sampler
 */
nt.SamplerKeys = function(view) {
	this.view = view;
};

nt.SamplerKeys.prototype.handlePlaySample = function(idx) {
	this.view.play(idx);
};

nt.SamplerKeys.prototype.handleStopSample = function(idx) {
	this.view.stop(idx);
};

nt.SamplerKeys.prototype.handlePauseSample = function(idx) {
	this.view.pause(idx);
};

nt.SamplerKeys.prototype.handleStopAll = function(idx) {
	this.view.stop(idx);
};

nt.SamplerKeys.prototype.bind = function() {
	var keys = this;
	var bindings = function(e){
		try {

			if(e.key === '1' ||
					e.key === '2' ||
					e.key === '3' ||
					e.key === '4' ||
					e.key === '5' ||
					e.key === '6' ||
					e.key === '7' ||
					e.key === '8' ||
					e.key === '9' ||
					e.key === '0' 
				) {
				if ( e.altKey ) {
					e.preventDefault();
					keys.handleStopSample(e.key);
				}
				else {
					e.preventDefault();
					keys.handlePlaySample(e.key);
				}
			}
			
			// space stop all
			if (e.key === ' ' ) {
				for (var i = 0 ; i < 10 ; i++ ) {
					try {
						keys.handleStopSample(i);
					} catch (err) {
						// ignore, probably not a full sound-bank
					}
				}
			} 

			else if ( (e.key === 'Up') ) {
				e.preventDefault();
				keys.view.loadPrevSoundBank();
			}
			else if ( (e.key === 'Down') ) {
				e.preventDefault();
				keys.view.loadNextSoundBank();
			}
			else if ( (e.key === 'F1') ) {
				e.preventDefault();
				keys.view.openHelp();
			}
			
		} catch(err) {
			alert("Error: " + err);
		}
	}
	$(window).keydown(bindings);


};

