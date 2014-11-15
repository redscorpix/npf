goog.provide('npf.dom.classes');

goog.require('goog.array');


/**
 * Sets the entire class name of an element.
 * @param {Node} element DOM node to set class of.
 * @param {string} className Class name(s) to apply to element.
 */
npf.dom.classes.set = function(element, className) {
  if (goog.isObject(element)) {
    if (element.className['baseVal']) {
      element.className['baseVal'] = className;
    }
  } else {
    element.className = className;
  }
};


/**
 * Gets an array of class names on an element
 * @param {Node} element DOM node to get class of.
 * @return {!Array} Class names on {@code element}.
 */
npf.dom.classes.get = function(element) {
  var className = element.className;
  /** @type {string} */
  var value = '';

  if (goog.isString(className)) {
    value = className;
  } else if (className && goog.isString(className['baseVal'])) {
    value = className['baseVal'];
  }

  return value.match(/\S+/g) || [];
};


/**
 * Adds a class or classes to an element. Does not add multiples of class names.
 * @param {Node} element DOM node to add class to.
 * @param {...string} var_args Class names to add.
 * @return {boolean} Whether class was added (or all classes were added).
 */
npf.dom.classes.add = function(element, var_args) {
  var classes = npf.dom.classes.get(element);
  var args = goog.array.slice(arguments, 1);
  var expectedCount = classes.length + args.length;
  npf.dom.classes.add_(classes, args);
  npf.dom.classes.set(element, classes.join(' '));

  return classes.length == expectedCount;
};


/**
 * Removes a class or classes from an element.
 * @param {Node} element DOM node to remove class from.
 * @param {...string} var_args Class name(s) to remove.
 * @return {boolean} Whether all classes in {@code var_args} were found and
 *     removed.
 */
npf.dom.classes.remove = function(element, var_args) {
  var classes = npf.dom.classes.get(element);
  var args = goog.array.slice(arguments, 1);
  var newClasses = npf.dom.classes.getDifference_(classes, args);
  npf.dom.classes.set(element, newClasses.join(' '));

  return newClasses.length == classes.length - args.length;
};


/**
 * Helper method for {@link npf.dom.classes.add} and
 * {@link npf.dom.classes.addRemove}. Adds one or more classes to the supplied
 * classes array.
 * @param {Array.<string>} classes All class names for the element, will be
 *     updated to have the classes supplied in {@code args} added.
 * @param {Array.<string>} args Class names to add.
 * @private
 */
npf.dom.classes.add_ = function(classes, args) {
  for (var i = 0; i < args.length; i++) {
    if (!goog.array.contains(classes, args[i])) {
      classes.push(args[i]);
    }
  }
};


/**
 * Helper method for {@link npf.dom.classes.remove} and
 * {@link npf.dom.classes.addRemove}. Calculates the difference of two arrays.
 * @param {!Array.<string>} arr1 First array.
 * @param {!Array.<string>} arr2 Second array.
 * @return {!Array.<string>} The first array without the elements of the second
 *     array.
 * @private
 */
npf.dom.classes.getDifference_ = function(arr1, arr2) {
  return goog.array.filter(arr1, function(item) {
    return !goog.array.contains(arr2, item);
  });
};


/**
 * Switches a class on an element from one to another without disturbing other
 * classes. If the fromClass isn't removed, the toClass won't be added.
 * @param {Node} element DOM node to swap classes on.
 * @param {string} fromClass Class to remove.
 * @param {string} toClass Class to add.
 * @return {boolean} Whether classes were switched.
 */
npf.dom.classes.swap = function(element, fromClass, toClass) {
  var classes = npf.dom.classes.get(element);
  var removed = false;

  for (var i = 0; i < classes.length; i++) {
    if (classes[i] == fromClass) {
      goog.array.splice(classes, i--, 1);
      removed = true;
    }
  }

  if (removed) {
    classes.push(toClass);
    npf.dom.classes.set(element, classes.join(' '));
  }

  return removed;
};


/**
 * Adds zero or more classes to an element and removes zero or more as a single
 * operation. Unlike calling {@link npf.dom.classes.add} and
 * {@link npf.dom.classes.remove} separately, this is more efficient as it only
 * parses the class property once.
 *
 * If a class is in both the remove and add lists, it will be added. Thus,
 * you can use this instead of {@link npf.dom.classes.swap} when you have
 * more than two class names that you want to swap.
 *
 * @param {Node} element DOM node to swap classes on.
 * @param {?(string|Array.<string>)} classesToRemove Class or classes to
 *     remove, if null no classes are removed.
 * @param {?(string|Array.<string>)} classesToAdd Class or classes to add, if
 *     null no classes are added.
 */
npf.dom.classes.addRemove = function(element, classesToRemove, classesToAdd) {
  var classes = npf.dom.classes.get(element);

  if (goog.isString(classesToRemove)) {
    goog.array.remove(classes, classesToRemove);
  } else if (goog.isArray(classesToRemove)) {
    classes = npf.dom.classes.getDifference_(classes, classesToRemove);
  }

  if (
    goog.isString(classesToAdd) &&
    !goog.array.contains(classes, classesToAdd)
  ) {
    classes.push(classesToAdd);
  } else if (goog.isArray(classesToAdd)) {
    npf.dom.classes.add_(classes, classesToAdd);
  }

  npf.dom.classes.set(element, classes.join(' '));
};


/**
 * Returns true if an element has a class.
 * @param {Node} element DOM node to test.
 * @param {string} className Class name to test for.
 * @return {boolean} Whether element has the class.
 */
npf.dom.classes.has = function(element, className) {
  return goog.array.contains(npf.dom.classes.get(element), className);
};


/**
 * Adds or removes a class depending on the enabled argument.
 * @param {Node} element DOM node to add or remove the class on.
 * @param {string} className Class name to add or remove.
 * @param {boolean} enabled Whether to add or remove the class (true adds,
 *     false removes).
 */
npf.dom.classes.enable = function(element, className, enabled) {
  if (enabled) {
    npf.dom.classes.add(element, className);
  } else {
    npf.dom.classes.remove(element, className);
  }
};


/**
 * Removes a class if an element has it, and adds it the element doesn't have
 * it.  Won't affect other classes on the node.
 * @param {Node} element DOM node to toggle class on.
 * @param {string} className Class to toggle.
 * @return {boolean} True if class was added, false if it was removed
 *     (in other words, whether element has the class after this function has
 *     been called).
 */
npf.dom.classes.toggle = function(element, className) {
  var add = !npf.dom.classes.has(element, className);
  npf.dom.classes.enable(element, className, add);

  return add;
};
