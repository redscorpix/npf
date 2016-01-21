goog.provide('npf.dom.incremental.nodes');

goog.require('npf.dom.incremental.NodeData');
goog.require('npf.dom.incremental.attributes');
goog.require('npf.dom.incremental.util');


/**
 * Gets the namespace to create an element (of a given tag) in.
 * @param {string} tag The tag to get the namespace for.
 * @param {!Node} parent
 * @return {?string} The namespace to create the tag in.
 */
npf.dom.incremental.nodes.getNamespaceForTag_ = function(tag, parent) {
  if (tag === 'svg') {
    return 'http://www.w3.org/2000/svg';
  }

  /** @type {!npf.dom.incremental.NodeData} */
  var nodeData = npf.dom.incremental.NodeData.getData(parent);

  return 'foreignObject' === nodeData.nodeName ||
    'http://www.w3.org/1999/xhtml' == parent.namespaceURI ?
      null : parent.namespaceURI;
};


/**
 * Creates an Element.
 * @param {!Document} doc The document with which to create the Element.
 * @param {!Node} parent
 * @param {string} tag The tag for the Element.
 * @param {?string=} opt_key A key to identify the Element.
 * @param {?Array<*>=} opt_statics An array of attribute name/value pairs of the
 *     static attributes for the Element.
 * @return {!Element}
 */
npf.dom.incremental.nodes.createElement = function(doc, parent, tag, opt_key,
    opt_statics) {
  var namespace = npf.dom.incremental.nodes.getNamespaceForTag_(tag, parent);
  /** @type {!Element} */
  var el = namespace ?
    doc.createElementNS(namespace, tag) : doc.createElement(tag);
  npf.dom.incremental.NodeData.initData(el, tag, opt_key);

  if (opt_statics) {
    for (var i = 0; i < opt_statics.length; i += 2) {
      npf.dom.incremental.attributes.updateAttribute(
        el, /** @type {!string}*/(opt_statics[i]), opt_statics[i + 1]);
    }
  }

  return el;
};


/**
 * Creates a Text Node.
 * @param {!Document} doc The document with which to create the Element.
 * @return {!Text}
 */
npf.dom.incremental.nodes.createText = function(doc) {
  var node = doc.createTextNode('');
  npf.dom.incremental.NodeData.initData(node, '#text', null);

  return node;
};


/**
 * Creates a mapping that can be used to look up children using a key.
 * @param {!Node} el
 * @return {!Object<string,!Element>} A mapping of keys to the children of the
 *     Element.
 * @private
 */
npf.dom.incremental.nodes.createKeyMap_ = function(el) {
  var map = npf.dom.incremental.util.createMap();
  var children = el.children;

  for (var i = 0, count = children.length; i < count; i += 1) {
    var child = children[i];
    var key = npf.dom.incremental.NodeData.getData(child).key;

    if (key) {
      map[key] = child;
    }
  }

  return map;
};


/**
 * Retrieves the mapping of key to child node for a given Element, creating it
 * if necessary.
 * @param {!Node} el
 * @return {!Object<string, !Node>} A mapping of keys to child Elements
 * @private
 */
npf.dom.incremental.nodes.getKeyMap_ = function(el) {
  /** @type {!npf.dom.incremental.NodeData} */
  var data = npf.dom.incremental.NodeData.getData(el);

  if (!data.keyMap) {
    data.keyMap = npf.dom.incremental.nodes.createKeyMap_(el);
  }

  return data.keyMap;
};


/**
 * Retrieves a child from the parent with the given key.
 * @param {!Node} parent
 * @param {?string=} opt_key
 * @return {?Node} The child corresponding to the key.
 */
npf.dom.incremental.nodes.getChild = function(parent, opt_key) {
  return opt_key ? npf.dom.incremental.nodes.getKeyMap_(parent)[opt_key] : null;
};


/**
 * Registers an element as being a child. The parent will keep track of the
 * child using the key. The child can be retrieved using the same key using
 * npf.dom.incremental.nodes.getKeyMap_. \
 * The provided key should be unique within the parent Element.
 * @param {!Node} parent The parent of child.
 * @param {string} key A key to identify the child with.
 * @param {!Node} child The child to register.
 */
npf.dom.incremental.nodes.registerChild = function(parent, key, child) {
  npf.dom.incremental.nodes.getKeyMap_(parent)[key] = child;
};
