goog.provide('npf.ui.navigation.Renderer');

goog.require('npf.ui.Renderer');


/**
 * @constructor
 * @extends {npf.ui.Renderer}
 */
npf.ui.navigation.Renderer = function() {
  npf.ui.navigation.Renderer.base(this, 'constructor');
};
goog.inherits(npf.ui.navigation.Renderer, npf.ui.Renderer);
goog.addSingletonGetter(npf.ui.navigation.Renderer);


/**
 * @type {string}
 */
npf.ui.navigation.Renderer.CSS_CLASS = goog.getCssName('npf-navigation');


/** @inheritDoc */
npf.ui.navigation.Renderer.prototype.getCssClass = function() {
  return npf.ui.navigation.Renderer.CSS_CLASS;
};
