goog.provide('npf.fs.arrayBuffer');


/**
 * @param {string|!Blob} file
 * @param {function(this:SCOPE,ArrayBuffer)} callback
 * @param {SCOPE=} opt_scope
 * @template SCOPE
 */
npf.fs.arrayBuffer.get = function(file, callback, opt_scope) {
  if (goog.isString(file)) {
    if (/^data\:/i.test(file)) { // Data URI
      /** @type {!ArrayBuffer} */
      var buffer = npf.fs.arrayBuffer.getFromDataUrl(file);
      callback.call(opt_scope, buffer);
    } else if (/^blob\:/i.test(file)) { // Object URL
      npf.fs.arrayBuffer.getFromObjectUrl(file, callback, opt_scope);
    } else {
      npf.fs.arrayBuffer.getFromUrl(file, callback, opt_scope);
    }
  } else {
    npf.fs.arrayBuffer.getFromBlob(file, callback, opt_scope);
  }
};

/**
 * @param {!Blob} blob
 * @param {function(this:SCOPE,ArrayBuffer)} callback
 * @param {SCOPE=} opt_scope
 * @template SCOPE
 */
npf.fs.arrayBuffer.getFromBlob = function(blob, callback, opt_scope) {
  if (goog.global.FileReader) {
    var fileReader = new FileReader();
    fileReader.onload = function(evt) {
      callback.call(opt_scope, evt.target.result);
    };
    fileReader.readAsArrayBuffer(blob);
  } else {
    callback.call(opt_scope, null);
  }
};

/**
 * @param {string} dataUri
 * @return {!ArrayBuffer}
 */
npf.fs.arrayBuffer.getFromDataUrl = function(dataUri) {
  var byteString = atob(dataUri.replace(/^data\:([^\;]+)\;base64,/gmi, ''));
  var buffer = new ArrayBuffer(byteString.length);
  var view = new Uint8Array(buffer);

  for (var i = 0; i < byteString.length; i++) {
    view[i] = byteString.charCodeAt(i);
  }

  return buffer;
};

/**
 * @param {string} url
 * @param {function(this:SCOPE,ArrayBuffer)} callback
 * @param {SCOPE=} opt_scope
 * @template SCOPE
 */
npf.fs.arrayBuffer.getFromObjectUrl = function(url, callback, opt_scope) {
  var http = new XMLHttpRequest();
  http.open('GET', url, true);
  http.responseType = 'blob';
  http.onload = function(evt) {
    if (200 == http.status || 0 === http.status) {
      /** @type {Blob} */
      var blob = http.response;
      http = null;

      if (blob) {
        var fileReader = new FileReader();
        fileReader.onload = function(evt) {
          callback.call(opt_scope, evt.target.result);
        };
        fileReader.readAsArrayBuffer(blob);

        return;
      }
    }

    callback.call(opt_scope, null);
  };
};

/**
 * @param {string} url
 * @param {function(this:SCOPE,ArrayBuffer)} callback
 * @param {SCOPE=} opt_scope
 * @template SCOPE
 */
npf.fs.arrayBuffer.getFromUrl = function(url, callback, opt_scope) {
  var http = new XMLHttpRequest();
  http.onload = function() {
    /** @type {ArrayBuffer} */
    var buffer = 200 == http.status || 0 === http.status ? http.response : null;
    http = null;
    callback.call(opt_scope, buffer);
  };
  http.open('GET', url, true);
  http.responseType = 'arraybuffer';
  http.send(null);
};
