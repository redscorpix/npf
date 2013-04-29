goog.provide('npf.ui.stickyHead.HeadRenderer');

goog.require('goog.dom.classes');
goog.require('goog.style');
goog.require('npf.ui.Renderer');


/**
 * @constructor
 * @extends {npf.ui.Renderer}
 */
npf.ui.stickyHead.HeadRenderer = function() {
	goog.base(this);
};
goog.inherits(npf.ui.stickyHead.HeadRenderer, npf.ui.Renderer);
goog.addSingletonGetter(npf.ui.stickyHead.HeadRenderer);


/**
 * @type {string}
 */
npf.ui.stickyHead.HeadRenderer.CSS_CLASS = goog.getCssName('stickyHead-head');

/**
 * @enum {string}
 */
npf.ui.stickyHead.HeadRenderer.CssClass = {
	STICKY: goog.getCssName('stickyHead-stickyHead')
};


/** @inheritDoc */
npf.ui.stickyHead.HeadRenderer.prototype.createDom = function(component) {
	/** @type {Element} */
	var element = goog.base(this, 'createDom', component);

	if (component.isSticky()) {
		goog.dom.classes.add(element, this.getStickyCssClass());
	}

	return element;
};

/** @inheritDoc */
npf.ui.stickyHead.HeadRenderer.prototype.getCssClass = function() {
	return npf.ui.stickyHead.HeadRenderer.CSS_CLASS;
};

/**
 * @return {string}
 */
npf.ui.stickyHead.HeadRenderer.prototype.getStickyCssClass = function() {
	return npf.ui.stickyHead.HeadRenderer.CssClass.STICKY;
};

/**
 * @param {!npf.ui.stickyHead.Head} component
 * @param {boolean} visible
 */
npf.ui.stickyHead.HeadRenderer.prototype.setVisible = function(component, visible) {
	/** @type {Element} */
	var element = component.getElement();

	if (element) {
		goog.style.setElementShown(element, visible);
	}
};
