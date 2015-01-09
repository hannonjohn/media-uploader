# Media Uploader

This repo contains a complete, lightweight JS media uploader solution using Backbone.js.

The entry point is Controller.js.

Features:
- XHR upload for HTML5 compliant browsers (File API, FormData API, XHR level 2)
- iframe upload fallback for non-HTML5 compliant browsers (e.g. IE8, IE9)
- drag and drop
- upload progress (XHR)
- multiple file upload
- validation - max file size, file type, max no. of files
- jQuery.Deferred and promises used to manage the uploads
- Backbone views, models, collections, and events
- lightweight - code as clean and DRY as possible
- "progress" and "done" templates (Underscore)
