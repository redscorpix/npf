goog.provide('npf.dom.incremental.NodeData');

goog.require('npf.dom.incremental.util');


/**
 * Keeps track of information needed to perform diffs for a given DOM node.
 * @param {!string} nodeName
 * @param {?string=} opt_key
 * @constructor
 * @struct
 */
npf.dom.incremental.NodeData = function(nodeName, opt_key) {

  /**
   * The attributes and their values.
   * @const {!Object<string,*>}
   */
  this.attrs = npf.dom.incremental.util.createMap();

  /**
   * An array of attribute name/value pairs, used for quickly diffing the
   * incomming attributes to see if the DOM node's attributes need to be
   * updated.
   * @const {!Array<*>}
   */
  this.attrsArr = [];

  /**
   * The incoming attributes for this Node, before they are updated.
   * @const {!Object<string,*>}
   */
  this.newAttrs = npf.dom.incremental.util.createMap();

  /**
   * The key used to identify this node, used to preserve DOM nodes when they
   * move within their parent.
   * @const {?string}
   */
  this.key = opt_key || null;

  /**
   * Keeps track of children within this node by their key.
   * {?Object<string,!Element>}
   */
  this.keyMap = null;

  /**
   * Whether or not the keyMap is currently valid.
   * {boolean}
   */
  this.keyMapValid = true;

  /**
   * The node name for this node.
   * @const {string}
   */
  this.nodeName = nodeName;

  /**
   * @type {?string}
   */
  this.text = null;
};


/**
 * @const {string}
 */
npf.dom.incremental.NodeData.DOM_DATA_KEY = '__incrementalDOMData';


/**
 * Initializes a npf.dom.incremental.NodeData object for a Node.
 *
 * @param {!Node} node The node to initialize data for.
 * @param {string} nodeName The node name of node.
 * @param {?string=} opt_key The key that identifies the node.
 * @return {!npf.dom.incremental.NodeData} The newly initialized data object
 */
npf.dom.incremental.NodeData.initData = function(node, nodeName, opt_key) {
  var data = new npf.dom.incremental.NodeData(nodeName, opt_key);
  node[npf.dom.incremental.NodeData.DOM_DATA_KEY] = data;

  return data;
};


/**
 * Retrieves the npf.dom.incremental.NodeData object for a Node, creating it
 * if necessary.
 *
 * @param {!Node} node The node to retrieve the data for.
 * @return {!npf.dom.incremental.NodeData} The npf.dom.incremental.NodeData
 *     for this Node.
 */
npf.dom.incremental.NodeData.getData = function(node) {
  var data = /** @type {npf.dom.incremental.NodeData|undefined} */ (
    node[npf.dom.incremental.NodeData.DOM_DATA_KEY]);

  if (!data) {
    /** @type {string} */
    var nodeName = node.nodeName.toLowerCase();
    /** @type {string|null|undefined} */
    var key = node instanceof Element ? node.getAttribute('key') : null;
    data = npf.dom.incremental.NodeData.initData(node, nodeName, key);
  }

  return data;
};
