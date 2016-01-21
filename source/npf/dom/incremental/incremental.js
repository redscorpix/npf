goog.provide('npf.dom.incremental');

goog.require('npf.dom.incremental.NodeData');
goog.require('npf.dom.incremental.assertions');
goog.require('npf.dom.incremental.attributes');
goog.require('npf.dom.incremental.core');
goog.require('npf.dom.incremental.notifications');
goog.require('goog.asserts');


/**
 * The offset in the virtual element declaration where the attributes are
 * specified.
 * @const {number}
 */
npf.dom.incremental.ATTRIBUTES_OFFSET = 3;


/**
 * Builds an array of arguments for use with elementOpenStart, attr and
 * elementOpenEnd.
 * @const {Array<*>}
 * @private
 */
npf.dom.incremental.argsBuilder_ = [];


/**
 * Declares an Element with zero or more attributes/properties that should
 * be present at the current location in the document tree.
 *
 * @param {string} tag The element's tag.
 * @param {?string=} opt_key The key used to identify this element. This can be
 *     an empty string, but performance may be better if a unique value is used
 *     when iterating over an array of items.
 * @param {?Array<*>=} opt_statics An array of attribute name/value pairs of the
 *     static attributes for the Element. These will only be set once when the
 *     Element is created.
 * @param {...*} var_args Attribute name/value pairs of the dynamic attributes
 *     for the Element.
 * @return {!Element} The corresponding Element.
 */
npf.dom.incremental.elementOpen = function(tag, opt_key, opt_statics,
    var_args) {
  npf.dom.incremental.assertions.assertNotInAttributes('elementOpen');
  npf.dom.incremental.assertions.assertNotInSkip('elementOpen');

  /** @type {!Element} */
  var node = npf.dom.incremental.core.elementOpen(tag, opt_key, opt_statics);
  /** @type {!npf.dom.incremental.NodeData} */
  var data = npf.dom.incremental.NodeData.getData(node);

  /*
   * Checks to see if one or more attributes have changed for a given Element.
   * When no attributes have changed, this is much faster than checking each
   * individual argument. When attributes have changed, the overhead of this is
   * minimal.
   */

  /** @type {Array<*>} */
  var attrsArr = data.attrsArr;
  /** @type {!Object<string,*>} */
  var newAttrs = data.newAttrs;
  /** @type {boolean} */
  var attrsChanged = false;
  /** @type {number} */
  var i = npf.dom.incremental.ATTRIBUTES_OFFSET;
  /** @type {number} */
  var j = 0;

  for (; i < arguments.length; i++, j++) {
    if (attrsArr[j] !== arguments[i]) {
      attrsChanged = true;
      break;
    }
  }

  for (; i < arguments.length; i++, j++) {
    attrsArr[j] = arguments[i];
  }

  if (j < attrsArr.length) {
    attrsChanged = true;
    attrsArr.length = j;
  }

  /*
   * Actually perform the attribute update.
   */
  if (attrsChanged) {
    /** @type {number} */
    var offset = npf.dom.incremental.ATTRIBUTES_OFFSET;

    for (i = offset; i < arguments.length; i += 2) {
      newAttrs[arguments[i]] = arguments[i + 1];
    }

    for (var attr in newAttrs) {
      npf.dom.incremental.attributes.updateAttribute(
        node, attr, newAttrs[attr]);
      newAttrs[attr] = undefined;
    }
  }

  return node;
};


/**
 * Declares a virtual Element at the current location in the document. This
 * corresponds to an opening tag and a elementClose tag is required. This is
 * like elementOpen, but the attributes are defined using the attr function
 * rather than being passed as arguments. Must be folllowed by 0 or more calls
 * to attr, then a call to elementOpenEnd.
 *
 * @param {string} tag The element's tag.
 * @param {?string=} opt_key The key used to identify this element. This can be
 *     an empty string, but performance may be better if a unique value is used
 *     when iterating over an array of items.
 * @param {?Array<*>=} opt_statics An array of attribute name/value pairs of the
 *     static attributes for the Element. These will only be set once when the
 *     Element is created.
 */
npf.dom.incremental.elementOpenStart = function(tag, opt_key, opt_statics) {
  npf.dom.incremental.assertions.assertNotInAttributes('elementOpenStart');

  if (goog.asserts.ENABLE_ASSERTS) {
    npf.dom.incremental.assertions.setInAttributes(true);
  }

  npf.dom.incremental.argsBuilder_[0] = tag;
  npf.dom.incremental.argsBuilder_[1] = opt_key;
  npf.dom.incremental.argsBuilder_[2] = opt_statics;
};


/***
 * Defines a virtual attribute at this point of the DOM. This is only valid
 * when called between elementOpenStart and elementOpenEnd.
 *
 * @param {string} name
 * @param {*} value
 */
npf.dom.incremental.attr = function(name, value) {
  npf.dom.incremental.assertions.assertInAttributes('attr');
  npf.dom.incremental.argsBuilder_.push(name, value);
};


/**
 * Closes an open tag started with elementOpenStart.
 * @return {!Element} The corresponding Element.
 */
