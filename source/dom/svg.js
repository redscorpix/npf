goog.provide('npf.dom.svg');

goog.require('goog.array');
goog.require('goog.object');


/**
 * @enum {string}
 */
npf.dom.svg.Ns = {
  SVG: 'http://www.w3.org/2000/svg',
  XLINK: 'http://www.w3.org/1999/xlink',
  EV: 'http://www.w3.org/2001/xml-events',
  XML: 'http://www.w3.org/XML/1998/namespace'
};

/**
 * @type {!Array.<string>}
 * @private
 */
npf.dom.svg._xlinkAttrs = ['actuate', 'arcrole', 'href', 'role', 'show', 'title', 'type'];

/**
 * @type {!Array.<string>}
 * @private
 */
npf.dom.svg._xmlAttrs = ['base', 'lang', 'space'];


/**
 * @param {string} tagName
 * @param {string|Object.<string,string>=} opt_attrs
 * @return {!Element}
 */
npf.dom.svg.createElement = function(tagName, opt_attrs) {
  /** @type {!Element} */
  var element = document.createElementNS(npf.dom.svg.Ns.SVG, tagName);

  if (opt_attrs) {
    /** @type {!Object.<string,string>} */
    var attrs = {};

    if (goog.isString(opt_attrs)) {
      attrs['class'] = opt_attrs;
    } else {
      attrs = opt_attrs;
    }

    npf.dom.svg.setAttr(element, attrs);
  }

  return element;
};

/**
 * Из строки делает SVG-элемент.
 * @param {string} data
 * @return {Element}
 */
npf.dom.svg.parseFromString = function(data) {
  var index = data.indexOf(' ');

  var xmlData = new DOMParser().parseFromString(data, 'text/xml');
  var svgElement = document.createElementNS(npf.dom.svg.Ns.SVG, 'svg');
  var attrs = {
    version: '1.1'
  };

  for (var i = 0; i < xmlData.documentElement.attributes.length; i++) {
    var xmlAttr = xmlData.documentElement.attributes.item(i);
    attrs[xmlAttr.nodeName] = xmlAttr.nodeValue;
  }

  npf.dom.svg.setAttr(svgElement, attrs);

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
npf.dom.svg.getAttr = function(element, name) {
  /** @type {?string} */
  var ns = npf.dom.svg._getAttrNamespace(name);

  return ns ? element.getAttributeNS(ns, name) : element.getAttribute(name);
};

/**
 * @param {Element} element
 * @param {string|Object.<string,string|number>} name
 * @param {number|string=} opt_value
 */
npf.dom.svg.setAttr = function(element, name, opt_value) {
  if (goog.isObject(name)) {
    goog.object.forEach(name, function(value, key) {
      npf.dom.svg.setAttr(element, key, value);
    });
  } else if (goog.isString(name)) {
    /** @type {?string} */
    var ns = npf.dom.svg._getAttrNamespace(name);

    if (ns) {
      element.setAttributeNS(ns, name, /** @type {string|number} */ (opt_value));
    } else {
      element.setAttribute(name, /** @type {string|number} */ (opt_value));
    }
  }
};

/**
 * @param {Element} element
 * @param {string} name
 */
npf.dom.svg.removeAttr = function(element, name) {
  /** @type {?string} */
  var ns = npf.dom.svg._getAttrNamespace(name);

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
npf.dom.svg._getAttrNamespace = function(name) {
  if (-1 < goog.array.indexOf(npf.dom.svg._xlinkAttrs, name)) {
    return npf.dom.svg.Ns.XLINK;
  } else if (-1 < goog.array.indexOf(npf.dom.svg._xmlAttrs, name)) {
    return npf.dom.svg.Ns.XML;
  }

  return null;
};
