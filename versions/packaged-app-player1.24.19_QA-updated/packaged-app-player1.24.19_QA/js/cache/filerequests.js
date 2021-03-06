rvFileRequestInfo = function(url, downloadComplete) {
	
	this.url = url;
	this.lastRequested = new Date(2000, 1, 2, 3, 4, 5, 6); //set it to previous date so beginRequest() returns true on first call
	this.downloadComplete = downloadComplete;

	this.setDownloadComplete = function(value) {
		this.downloadComplete = value;
		if (!value) {
			this.lastRequested = new Date();
		}
	};

};

rvFileRequests = function() {
	
	var DATE_OFFSET_5_MINUTES = 5*60*1000; //5 minutes threshold to check if file is modified.
	var map = new rvHashTable();

	this.register = function(url) {
		var fr = map.get(url);
		if (!fr) {
			fr = new rvFileRequestInfo(url, true);
			map.put(url, fr);
		}
	};

	this.beginRequest = function(url) {
		var res = false;
		var fr = map.get(url);
		if (!fr) {
			//this should never happen because register() is always called first
			fr = new rvFileRequestInfo(url, false);
			map.put(url, fr);
			res = true;
		} else {
			//check if enough time (5 minutes) past since last request and if it's not downloading
			if (fr.downloadComplete) {
				var dt5m = new Date().getTime() - DATE_OFFSET_5_MINUTES;
				if (fr.lastRequested.getTime() < dt5m) {
					res = true;
					fr.setDownloadComplete(false);
				}
			} 
		}
		return res;
	};

	this.endRequest = function(url) {
		var fr = map.get(url);
		if (fr != null) {
			fr.setDownloadComplete(true);
		}
	};
	
};
