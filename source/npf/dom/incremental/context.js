goog.provide('npf.dom.incremental.Context');

goog.require('npf.dom.incremental.notifications');


/**
 * Keeps track of the state of a patch.
 * @constructor
 * @struct
 */
npf.dom.incremental.Context = function() {

  /**
   * @private {?Array<!Node>}
   */
  this.created_ = npf.dom.incremental.notifications.nodesCreated ? [] : null;

  /**
   * @private {?Array<!Node>}
   */
  this.deleted_ = npf.dom.incremental.notifications.nodesDeleted ? [] : null;
};


/**
 * @param {!Node} node
 */
npf.dom.incremental.Context.prototype.markCreated = function(node) {
  if (this.created_) {
    this.created_.push(node);
  }
};


/**
 * @param {!Node} node
 */
npf.dom.incremental.Context.prototype.markDeleted = function(node) {
  if (this.deleted_) {
    this.deleted_.push(node);
  }
};


/**
 * Notifies about nodes that were created during the patch opearation.
 */
npf.dom.incremental.Context.prototype.notifyChanges = function() {
  if (this.created_ && this.created_.length) {
    npf.dom.incremental.notifications.nodesCreated(this.created_);
  }

  if (this.deleted_ && this.deleted_.length) {
    npf.dom.incremental.notifications.nodesDeleted(this.deleted_);
  }
};
