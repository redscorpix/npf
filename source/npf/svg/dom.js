goog.provide('npf.svg.dom');

goog.require('goog.array');
goog.require('goog.dom');
goog.require('goog.dom.NodeType');
goog.require('goog.object');
goog.require('npf.svg.Ns');


/**
 * @private {!Array.<string>}
 */
npf.svg.dom.xlinkAttrs_ = [
  'actuate', 'arcrole', 'href', 'role', 'show', 'title', 'type'];

/**
 * @private {!Array.<string>}
 */
npf.svg.dom.xmlAttrs_ = ['base', 'lang', 'space'];


/**
 * @param {Node} node
 * @return {boolean}
 */
npf.svg.dom.isSvgElement = function(node) {
  return goog.dom.NodeType.ELEMENT == node.nodeType &&
    npf.svg.Ns.SVG == node.namespaceURI;
};

/**
 * @param {string} tagName
 * @param {string|Object.<string>=} opt_attrs
 * @param {goog.dom.DomHelper=} opt_domHelper
 * @return {!SVGElement}
 */
npf.svg.dom.createElement = function(tagName, opt_attrs, opt_domHelper) {
  /** @type {!goog.dom.DomHelper} */
  var domHelper = opt_domHelper || goog.dom.getDomHelper();
  var element = /** @type {!SVGElement} */ (
    domHelper.getDocument().createElementNS(npf.svg.Ns.SVG, tagName));

  if (opt_attrs) {
    /** @type {!Object.<string>} */
    var attrs = {};

    if (goog.isString(opt_attrs)) {
      attrs['class'] = opt_attrs;
    } else {
      attrs = opt_attrs;
    }

    npf.svg.dom.setAttr(element, attrs);
  }

  return element;
};

/**
 * Parse string and returns SVG element.
 * @param {string} data
 * @param {goog.dom.DomHelper=} opt_domHelper
 * @return {!SVGSVGElement}
 */
npf.svg.dom.parseFromString = function(data, opt_domHelper) {
  var xmlData = new DOMParser().parseFromString(data, 'text/xml');
  var attrs = {};

  for (var i = 0; i < xmlData.documentElement.attributes.length; i++) {
    var xmlAttr = xmlData.documentElement.attributes.item(i);
    attrs[xmlAttr.nodeName] = xmlAttr.nodeValue;
  }

  var svgElement = /** @type {!SVGSVGElement} */ (
    npf.svg.dom.createElement('svg', attrs, opt_domHelper));

  goog.array.forEach(xmlData.documentElement.childNodes, function(node) {
    svgElement.appendChild(node.cloneNode(true));
  });

  return svgElement;
};

/**
 * @param {Element} element
 * @param {string} name
 * @return {string?}
 */
npf.svg.dom.getAttr = function(element, name) {
  /** @type {?string} */
  var ns = npf.svg.dom.getAttrNamespace_(name);

  return ns ? element.getAttributeNS(ns, name) : element.getAttribute(name);
};

/**
 * @param {Element} element
 * @param {string|Object.<string|number|boolean>} name
 * @param {number|string|boolean=} opt_value
 */
npf.svg.dom.setAttr = function(element, name, opt_value) {
  if (goog.isObject(name)) {
    goog.object.forEach(name, function(value, key) {
      npf.svg.dom.setAttr(element, key, value);
    });
  } else if (goog.isString(name)) {
    /** @type {?string} */
    var ns = npf.svg.dom.getAttrNamespace_(name);

    if (ns) {
      element.setAttributeNS(
        ns, name, /** @type {string|number|boolean} */ (opt_value));
    } else {
      element.setAttribute(
        name, /** @type {string|number|boolean} */ (opt_value));
    }
  }
};

/**
 * @param {Element} element
 * @param {string} name
 */
npf.svg.dom.removeAttr = function(element, name) {
  /** @type {?string} */
  var ns = npf.svg.dom.getAttrNamespace_(name);

  if (ns) {
    element.removeAttributeNS(ns, name);
  } else {
    element.removeAttribute(name);
  }
};

/**
 * @param {string} name
 * @return {string?}
 * @private
 */
npf.svg.dom.getAttrNamespace_ = function(name) {
  if (-1 < goog.array.indexOf(npf.svg.dom.xlinkAttrs_, name)) {
    return npf.svg.Ns.XLINK;
  } else if (-1 < goog.array.indexOf(npf.svg.dom.xmlAttrs_, name)) {
    return npf.svg.Ns.XML;
  }

  return null;
};
