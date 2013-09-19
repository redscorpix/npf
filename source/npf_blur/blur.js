goog.provide('npfBlur');

goog.require('npf.graphics.Blur');


goog.exportSymbol('npfBlur', function(img, radius, opt_blurAlphaChannel) {
  if (
    (
      img instanceof Image ||
      img instanceof HTMLImageElement ||
      img instanceof HTMLCanvasElement
    ) &&
    goog.isNumber(radius)
  ) {
    /** @type {!npf.graphics.Blur} */
    var blur = npf.graphics.Blur.create(img);

    if (blur.convert(radius, !!opt_blurAlphaChannel)) {
      return blur.destination;
    }
  }

  return null;
});
