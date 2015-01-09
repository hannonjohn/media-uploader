var Namespace = { MediaUploader: {} };

Namespace.MediaUploader.UploadMethod = {
	DragAndDrop: "DragAndDrop",
	Browse: "Browse"
};

Namespace.MediaUploader.FileUploadState = {
	Pending: "Pending",
	Done: "Done",
	Failed: "Failed"
};

Namespace.MediaUploader.FileInputAcceptAttribute = {
	Image: "image/*",
	Audio: "audio/*"
};

Namespace.MediaUploader.FileTypeRegex = {
	Image: /(\.|\/)(bmp|gif|png|jpg|jpeg)$/i,
	Audio: /(\.|\/)(mp3|m4a)$/i,
	Text: /(\.|\/)(txt|TXT|doc|DOC|docx|rtf|RTF|DOCX|pdf|PDF)$/i,
	CSV: /(\.|\/)(xls|xlsx|csv)$/i,
	Any: /\.[0-9a-z]+$/i
};

Namespace.MediaUploader.BlockedFileTypeRegex = /(\.|\/)(exe)$/i;

Namespace.MediaUploader.FileTypeConfig = {
	Image: {
		Id: "Image",
		Regex: Namespace.MediaUploader.FileTypeRegex.Image,
		AcceptAttr: Namespace.MediaUploader.FileInputAcceptAttribute.Image,
		UnsupportedFileTypeMsg: "Sorry, unsupported file type detected. Please try again with an image file."
	},
	Audio: {
		Id: "Audio",
		Regex: Namespace.MediaUploader.FileTypeRegex.Audio,
		AcceptAttr: Namespace.MediaUploader.FileInputAcceptAttribute.Audio,
		UnsupportedFileTypeMsg: "Sorry, unsupported file type detected. Please try again with an .mp3 or an .m4a file."
	},
	Any: {
		Id: "Any",
		Regex: Namespace.MediaUploader.FileTypeRegex.Any,
		UnsupportedFileTypeMsg: "Sorry, unsupported file type detected"
	},
	Text: {
		Id: "Text",
		Regex: Namespace.MediaUploader.FileTypeRegex.Text,
		UnsupportedFileTypeMsg: "Sorry, unsupported file type detected. Please try again with a .txt, .doc, .docx, .pdf, or .rtf file."
	},
	CSV: {
		Id: "CSV",
		Regex: Namespace.MediaUploader.FileTypeRegex.CSV,
		UnsupportedFileTypeMsg: "Sorry, unsupported file type detected. Please try again with a .csv file"
	}
};