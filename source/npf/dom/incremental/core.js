goog.provide('npf.dom.incremental.core');

goog.require('npf.dom.incremental.Context');
goog.require('npf.dom.incremental.NodeData');
goog.require('npf.dom.incremental.assertions');
goog.require('npf.dom.incremental.nodes');
goog.require('npf.dom.incremental.symbols');
goog.require('goog.asserts');


/**
 * @private {?npf.dom.incremental.Context}
 */
npf.dom.incremental.core.context_ = null;

/**
 * @private {?Node}
 */
npf.dom.incremental.core.currentNode_ = null;

/**
 * @private {?Node}
 */
npf.dom.incremental.core.currentParent_ = null;

/**
 * @private {?Node}
 */
npf.dom.incremental.core.previousNode_ = null;

/**
 * @private {?Element|?DocumentFragment}
 */
npf.dom.incremental.core.root_ = null;

/**
 * @private {?Document}
 */
npf.dom.incremental.core.doc_ = null;


/**
 * Patches the document starting at el with the provided function. This function
 * may be called during an existing patch operation.
 * @param {!Element|!DocumentFragment} node The Element or Document to patch.
 * @param {!function(T)} fn A function containing elementOpen/elementClose/etc.
 *     calls that describe the DOM.
 * @param {T=} opt_data An argument passed to fn to represent DOM state.
 * @template T
 */
npf.dom.incremental.core.patch = function(node, fn, opt_data) {
  /** @type {?npf.dom.incremental.Context} */
  var prevContext = npf.dom.incremental.core.context_;
  /** @type {?Element|?DocumentFragment} */
  var prevRoot = npf.dom.incremental.core.root_;
  /** @type {?Document} */
  var prevDoc = npf.dom.incremental.core.doc_;
  /** @type {?Node} */
  var prevCurrentNode = npf.dom.incremental.core.currentNode_;
  /** @type {?Node} */
  var prevCurrentParent = npf.dom.incremental.core.currentParent_;
  /** @type {?Node} */
  var prevPreviousNode = npf.dom.incremental.core.previousNode_;
  /** @type {boolean} */
  var previousInAttributes = false;
  /** @type {boolean} */
  var previousInSkip = false;

  npf.dom.incremental.core.context_ = new npf.dom.incremental.Context();
  npf.dom.incremental.core.root_ = node;
  npf.dom.incremental.core.doc_ = node.ownerDocument;
  npf.dom.incremental.core.currentNode_ = node;
  npf.dom.incremental.core.currentParent_ = null;
  npf.dom.incremental.core.previousNode_ = null;

  if (goog.asserts.ENABLE_ASSERTS) {
    previousInAttributes =
      npf.dom.incremental.assertions.setInAttributes(false);
    previousInSkip = npf.dom.incremental.assertions.setInSkip(false);
  }

  npf.dom.incremental.core.enterNode_();
  fn(opt_data);
  npf.dom.incremental.core.exitNode_();

  npf.dom.incremental.assertions.assertVirtualAttributesClosed();
  npf.dom.incremental.assertions.assertNoUnclosedTags(
    npf.dom.incremental.core.previousNode_, node);

  if (goog.asserts.ENABLE_ASSERTS) {
    npf.dom.incremental.assertions.setInAttributes(previousInAttributes);
    npf.dom.incremental.assertions.setInSkip(previousInSkip);
  }

  npf.dom.incremental.core.context_.notifyChanges();

  npf.dom.incremental.core.context_ = prevContext;
  npf.dom.incremental.core.root_ = prevRoot;
  npf.dom.incremental.core.doc_ = prevDoc;
  npf.dom.incremental.core.currentNode_ = prevCurrentNode;
  npf.dom.incremental.core.currentParent_ = prevCurrentParent;
  npf.dom.incremental.core.previousNode_ = prevPreviousNode;
};


/**
 * Checks whether or not the current node matches the specified nodeName and
 * key.
 *
 * @param {?string} nodeName The nodeName for this node.
 * @param {?string=} opt_key An optional key that identifies a node.
 * @return {boolean} True if the node matches, false otherwise.
 * @private
 */
