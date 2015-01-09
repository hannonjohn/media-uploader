Namespace.MediaUploader.FileListView = (function(options) {

	var View = Backbone.View.extend({
		collection: Namespace.MediaUploader.FileCollection,
		tagName: "ul",
		className: "files",
		initialize: function() {
			Namespace.MediaUploader.Helpers.BindAll(this);
			this.render();
			this.bindCollection();
		},
		bindCollection: function() {
			this.collection.on("add", this.addFile, this);
		},
		render: function () {
			this.collection.each(this.addFile);
		},
		addFile: function (mdl) {
			mdl.on("deleted", this.fileDeleted, this);

			var fileView = new Namespace.MediaUploader.FileView({
				model: mdl,
				progressTemplate: options.progressTemplate,
				doneTemplate: options.doneTemplate
			});

			this.$el.append(fileView.$el);
		},
		fileDeleted: function (model) {
			this.collection.remove(model);
		}
	});

	return new View({ collection: options.collection });
});