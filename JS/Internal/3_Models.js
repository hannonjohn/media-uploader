Namespace.MediaUploader.File = Backbone.Model.extend({
	defaults: {
		originalName: "",
		sizeInBytes: 0,
		fileObject: null, //File API object
		fileSizeDisplay: "",
		xhr: null, //used for cancel/abort upload
		uploadProgress: 0,
		uploadState: Namespace.MediaUploader.FileUploadState.Pending
	},
	initialize: function() {
		this.normaliseName();
		this.on("change:originalName", this.normaliseName, this);
		this.buildFileSizeDisplay();
		this.on("change:sizeInBytes", this.buildFileSizeDisplay, this);
	},
	normaliseName: function() {
		var normalisedName;
		var originalName = this.get("originalName");
		var lastSlashIndex = originalName.lastIndexOf("\\");
		if (lastSlashIndex > 0) normalisedName = originalName.substring(lastSlashIndex + 1);
		else normalisedName = originalName;
		this.set("originalName", normalisedName);
	},
	buildFileSizeDisplay: function() {
		var sizeInBytes = this.get("sizeInBytes");
		if (!isNaN(sizeInBytes) && sizeInBytes > 0) {
			var sizeInKB = (Math.round((sizeInBytes / 1024) * 100) / 100);
			this.set("fileSizeDisplay", sizeInKB + "KB");
		}
	}
});

Namespace.MediaUploader.FileCollection = Backbone.Collection.extend({
	model: Namespace.MediaUploader.File,
	validate: function(validationOptions, errorCallback) {
		var valid = true;

		var error = function(msg) {
			valid = false;
			errorCallback(msg);
		};

		var Helpers = Namespace.MediaUploader.Helpers;

		if (validationOptions.maxFiles == 1 && this.length > 1) { //safety check file input "multiple" attribute may be manipulated
			error(Helpers.BuildMaxNumFilesExceededErrorMsg(validationOptions.maxFiles));
		} else {
			for (var i = 0; i < this.length; i++) {
				var mdl = this.models[i];
				var name = mdl.get("originalName");
				
				if (!validationOptions.fileTypeConfig.Regex.test(name)
					|| Namespace.MediaUploader.BlockedFileTypeRegex.test(name)) {
					error(validationOptions.fileTypeConfig.UnsupportedFileTypeMsg);
					break;
				} else if (mdl.get("sizeInBytes") > this.getMaxSizeInBytes(validationOptions.maxSizeMB)) {
					error(Helpers.BuildMaxFileSizeExceededErrorMsg(validationOptions.maxSizeMB));
					break;
				}
			}
		}

		return valid;
	},
	getMaxSizeInBytes: function (maxSizeMB) { return maxSizeMB * 1000 * 1000; }
});

Namespace.MediaUploader.OutputModel = Backbone.Model.extend({
	defaults: {
		uploadMethod: null, //Namespace.MediaUploader.UploadMethod, used for tracking
		fileCollection: null, //Namespace.MediaUploader.FileCollection
		uploadResponseJson: null, //full response returned from upload service,
		fileTypeConfig: null //Namespace.MediaUploader.FileTypeConfig option that was originally passed to Namespace.MediaUploader.Controller
	}
});