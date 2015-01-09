Namespace.MediaUploader.UploadViaXhr = (function (controller, files) {

	var uploadManager = $.Deferred();
	var q = [];
	var firstErrorMsg;
	var errorCount = 0;
	var fileCollection = new Namespace.MediaUploader.FileCollection();
	var extraDataForUploadService = controller.getExtraDataForUploadService();
	var validationOpts = controller.getFileValidationOptions();
	var maxFiles = validationOpts.maxFiles;
	var Helpers = Namespace.MediaUploader.Helpers;
	var ajaxBaseProps = { url: controller.getUploadUrl(), type: "POST", cache: false, processData: false, contentType: false, dataType: "json" };

	for (var i = 0; i < files.length; i++) {
		var file = files[i];
		fileCollection.add(new Namespace.MediaUploader.File({
			originalName: file.name,
			sizeInBytes: file.size,
			fileObject: file.dataUrl ? file.dataUrl : file
		}));
	}

	if (!fileCollection.validate(validationOpts, uploadManager.reject)) return uploadManager.promise();

	var progress = function (e, fileMdl) {
		var percent = 0;
		var position = e.loaded || e.position;
		if (e.lengthComputable) percent = Math.ceil(position / e.total * 100);
		fileMdl.set("uploadProgress", percent);
	};

	var appendFileName = function(fileMdl) { return " [File: " + fileMdl.get("originalName") + "]"; };

	var singleFileSuccess = function(response, fileMdl) {
		var errorMsg = Helpers.CheckForUploadServiceErrors(response);

		if (errorMsg) {
			errorCount++;
			if (!firstErrorMsg) firstErrorMsg = errorMsg + appendFileName(fileMdl);
		} else fileMdl.set("uploadState", Namespace.MediaUploader.FileUploadState.Done);
	}

	var singleFileError = function (xhr, fileMdl) {
		if (xhr.statusText == "abort") return; //a manual abort is not considered an error
		errorCount++;
		fileMdl.set("uploadState", Namespace.MediaUploader.FileUploadState.Failed);
		if (!firstErrorMsg) firstErrorMsg = "Sorry, something went wrong with the upload. " + appendFileName(fileMdl);
	};

	var singleFileComplete = function () {
		q.pop();
		if (q.length == 0) allDone();
	};

	var allDone = function () {
		var atLeastOneSucceeded = errorCount < fileCollection.length;

		if (firstErrorMsg) {
			if (atLeastOneSucceeded) {
				uploadManager.resolve();
				alert(firstErrorMsg);
			} else uploadManager.reject(firstErrorMsg);
		} else uploadManager.resolve();
	};

	var buildRequestData = function (fileMdl) {
		var formData = new FormData();
		for (var key in extraDataForUploadService) formData.append(key, extraDataForUploadService[key]);
		formData.append("data", fileMdl.get("fileObject"));
		return formData;
	};

	var buildRequest = function(fileMdl) {
		var ajaxProps = $.extend({
			data: buildRequestData(fileMdl),
			success: function(response) { singleFileSuccess(response, fileMdl); },
			error: function(xhr) { singleFileError(xhr, fileMdl); },
			complete: singleFileComplete,
			xhr: function() {
				var xhr = $.ajaxSettings.xhr();
				if (xhr.upload) xhr.upload.addEventListener("progress", function(e) { progress(e, fileMdl); }, false);
				return xhr;
			}
		}, ajaxBaseProps);

		var request = $.ajax(ajaxProps);
		fileMdl.set("xhr", request); //used for abort (cancel upload)
		q.push(request);
	};

	var beginUpload = function() { fileCollection.each(buildRequest); };

	if (maxFiles > 0 && fileCollection.length > maxFiles) {
		var modelsToRemove = fileCollection.slice(maxFiles - 1, fileCollection.length - 1); //remove extras, allow the rest to be uploaded
		fileCollection.remove(modelsToRemove);
		firstErrorMsg = Helpers.BuildMaxNumFilesExceededErrorMsg(maxFiles);
	}

	controller.start(fileCollection, beginUpload); //fileCollection now shared with controller

	return uploadManager.promise();
});