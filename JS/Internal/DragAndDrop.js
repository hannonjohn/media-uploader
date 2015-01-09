Namespace.MediaUploader.DragAndDrop = (function(controller) {

	var dragOverClass = "dragOver";

	var View = Backbone.View.extend({
		el: controller.getDropZone(),
		initialize: function() {
			Namespace.MediaUploader.Helpers.BindAll(this);
			this.bindEvents();
		},
		bindEvents: function() {
			if (Namespace.MediaUploader.Helpers.BrowserIsIE) this.$el.on("dragenter", this.stopPropagation);
			this.$el.on("dragover", this.stopPropagation);
			this.$el.on("dragenter", this.dragEnter);
			this.$el.on("dragleave", this.dragleave);
			this.$el.on("drop", this.drop);
		},
		dragEnter: function() {
			this.$el.addClass(dragOverClass);
		},
		dragLeave: function(e) {
			if (this.ensureNotChild(e)) this.$el.removeClass(dragOverClass);
		},
		drop: function (e) {
			this.stopPropagation(e);
			this.$el.removeClass(dragOverClass);
			var dt = e.originalEvent.dataTransfer;
			controller.filesDropped(dt.files);
		},
		ensureNotChild: function(e) {
			var clientX = e.originalEvent.clientX;
			var clientY = e.originalEvent.clientY;
			var child = document.elementFromPoint(clientX, clientY);
			var parent = this.$el.get(0);
			return !this.domContains(parent, child);
		},
		stopPropagation: function (e) {
			if (e) {
				e.preventDefault();
				if (e.stopPropagation) e.stopPropagation();
				else e.cancelBubble = true;
			}
		},
		domContains: function (parent, child) { //parent and child need to be DOM elements
			if (parent == child) return true;
			if (parent.contains) return parent.contains(child);
			else return !!(child.compareDocumentPosition(parent) & 8);
		}
	});

	return new View;
});