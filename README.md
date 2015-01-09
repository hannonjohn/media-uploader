# Media Uploader

This repo contains a complete, lightweight JS media uploader solution using Backbone.js.

The entry point is Controller.js.

Features:
- XHR upload for HTML5 compliant browsers (File API, FormData API, XHR level 2)
- Iframe upload fallback for non-HTML5 compliant browsers (e.g. IE8, IE9)
- Drag and drop
- Upload progress (XHR)
- Multiple file upload
- Validation - max file size, file type, max no. of files
- jQuery.Deferred and promises used to manage the uploads
- Backbone views, models, collections, and events
- Lightweight - code as clean and DRY as possible
- "progress" and "done" templates (Underscore)
