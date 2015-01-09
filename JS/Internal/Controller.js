Namespace.MediaUploader.Controller = (function (options) {

	var Helpers = Namespace.MediaUploader.Helpers;

	var ControllerView = Backbone.View.extend({
		el: options.el,
		collection: Namespace.MediaUploader.FileCollection,
		initialize: function() {
			Namespace.MediaUploader.Helpers.BindAll(this);
			this.$el.addClass("mediaUploader");
			this.bindContainers();
			this.bindFileInputs();
			if (this.usingDragAndDrop()) this.bindDragAndDrop();
			else this.dragText.hide();
		},
		bindContainers: function() {
			this.browseButtons = this.$(options.browseButtonSelector);
			this.fileInputPlaceholder = this.$(".fileInputPlaceholder");
			this.dragText = this.$(".dragText");
		},
		bindFileInputs: function () {
			if (!this.haveFileInputContainers()) return;

			var fileInputContainers;

			if (this.browseButtons.length) {
				this.$el.addClass("withBrowseButton");
				fileInputContainers = this.browseButtons;
			} else fileInputContainers = this.fileInputPlaceholder;

			var self = this;

			fileInputContainers.each(function() {
				var fileInputContainer = $(this);
				var fileInput = self.bindSingleFileInput();
				fileInputContainer.append(fileInput);
			});
		},
		bindSingleFileInput: function() {
			var self = this;
			var fileInput = $(options.fileInputTemplate);
			if (this.multipleAllowed()) fileInput.attr("multiple", "multiple");
			if (options.fileTypeConfig.AcceptAttr) fileInput.attr("accept", options.fileTypeConfig.AcceptAttr);
			fileInput.on("change", function () { self.fileInputChanged(fileInput); });
			return fileInput;
		},
		haveFileInputContainers: function() {
			if (this.browseButtons.length || this.fileInputPlaceholder.length) return true;
			else { console.info("MediaUploader: nowhere to put the file input"); return false; }
		},
		bindDragAndDrop: function() { Namespace.MediaUploader.DragAndDrop(this); },
		usingDragAndDrop: function () { return options.dropZone && !this.isShitBrowser(); },
		usingIFrame: function () { return this.isShitBrowser(); },
		isShitBrowser: function () { return Namespace.MediaUploader.Helpers.BrowserIsIE && Namespace.MediaUploader.Helpers.IEVersion() < 10; },
		multipleAllowed: function () { return options.maxFiles != 1; },
		fileInputChanged: function (fileInput) {
			if (!fileInput.val().length) return;
			this.uploadMethod = Namespace.MediaUploader.UploadMethod.Browse;
			if (this.usingIFrame()) this.uploadViaIFrame(fileInput);
			else this.uploadViaXhr(fileInput.get(0).files);
		},
		filesDropped: function (files) {
			this.uploadMethod = Namespace.MediaUploader.UploadMethod.DragAndDrop;
			this.uploadViaXhr(files);
		},
		uploadViaIFrame: function (fileInput) {
			Namespace.MediaUploader.UploadViaIFrame(this, fileInput).fail(this.error).done(this.success);
		},
		uploadViaXhr: function (files) {
			Namespace.MediaUploader.UploadViaXhr(this, files).fail(this.error).done(this.success);
		},
		uploadWebcamCapture: function (dataUrl) {
			var file = { name: "webcam-capture.jpg", dataUrl: dataUrl };
			this.uploadViaXhr([file]);
		},
		getUploadUrl: function () { return options.uploadUrl; },
		getIframeCallbackUrl: function() { return options.iframeCallbackUrl; },
		getDropZone: function () { return options.dropZone; },
		getExtraDataForUploadService: function () { return { entityId: options.entityId }; },
		getFileValidationOptions: function () {
			return {
				maxSizeMB: options.maxSizeMB,
				maxFiles: options.maxFiles,
				fileTypeConfig: options.fileTypeConfig
			};
		},
		start: function (fileCollection, started) { //also called by UploadViaIFrame.js and UploadViaXhr.js
			if (this.started && this.multipleAllowed()) {
				var newModelCount = fileCollection.length + this.collection.length;

				if (options.maxFiles > 0 && newModelCount > options.maxFiles) {
					var msg = Helpers.BuildMaxNumFilesExceededErrorMsg(options.maxFiles);
					this.error(msg);
				} else {
					this.collection.add(fileCollection.models);
					if (started) started();
				}
			} else {
				this.bindCollection(fileCollection);
				var self = this;

				var ready = function () {
					self.started = true;
					self.buildFeedbackContainer();
					if (started) started();
				};

				window.setTimeout(ready, options.delay);
			}

			if (options.start) options.start();
		},
		bindCollection: function (fileCollection) {
			this.collection = fileCollection;
			this.collection.on("remove", this.deleted, this);
		},
		buildFeedbackContainer: function () {
			this.bindFileListView();
			options.feedbackContainer.html(this.fileListView.el);
		},
		bindFileListView: function() {
			if (this.fileListView) Namespace.MediaUploader.Helpers.RemoveView(this.fileListView);

			this.fileListView = new Namespace.MediaUploader.FileListView({
				collection: this.collection,
				progressTemplate: options.progressTemplate,
				doneTemplate: options.doneTemplate
			});
		},
		success: function (response) {
			this.filterNotUploadedModels();

			var outputModel = new Namespace.MediaUploader.OutputModel({
				uploadMethod: this.uploadMethod,
				fileCollection: this.collection,
				uploadResponseJson: response,
				fileTypeConfig: options.fileTypeConfig
			});

			this.clearFileInputs();
			if (options.success) options.success(outputModel);
		},
		error: function (msg) {
			alert(msg);
			this.clearFileInputs();
			if (options.error) options.error();
		},
		deleted: function (fileModel) {
			this.clearFileInputs();
			if (options.deleted) options.deleted(fileModel);
		},
		clearFileInputs: function () {
			this.$("input.file[type='file']").each(function () {
				var fileInput = $(this);
				fileInput.val("");
			});
		},
		filterNotUploadedModels: function () {
			var notUploadedModels = this.collection.filter(function (model) {
				return model.get("uploadState") == Namespace.MediaUploader.FileUploadState.Pending
					|| model.get("uploadState") == Namespace.MediaUploader.FileUploadState.Failed;
			});
			this.collection.remove(notUploadedModels);
		},
		reset: function() {
			this.clearFileInputs();
			
			if (this.started) {
				this.collection.reset();
				this.bindFileListView();
				this.started = false;
			}
		}
	});

	options = $.extend({}, Namespace.MediaUploader.DefaultOptions, options);

	return new ControllerView;
});