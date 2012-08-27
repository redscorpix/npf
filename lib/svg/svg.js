goog.provide('npfSvg');

goog.require('npf.dom.svg');


/**
 * @enum {string}
 */
npfSvg.Ns = {
  'SVG': npf.dom.svg.Ns.SVG,
  'XLINK': npf.dom.svg.Ns.XLINK,
  'EV': npf.dom.svg.Ns.EV,
  'XML': npf.dom.svg.Ns.XML
};


goog.exportSymbol('npfSvg.Ns', npfSvg.Ns);
goog.exportSymbol('npfSvg.createElement', npf.dom.svg.createElement);
goog.exportSymbol('npfSvg.parseFromString', npf.dom.svg.parseFromString);
goog.exportSymbol('npfSvg.getAttr', npf.dom.svg.getAttr);
goog.exportSymbol('npfSvg.setAttr', npf.dom.svg.setAttr);
goog.exportSymbol('npfSvg.removeAttr', npf.dom.svg.removeAttr);