npf.dom.incremental.core.matches_ = function(nodeName, opt_key) {
  /** @type {!npf.dom.incremental.NodeData} */
  var data = npf.dom.incremental.NodeData.getData(
    /** @type {!Node} */ (npf.dom.incremental.core.currentNode_));

  // Key check is done using double equals as we want to treat a null key the
  // same as undefined. This should be okay as the only values allowed are
  // strings, null and undefined so the == semantics are not too weird.
  return nodeName === data.nodeName && opt_key == data.key;
};


/**
 * Aligns the virtual Element definition with the actual DOM, moving the
 * corresponding DOM node to the correct location or creating it if necessary.
 * @param {string} nodeName For an Element, this should be a valid tag string.
 *     For a Text, this should be #text.
 * @param {?string=} opt_key The key used to identify this element.
 * @param {?Array<*>=} opt_statics For an Element, this should be an array of
 *     name-value pairs.
 * @private
 */
npf.dom.incremental.core.alignWithDom_ = function(nodeName, opt_key,
    opt_statics) {
  if (
    npf.dom.incremental.core.currentNode_ &&
    npf.dom.incremental.core.matches_(nodeName, opt_key)
  ) {
    return;
  }

  var node;

  // Check to see if the node has moved within the parent.
  if (opt_key) {
    node = npf.dom.incremental.nodes.getChild(
      /** @type {!Node} */ (npf.dom.incremental.core.currentParent_), opt_key);

    if (node) {
      npf.dom.incremental.assertions.assertKeyedTagMatches(
        npf.dom.incremental.NodeData.getData(node).nodeName, nodeName, opt_key);
    }
  }

  // Create the node if it doesn't exist.
  if (!node) {
    if (nodeName === '#text') {
      node = npf.dom.incremental.nodes.createText(
        /** @type {!Document} */ (npf.dom.incremental.core.doc_));
    } else {
      node = npf.dom.incremental.nodes.createElement(
        /** @type {!Document} */ (npf.dom.incremental.core.doc_),
        /** @type {!Node} */ (npf.dom.incremental.core.currentParent_), nodeName,
        opt_key, opt_statics);
    }

    if (opt_key) {
      npf.dom.incremental.nodes.registerChild(
        /** @type {!Node} */ (npf.dom.incremental.core.currentParent_),
        opt_key, node);
    }

    npf.dom.incremental.core.context_.markCreated(node);
  }

  // If the node has a key, remove it from the DOM to prevent a large number
  // of re-orders in the case that it moved far or was completely removed.
  // Since we hold on to a reference through the keyMap, we can always add it
  // back.
  if (
    npf.dom.incremental.core.currentNode_ &&
    npf.dom.incremental.NodeData.getData(
      npf.dom.incremental.core.currentNode_).key
  ) {
    npf.dom.incremental.core.currentParent_.replaceChild(
      node, npf.dom.incremental.core.currentNode_);

    /** @type {!npf.dom.incremental.NodeData} */
    var nodeData = npf.dom.incremental.NodeData.getData(
      npf.dom.incremental.core.currentParent_);
    nodeData.keyMapValid = false;
  } else {
    npf.dom.incremental.core.currentParent_.insertBefore(
      node, npf.dom.incremental.core.currentNode_);
  }

  npf.dom.incremental.core.currentNode_ = node;
};


/**
 * Clears out any unvisited Nodes, as the corresponding virtual element
 * functions were never called for them.
 * @private
 */
npf.dom.incremental.core.clearUnvisitedDom_ = function() {
  var node = /** @type {!Node} */ (npf.dom.incremental.core.currentParent_);
  /** @type {!npf.dom.incremental.NodeData} */
  var data = npf.dom.incremental.NodeData.getData(node);
  /** @type {?Object<string,!Element>} */
  var keyMap = data.keyMap;
  /** @type {boolean} */
  var keyMapValid = data.keyMapValid;
  /** @type {?Node} */
  var child = node.lastChild;
  var key;

  if (child === npf.dom.incremental.core.previousNode_ && keyMapValid) {
    return;
  }

  if (
    data.attrs[npf.dom.incremental.symbols.PLACEHOLDER] &&
    node !== npf.dom.incremental.core.root_
  ) {
    return;
  }

  while (child !== npf.dom.incremental.core.previousNode_) {
    node.removeChild(child);
    npf.dom.incremental.core.context_.markDeleted(/** @type {!Node}*/(child));

    key = npf.dom.incremental.NodeData.getData(/** @type {!Node}*/(child)).key;

    if (key) {
      delete keyMap[key];
    }

    child = node.lastChild;
  }

  // Clean the keyMap, removing any unusued keys.
  if (!keyMapValid) {
    for (key in keyMap) {
      child = keyMap[key];

      if (child.parentNode !== node) {
        npf.dom.incremental.core.context_.markDeleted(child);
        delete keyMap[key];
      }
    }

    data.keyMapValid = true;
  }
};


