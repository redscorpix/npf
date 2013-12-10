goog.provide('npf.ui.stickyHead.Head');

goog.require('npf.ui.RenderedComponent');
goog.require('npf.ui.stickyHead.HeadRenderer');


/**
 * @param {boolean} sticky
 * @param {npf.ui.stickyHead.HeadRenderer=} opt_renderer Renderer used to render
 *                                          or decorate the component.
 * @param {goog.dom.DomHelper=} opt_domHelper DOM helper, used for document
 *                                            interaction.
 * @constructor
 * @extends {npf.ui.RenderedComponent}
 */
npf.ui.stickyHead.Head = function(sticky, opt_renderer, opt_domHelper) {
	goog.base(this, opt_renderer ||
		npf.ui.stickyHead.HeadRenderer.getInstance(), opt_domHelper);

	/**
	 * @private {boolean}
	 */
	this.sticky_ = sticky;

	/**
	 * @private {boolean}
	 */
	this.visible_ = true;
};
goog.inherits(npf.ui.stickyHead.Head, npf.ui.RenderedComponent);


/** @inheritDoc */
npf.ui.stickyHead.Head.prototype.enterDocument = function() {
	goog.base(this, 'enterDocument');

	this.applyVisible(this.isVisible());
};

/**
 * @return {boolean}
 */
npf.ui.stickyHead.Head.prototype.isSticky = function() {
	return this.sticky_;
};

/**
 * @return {boolean}
 */
npf.ui.stickyHead.Head.prototype.isVisible = function() {
	return this.visible_;
};

/**
 * @param {boolean} visible
 */
npf.ui.stickyHead.Head.prototype.setVisible = function(visible) {
	if (this.isVisible() != visible) {
		this.setVisibleInternal(visible);
		this.applyVisible(visible);
	}
};

/**
 * @param {boolean} visible
 * @protected
 */
npf.ui.stickyHead.Head.prototype.setVisibleInternal = function(visible) {
	this.visible_ = visible;
};

/**
 * @param {boolean} visible
 * @protected
 */
npf.ui.stickyHead.Head.prototype.applyVisible = function(visible) {
	this.getRenderer().setVisible(this, visible);
};
