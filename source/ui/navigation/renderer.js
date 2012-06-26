goog.provide('npf.ui.navigation.Renderer');

goog.require('npf.ui.renderComponent.Renderer');


/**
 * @constructor
 * @extends {npf.ui.renderComponent.Renderer}
 */
npf.ui.navigation.Renderer = function() {
	goog.base(this);
};
goog.inherits(npf.ui.navigation.Renderer, npf.ui.renderComponent.Renderer);
goog.addSingletonGetter(npf.ui.navigation.Renderer);


/**
 * @type {string}
 */
npf.ui.navigation.Renderer.CSS_CLASS = goog.getCssName('sx-navigation');


/** @inheritDoc */
npf.ui.navigation.Renderer.prototype.getCssClass = function() {
	return npf.ui.navigation.Renderer.CSS_CLASS;
};
