goog.provide('npf.ui.Navigation');

goog.require('goog.object');
goog.require('npf.ui.RenderedComponent');
goog.require('npf.ui.navigation.Item');
goog.require('npf.ui.navigation.Renderer');


/**
 * @param {npf.ui.navigation.Renderer=} opt_renderer Renderer used to render
 *                                      or decorate the component.
 * @param {goog.dom.DomHelper=} opt_domHelper DOM helper, used for document
 *                              interaction.
 * @constructor
 * @extends {npf.ui.RenderedComponent}
 */
npf.ui.Navigation = function(opt_renderer, opt_domHelper) {
  goog.base(this, opt_renderer ||
    npf.ui.navigation.Renderer.getInstance(), opt_domHelper);

  this.itemsMap_ = {};
  this.uidToType_ = {};
};
goog.inherits(npf.ui.Navigation, npf.ui.RenderedComponent);


/**
 * @private {Object.<npf.ui.navigation.Item>}
 */
npf.ui.Navigation.prototype.itemsMap_;

/**
 * @private {npf.ui.navigation.Item}
 */
npf.ui.Navigation.prototype.selectedItem_ = null;

/**
 * @type {Object.<string,string>}
 * @private
 */
npf.ui.Navigation.prototype.uidToType_;


/** @inheritDoc */
npf.ui.Navigation.prototype.disposeInternal = function() {
  goog.base(this, 'disposeInternal');

  this.itemsMap_ = null;
  this.selectedItem_ = null;
  this.uidToType_ = null;
};

/** @inheritDoc */
npf.ui.Navigation.prototype.addChildAt = function(child, index, opt_render) {
  if (child instanceof npf.ui.navigation.Item) {
    var itemContainer = /** @type {npf.ui.navigation.Item} */ (child);
    /** @type {string} */
    var type = itemContainer.getType();
    this.itemsMap_[type] = itemContainer;
    this.uidToType_[itemContainer.getId()] = type;
  }

  goog.base(this, 'addChildAt', child, index, opt_render);
};

/** @inheritDoc */
npf.ui.Navigation.prototype.removeChild = function(child, opt_unrender) {
  child = goog.base(this, 'removeChild', child, opt_unrender);

  if (child && child instanceof npf.ui.navigation.Item) {
    var itemContainer = /** @type {npf.ui.navigation.Item} */ (child);
    /** @type {string} */
    var type = itemContainer.getType();
    goog.object.remove(this.itemsMap_, type);
    goog.object.remove(this.uidToType_, itemContainer.getId());
  }

  return child;
};

/**
 * @return {string?}
 */
npf.ui.Navigation.prototype.getSelectedType = function() {
  if (this.selectedItem_) {
    return this.uidToType_[this.selectedItem_.getId()] || null;
  }

  return null;
};

/**
 * @return {npf.ui.navigation.Item}
 */
npf.ui.Navigation.prototype.getSelectedItem = function() {
  return this.selectedItem_;
};

/**
 * @param {string} type
 * @return {npf.ui.navigation.Item}
 */
npf.ui.Navigation.prototype.getItemByType = function(type) {
  return this.itemsMap_[type] || null;
};

/**
 * @param {string=} opt_type
 */
npf.ui.Navigation.prototype.select = function(opt_type) {
  /** @type {npf.ui.navigation.Item} */
  var item = null;

  if (opt_type && this.itemsMap_[opt_type]) {
    item = this.itemsMap_[opt_type];
  }

  if (this.selectedItem_ !== item) {
    if (this.selectedItem_) {
      this.selectedItem_.setSelected(false);
    }

    if (item) {
      this.selectedItem_ = item;
      this.selectedItem_.setSelected(true);
    }
  }
};
