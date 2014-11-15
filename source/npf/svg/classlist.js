goog.provide('npf.svg.classlist');

goog.require('goog.array');
goog.require('goog.object');


/**
 * Use externs.
 */

/**
 * Gets an array of class names on SVG element.
 * @param {SVGElement} element
 * @return {!Array.<string>}
 */
npf.svg.classlist.get = function(element) {
  /** @type {string} */
  var className;

  if (element.className) {
    className = /** @type {string} */ (element['className']['baseVal']);
  } else {
    className = element.getAttribute('class');
  }

  return className.split(/\s+/);
};

/**
 * Sets the entire class name of SVG element.
 * @param {SVGElement} element
 * @param {string} className
 */
npf.svg.classlist.set = function(element, className) {
  if (element.className) {
    element['className']['baseVal'] = className;
  } else {
    element.setAttribute('class', className);
  }
};

/**
 * Returns true if SVG element has a class.
 * @param {SVGElement} element
 * @param {string} className
 */
npf.svg.classlist.contains = function(element, className) {
  /** @type {!Array.<string>} */
  var classes = npf.svg.classlist.get(element);

  return goog.array.contains(classes, className);
};

/**
 * Adds a class (set of classes) to SVG element.
 * @param {SVGElement} element
 * @param {string|Array.<string>} className
 */
npf.svg.classlist.add = function(element, className) {
  /** @type {!Array.<string>} */
  var classNames = goog.isArray(className) ? className : [className];
  /** @type {!Array.<string>} */
  var classes = npf.svg.classlist.get(element);
  var classMap = {};

  goog.array.forEach(npf.svg.classlist.get(element), function(className) {
    classMap[className] = true;
  });
  goog.array.forEach(classNames, function(className) {
    classMap[className] = true;
  });

  npf.svg.classlist.set(element, goog.object.getKeys(classMap).join(' '));
};

/**
 * Removes a class (set of classes) from SVG element.
 * @param {SVGElement} element
 * @param {string|Array.<string>} className
 */
npf.svg.classlist.remove = function(element, className) {
  /** @type {!Array.<string>} */
  var classNames = goog.isArray(className) ? className : [className];
  /** @type {!Array.<string>} */
  var classes = goog.array.filter(
    npf.svg.classlist.get(element),
    function(className) {
      return !goog.array.contains(classNames, className);
    }
  );

  npf.svg.classlist.set(element, classes.join(' '));
};

/**
 * Adds or removes a class depending on the enabled argument.
 * @param {SVGElement} element
 * @param {string} className
 * @param {boolean} enabled
 */
npf.svg.classlist.enable = function(element, className, enabled) {
  if (enabled) {
    npf.svg.classlist.add(element, [className]);
  } else {
    npf.svg.classlist.remove(element, [className]);
  }
};

/**
 * Removes a class if SVG element has it, and adds it the element doesn't have
 * it.
 * @param {SVGElement} element
 * @param {string} className
 */
npf.svg.classlist.toggleClass = function(element, className) {
  /** @type {boolean} */
  var add = !npf.svg.classlist.contains(element, className);
  npf.svg.classlist.enable(element, className, add);
};

/**
 * Adds and removes a class of SVG element.
 * @param {SVGElement} element
 * @param {string} classToRemove
 * @param {string} classToAdd
 */
npf.svg.classlist.addRemoveClass = function(element, classToRemove,
    classToAdd) {
  npf.svg.classlist.remove(element, [classToRemove]);
  npf.svg.classlist.add(element, [classToAdd]);
};