npf.dom.incremental.elementOpenEnd = function() {
  npf.dom.incremental.assertions.assertInAttributes('elementOpenEnd');

  if (goog.asserts.ENABLE_ASSERTS) {
    npf.dom.incremental.assertions.setInAttributes(false);
  }

  var node = npf.dom.incremental.elementOpen.apply(
    null, npf.dom.incremental.argsBuilder_);
  npf.dom.incremental.argsBuilder_.length = 0;

  return node;
};


/**
 * Closes an open virtual Element.
 *
 * @param {string} tag The element's tag.
 * @return {!Element} The corresponding Element.
 */
npf.dom.incremental.elementClose = function(tag) {
  npf.dom.incremental.assertions.assertNotInAttributes('elementClose');

  /** @type {!Element} */
  var node = npf.dom.incremental.core.elementClose();
  /** @type {string} */
  var nodeName = npf.dom.incremental.NodeData.getData(node).nodeName;
  npf.dom.incremental.assertions.assertCloseMatchesOpenTag(nodeName, tag);

  return node;
};


/**
 * Declares a virtual Element at the current location in the document that has
 * no children.
 *
 * @param {string} tag The element's tag.
 * @param {?string=} opt_key The key used to identify this element. This can be
 *     an empty string, but performance may be better if a unique value is used
 *     when iterating over an array of items.
 * @param {?Array<*>=} opt_statics An array of attribute name/value pairs of the
 *     static attributes for the Element. These will only be set once when the
 *     Element is created.
 * @param {...*} var_args Attribute name/value pairs of the dynamic attributes
 *     for the Element.
 * @return {!Element} The corresponding Element.
 */
npf.dom.incremental.elementVoid = function(tag, opt_key, opt_statics,
    var_args) {
  /** @type {!Element} */
  var node = npf.dom.incremental.elementOpen.apply(null, arguments);
  npf.dom.incremental.elementClose.apply(null, arguments);

  return node;
};


/**
 * Declares a virtual Element at the current location in the document that is a
 * placeholder element. Children of this Element can be manually managed and
 * will not be cleared by the library.
 *
 * A key must be specified to make sure that this node is correctly preserved
 * across all conditionals.
 *
 * @param {string} tag The element's tag.
 * @param {string} key The key used to identify this element.
 * @param {?Array<*>=} opt_statics An array of attribute name/value pairs of the
 *     static attributes for the Element. These will only be set once when the
 *     Element is created.
 * @param {...*} var_args Attribute name/value pairs of the dynamic attributes
 *     for the Element.
 * @return {!Element} The corresponding Element.
 */
npf.dom.incremental.elementPlaceholder = function(tag, key, opt_statics,
    var_args) {
  goog.asserts.assert(key, 'Placeholder elements must have a key specified.');

  npf.dom.incremental.elementOpen.apply(null, arguments);
  npf.dom.incremental.core.skip();

  return npf.dom.incremental.elementClose.apply(null, arguments);
};


/**
 * Declares a virtual Text at this point in the document.
 *
 * @param {string|number|boolean} value The value of the Text.
 * @param {...(function((string)):string)} var_args
 *     Functions to format the value which are called only when the value has
 *     changed.
 * @return {!Text} The corresponding text node.
 */
npf.dom.incremental.text = function(value, var_args) {
  npf.dom.incremental.assertions.assertNotInAttributes('text');
  npf.dom.incremental.assertions.assertNotInSkip('text');

  /** @type {!Text} */
  var node = npf.dom.incremental.core.text();
  /** @type {!npf.dom.incremental.NodeData} */
  var data = npf.dom.incremental.NodeData.getData(node);

  if (data.text !== value) {
    data.text = /** @type {string} */(value);

    var formatted = value;

    for (var i = 1; i < arguments.length; i += 1) {
      formatted = arguments[i](formatted);
    }

    node.data = formatted;
  }

  return node;
};

/**
 * Patches the document starting at el with the provided function. This function
 * may be called during an existing patch operation.
 *
 * @param {!Element|!DocumentFragment} node The Element or Document to patch.
 * @param {!function(T)} fn A function containing elementOpen/elementClose/etc.
 *     calls that describe the DOM.
 * @param {T=} opt_data An argument passed to fn to represent DOM state.
 * @template T
 */
npf.dom.incremental.patch = function(node, fn, opt_data) {
  npf.dom.incremental.core.patch(node, fn, opt_data);
};

/**
 * @return {?function(!Array<!Node>)}
 */
npf.dom.incremental.getNotificationCreated = function() {
  return npf.dom.incremental.notifications.nodesCreated;
};

/**
 * @param {?function(!Array<!Node>)} notification
 */
npf.dom.incremental.setNotificationCreated = function(notification) {
  npf.dom.incremental.notifications.nodesCreated = notification;
};

/**
 * @return {?function(!Array<!Node>)}
 */
npf.dom.incremental.getNotificationDeleted = function(notification) {
  return npf.dom.incremental.notifications.nodesDeleted;
};

/**
 * @param {?function(!Array<!Node>)} notification
 */
npf.dom.incremental.setNotificationDeleted = function(notification) {
  npf.dom.incremental.notifications.nodesDeleted = notification;
};
