Namespace.MediaUploader.DefaultOptions = {
	uploadUrl: null, //url of upload service
	iframeCallbackUrl: null, //url which the upload service will redirect to after an iframe upload completes - to be able to read the contents of the iframe, the domain of the iframe src must match the current domain
	delay: 0, //will be used to delay the "success" and "error" callbacks, can be used to give fade animations triggered by the "start" callback enough time to complete

	//--CONTAINERS--//
	el: null, //jQuery elem
	dropZone: null, //jQuery elem
	feedbackContainer: null, //jQuery elem where progress and done templates are appended
	browseButtonSelector: ".actionBrowse",
	//--CONTAINERS--//

	//--TEMPLATES--//
	progressTemplate: null,
	doneTemplate: null,
	fileInputTemplate: "<input type='file' class='file' name='files' autocomplete='off'/>",
	//--TEMPLATES--//

	//--VALIDATION OPTIONS--//
	maxSizeMB: 30,
	maxFiles: -1,
	fileTypeConfig: Namespace.MediaUploader.FileTypeConfig.Any,
	//--VALIDATION OPTIONS--//

	//--EXTRA DATA FOR UPLOAD SERVICE--//
	entityId: null,
	//--EXTRA DATA FOR UPLOAD SERVICE--//

	//--CALLBACKS--//
	start: null, //triggered just before upload starts, if "start" fires then either "success" or "error" is guaranteed to fire
	success: null, //triggered if at least one upload succeeeds
	error: null, //triggered only if ALL uploads fail
	deleted: null //triggered when an upload is cancelled (aborted) or an uploaded file is removed
	//--CALLBACKS--//
};