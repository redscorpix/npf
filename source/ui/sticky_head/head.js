goog.provide('npf.ui.stickyHead.Head');

goog.require('npf.ui.RenderComponent');
goog.require('npf.ui.stickyHead.HeadRenderer');


/**
 * @param {boolean} isSticky
 * @param {npf.ui.stickyHead.HeadRenderer=} opt_renderer Renderer used to render or decorate the release.
 * @param {goog.dom.DomHelper=} opt_domHelper DOM helper, used for document interaction.
 * @constructor
 * @extends {npf.ui.RenderComponent}
 */
npf.ui.stickyHead.Head = function(isSticky, opt_renderer, opt_domHelper) {
	goog.base(this, opt_renderer || npf.ui.stickyHead.HeadRenderer.getInstance(), opt_domHelper);

	this._isSticky = isSticky;
};
goog.inherits(npf.ui.stickyHead.Head, npf.ui.RenderComponent);


/**
 * @type {boolean}
 * @private
 */
npf.ui.stickyHead.Head.prototype._isSticky;

/**
 * @type {boolean}
 * @private
 */
npf.ui.stickyHead.Head.prototype._isVisible = true;


/** @inheritDoc */
npf.ui.stickyHead.Head.prototype.enterDocument = function() {
	goog.base(this, 'enterDocument');

	this.setVisibleInternal(this._isVisible);
};

/** @inheritDoc */
npf.ui.stickyHead.Head.prototype.disposeInternal = function() {
	goog.base(this, 'disposeInternal');

	delete this._isSticky;
	delete this._isVisible;
};

/**
 * @return {boolean}
 */
npf.ui.stickyHead.Head.prototype.isSticky = function() {
	return this._isSticky;
};

/**
 * @return {boolean}
 */
npf.ui.stickyHead.Head.prototype.isVisible = function() {
	return this._isVisible;
};

/**
 * @param {boolean} visible
 */
npf.ui.stickyHead.Head.prototype.setVisible = function(visible) {
	if (this._isVisible == visible) {
		return;
	}

	this._isVisible = visible;

	if (this.isInDocument()) {
		this.setVisibleInternal(visible);
	}
};

/**
 * @param {boolean} visible
 * @protected
 */
npf.ui.stickyHead.Head.prototype.setVisibleInternal = function(visible) {
	/** @type {npf.ui.stickyHead.HeadRenderer} */
	var renderer = /** @type {npf.ui.stickyHead.HeadRenderer} */ (this.getRenderer());
	renderer.setVisible(this, visible);
};
