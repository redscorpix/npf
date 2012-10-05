goog.provide('npf.ui.Navigation');

goog.require('goog.object');
goog.require('npf.ui.RenderComponent');
goog.require('npf.ui.navigation.Item');
goog.require('npf.ui.navigation.Renderer');


/**
 * @param {npf.ui.navigation.Renderer=} opt_renderer Renderer used to render or decorate the component.
 * @param {goog.dom.DomHelper=} opt_domHelper DOM helper, used for document interaction.
 * @constructor
 * @extends {npf.ui.RenderComponent}
 */
npf.ui.Navigation = function(opt_renderer, opt_domHelper) {
  goog.base(this, opt_renderer ||
    npf.ui.navigation.Renderer.getInstance(), opt_domHelper);

  this.itemsMap_ = {};
  this.uidToType_ = {};
};
goog.inherits(npf.ui.Navigation, npf.ui.RenderComponent);


/**
 * @type {Object.<string,npf.ui.navigation.Item>}
 * @private
 */
npf.ui.Navigation.prototype.itemsMap_;

/**
 * @type {Object.<string,string>}
 * @private
 */
npf.ui.Navigation.prototype.uidToType_;

/**
 * @type {npf.ui.navigation.Item}
 * @private
 */
npf.ui.Navigation.prototype.selectedItem_ = null;


/** @inheritDoc */
npf.ui.Navigation.prototype.createDom = function() {
  var renderer = this.getRenderer();
  /** @type {Element} */
  var element = renderer.createDom(this);
  this.setElementInternal(element);
};

/** @inheritDoc */
npf.ui.Navigation.prototype.disposeInternal = function() {
  goog.base(this, 'disposeInternal');

  this.itemsMap_ = null;
  this.uidToType_ = null;
  this.selectedItem_ = null;
};

/**
 * @param {npf.ui.navigation.Item} item
 */
npf.ui.Navigation.prototype.addItem = function(item) {
  /** @type {string} */
  var type = item.getType();
  goog.object.add(this.itemsMap_, type, item);
  goog.object.add(this.uidToType_, goog.getUid(item) + '', type);

  this.addChild(item, true);
};

/**
 * @return {string?}
 */
npf.ui.Navigation.prototype.getSelectedType = function() {
  if (this.selectedItem_) {
    /** @type {number} */
    var uid = goog.getUid(this.selectedItem_);

    return this.uidToType_[/** @type {string} */ (uid)] || null;
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
 * @param {?string=} opt_type
 */
npf.ui.Navigation.prototype.select = function(opt_type) {
  /** @type {npf.ui.navigation.Item} */
  var item = null;

  if (opt_type) {
    item = this.itemsMap_[opt_type] || null;
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
