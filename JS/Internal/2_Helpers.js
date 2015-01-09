Namespace.MediaUploader.Helpers = {
	CheckForUploadServiceErrors: function(uploadServiceResponseJson) {
		var errorMsg = null;
		if (uploadServiceResponseJson.ErrorCode) errorMsg = Helpers.GetUploadServiceErrorMsg(uploadServiceResponseJson.ErrorCode);
		return errorMsg;
	},
	GetUploadServiceErrorMsg: function(errorCode) {
		switch (errorCode) { //to be extended e.g. file size exceeded
			default: return "Sorry, something went wrong with the upload";
		}
	},
	BuildMaxNumFilesExceededErrorMsg: function(maxFiles) {
		return "Sorry, only " + maxFiles + " file(s) allowed";
	},
	BuildMaxFileSizeExceededErrorMsg: function(maxSizeMB) {
		return "Sorry, maximum file size exceeded (" + maxSizeMB + "MB)";
	},
	RemoveView: function(view) { //unbind events and remove from DOM		
		this.UnBindView(view);
		view.remove();
	},
	UnBindView: function(view) { //only unbind view events
		view.off(); //unbind events bound with [view.on(event, callback)]
		view.stopListening(); //unbind events bound with [view.listenTo(object, event, callback)]
		view.undelegateEvents(); //unbind events bound within the view's [events: { "click": "save", ... }]
		if (view.model && view.model.off) view.model.off(null, null, view); //unbind events bound to the view's model with [view.model.on(event, callback, view)]
		if (view.collection && view.collection.off) view.collection.off(null, null, view); //unbind events bound to the view's collection with [view.collection.on(event, callback, view)]
	},
	BindAll: function(view) {
		for (var key in view) {
			if (_.isFunction(view[key])) view[key] = _.bind(view[key], view);
		}
	},
	BrowserIsIE: navigator.appVersion.indexOf("MSIE 7.") != -1
		|| navigator.appVersion.indexOf("MSIE 8.") != -1
		|| navigator.appVersion.indexOf("MSIE 9.") != -1
		|| navigator.appVersion.indexOf("MSIE 10.") != -1
		|| !!navigator.appVersion.match(/Trident.*rv[ :]*11\./),
	IEVersion: function() {
		if (navigator.appVersion.indexOf("MSIE 7.") != -1) return 7;
		else if (navigator.appVersion.indexOf("MSIE 8.") != -1) return 8;
		else if (navigator.appVersion.indexOf("MSIE 9.") != -1) return 9;
		else if (navigator.appVersion.indexOf("MSIE 10.") != -1) return 10;
		else if (!!navigator.appVersion.match(/Trident.*rv[ :]*11\./)) return 11;
	}
};