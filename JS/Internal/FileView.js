Namespace.MediaUploader.FileView = (function (options) {

	var View = Backbone.View.extend({
		tagName: "li",
		className: "file",
		model: Namespace.MediaUploader.File,
		events: {
			"click .actionCancelUpload": "cancelUpload",
			"click .actionDelete": "deleteFile"
		},
		initialize: function() {
			Namespace.MediaUploader.Helpers.BindAll(this);
			this.bindTemplates();
			this.bindModel();
		},
		bindTemplates: function () {
			if (options.progressTemplate) this.progressTemplate = _.template(options.progressTemplate);
			if (options.doneTemplate) this.doneTemplate = _.template(options.doneTemplate);
		},
		bindModel: function() {
			this.model.on("change:uploadProgress", this.uploadProgressChanged, this);
			this.model.on("change:uploadState", this.uploadStateChanged, this);
			if (this.model.get("uploadState") == Namespace.MediaUploader.FileUploadState.Done) this.uploadDone();
		},
		uploadProgressChanged: function (mdl, uploadProgress) {
			if (!this.progressTemplate) return;

			if (!this.progressTemplateRendered) {
				var html = this.progressTemplate({ progress: uploadProgress });
				this.$el.addClass("progress");
				this.$el.html(html);
				this.progressBar = this.$(".progressBar");
				this.progressTemplateRendered = true;
			} else this.progressBar.css("width", uploadProgress + "%");
		},
		uploadDone: function () {
			if (!this.doneTemplate) return;
			var html = this.doneTemplate(this.model.toJSON());
			this.$el.removeClass("progress").addClass("done").html(html);
			this.$el.data("model-id", this.model.id); //used for sorting
		},
		uploadStateChanged: function (mdl, uploadState) {
			switch (uploadState) {
				case Namespace.MediaUploader.FileUploadState.Done:
					this.uploadDone();
					break;
				case Namespace.MediaUploader.FileUploadState.Failed:
					this.uploadError();
					break;
			};
		},
		uploadError: function() {
			this.$el.addClass("error");
		},
		cancelUpload: function () {
			if (!this.model.get("xhr")) return false;
			this.model.get("xhr").abort(); //only XHR uploads can be cancelled
			this.deleteFile();
			return false;
		},
		deleteFile: function () {
			this.hideAndRemove(this.triggerDelete);
			return false;
		},
		triggerDelete: function () { this.model.trigger("deleted", this.model); },
		hideAndRemove: function(callback) {
			var self = this;
			this.$el.fadeOut(function () {
				Namespace.MediaUploader.Helpers.RemoveView(self);
				if (callback) callback();
			});
		}
	});

	return new View({ model: options.model });
});