/**
 * Changes to the first child of the current node.
 * @private
 */
npf.dom.incremental.core.enterNode_ = function() {
  npf.dom.incremental.core.currentParent_ =
    npf.dom.incremental.core.currentNode_;
  npf.dom.incremental.core.currentNode_ =
    npf.dom.incremental.core.currentNode_.firstChild;
  npf.dom.incremental.core.previousNode_ = null;
};


/**
 * Changes to the next sibling of the current node.
 * @private
 */
npf.dom.incremental.core.nextNode_ = function() {
  npf.dom.incremental.core.previousNode_ =
    npf.dom.incremental.core.currentNode_;
  npf.dom.incremental.core.currentNode_ =
    npf.dom.incremental.core.currentNode_.nextSibling;
};


/**
 * Changes to the parent of the current node, removing any unvisited children.
 * @private
 */
npf.dom.incremental.core.exitNode_ = function() {
  npf.dom.incremental.core.clearUnvisitedDom_();

  npf.dom.incremental.core.previousNode_ =
    npf.dom.incremental.core.currentParent_;
  npf.dom.incremental.core.currentNode_ =
    npf.dom.incremental.core.currentParent_.nextSibling;
  npf.dom.incremental.core.currentParent_ =
    npf.dom.incremental.core.currentParent_.parentNode;
};


/**
 * Makes sure that the current node is an Element with a matching tagName and
 * key.
 *
 * @param {string} tag The element's tag.
 * @param {?string=} opt_key The key used to identify this element. This can be
 *     an empty string, but performance may be better if a unique value is used
 *     when iterating over an array of items.
 * @param {?Array<*>=} opt_statics An array of attribute name/value pairs of the
 *     static attributes for the Element. These will only be set once when the
 *     Element is created.
 * @return {!Element} The corresponding Element.
 */
npf.dom.incremental.core.elementOpen = function(tag, opt_key, opt_statics) {
  npf.dom.incremental.core.alignWithDom_(tag, opt_key, opt_statics);
  npf.dom.incremental.core.enterNode_();

  return /** @type {!Element} */(npf.dom.incremental.core.currentParent_);
};


/**
 * Closes the currently open Element, removing any unvisited children if
 * necessary.
 *
 * @return {!Element} The corresponding Element.
 */
npf.dom.incremental.core.elementClose = function() {
  if (goog.asserts.ENABLE_ASSERTS) {
    npf.dom.incremental.assertions.setInSkip(false);
  }

  npf.dom.incremental.core.exitNode_();

  return /** @type {!Element} */(npf.dom.incremental.core.previousNode_);
};


/**
 * Makes sure the current node is a Text node and creates a Text node if it is
 * not.
 *
 * @return {!Text} The corresponding Text Node.
 */
npf.dom.incremental.core.text = function() {
  npf.dom.incremental.core.alignWithDom_('#text', null, null);
  npf.dom.incremental.core.nextNode_();

  return /** @type {!Text} */(npf.dom.incremental.core.previousNode_);
};


/**
 * Gets the current Element being patched.
 * @return {!Element}
 */
npf.dom.incremental.core.currentElement = function() {
  goog.asserts.assert(npf.dom.incremental.core.context_,
    'Cannot call currentElement() unless in patch');
  npf.dom.incremental.assertions.assertNotInAttributes('currentElement');

  return /** @type {!Element} */(npf.dom.incremental.core.currentParent_);
};


/**
 * Skips the children in a subtree, allowing an Element to be closed without
 * clearing out the children.
 */
npf.dom.incremental.core.skip = function() {
  goog.asserts.assert(goog.isNull(npf.dom.incremental.core.previousNode_),
    'skip() must come before any ' +
    'child declarations inside the current element.');

  if (goog.asserts.ENABLE_ASSERTS) {
    npf.dom.incremental.assertions.setInSkip(true);
  }

  npf.dom.incremental.core.previousNode_ =
    npf.dom.incremental.core.currentParent_.lastChild;
};
