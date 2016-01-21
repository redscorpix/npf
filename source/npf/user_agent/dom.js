goog.provide('npf.userAgent.dom');

goog.require('goog.dom');
goog.require('goog.dom.TagName');


/**
 * @return {boolean}
 */
npf.userAgent.dom.isClassListSupported = function() {
  return 'classList' in goog.dom.getDomHelper().getDocument().documentElement;
};

/**
 * @private {boolean?}
 */
npf.userAgent.dom.createElementAttr_ = null;

/**
 * @return {boolean}
 */
npf.userAgent.dom.isCreateElementAttrSupported = function() {
  if (goog.isNull(npf.userAgent.dom.createElementAttr_)) {
    npf.userAgent.dom.createElementAttr_ = false;

    try {
      npf.userAgent.dom.createElementAttr_ =
        'test' == goog.dom.createElement('<input name="test" />').
          getAttribute('name');
    } catch (e) { }
  }

  return /** @type {boolean} */ (npf.userAgent.dom.createElementAttr_);
};

/**
 * @private {boolean?}
 */
npf.userAgent.dom.dataset_ = null;

/**
 * @return {boolean}
 */
npf.userAgent.dom.isDatasetSupported = function() {
  if (goog.isNull(npf.userAgent.dom.dataset_)) {
    /** @type {!Element} */
    var element = goog.dom.createElement(goog.dom.TagName.DIV);
    element.setAttribute('data-a-b', 'c');

    npf.userAgent.dom.dataset_ =
      !!element['dataset'] && 'c' === element['dataset']['aB'];
  }

  return /** @type {boolean} */ (npf.userAgent.dom.dataset_);
};

/**
 * Append multiple elements to the DOM within a single insertion.
 * @return {boolean}
 */
npf.userAgent.dom.isDocumentFragmentSupported = function() {
  /** @type {!Document} */
  var doc = goog.dom.getDomHelper().getDocument();

  return 'createDocumentFragment' in doc &&
    'appendChild' in doc.documentElement;
};

/**
 * @private {boolean?}
 */
npf.userAgent.dom.hiddenAttr_ = null;

/**
 * Does the browser support the HTML5 [hidden] attribute?
 * @return {boolean}
 */
npf.userAgent.dom.isHiddenAttributeSupported = function() {
  if (goog.isNull(npf.userAgent.dom.hiddenAttr_)) {
    npf.userAgent.dom.hiddenAttr_ =
      'hidden' in goog.dom.createElement(goog.dom.TagName.A);
  }

  return /** @type {boolean} */ (npf.userAgent.dom.hiddenAttr_);
};

/**
 * @return {boolean}
 */
npf.userAgent.dom.isMicrodataSupported = function() {
  return 'getItems' in goog.dom.getDomHelper().getDocument();
};

/**
 * Determines if DOM4 MutationObserver support is available.
 * @return {boolean}
 */
npf.userAgent.dom.isMutationObserverSupported = function() {
  /** @type {!Window} */
  var win = goog.dom.getDomHelper().getWindow();

  return !!win['MutationObserver'] || !!win['WebKitMutationObserver'];
};

/**
 * Detects support for querySelector.
 * @return {boolean}
 */
npf.userAgent.dom.isQuerySelectorSupported = function() {
  /** @type {!Document} */
  var doc = goog.dom.getDomHelper().getDocument();

  return 'querySelector' in doc && 'querySelectorAll' in doc;
};
