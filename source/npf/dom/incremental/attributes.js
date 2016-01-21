goog.provide('npf.dom.incremental.attributes');

goog.require('npf.dom.incremental.NodeData');
goog.require('npf.dom.incremental.symbols');
goog.require('npf.dom.incremental.util');


/**
 * Applies an attribute or property to a given Element. If the value is null
 * or undefined, it is removed from the Element. Otherwise, the value is set
 * as an attribute.
 * @param {!Element} el
 * @param {string} name The attribute's name.
 * @param {?(boolean|number|string)=} opt_value The attribute's value.
 */
npf.dom.incremental.attributes.applyAttr = function(el, name, opt_value) {
  if (!goog.isNull(opt_value) && goog.isDef(opt_value)) {
    el.setAttribute(name, opt_value);
  } else {
    el.removeAttribute(name);
  }
};

/**
 * Applies a property to a given Element.
 * @param {!Element} el
 * @param {string} name The property's name.
 * @param {*} value The property's value.
 */
npf.dom.incremental.attributes.applyProp = function(el, name, value) {
  el[name] = value;
};


/**
 * Applies a style to an Element. No vendor prefix expansion is done for
 * property names/values.
 * @param {!Element} el
 * @param {string} name The attribute's name.
 * @param {*} style The style to set. Either a string of css or an object
 *     containing property-value pairs.
 */
npf.dom.incremental.attributes.applyStyle = function(el, name, style) {
  if (goog.isString(style)) {
    el.style.cssText = style;
  } else {
    el.style.cssText = '';
    var elStyle = el.style;
    var obj = /** @type {!Object<string,string>} */(style);

    for (var prop in obj) {
      if (npf.dom.incremental.util.has(obj, prop)) {
        elStyle[prop] = obj[prop];
      }
    }
  }
};


/**
 * Updates a single attribute on an Element.
 * @param {!Element} el
 * @param {string} name The attribute's name.
 * @param {*} value The attribute's value. If the value is an object or
 *     function it is set on the Element, otherwise, it is set as an HTML
 *     attribute.
 * @private
 */
npf.dom.incremental.attributes.applyAttributeTyped_ = function(el, name,
    value) {
  var type = typeof value;

  if (type === 'object' || type === 'function') {
    npf.dom.incremental.attributes.applyProp(el, name, value);
  } else {
    npf.dom.incremental.attributes.applyAttr(
      el, name, /** @type {?(boolean|number|string)} */(value));
  }
};


/**
 * Calls the appropriate attribute mutator for this attribute.
 * @param {!Element} el
 * @param {string} name The attribute's name.
 * @param {*} value The attribute's value.
 */
npf.dom.incremental.attributes.updateAttribute = function(el, name, value) {
  /** @type {!npf.dom.incremental.NodeData} */
  var data = npf.dom.incremental.NodeData.getData(el);
  /** @type {!Object<string,*>} */
  var attrs = data.attrs;

  if (attrs[name] !== value) {
    var mutator = npf.dom.incremental.attributes.attributes_[name] ||
      npf.dom.incremental.attributes.attributes_[
        npf.dom.incremental.symbols.DEFAULT];
    mutator(el, name, value);
    attrs[name] = value;
  }
};


/**
 * A publicly mutable object to provide custom mutators for attributes.
 * @const {!Object<string, function(!Element, string, *)>}
 * @private
 */
npf.dom.incremental.attributes.attributes_ =
  npf.dom.incremental.util.createMap();

// Special generic mutator that's called for any attribute that does not
// have a specific mutator.
npf.dom.incremental.attributes.attributes_[npf.dom.incremental.symbols.DEFAULT] =
  npf.dom.incremental.attributes.applyAttributeTyped_;
npf.dom.incremental.attributes.attributes_[npf.dom.incremental.symbols.PLACEHOLDER] =
  function() {};
npf.dom.incremental.attributes.attributes_['style'] =
  npf.dom.incremental.attributes.applyStyle;
