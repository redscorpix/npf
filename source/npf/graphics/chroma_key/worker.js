goog.provide('npf.graphics.chromaKey.worker');

goog.require('npf.graphics.chromaKey.convertor');


onmessage = function(evt) {
  var data = /** @type {Object} */ (evt['data']);
  npf.graphics.chromaKey.convertor.calculate(data['imageData'], data['back']);
  postMessage(data['imageData']);
};
