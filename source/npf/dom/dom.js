goog.provide('npf.dom');

goog.require('goog.array');
goog.require('goog.dom');
goog.require('npf.dom.Content');


/**
 * @param {!Element} element
 * @param {npf.dom.Content} content
 */
npf.dom.setContent = function(element, content) {
  goog.dom.removeChildren(element);

  if (content) {
    if (goog.isString(content)) {
      goog.dom.setTextContent(element, content);
    } else {
      var childHandler = function(child) {
        if (child) {
          var doc = goog.dom.getOwnerDocument(element);
          element.appendChild(
            goog.isString(child) ? doc.createTextNode(child) : child);
        }
      };
      if (goog.isArray(content)) {
        // Array of nodes.
        goog.array.forEach(content, childHandler);
      } else if (goog.isArrayLike(content) && !('nodeType' in content)) {
        // NodeList. The second condition filters out TextNode which also has
        // length attribute but is not array like. The nodes have to be cloned
        // because childHandler removes them from the list during iteration.
        goog.array.forEach(goog.array.clone(/** @type {!NodeList} */(content)),
          childHandler);
      } else {
        // Node or string.
        childHandler(content);
      }
    }
  }
};
