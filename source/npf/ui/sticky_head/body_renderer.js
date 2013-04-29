goog.provide('npf.ui.stickyHead.BodyRenderer');

goog.require('npf.ui.Renderer');


/**
 * @constructor
 * @extends {npf.ui.Renderer}
 */
npf.ui.stickyHead.BodyRenderer = function() {
	goog.base(this);
};
goog.inherits(npf.ui.stickyHead.BodyRenderer, npf.ui.Renderer);
goog.addSingletonGetter(npf.ui.stickyHead.BodyRenderer);


/**
 * @type {string}
 */
npf.ui.stickyHead.BodyRenderer.CSS_CLASS = goog.getCssName('stickyHead-body');


/** @inheritDoc */
npf.ui.stickyHead.BodyRenderer.prototype.getCssClass = function() {
	return npf.ui.stickyHead.BodyRenderer.CSS_CLASS;
};
