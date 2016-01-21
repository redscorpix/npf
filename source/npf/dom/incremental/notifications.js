goog.provide('npf.dom.incremental.notifications');


/**
 * Called after patch has compleated with any Nodes that have been created
 * and added to the DOM.
 * @type {?function(!Array<!Node>)}
 */
npf.dom.incremental.notifications.nodesCreated = null;

/**
 * Called after patch has compleated with any Nodes that have been removed
 * from the DOM.
 * Note it's an applications responsibility to handle any childNodes.
 * @type {?function(!Array<!Node>)}
 */
npf.dom.incremental.notifications.nodesDeleted = null;



