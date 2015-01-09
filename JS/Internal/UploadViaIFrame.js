Namespace.MediaUploader.IFrameJson = {};

Namespace.MediaUploader.UploadViaIFrame = (function (controller, fileInput) {

	var uploadManager = $.Deferred();
	var fileInputClone = fileInput.clone();

	//IE8 + IE9 do not support multiple file uploads using the file input (could be done with flash).
	//So even though we have a collection here, there will only ever be one file model in it
	var fileCollection = new Namespace.MediaUploader.FileCollection();
	var fileModel = new Namespace.MediaUploader.File({ originalName: fileInput.val() });
	fileCollection.add(fileModel);

	if (!fileCollection.validate(controller.getFileValidationOptions(), uploadManager.reject)) return uploadManager.promise();

	var frameName = "uploadFrame";
	var iframe = $("<iframe name='" + frameName + "'/>");
	var form = $("<form class='form' style='display:none;'></form>");

	form.attr({
		target: frameName,
		action: controller.getUploadUrl(),
		method: "POST",
		enctype: "multipart/form-data",
		encoding: "multipart/form-data"
	});

	var extraDataForUploadService = controller.getExtraDataForUploadService();
	for (var key in extraDataForUploadService) form.append("<input type='hidden' name='" + key + "' value='" + extraDataForUploadService[key] + "'/>");
	form.append("<input type='hidden' name='redirect' value='" + controller.getIframeCallbackUrl() + "'/>");

    var bindIframeLoad = function() {            
	    iframe.load(function () {
		    try {
			    var iframeInnerHTML = this.contentWindow.document.body.innerHTML;

			    var response = {}, errorMsg;
			    eval("Namespace.MediaUploader.IFrameJson = " + iframeInnerHTML);            			

			    errorMsg = Namespace.MediaUploader.Helpers.CheckForUploadServiceErrors(Namespace.MediaUploader.IFrameJson);

			    if (errorMsg) uploadManager.reject(errorMsg);
			    else {
			    	fileModel.set("uploadState", Namespace.MediaUploader.FileUploadState.Done);
				    uploadManager.resolve(response);
			    }

			    fileInputClone.replaceWith(fileInput);
		    }
		    catch (e) { console.info("iframe.load error: " + e.message); }
            finally { form.remove(); }
	    });
    };

	iframe.error(function() {
	    form.remove();
		console.info("iframe.error");
		uploadManager.reject("Sorry, something went wrong with the upload");
	});

	var beginUpload = function() {
		fileCollection.at(0).set("uploadProgress", 46); //fake the progress
		fileInput.after(fileInputClone);
		form.append(fileInput).append(iframe).appendTo(controller.$el);
		bindIframeLoad();//this allows debugging the iframe uploader in chrome, see http://stackoverflow.com/questions/10781880/why-iframe-that-dynamic-created-trigger-onload-event-twice 
		form.submit();
	};

	controller.start(fileCollection, beginUpload); //fileCollection now shared with controller

	return uploadManager.promise();
});