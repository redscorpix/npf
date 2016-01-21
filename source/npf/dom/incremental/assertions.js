goog.provide('npf.dom.incremental.assertions');

goog.require('goog.asserts');


/**
 * Keeps track whether or not we are in an attributes declaration (after
 * elementOpenStart, but before elementOpenEnd).
 * @private {boolean}
 */
npf.dom.incremental.assertions.inAttributes_ = false;


/**
 * Keeps track whether or not we are in an element that should not have its
 * children cleared.
 * @private {boolean}
 */
npf.dom.incremental.assertions.inSkip_ = false;


/**
 * Makes sure that keyed Element matches the tag name provided.
 * @param {string} nodeName The nodeName of the node that is being matched.
 * @param {string} tag The tag name of the Element.
 * @param {string} key The key of the Element.
 */
npf.dom.incremental.assertions.assertKeyedTagMatches = function(nodeName, tag,
    key) {
  goog.asserts.assert(nodeName === tag, 'Was expecting node with key "' +
    key + '" to be a ' + tag + ', not a ' + nodeName + '.');
};


/**
 * Makes sure that a patch closes every node that it opened.
 * @param {?Node} openElement
 * @param {!Node|!DocumentFragment} root
 */
npf.dom.incremental.assertions.assertNoUnclosedTags = function(openElement,
    root) {
  goog.asserts.assert(openElement === root,
    'One or more tags were not closed:\n' +
    npf.dom.incremental.assertions.getOpenTags_(openElement, root).join('\n'));
};

/**
 * @param {?Node} openElement
 * @param {!Node|!DocumentFragment} root
 * @return {!Array<string>}
 * @private
 */
npf.dom.incremental.assertions.getOpenTags_ = function(openElement, root) {
  /** @type {?Node} */
  var currentElement = openElement;
  /** @type {!Array<string>} */
  var openTags = [];

  while (currentElement && currentElement !== root) {
    openTags.push(currentElement.nodeName.toLowerCase());
    currentElement = currentElement.parentNode;
  }

  return openTags;
};


/**
 * Makes sure that the caller is not where attributes are expected.
 * @param {string} functionName
 */
npf.dom.incremental.assertions.assertNotInAttributes = function(functionName) {
  goog.asserts.assert(!npf.dom.incremental.assertions.inAttributes_,
    functionName +
    '() may not be called between elementOpenStart() and elementOpenEnd().');
};


/**
 * Makes sure that the caller is not inside an element that has declared skip.
 * @param {string} functionName
 */
npf.dom.incremental.assertions.assertNotInSkip = function(functionName) {
  goog.asserts.assert(!npf.dom.incremental.assertions.inSkip_, functionName +
    '() may not be called inside an element that has called skip().');
};


/**
 * Makes sure that the caller is where attributes are expected.
 * @param {string} functionName
 */
npf.dom.incremental.assertions.assertInAttributes = function(functionName) {
  goog.asserts.assert(npf.dom.incremental.assertions.inAttributes_,
    functionName + '() must be called after elementOpenStart().');
};


/**
 * Makes sure the patch closes virtual attributes call
 */
npf.dom.incremental.assertions.assertVirtualAttributesClosed = function() {
  goog.asserts.assert(!npf.dom.incremental.assertions.inAttributes_,
    'elementOpenEnd() must be called after calling elementOpenStart().');
};


/**
  * Makes sure that tags are correctly nested.
  * @param {string} nodeName
  * @param {string} tag
  */
npf.dom.incremental.assertions.assertCloseMatchesOpenTag = function(nodeName,
    tag) {
  goog.asserts.assert(nodeName === tag, 'Received a call to close ' + tag +
    ' but ' + nodeName + ' was open.');
};


/**
 * Updates the state of being in an attribute declaration.
 * @param {boolean} value
 * @return {boolean} the previous value.
 */
npf.dom.incremental.assertions.setInAttributes = function(value) {
  /** @type {boolean} */
  var previous = npf.dom.incremental.assertions.inAttributes_;
  npf.dom.incremental.assertions.inAttributes_ = value;

  return previous;
};


/**
 * Updates the state of being in a skip element.
 * @param {boolean} value
 * @return {boolean} the previous value.
 */
npf.dom.incremental.assertions.setInSkip = function(value) {
  /** @type {boolean} */
  var previous = npf.dom.incremental.assertions.inSkip_;
  npf.dom.incremental.assertions.inSkip_ = value;

  return previous;
};
