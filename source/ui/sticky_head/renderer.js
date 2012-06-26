goog.provide('npf.ui.stickyHead.Renderer');

goog.require('npf.ui.renderComponent.Renderer');


/**
 * @constructor
 * @extends {npf.ui.renderComponent.Renderer}
 */
npf.ui.stickyHead.Renderer = function() {
	goog.base(this);
};
goog.inherits(npf.ui.stickyHead.Renderer, npf.ui.renderComponent.Renderer);
goog.addSingletonGetter(npf.ui.stickyHead.Renderer);


/**
 * @type {string}
 */
npf.ui.stickyHead.Renderer.CSS_CLASS = goog.getCssName('stickyHead');


/** @inheritDoc */
npf.ui.stickyHead.Renderer.prototype.getCssClass = function() {
	return npf.ui.stickyHead.Renderer.CSS_CLASS;
};
